import { useMemo, useState } from 'react';
import type { CheatCategory } from '../../types/content';
import './blocks.css';

/** Filterbares Cheatsheet mit Pills. Migriert aus renderCheat(). */
export function CheatSheet({ categories }: { categories: CheatCategory[] }) {
  const [active, setActive] = useState('Alle');
  const pills = useMemo(() => ['Alle', ...categories.map((c) => c.name)], [categories]);
  const shown = categories.filter((c) => active === 'Alle' || c.name === active);

  return (
    <div className="panel">
      <div className="cheat-pills">
        {pills.map((p) => (
          <button
            key={p}
            className={`cheat-pill ${p === active ? 'active' : ''}`}
            onClick={() => setActive(p)}
          >
            {p}
          </button>
        ))}
      </div>
      <div>
        {shown.map((c) =>
          c.rows.map((r, i) => (
            <div className="cheat-row" key={`${c.name}-${i}`}>
              <div className="cheat-key" dangerouslySetInnerHTML={{ __html: r.key }} />
              <div className="cheat-info">
                <span dangerouslySetInnerHTML={{ __html: r.info }} />
                <span className="why">{r.why}</span>
              </div>
            </div>
          )),
        )}
      </div>
    </div>
  );
}
