import { Fragment, useState } from 'react';
import type { BreakToken } from '../../types/content';
import './blocks.css';

/** Zerlegt einen Befehl in klickbare Teile. Migriert aus renderBreakdown(). */
export function CommandBreakdown({ cmd }: { cmd: BreakToken[] }) {
  const [sel, setSel] = useState(0);
  return (
    <div className="panel">
      <div className="bd-cmd">
        {cmd.map((tok, i) => (
          <Fragment key={i}>
            <span
              className={`bd-token ${i === sel ? 'active' : ''}`}
              onClick={() => setSel(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSel(i)}
            >
              {tok.t}
            </span>
            {i < cmd.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </div>
      <div className="bd-explain-box">
        <span className="tok">{cmd[sel].t}</span>
        <p>{cmd[sel].d}</p>
      </div>
    </div>
  );
}
