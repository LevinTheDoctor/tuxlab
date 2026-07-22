import { useMemo, useState } from 'react';
import type { ScriptStep } from '../../types/content';
import { makeDefaultFs } from '../../lib/fakeFs';
import { createShell, runScript } from '../../lib/shell/interpreter';
import './blocks.css';

interface Props {
  title?: string;
  script: ScriptStep[];
  interactive?: boolean;
}

/** Skript-Durchlauf: geführtes Step-Through UND (optional) echter Interpreter-Lauf. */
export function ScriptSimulator({ title = 'skript.sh', script, interactive }: Props) {
  const [tab, setTab] = useState<'step' | 'run'>('step');
  const [step, setStep] = useState(-1); // -1 = noch nicht gestartet
  const [runOut, setRunOut] = useState<string[] | null>(null);

  const scriptText = useMemo(() => script.map((s) => s.line).join('\n'), [script]);

  const atEnd = step >= script.length - 1;
  const current = step >= 0 ? script[step] : null;

  // Ausgabe bis einschließlich aktuellem Schritt sammeln.
  const stepOutput = script
    .slice(0, step + 1)
    .map((s) => s.output)
    .filter((o): o is string => !!o)
    .join('\n');

  function runAll() {
    const sh = createShell(makeDefaultFs());
    const out = runScript(sh, scriptText).filter((l) => l.text !== '\x00CLEAR\x00');
    setRunOut(out.length ? out.map((l) => l.text) : ['(keine Ausgabe)']);
  }

  return (
    <div className="scriptsim">
      <div className="scriptsim-head">
        <span className="file">📜 {title}</span>
        {interactive && (
          <div className="tabs">
            <button className={`scriptsim-tab ${tab === 'step' ? 'active' : ''}`} onClick={() => setTab('step')}>
              Schritt für Schritt
            </button>
            <button
              className={`scriptsim-tab ${tab === 'run' ? 'active' : ''}`}
              onClick={() => { setTab('run'); if (!runOut) runAll(); }}
            >
              Wirklich ausführen ▶
            </button>
          </div>
        )}
      </div>

      {tab === 'step' || !interactive ? (
        <>
          <div className="scriptsim-code">
            {script.map((s, i) => (
              <div
                key={i}
                className={`code-line ${i < step ? 'done' : ''} ${i === step ? 'current' : ''}`}
              >
                <span className="ln">{i + 1}</span>
                <span className="lc">{s.line || ' '}</span>
              </div>
            ))}
          </div>

          <div className="scriptsim-explain">
            {current ? (
              <p dangerouslySetInnerHTML={{ __html: current.explain }} />
            ) : (
              <p style={{ color: 'var(--comment)' }}>
                Klick „Nächste Zeile“ und geh das Skript Zeile für Zeile durch — mit Erklärung und simulierter Ausgabe.
              </p>
            )}
          </div>

          {stepOutput && (
            <div className="scriptsim-out">
              <span className="out-label">Ausgabe bisher:</span>
              {stepOutput}
            </div>
          )}

          <div className="scriptsim-controls">
            <button className="mini-btn" onClick={() => setStep((s) => Math.max(-1, s - 1))} disabled={step < 0}>
              ← Zurück
            </button>
            <button
              className="mini-btn primary"
              onClick={() => setStep((s) => Math.min(script.length - 1, s + 1))}
              disabled={atEnd}
            >
              Nächste Zeile →
            </button>
            <button className="mini-btn" onClick={() => setStep(script.length - 1)} disabled={atEnd}>
              Alles zeigen
            </button>
            <button className="mini-btn" onClick={() => setStep(-1)} disabled={step < 0}>
              ⟲ Reset
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="scriptsim-code">
            {script.map((s, i) => (
              <div key={i} className="code-line">
                <span className="ln">{i + 1}</span>
                <span className="lc">{s.line || ' '}</span>
              </div>
            ))}
          </div>
          <div className="scriptsim-out">
            <span className="out-label">Echte Interpreter-Ausgabe:</span>
            {(runOut ?? ['(läuft…)']).join('\n')}
          </div>
          <div className="scriptsim-controls">
            <button className="mini-btn primary" onClick={runAll}>▶ Nochmal ausführen</button>
          </div>
        </>
      )}
    </div>
  );
}
