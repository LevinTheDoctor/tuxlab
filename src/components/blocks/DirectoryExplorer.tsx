import { useState } from 'react';
import type { DirEntry } from '../../types/content';
import './blocks.css';

/** Zwei-Spalten-Explorer (Baum + Detail). Migriert aus der dirs-Sektion. */
export function DirectoryExplorer({ dirs, startIndex = 0 }: { dirs: DirEntry[]; startIndex?: number }) {
  const [sel, setSel] = useState(Math.min(startIndex, dirs.length - 1));
  const d = dirs[sel];

  return (
    <div className="explorer">
      <div className="tree" role="listbox" aria-label="Verzeichnisse">
        {dirs.map((entry, i) => {
          // Baum-Zeichen wie `tree`: Wurzel ohne Ast, letzter mit Ecke, sonst T-Stück.
          const prefix = i === 0 ? '' : i === dirs.length - 1 ? '└ ' : '├ ';
          return (
            <button
              key={entry.path}
              className={`tree-item ${i === sel ? 'active' : ''}`}
              role="option"
              aria-selected={i === sel}
              onClick={() => setSel(i)}
            >
              <span className="branch">{prefix}</span>
              <span className="dir">{entry.path}</span>
            </button>
          );
        })}
      </div>

      <div className="detail">
        <div className="path-big">{d.path}</div>
        <div>
          <span className="role">{d.role}</span>
        </div>
        <h4>Wofür ist das da?</h4>
        <p>{d.desc}</p>
        <h4>Was liegt typisch drin?</h4>
        <div className="chips">
          {d.inside.map((x) => (
            <span className="chip" key={x}>{x}</span>
          ))}
        </div>
        <div className="callout callout-tip" style={{ marginTop: 20 }}>
          <strong className="callout-title">💡 Tipp</strong>
          <span className="callout-body">{d.tip}</span>
        </div>
      </div>
    </div>
  );
}
