import { topics } from '../../content/registry';
import { CATEGORY_META, LEVEL_META, type Category } from '../../types/content';
import { Tux } from '../Tux';
import { usePlatform } from '../../hooks/usePlatform';
import './Sidebar.css';

interface Props {
  activeId: string;
  done: Set<string>;
  onNavigate: (id: string) => void;
  onOpenPalette: () => void;
  open: boolean;
  onToggle: () => void;
}

export function Sidebar({ activeId, done, onNavigate, onOpenPalette, open, onToggle }: Props) {
  const platform = usePlatform();
  const shortcut = platform === 'mac' ? '⌘K' : 'Ctrl+K';
  // Kategorien in definierter Reihenfolge, jede mit ihren Topics.
  const cats = (Object.keys(CATEGORY_META) as Category[])
    .sort((a, b) => CATEGORY_META[a].order - CATEGORY_META[b].order)
    .map((cat) => ({ cat, items: topics.filter((t) => t.category === cat) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <button className="nav-burger" onClick={onToggle} aria-label="Navigation umschalten" aria-expanded={open}>
        <span className="nav-burger-prompt">$</span> {open ? 'schließen' : 'menü'}
      </button>

      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-head">
          <button className="brand" onClick={() => onNavigate('roadmap')} aria-label="Zur Startseite / Roadmap">
            <span className="brand-mark">🐧</span>
            <span className="brand-name">tuxlab</span>
            <span className="brand-cursor">▊</span>
          </button>
          <p className="brand-sub">Linux — von basic bis senior</p>
        </div>

        <button className="palette-hint" onClick={onOpenPalette}>
          <span>Suchen / Springen</span>
          <kbd>{shortcut}</kbd>
        </button>

        <button
          className={`nav-roadmap ${activeId === 'roadmap' || activeId === '' ? 'active' : ''}`}
          onClick={() => onNavigate('roadmap')}
        >
          <span className="nav-ico">🗺️</span> Roadmap &amp; Fortschritt
        </button>

        <nav className="nav">
          {cats.map(({ cat, items }) => (
            <div className="nav-group" key={cat}>
              <div className="nav-group-title">{CATEGORY_META[cat].label}</div>
              {items.map((t) => {
                const isDone = done.has(t.id);
                const lvl = LEVEL_META[t.level];
                return (
                  <button
                    key={t.id}
                    className={`nav-item ${activeId === t.id ? 'active' : ''}`}
                    onClick={() => onNavigate(t.id)}
                    title={t.summary}
                  >
                    <span className={`nav-dot ${isDone ? 'is-done' : ''}`} aria-hidden />
                    <span className="nav-ico">{t.icon}</span>
                    <span className="nav-label">{t.title}</span>
                    <span
                      className="nav-lvl"
                      style={{ color: `var(${lvl.varName})` }}
                      title={lvl.label}
                    >
                      {lvl.label[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-foot">
          <Tux size="sidebar" />
          <p className="foot-tip">Klick Tux für einen Tipp. Konami-Code für eine Überraschung.</p>
          <a
            className="foot-github"
            href="https://github.com/LevinTheDoctor/tuxlab"
            target="_blank"
            rel="noopener noreferrer"
            title="Tuxlab auf GitHub"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span>Auf GitHub ansehen</span>
          </a>
        </div>
      </aside>

      {open && <div className="sidebar-scrim" onClick={onToggle} />}
    </>
  );
}
