export const groups = ['Northern Atayal', 'Southern Atayal', 'Tgdaya', 'Toda', 'Truku'] as const;
export type Group = typeof groups[number] | 'Pazeh';
export type Place = {
  id: string;
  language: 'Atayal' | 'Seediq' | 'Pazeh';
  group: Group;
  name: string;
  coordinates: [number, number];
  color: string;
};

export const places: Place[] = [
  { id: 'matuuwal', language: 'Atayal', group: 'Northern Atayal', name: "Matu'uwal", coordinates: [24.46492, 120.9406], color: '#315A93' },
  { id: 'squliq', language: 'Atayal', group: 'Northern Atayal', name: 'Squliq', coordinates: [24.12341, 121.1572], color: '#4379AE' },
  { id: 'skikun', language: 'Atayal', group: 'Northern Atayal', name: 'Skikun', coordinates: [24.48839, 121.4267], color: '#626FB0' },
  { id: 'bala', language: 'Atayal', group: 'Southern Atayal', name: "B'ala", coordinates: [24.07232, 120.9827], color: '#356747' },
  { id: 'klesan', language: 'Atayal', group: 'Southern Atayal', name: 'Klesan', coordinates: [24.416047980252213, 121.53477011600648], color: '#478157' },
  { id: 'suli', language: 'Atayal', group: 'Southern Atayal', name: "S'uli", coordinates: [24.35984, 120.947], color: '#65783D' },
  { id: 'matuaw', language: 'Atayal', group: 'Southern Atayal', name: "Ma'tuaw", coordinates: [24.42113, 120.9088], color: '#718D51' },
  { id: 'plngawan', language: 'Atayal', group: 'Southern Atayal', name: 'Plngawan', coordinates: [24.0046944, 121.1386427], color: '#3E806D' },
  { id: 'tgdaya', language: 'Seediq', group: 'Tgdaya', name: 'Tgdaya', coordinates: [24.0156964, 121.1299336], color: '#A07126' },
  { id: 'central-toda', language: 'Seediq', group: 'Toda', name: 'C. Toda', coordinates: [24.06007, 121.1922], color: '#77528D' },
  { id: 'eastern-toda', language: 'Seediq', group: 'Toda', name: 'E. Toda', coordinates: [24.40275535073076, 121.55365970148581], color: '#956CA5' },
  { id: 'central-truku', language: 'Seediq', group: 'Truku', name: 'C. Truku', coordinates: [24.08617, 121.2165], color: '#247F91' },
  { id: 'eastern-truku', language: 'Seediq', group: 'Truku', name: 'E. Truku', coordinates: [24.15221966216356, 121.41957261635254], color: '#489DAD' },
];
