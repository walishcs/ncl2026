import { useCallback, useEffect, useId, useRef, useState } from 'react';
import L from 'leaflet';
import type { GeoJsonObject } from 'geojson';
import { places, groups, type Group, type Place } from '../data/places';
import { LinguisticForm } from './LinguisticForm';
import { placeLabels, leaderSegment, type PlacedLabel } from './mapLayout';

export type DistributionMapProps = {
  visibleGroups?: readonly Group[];
  visibleIds?: readonly string[];
  highlightedIds?: readonly string[];
  formsById?: Readonly<Record<string, string>>;
  labelMode?: 'name' | 'form';
  active?: boolean;
  layoutVersion?: number;
  onSelect?: (id: string) => void;
  collection?: readonly Place[];
  focusIds?: readonly string[];
  routeIds?: readonly string[];
};
const region: L.LatLngBoundsExpression = [[23.78, 120.15], [25.4, 122.2]];
const initial: L.LatLngBoundsExpression = [[23.94, 120.84], [24.53, 121.63]];
const noForms: Readonly<Record<string, string>> = {};
const noRoute: readonly string[] = [];

export function DistributionMap({ visibleGroups = groups, visibleIds, highlightedIds = [], formsById = noForms, labelMode = 'name', active = true, layoutVersion = 0, onSelect, collection = places, focusIds, routeIds = noRoute }: DistributionMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<L.LayerGroup | null>(null);
  const props = useRef({ visibleGroups, visibleIds, highlightedIds, formsById, labelMode, onSelect, collection, focusIds, routeIds });
  props.current = { visibleGroups, visibleIds, highlightedIds, formsById, labelMode, onSelect, collection, focusIds, routeIds };
  const [labels, setLabels] = useState<PlacedLabel[]>([]);
  const [routePath, setRoutePath] = useState('');
  const arrowId = `migration-arrow-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);
  const [size, setSize] = useState({ width: 1, height: 1 });
  const frame = useRef(0);
  const fitted = useRef(false);
  const metricsReady = useRef(false);

  const initialView = useCallback(() => {
    const { collection, focusIds } = props.current;
    const points = collection.filter(place => focusIds?.includes(place.id));
    return points.length ? L.latLngBounds(points.map(place => place.coordinates)).pad(0.15) : initial;
  }, []);

  const resizeMap = useCallback(() => {
    const instance = map.current;
    if (!instance) return;
    instance.invalidateSize({ pan: false });
    const size = instance.getSize();
    if (!fitted.current && size.x > 100 && size.y > 100) {
      instance.fitBounds(initialView(), { padding: [60, 40], maxZoom: 11.5, animate: false });
      fitted.current = true;
    }
  }, [initialView]);

  const relayout = useCallback(() => {
    const instance = map.current;
    if (!instance || !metricsReady.current) return;
    const dimensions = instance.getSize();
    const { visibleGroups, visibleIds, highlightedIds, formsById, labelMode, collection, routeIds } = props.current;
    const context = document.createElement('canvas').getContext('2d');
    const inputs = collection.filter(p => visibleGroups.includes(p.group) && (!visibleIds || visibleIds.includes(p.id))).map(place => {
      const point = instance.latLngToContainerPoint(place.coordinates);
      let formWidth = 0;
      if (context && labelMode === 'form' && formsById[place.id]) {
        context.font = '36px Gentium';
        formWidth = context.measureText(formsById[place.id]).width;
      }
      if (context) context.font = '21px "Noto Sans TC"';
      const nameWidth = context?.measureText(place.name).width ?? place.name.length * 14;
      return { id: place.id, x: point.x, y: point.y, width: Math.ceil(Math.max(formWidth, nameWidth)) + 14,
        height: labelMode === 'form' && formsById[place.id] ? 66 : 32, priority: highlightedIds.includes(place.id) };
    });
    setSize({ width: dimensions.x, height: dimensions.y });
    const placedLabels = placeLabels(inputs, dimensions.x, dimensions.y);
    setLabels(placedLabels);
    const stops = routeIds.map(id => collection.find(place => place.id === id));
    const isVisible = (place: Place | undefined) => place && visibleGroups.includes(place.group) && (!visibleIds || visibleIds.includes(place.id));
    if (stops.length < 2 || stops.some(place => !place) || !isVisible(stops[0]) || !isVisible(stops[stops.length - 1])) {
      setRoutePath('');
    } else {
      const points = stops.map(place => instance.latLngToContainerPoint(place!.coordinates));
      for (let i = 1; i < points.length - 1; i++) points[i] = points[i].add([36, 14]);
      const startDirection = points[1].subtract(points[0]);
      if (startDirection.distanceTo([0, 0]) < 1) {
        setRoutePath('');
        return;
      }
      points[0] = points[0].add(startDirection.multiplyBy(12 / startDirection.distanceTo([0, 0])));
      const destination = points[points.length - 1];
      let bestPath = '', fewestCollisions = Infinity;
      for (const direction of [[0, 1], [1, 1], [1, 0], [-1, 1], [0, -1], [1, -1], [-1, 0], [-1, -1]]) {
        const outward = L.point(direction[0], direction[1]).divideBy(Math.hypot(...direction));
        const candidate = [...points.slice(0, -1), destination.add(outward.multiplyBy(18))];
        let path = `M ${candidate[0].x} ${candidate[0].y}`, collisions = 0;
        for (let i = 0; i < candidate.length - 1; i++) {
          const previous = candidate[Math.max(0, i - 1)];
          const start = candidate[i], end = candidate[i + 1];
          const next = candidate[Math.min(candidate.length - 1, i + 2)];
          const control1 = start.add(end.subtract(previous).divideBy(6));
          const control2 = i === candidate.length - 2
            ? end.add(outward.multiplyBy(Math.min(100, Math.max(40, start.distanceTo(end) * 0.4))))
            : end.subtract(next.subtract(start).divideBy(6));
          path += ` C ${control1.x} ${control1.y}, ${control2.x} ${control2.y}, ${end.x} ${end.y}`;
          const length = start.distanceTo(control1) + control1.distanceTo(control2) + control2.distanceTo(end);
          const samples = Math.min(400, Math.max(16, Math.ceil(length / 6)));
          for (let step = 0; step <= samples; step++) {
            const t = step / samples, u = 1 - t;
            const x = u ** 3 * start.x + 3 * u ** 2 * t * control1.x + 3 * u * t ** 2 * control2.x + t ** 3 * end.x;
            const y = u ** 3 * start.y + 3 * u ** 2 * t * control1.y + 3 * u * t ** 2 * control2.y + t ** 3 * end.y;
            if (placedLabels.some(label => x > label.left - 8 && x < label.left + label.width + 8 && y > label.top - 8 && y < label.top + label.height + 8)) collisions++;
          }
        }
        if (collisions < fewestCollisions) { bestPath = path; fewestCollisions = collisions; }
        if (collisions === 0) break;
      }
      setRoutePath(bestPath);
    }
  }, []);

  const queueLayout = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(relayout);
  }, [relayout]);

  useEffect(() => {
    if (!container.current) return;
    const instance = L.map(container.current, {
      zoomControl: false, attributionControl: false, keyboard: false,
      maxBounds: region, maxBoundsViscosity: 1, minZoom: 8, maxZoom: 13,
      zoomSnap: 0.25, zoomDelta: 0.5, scrollWheelZoom: false,
      zoomAnimation: false, fadeAnimation: false, markerZoomAnimation: false,
    });
    map.current = instance;
    L.DomEvent.disableClickPropagation(container.current);
    L.DomEvent.disableScrollPropagation(container.current);
    instance.fitBounds(initialView(), { padding: [60, 40], maxZoom: 11.5 });
    instance.createPane('place-markers').style.zIndex = '420';
    markers.current = L.layerGroup().addTo(instance);
    L.control.scale({ imperial: false, maxWidth: 120, position: 'bottomleft' }).addTo(instance);
    instance.on('move zoom resize', queueLayout);
    const abort = new AbortController();
    async function load() {
      try {
        const data = await Promise.all(['taiwan.geojson', 'taiwan-rivers.geojson'].map(async filename => {
          const response = await fetch(`${import.meta.env.BASE_URL}geography/${filename}`, { signal: abort.signal });
          if (!response.ok) throw new Error(`Map asset: ${response.status}`);
          return response.json() as Promise<GeoJsonObject>;
        }));
        await Promise.all([
          document.fonts.load('36px Gentium', '=cu; =ci; =kuŋ'),
          document.fonts.load('21px "Noto Sans TC"', collection.map(p => p.name).join(' ')),
        ]);
        if (abort.signal.aborted) return;
        metricsReady.current = true;
        L.geoJSON(data[0], { interactive: false, style: { color: '#c8c5b9', weight: 1.4, fillColor: '#efede3', fillOpacity: 1 } }).addTo(instance);
        L.geoJSON(data[1], { interactive: false, style: { color: '#a9bec4', weight: 1.5, opacity: 0.78 } }).addTo(instance);
        markers.current?.eachLayer(layer => { if (layer instanceof L.Path) layer.bringToFront(); });
        setReady(true);
        queueLayout();
      } catch {
        if (!abort.signal.aborted) setError(true);
      }
    }
    void load();
    const resize = () => { resizeMap(); queueLayout(); };
    const observer = new ResizeObserver(resize);
    observer.observe(container.current);
    document.addEventListener('fullscreenchange', resize);
    document.fonts.addEventListener('loadingdone', queueLayout);
    void document.fonts.ready.then(() => { if (!abort.signal.aborted) resize(); });
    return () => {
      abort.abort(); cancelAnimationFrame(frame.current); observer.disconnect();
      document.removeEventListener('fullscreenchange', resize);
      document.fonts.removeEventListener('loadingdone', queueLayout);
      instance.off(); instance.remove(); map.current = null; markers.current = null; fitted.current = false; metricsReady.current = false;
    };
  }, [collection, initialView, queueLayout, resizeMap]);

  useEffect(() => {
    const instance = map.current;
    const layer = markers.current;
    if (!instance || !layer) return;
    layer.clearLayers();
    for (const place of collection.filter(p => visibleGroups.includes(p.group) && (!visibleIds || visibleIds.includes(p.id)))) {
      const selected = highlightedIds.includes(place.id);
      const marker = L.circleMarker(place.coordinates, { radius: selected ? 10 : 7, weight: selected ? 3 : 2,
        pane: 'place-markers', color: '#FAF8F2', fillColor: place.color, fillOpacity: 1, className: `place-marker ${selected ? 'is-selected' : ''}`,
      }).addTo(layer);
      marker.on('click', () => props.current.onSelect?.(place.id));
      const element = marker.getElement();
      if (element) {
        element.setAttribute('data-place-id', place.id);
        element.setAttribute('role', 'button');
        element.setAttribute('aria-label', place.name);
        element.setAttribute('aria-pressed', String(selected));
        element.setAttribute('tabindex', '0');
        element.addEventListener('keydown', rawEvent => {
          const event = rawEvent as KeyboardEvent;
          event.stopPropagation();
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); props.current.onSelect?.(place.id); }
        });
      }
    }
    queueLayout();
  }, [collection, visibleGroups, visibleIds, highlightedIds, ready, queueLayout]);

  useEffect(() => { queueLayout(); }, [labelMode, formsById, routeIds, queueLayout]);
  useEffect(() => {
    if (!active) return;
    const id = requestAnimationFrame(() => { resizeMap(); queueLayout(); });
    return () => cancelAnimationFrame(id);
  }, [active, layoutVersion, queueLayout, resizeMap]);

  useEffect(() => {
    if (active && ready && focusIds?.length) {
      map.current?.fitBounds(initialView(), { padding: [60, 40], maxZoom: 11.5, animate: false });
    }
  }, [active, ready, focusIds, initialView]);

  return <div className="distribution-map" onKeyDown={event => event.stopPropagation()} data-ready={ready}>
    <div className="leaflet-host" ref={container} role="region" tabIndex={0} onPointerDown={() => container.current?.focus({ preventScroll: true })} aria-label="語言與變體分布地圖"/>
    {routePath && <svg className="map-route" viewBox={`0 0 ${size.width} ${size.height}`} role="img" aria-label="遷徙示意：C. Toda 經 Sqoyaw 附近前往 E. Toda">
      <defs><marker id={arrowId} viewBox="0 0 12 12" refX="11" refY="6" markerWidth="13" markerHeight="13" markerUnits="userSpaceOnUse" orient="auto">
        <path d="M 0 0 L 12 6 L 0 12 L 3 6 Z" fill="#861F2D"/>
      </marker></defs>
      <path className="migration-route" d={routePath} fill="none" stroke="#861F2D" strokeWidth="3" strokeLinecap="round" markerEnd={`url(#${arrowId})`}/>
    </svg>}
    <svg className="map-leaders" viewBox={`0 0 ${size.width} ${size.height}`} aria-hidden="true">{labels.filter(label => label.showLeader !== false).map(label => {
      const [start, end] = leaderSegment(label);
      return <line key={label.id} data-leader-id={label.id} x1={start.x} y1={start.y} x2={end.x} y2={end.y}/>;
    })}</svg>
    <div className="map-labels">{labels.map(label => {
      const place = collection.find(p => p.id === label.id)!;
      return <button key={place.id} className={`map-label ${highlightedIds.includes(place.id) ? 'selected' : ''}`} data-label-id={place.id} style={{ left: label.left, top: label.top, width: label.width, height: label.height, color: place.color }} onClick={() => onSelect?.(place.id)}>
        {labelMode === 'form' && formsById[place.id] && <LinguisticForm>{formsById[place.id]}</LinguisticForm>}
        <span className="map-place-name">{place.name}</span>
      </button>;
    })}</div>
    <div className="map-tools" aria-label="地圖操作"><button aria-label="放大地圖" onClick={() => map.current?.zoomIn()}>＋</button><button aria-label="縮小地圖" onClick={() => map.current?.zoomOut()}>−</button><button className="reset-map" onClick={() => map.current?.fitBounds(initialView(), { padding: [60, 40], maxZoom: 11.5, animate: false })}>重設</button></div>
    <div className="north-arrow" aria-hidden="true">N<br/><span>↑</span></div>
    <div className="map-attribution">Natural Earth · HydroRIVERS © WWF</div>
    {error && <div className="map-error" role="alert">地圖檔案讀取失敗，請重新載入。</div>}
  </div>;
}
