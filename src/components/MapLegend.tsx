import { places, type Group, type Place } from '../data/places';
export function MapLegend({ visibleIds, highlightedIds, onGroupToggle, onLanguageToggle, onVisibilityToggle, onSelect, collection = places }: {
  visibleIds: readonly string[]; highlightedIds: readonly string[];
  collection?: readonly Place[];
  onGroupToggle: (group: Group) => void; onLanguageToggle: (language: Place['language']) => void;
  onVisibilityToggle: (id: string) => void; onSelect: (id: string) => void;
}) {
  return <aside className="map-legend" aria-label="分群與變體" onKeyDown={event => event.stopPropagation()}>
    <div className="legend-heading"><span>變體</span><span>{visibleIds.length} / {collection.length}</span></div>
    {[...new Set(collection.map(place => place.language))].map(language => <div className="legend-language" key={language}>
      <button className="language-toggle" aria-pressed={collection.filter(p => p.language === language).every(p => visibleIds.includes(p.id))} onClick={() => onLanguageToggle(language)}>{language}</button>
      {[...new Set(collection.filter(p => p.language === language).map(p => p.group))].map(group => {
        const members = collection.filter(p => p.group === group);
        const allVisible = members.every(p => visibleIds.includes(p.id));
        return <div className="legend-group" key={group}>
          <button className="group-toggle" aria-pressed={allVisible} onClick={() => onGroupToggle(group)}><span>{group}</span><span className="toggle-glyph">{allVisible ? '−' : '+'}</span></button>
          <div className="legend-items">{members.map(place => <div className="legend-item" key={place.id}>
            <input type="checkbox" aria-label={`顯示 ${place.name}`} checked={visibleIds.includes(place.id)} onChange={() => onVisibilityToggle(place.id)} style={{ accentColor: place.color }}/>
            <button className={`legend-place ${highlightedIds.includes(place.id) ? 'selected' : ''}`} disabled={!visibleIds.includes(place.id)} aria-pressed={highlightedIds.includes(place.id)} onClick={() => onSelect(place.id)} style={{ color: place.color }}>
              <span>{place.name}</span>
            </button>
          </div>)}</div>
        </div>;
      })}
    </div>)}
  </aside>;
}
