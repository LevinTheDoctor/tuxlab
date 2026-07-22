/* =========================================================================
   EASTER EGGS
   - Konami-Code global lauschen -> Tux-Party
   - Fun-Kommandos (aus Terminal/Palette) zentral auswerten
   Kommunikation läuft über CustomEvents, damit UI-Teile lose gekoppelt bleiben.
   ========================================================================= */

export function tuxParty() {
  window.dispatchEvent(new CustomEvent('tux:party'));
}
export function tuxSay(text?: string) {
  window.dispatchEvent(new CustomEvent('tux:say', { detail: text }));
}
export function toast(text: string, variant: 'info' | 'fun' | 'warn' = 'fun') {
  window.dispatchEvent(new CustomEvent('toast', { detail: { text, variant } }));
}

/** Konami: ↑ ↑ ↓ ↓ ← → ← → b a */
const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

export function installKonami() {
  let idx = 0;
  const handler = (e: KeyboardEvent) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === KONAMI[idx]) {
      idx++;
      if (idx === KONAMI.length) {
        idx = 0;
        tuxParty();
        toast('KONAMI! Tux tanzt. 🐧', 'fun');
      }
    } else {
      idx = key === KONAMI[0] ? 1 : 0;
    }
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}

export interface EggResult {
  /** Textzeilen fürs Terminal (falls aus dem Terminal aufgerufen). */
  lines?: string[];
  /** true = das Kommando war ein Easter Egg und wurde behandelt. */
  handled: boolean;
}

const COW = (msg: string) => {
  const line = ' ' + '_'.repeat(msg.length + 2);
  const line2 = ' ' + '-'.repeat(msg.length + 2);
  return [
    line,
    `< ${msg} >`,
    line2,
    '        \\   ^__^',
    '         \\  (oo)\\_______',
    '            (__)\\       )\\/\\',
    '                ||----w |',
    '                ||     ||',
  ];
};

/**
 * Wertet Fun-Kommandos aus. Gibt handled=false zurück, wenn es kein Egg war —
 * dann soll der normale Interpreter/die Navigation übernehmen.
 */
export function runEasterEgg(raw: string): EggResult {
  const input = raw.trim();
  const lower = input.toLowerCase();
  const [cmd, ...rest] = input.split(/\s+/);
  const arg = rest.join(' ');

  // rm -rf / (und Varianten) — Tux blockt.
  if (/^(sudo\s+)?rm\s+-\S*[rf]\S*\s+\/(\*|\s|$)/.test(lower)) {
    tuxParty();
    return {
      handled: true,
      lines: [
        'Tux stellt sich schützend vor dein Dateisystem. 🐧',
        "rm: '/' wird nicht gelöscht (--no-preserve-root nicht angegeben)",
        'Guter Versuch. In echt wäre hier alles weg gewesen.',
      ],
    };
  }

  if (lower === 'sudo' || lower === 'sudo su') {
    return {
      handled: true,
      lines: [
        'levin is not in the sudoers file. This incident will be reported.',
      ],
    };
  }

  if (cmd === 'cowsay') {
    return { handled: true, lines: COW(arg || 'Muuuh, lern Linux!') };
  }

  if (cmd === 'cowthink') {
    tuxSay(arg || undefined);
    return { handled: true, lines: [] };
  }

  if (lower === ':q' || lower === ':q!' || lower === ':wq' || lower === ':x') {
    toast('Das ist kein Neovim. Aber netter Reflex. 😎', 'fun');
    return { handled: true, lines: ['E37: Kein Vim hier. Nutz die Sidebar zum Rausgehen.'] };
  }

  if (lower === 'exit' || lower === 'logout') {
    return { handled: true, lines: ['Nice try. Du kommst hier nicht raus, du lernst jetzt Linux.'] };
  }

  if (lower === 'whoami') {
    return { handled: true, lines: ['levin — angehender Linux-Wizard 🧙'] };
  }

  if (lower === 'sl') {
    return { handled: true, lines: ['🚂💨  choo choo — du meintest wohl `ls`.'] };
  }

  if (cmd === 'man' && (arg === 'tux' || arg === 'penguin')) {
    return {
      handled: true,
      lines: [
        'TUX(1)                     Tuxlab Handbuch                    TUX(1)',
        '',
        'NAME',
        '       tux — das Maskottchen des Linux-Kernels',
        '',
        'BESCHREIBUNG',
        '       Ein Pinguin. Larry Ewing zeichnete ihn 1996 in GIMP.',
        '       Angeblich weil Linus Torvalds von einem Pinguin im',
        '       Zoo gebissen wurde. Seitdem: Kernel-Maskottchen.',
        '',
        'SIEHE AUCH',
        '       Klick mich in der Seitenleiste an.',
      ],
    };
  }

  return { handled: false };
}
