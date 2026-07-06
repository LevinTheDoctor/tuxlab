import { useEffect, useState } from 'react';
import './App.css';
import { topics } from './content/registry';
import { useHashRoute } from './hooks/useHashRoute';
import { loadDone, saveDone } from './lib/progress';
import { installKonami } from './lib/easterEggs';
import { Sidebar } from './components/layout/Sidebar';
import { TopicView } from './components/layout/TopicView';
import { Roadmap } from './components/Roadmap';
import { CommandPalette } from './components/CommandPalette';
import { Toasts } from './components/Toasts';

export default function App() {
  const [route, navigate] = useHashRoute();
  const [done, setDone] = useState<Set<string>>(() => loadDone());
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  // Konami-Code global scharf schalten.
  useEffect(() => installKonami(), []);

  // Palette per Strg/⌘+K öffnen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function toggleDone(id: string) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveDone(next);
      return next;
    });
  }

  const isRoadmap = route === 'roadmap' || route === '';
  const topic = topics.find((t) => t.id === route);

  function go(id: string) {
    navigate(id);
    setNavOpen(false);
  }

  return (
    <div className="app">
      <Sidebar
        activeId={route}
        done={done}
        onNavigate={go}
        onOpenPalette={() => setPaletteOpen(true)}
        open={navOpen}
        onToggle={() => setNavOpen((v) => !v)}
      />

      <main className="main">
        <div className="main-inner">
          {isRoadmap ? (
            <Roadmap done={done} onNavigate={go} />
          ) : topic ? (
            <TopicView topic={topic} isDone={done.has(topic.id)} onToggleDone={() => toggleDone(topic.id)} />
          ) : (
            <div className="not-found">
              <h2>404 — Kein Thema unter diesem Pfad</h2>
              <p>
                <code>{route}</code> gibt es nicht. Zurück zur{' '}
                <a href="#/roadmap" onClick={() => go('roadmap')}>Roadmap</a>.
              </p>
            </div>
          )}
        </div>
      </main>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={go}
      />
      <Toasts />
    </div>
  );
}
