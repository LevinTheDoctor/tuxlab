import { useEffect, useRef, useState } from 'react';
import './Tux.css';

/** Tux als ASCII-Art. Bewusst der klassische Look (jgs), leicht gekürzt. */
export const TUX_ASCII = String.raw`
     .--.
    |o_o |
    |:_/ |
   //   \ \
  (|     | )
 /'\_   _/'\
 \___)=(___/`;

const TIPS = [
  'Alles ist eine Datei. Sogar deine Maus lebt unter /dev.',
  'man <befehl> ist dein bester Freund. Kein Googeln nötig.',
  'Mit Tab vervollständigst du Pfade und Befehle. Faulheit ist eine Tugend.',
  'Strg+R durchsucht deine Shell-History rückwärts. Lifechanger.',
  '`cd -` springt zurück ins vorherige Verzeichnis.',
  'Vor jedem sudo: einmal tief durchatmen und den Befehl nochmal lesen.',
  '`rm` fragt nicht nach. Es gibt keinen Papierkorb.',
  'chmod 777 ist selten die Lösung und oft das Problem.',
  'Ich bin ein Pinguin, kein Symbol. Aber ich fühle mich geehrt.',
  'Drück Strg+K. Da drin wohnt eine kleine Shell.',
];

export function Tux({ size = 'sidebar' }: { size?: 'sidebar' | 'floating' }) {
  const [tip, setTip] = useState<string | null>(null);
  const [party, setParty] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const onParty = () => {
      setParty(true);
      window.setTimeout(() => setParty(false), 2600);
    };
    const onSay = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      showTip(detail ?? TIPS[Math.floor(Math.random() * TIPS.length)]);
    };
    window.addEventListener('tux:party', onParty);
    window.addEventListener('tux:say', onSay);
    return () => {
      window.removeEventListener('tux:party', onParty);
      window.removeEventListener('tux:say', onSay);
    };
  }, []);

  function showTip(text: string) {
    setTip(text);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setTip(null), 6000);
  }

  function randomTip() {
    showTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
  }

  return (
    <div className={`tux tux-${size} ${party ? 'tux-party' : ''}`}>
      {tip && (
        <div className="tux-bubble" role="status">
          {tip}
        </div>
      )}
      <button
        className="tux-art"
        onClick={randomTip}
        aria-label="Tux fragen (zufälliger Tipp)"
        title="Klick mich"
      >
        <pre>{TUX_ASCII}</pre>
      </button>
      {party && <div className="tux-confetti">🎉 ✨ 🐧 ✨ 🎉</div>}
    </div>
  );
}
