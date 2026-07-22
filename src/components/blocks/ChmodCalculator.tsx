import { useState } from 'react';
import './blocks.css';

type Grp = 'user' | 'group' | 'other';
type Bit = 'r' | 'w' | 'x';
type State = Record<Grp, Record<Bit, boolean>>;

const groups: Grp[] = ['user', 'group', 'other'];
const bitDefs: { key: Bit; val: number }[] = [
  { key: 'r', val: 4 },
  { key: 'w', val: 2 },
  { key: 'x', val: 1 },
];
const words: Record<Bit, string> = { r: 'lesen', w: 'schreiben', x: 'ausführen' };

const presets = [
  { oct: '644', note: 'Normale Datei' },
  { oct: '755', note: 'Programm / Ordner' },
  { oct: '600', note: 'Privat (SSH-Key)' },
  { oct: '700', note: 'Privater Ordner' },
  { oct: '777', note: 'Alle dürfen alles' },
];

function fromOctal(oct: string): State {
  const s = {} as State;
  groups.forEach((g, i) => {
    const digit = parseInt(oct[i] ?? '0', 10);
    s[g] = { r: (digit & 4) !== 0, w: (digit & 2) !== 0, x: (digit & 1) !== 0 };
  });
  return s;
}

/** Interaktiver chmod-Rechner. Migriert aus der Rechte-Sektion. */
export function ChmodCalculator({ start = '755' }: { start?: string }) {
  const [state, setState] = useState<State>(() => fromOctal(start));

  function toggle(g: Grp, bit: Bit) {
    setState((prev) => ({ ...prev, [g]: { ...prev[g], [bit]: !prev[g][bit] } }));
  }

  // Symbol- und Oktalform aus dem State ableiten.
  let oct = '';
  const symParts: { on: boolean; ch: Bit }[] = [];
  groups.forEach((g) => {
    let digit = 0;
    bitDefs.forEach((b) => {
      const on = state[g][b.key];
      symParts.push({ on, ch: b.key });
      if (on) digit += b.val;
    });
    oct += digit;
  });

  return (
    <div className="calc">
      <div className="calc-grid">
        <div className="calc-head" />
        <div className="calc-head">Besitzer<br />(user)</div>
        <div className="calc-head">Gruppe<br />(group)</div>
        <div className="calc-head">Andere<br />(other)</div>

        {bitDefs.map((b) => (
          <div key={b.key} style={{ display: 'contents' }}>
            <div className="calc-rowlabel">
              {b.key} <small>{words[b.key]}</small>
            </div>
            {groups.map((g) => {
              const on = state[g][b.key];
              return (
                <button
                  key={g}
                  className={`bit ${b.key} ${on ? 'on' : ''}`}
                  aria-pressed={on}
                  onClick={() => toggle(g, b.key)}
                >
                  {b.key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="calc-result">
        <div className="sym">
          -
          {symParts.map((p, i) =>
            p.on ? p.ch : <span className="off" key={i}>-</span>,
          )}
        </div>
        <div className="oct">{oct}</div>
        <div className="cmd">
          z.B. <b>chmod</b> {oct} datei.txt
        </div>
      </div>

      <div className="presets">
        {presets.map((p) => (
          <button key={p.oct} className="preset" onClick={() => setState(fromOctal(p.oct))}>
            {p.oct}
            <small>{p.note}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
