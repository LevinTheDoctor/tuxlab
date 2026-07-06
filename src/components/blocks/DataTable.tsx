import type { TableData } from '../../types/content';
import './extras.css';

/** Einfache Vergleichstabelle (z.B. Shells, Paketmanager). */
export function DataTable({ table }: { table: TableData }) {
  return (
    <div className="datatable-wrap">
      <table className="datatable">
        <thead>
          <tr>
            {table.headers.map((h, i) => (
              <th key={i} dangerouslySetInnerHTML={{ __html: h }} />
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c} dangerouslySetInnerHTML={{ __html: cell }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
