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
        </div>
      </aside>

      {open && <div className="sidebar-scrim" onClick={onToggle} />}
    </>
  );
}
