import { LinguisticForm } from './LinguisticForm';
export type ComparisonRow = { id: string; label: string; cells: string[] };
export function ComparisonTable({ columns, rows, revealRows = false, highlightedRows = [], highlightedColumns = [] }: {
  columns: string[]; rows: ComparisonRow[]; revealRows?: boolean;
  highlightedRows?: string[]; highlightedColumns?: number[];
}) {
  return <table className="comparison-table"><thead><tr><th scope="col">變體</th>{columns.map((column, i) => <th scope="col" key={column} className={highlightedColumns.includes(i) ? 'emphasized-column' : ''}>{column}</th>)}</tr></thead>
    <tbody>{rows.map((row, i) => <tr key={row.id} className={`${revealRows && i > 0 ? 'fragment fade-in' : ''} ${highlightedRows.includes(row.id) ? 'emphasized-row' : ''}`} data-fragment-index={revealRows && i > 0 ? i - 1 : undefined}>
      <th scope="row">{row.label}</th>{row.cells.map((cell, j) => <td key={j} className={highlightedColumns.includes(j) ? 'emphasized-column' : ''}><LinguisticForm>{cell}</LinguisticForm></td>)}
    </tr>)}</tbody></table>;
}
