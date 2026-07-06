import { topics } from '../content/registry';
import { LEVEL_META, type Level } from '../types/content';
import { TUX_ASCII } from './Tux';
import './Roadmap.css';

interface Props {
  done: Set<string>;
  onNavigate: (id: string) => void;
}

const LEVELS: Level[] = ['basic', 'intermediate', 'advanced', 'senior'];

const LEVEL_BLURB: Record<Level, string> = {
  basic: 'Erste Schritte: das Terminal, Befehle, das Dateisystem. Hier beginnt alles.',
  intermediate: 'Rechte, User, Mounten, Editor. Du wirst im System heimisch.',
  advanced: 'Shell-Scripting, Git, Docker, tmux. Du automatisierst und arbeitest wie im Alltag.',
  senior: 'Wie Linux wirklich tickt: Prozesse, Kernel, Protokolle, systemd. Das große Bild.',
};

/** Startseite: Lernpfad basic → senior mit Fortschritt. */
export function Roadmap({ done, onNavigate }: Props) {
  const total = topics.length;
  const doneCount = topics.filter((t) => done.has(t.id)).length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="roadmap">
      <header className="rm-hero">
        <pre className="rm-tux">{TUX_ASCII}</pre>
        <div className="rm-hero-text">
          <div className="rm-eyebrow">
            <span className="rm-user">levin@ubuntu</span>:<span className="rm-path">~</span>$ ./lerne-linux.sh
          </div>
          <h1 className="rm-title">Werde Linux-Wizard.</h1>
          <p className="rm-sub">
            Von <b>absolut basic</b> bis <b>Senior</b>. Klickbar, simulierbar, mit echtem Terminal
            und einem Pinguin, der Tipps gibt. Kein Vorwissen nötig — nur Neugier.
          </p>
          <div className="rm-progress">
            <div className="rm-bar"><div className="rm-bar-fill" style={{ width: `${pct}%` }} /></div>
            <span className="rm-progress-label">{doneCount} / {total} gelernt · {pct}%</span>
          </div>
        </div>
      </header>

      {LEVELS.map((lvl) => {
        const items = topics.filter((t) => t.level === lvl);
        if (!items.length) return null;
        const meta = LEVEL_META[lvl];
        return (
          <section className="rm-level" key={lvl}>
            <div className="rm-level-head">
              <span className="rm-level-badge" style={{ background: `var(${meta.varName})` }}>{meta.label}</span>
              <p className="rm-level-blurb">{LEVEL_BLURB[lvl]}</p>
            </div>
            <div className="rm-grid">
              {items.map((t) => {
                const isDone = done.has(t.id);
                return (
                  <button className={`rm-card ${isDone ? 'is-done' : ''}`} key={t.id} onClick={() => onNavigate(t.id)}>
                    <span className="rm-card-ico">{t.icon}</span>
                    <span className="rm-card-title">{t.title}{isDone && <span className="rm-check">✓</span>}</span>
                    <span className="rm-card-sum">{t.summary}</span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
