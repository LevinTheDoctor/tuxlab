import { useEffect, useMemo, useRef, useState } from 'react';
import { makeDefaultFs, resolvePath, segmentsToPath } from '../../lib/fakeFs';
import { createShell, runScript } from '../../lib/shell/interpreter';
import { runEasterEgg } from '../../lib/easterEggs';
import type { OutLine } from '../../lib/shell/types';
import './blocks.css';

interface Line extends OutLine {
  id: number;
  prompt?: string; // wenn gesetzt: Eingabezeile
}

let uid = 0;

function shortCwd(cwd: string[]): string {
  const p = segmentsToPath(cwd);
  return p.startsWith('/home/levin') ? '~' + p.slice('/home/levin'.length) : p;
}

/** Interaktives Terminal gegen fakeFs + Mini-Interpreter. */
export function Terminal({ intro, cwd }: { intro?: string; cwd?: string }) {
  const sh = useMemo(() => {
    const fs = makeDefaultFs();
    const start = cwd ? resolvePath('/', cwd) : ['home', 'levin'];
    return createShell(fs, start);
  }, [cwd]);

  const [lines, setLines] = useState<Line[]>(() =>
    intro ? [{ id: uid++, text: intro, kind: 'sys' }] : [],
  );
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [promptPath, setPromptPath] = useState(shortCwd(sh.cwd));
  const screenRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    screenRef.current?.scrollTo({ top: screenRef.current.scrollHeight });
  }, [lines]);

  function push(newLines: Line[]) {
    setLines((prev) => [...prev, ...newLines]);
  }

  function submit() {
    const cmd = input;
    setInput('');
    const promptLine: Line = { id: uid++, text: cmd, kind: 'out', prompt: promptPath };
    if (cmd.trim()) {
      setHistory((h) => [...h, cmd]);
    }
    setHistIdx(-1);

    if (!cmd.trim()) {
      push([promptLine]);
      return;
    }

    // clear vorab abfangen
    if (cmd.trim() === 'clear') {
      setLines([]);
      return;
    }

    // Easter Eggs zuerst
    const egg = runEasterEgg(cmd);
    if (egg.handled) {
      push([promptLine, ...(egg.lines ?? []).map((t) => ({ id: uid++, text: t, kind: 'out' as const }))]);
      return;
    }

    // Interpreter
    const out = runScript(sh, cmd);
    const rendered: Line[] = [];
    let cleared = false;
    for (const o of out) {
      if (o.text === '\x00CLEAR\x00') { cleared = true; rendered.length = 0; continue; }
      rendered.push({ id: uid++, ...o });
    }
    setPromptPath(shortCwd(sh.cwd));
    if (cleared) setLines([]);
    else push([promptLine, ...rendered]);
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { submit(); return; }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const idx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setInput(history[idx]);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx === -1) return;
      const idx = histIdx + 1;
      if (idx >= history.length) { setHistIdx(-1); setInput(''); }
      else { setHistIdx(idx); setInput(history[idx]); }
    }
  }

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-titlebar">
        <span className="dot r" /><span className="dot y" /><span className="dot g" />
        <span className="tt">levin@ubuntu — probier's aus</span>
      </div>
      <div className="terminal-screen" ref={screenRef}>
        {lines.map((l) =>
          l.prompt !== undefined ? (
            <div className="terminal-line in" key={l.id}>
              <span className="tp">levin@ubuntu</span>:<span className="tpath">{l.prompt}</span>$ {l.text}
            </div>
          ) : (
            <div className={`terminal-line ${l.kind}`} key={l.id}>{l.text || ' '}</div>
          ),
        )}
        <div className="terminal-inputline">
          <span className="tp">levin@ubuntu</span>:<span className="tpath">{promptPath}</span>$
          <input
            ref={inputRef}
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            aria-label="Terminal-Eingabe"
          />
        </div>
      </div>
    </div>
  );
}
