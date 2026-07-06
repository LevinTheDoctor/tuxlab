import { useEffect, useMemo, useRef, useState } from 'react';
import { topics } from '../content/registry';
import { LEVEL_META } from '../types/content';
import { runEasterEgg, toast } from '../lib/easterEggs';
import './CommandPalette.css';

interface Props {
  open: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

/** Command-Palette (⌘/Strg+K): springen per cd/man, suchen, Fun-Kommandos. */
export function CommandPalette({ open, onClose, onNavigate }: Props) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ('');
      setSel(0);
      // Fokus nach dem Öffnen setzen.
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  // "cd thema" / "man thema" -> reines Query extrahieren.
  const query = q.replace(/^\s*(cd|man|open|goto)\s+/i, '').trim().toLowerCase();

  const results = useMemo(() => {
    if (!query) return topics;
    return topics.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.id.toLowerCase().includes(query) ||
        t.summary.toLowerCase().includes(query),
    );
  }, [query]);

  if (!open) return null;

  function choose(id: string) {
    onNavigate(id);
    onClose();
  }

  function onSubmit() {
    const raw = q.trim();

    // Fun-Kommandos zuerst.
    const egg = runEasterEgg(raw);
    if (egg.handled) {
      if (egg.lines && egg.lines.length) toast(egg.lines[0], 'fun');
      onClose();
      return;
    }
    if (results.length > 0) choose(results[Math.min(sel, results.length - 1)].id);
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'Enter') { onSubmit(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(results.length - 1, s + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
  }

  return (
    <div className="palette-overlay" onClick={onClose}>
      <div className="palette" onClick={(e) => e.stopPropagation()}>
        <div className="palette-input-row">
          <span className="palette-prompt">$</span>
          <input
            ref={inputRef}
            className="palette-input"
            value={q}
            placeholder="cd rechte · man git · oder such einfach…"
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={onKey}
            spellCheck={false}
            autoComplete="off"
          />
          <kbd className="palette-esc">esc</kbd>
        </div>
        <div className="palette-results">
          {results.length === 0 ? (
            <div className="palette-empty">Kein Treffer. Vielleicht ein Easter Egg? Probier <code>cowsay hi</code>.</div>
          ) : (
            results.map((t, i) => {
              const lvl = LEVEL_META[t.level];
              return (
                <button
                  key={t.id}
                  className={`palette-item ${i === sel ? 'active' : ''}`}
                  onMouseEnter={() => setSel(i)}
                  onClick={() => choose(t.id)}
                >
                  <span className="pi-ico">{t.icon}</span>
                  <span className="pi-body">
                    <span className="pi-title">{t.title}</span>
                    <span className="pi-sum">{t.summary}</span>
                  </span>
                  <span className="pi-lvl" style={{ color: `var(${lvl.varName})` }}>{lvl.label}</span>
                </button>
              );
            })
          )}
        </div>
        <div className="palette-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> wählen</span>
          <span><kbd>↵</kbd> öffnen</span>
          <span>Tipp: <code>man tux</code></span>
        </div>
      </div>
    </div>
  );
}
