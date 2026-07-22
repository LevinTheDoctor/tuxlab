import { useState } from 'react';
import type { EditorMode } from '../../types/content';
import './blocks.css';

/** Klickbare Modus-Zustandsmaschine (Neovim). Migriert aus der nvim-Sektion. */
export function ModeMachine({ modes }: { modes: EditorMode[] }) {
  const [sel, setSel] = useState(0);
  const m = modes[sel];
  return (
    <div>
      <div className="modes">
        {modes.map((mode, i) => (
          <button
            key={mode.name}
            className={`mode-box ${i === sel ? 'active' : ''}`}
            onClick={() => setSel(i)}
          >
            <h4>{mode.name}-Modus</h4>
            <span className="enter">Rein mit: {mode.enter}</span>
          </button>
        ))}
      </div>
      <div className="bd-explain-box" style={{ borderLeftColor: 'var(--green)', background: 'rgba(80,250,123,.06)' }}>
        <span className="tok" style={{ color: 'var(--green)' }}>{m.name}-Modus</span>
        <p>{m.desc}</p>
      </div>
    </div>
  );
}
