export type LabelInput = { id: string; x: number; y: number; width: number; height: number; priority: boolean };
export type PlacedLabel = LabelInput & { left: number; top: number; showLeader?: boolean };
type Point = { x: number; y: number };
type Segment = [Point, Point];
type Rect = { left: number; top: number; width: number; height: number };
const gap = 8;
export function leaderSegment(label: PlacedLabel): Segment {
  return [{ x: label.x, y: label.y }, { x: Math.max(label.left, Math.min(label.x, label.left + label.width)), y: Math.max(label.top, Math.min(label.y, label.top + label.height)) }];
}
export function segmentsCross([a, b]: Segment, [c, d]: Segment): boolean {
  const orient = (p: Point, q: Point, r: Point) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
  return orient(a, b, c) * orient(a, b, d) < -0.01 && orient(c, d, a) * orient(c, d, b) < -0.01;
}
const overlaps = (a: Rect, b: Rect) => a.left < b.left + b.width + gap && a.left + a.width + gap > b.left && a.top < b.top + b.height + gap && a.top + a.height + gap > b.top;
function throughRect(line: Segment, rect: Rect) {
  const a = { x: rect.left - 3, y: rect.top - 3 }, b = { x: rect.left + rect.width + 3, y: rect.top - 3 };
  const c = { x: b.x, y: rect.top + rect.height + 3 }, d = { x: a.x, y: c.y };
  return [[a, b], [b, c], [c, d], [d, a]].some(edge => segmentsCross(line, edge as Segment));
}

export function placeLabels(inputs: LabelInput[], width: number, height: number): PlacedLabel[] {
  if (width < 100 || height < 100) return [];
  const reserved: Rect[] = [{ left: width - 180, top: 0, width: 180, height: 72 }, { left: 0, top: 0, width: 60, height: 88 }, { left: 0, top: height - 30, width, height: 30 }];
  const candidates = new Map<string, PlacedLabel[]>();
  for (const input of inputs) {
    const x = Math.max(15, Math.min(width - 15, input.x)), y = Math.max(15, Math.min(height - 15, input.y));
    const locations: PlacedLabel[] = [];
    for (let top = 12; top <= height - input.height - 12; top += 18) {
      for (let left = 12; left <= width - input.width - 12; left += 18) locations.push({ ...input, left, top });
    }
    for (const [dx, dy] of [[18, -input.height / 2], [-input.width - 18, -input.height / 2], [-input.width / 2, 18], [-input.width / 2, -input.height - 18]]) locations.push({ ...input, left: x + dx, top: y + dy });
    const valid = locations.filter(rect => rect.left >= 12 && rect.top >= 12 && rect.left + rect.width <= width - 12 && rect.top + rect.height <= height - 12 && !reserved.some(r => overlaps(rect, r)) && !inputs.some(p => rect.left - 9 < p.x && rect.left + rect.width + 9 > p.x && rect.top - 9 < p.y && rect.top + rect.height + 9 > p.y));
    const cost = (label: PlacedLabel) => { const [a, b] = leaderSegment({ ...label, x, y }); return (a.x - b.x) ** 2 + (a.y - b.y) ** 2; };
    valid.sort((a, b) => cost(a) - cost(b));
    candidates.set(input.id, valid);
  }
  const byDensity = (a: LabelInput, b: LabelInput) => {
    const distance = (p: LabelInput) => Math.min(...inputs.filter(q => q.id !== p.id).map(q => (q.x - p.x) ** 2 + (q.y - p.y) ** 2));
    return distance(a) - distance(b);
  };
  const orders = [byDensity, (a: LabelInput, b: LabelInput) => a.y - b.y, (a: LabelInput, b: LabelInput) => b.y - a.y, (a: LabelInput, b: LabelInput) => a.x - b.x, (a: LabelInput, b: LabelInput) => b.x - a.x];
  for (const order of orders) {
    const sorted = [...inputs].sort((a, b) => Number(b.priority) - Number(a.priority) || order(a, b));
    const placed: PlacedLabel[] = [];
    let visits = 0;
    const solve = (index: number): boolean => {
      if (index === sorted.length) return true;
      if (++visits > 400) return false;
      const input = sorted[index];
      let attempts = 0;
      for (const rect of candidates.get(input.id) ?? []) {
        const line = leaderSegment(rect);
        if (placed.some(p => overlaps(rect, p) || segmentsCross(line, leaderSegment(p)) || throughRect(line, p) || throughRect(leaderSegment(p), rect))) continue;
        placed.push(rect);
        if (solve(index + 1)) return true;
        placed.pop();
        if (++attempts >= 12) break;
      }
      return false;
    };
    if (solve(0)) return placed;
  }
  return inputs.map((input, i) => ({ ...input, showLeader: false, left: 12 + (i % 3) * (width - 24) / 3, top: 90 + Math.floor(i / 3) * 80, width: Math.min(input.width, (width - 48) / 3) }));
}
