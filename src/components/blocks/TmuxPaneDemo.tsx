import { useState } from 'react';
import './blocks.css';

type Dir = 'v' | 'h';
interface Layout {
  cols: string;
  rows: string;
  pos: [string, string][];
}

/** Grid-Layout für n Panes (identisch zur Original-Logik layoutFor). */
function layoutFor(n: number, dir: Dir): Layout {
  if (n === 1) return { cols: '1fr', rows: '1fr', pos: [['1', '1']] };
  if (n === 2)
    return dir === 'h'
      ? { cols: '1fr', rows: '1fr 1fr', pos: [['1', '1'], ['1', '2']] }
      : { cols: '1fr 1fr', rows: '1fr', pos: [['1', '1'], ['2', '1']] };
  if (n === 3)
    return { cols: '1fr 1fr', rows: '1fr 1fr', pos: [['1', '1 / span 2'], ['2', '1'], ['2', '2']] };
  return { cols: '1fr 1fr', rows: '1fr 1fr', pos: [['1', '1'], ['2', '1'], ['1', '2'], ['2', '2']] };
}

/** Interaktives tmux-Pane-Demo. Migriert aus der tmux-Sektion. */
export function TmuxPaneDemo() {
  const [count, setCount] = useState(1);
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [lastDir, setLastDir] = useState<Dir>('v');
  const [hint, setHint] = useState('Klick einen Pane an, um ihn aktiv (grün umrandet) zu machen, dann teile ihn.');

  function split(dir: Dir) {
    if (zoomed) return setHint('Erst den Zoom beenden (Prefix z), dann teilen.');
    if (count >= 4) return setHint('Dieses Demo zeigt maximal 4 Panes, in echt geht viel mehr.');
    setLastDir(dir);
    setActive(count); // der neue Pane wird aktiv
    setCount(count + 1);
    setHint(
      dir === 'v'
        ? 'Vertikal geteilt: neuer Pane rechts, jetzt aktiv (grün).'
        : 'Horizontal geteilt: neuer Pane unten, jetzt aktiv (grün).',
    );
  }
  function zoom() {
    if (count < 2) return setHint('Zoom lohnt sich erst ab zwei Panes.');
    setZoomed((z) => !z);
    setHint(!zoomed ? 'Zoom an: aktiver Pane auf Vollbild. Nochmal drücken bringt alle zurück.' : 'Zoom aus: alle Panes wieder sichtbar.');
  }
  function close() {
    if (zoomed) return setHint('Im Zoom lässt sich nicht schließen, erst Prefix z.');
    if (count < 2) return setHint('Den letzten Pane kannst du nicht schließen, das wäre das Window-Ende.');
    setCount(count - 1);
    setActive(0);
    setHint('Pane geschlossen.');
  }

  const lay = zoomed ? { cols: '1fr', rows: '1fr', pos: [['1', '1']] as [string, string][] } : layoutFor(count, lastDir);
  const visible = zoomed ? [active] : Array.from({ length: count }, (_, i) => i);

  return (
    <div className="demo-wrap">
      <div className="term-frame">
        <div
          className="term-grid"
          style={{ gridTemplateColumns: lay.cols, gridTemplateRows: lay.rows }}
        >
          {visible.map((paneIdx, cell) => {
            const [col, row] = lay.pos[zoomed ? 0 : cell];
            return (
              <div
                key={paneIdx}
                className={`pane ${paneIdx === active ? 'active' : ''}`}
                style={{ gridColumn: col, gridRow: row }}
                onClick={() => setActive(paneIdx)}
              >
                <span className="tag">{paneIdx}</span>
                bash
              </div>
            );
          })}
        </div>
      </div>
      <div className="demo-controls">
        <button className="demo-btn" onClick={() => split('v')}>Prefix <span className="k">%</span> vertikal teilen</button>
        <button className="demo-btn" onClick={() => split('h')}>Prefix <span className="k">"</span> horizontal teilen</button>
        <button className="demo-btn" onClick={zoom}>Prefix <span className="k">z</span> Zoom</button>
        <button className="demo-btn" onClick={close}>Prefix <span className="k">x</span> schließen</button>
      </div>
      <div className="demo-hint">{hint}</div>
    </div>
  );
}
