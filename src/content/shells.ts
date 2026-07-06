import type { Topic } from '../types/content';

export const shells: Topic = {
  id: 'shells',
  title: 'Shells: bash, zsh, fish',
  icon: '🐚',
  level: 'intermediate',
  category: 'werkzeuge',
  summary: 'Welche Shell tippt deine Befehle? Unterschiede, Configs und Komfort.',
  blocks: [
    {
      type: 'prose',
      html: `Die <b>Shell</b> ist das Programm, das deine Eingaben liest und ausführt. Es gibt mehrere — sie sprechen fast dieselbe Sprache, unterscheiden sich aber im Komfort. Welche gerade läuft, verrät dir <code>echo $SHELL</code>.`,
    },
    { type: 'heading', text: 'Die drei großen im Vergleich', color: '--purple' },
    {
      type: 'table',
      table: {
        headers: ['', 'bash', 'zsh', 'fish'],
        rows: [
          ['Rolle', 'Der Standard überall', 'bash + Komfort', 'Modern, „einfach schön“'],
          ['Autovervollständigung', 'Basis (Tab)', 'Sehr stark, mit Menü', 'Beste, out-of-the-box'],
          ['Vorschläge beim Tippen', 'nein', 'per Plugin', '<b>eingebaut</b> (History-Ghost)'],
          ['Config-Datei', '<code>~/.bashrc</code>', '<code>~/.zshrc</code>', '<code>~/.config/fish/</code>'],
          ['POSIX-kompatibel', 'ja', 'ja', 'nein (eigene Syntax)'],
          ['Ideal für', 'Skripte & Server', 'Alltag am Desktop', 'Einsteiger, Komfort'],
        ],
      },
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Wichtig für Skripte',
      html: `Schreibe <b>Skripte immer in bash</b> (Shebang <code>#!/bin/bash</code> oder portabel <code>#!/bin/sh</code>), nie in fish — fish hat eine eigene, inkompatible Syntax. Als <b>interaktive</b> Shell darfst du nehmen, was dir gefällt. Viele nutzen zsh oder fish zum Arbeiten und bash zum Skripten. Beides geht problemlos nebeneinander.`,
    },
    { type: 'heading', text: 'Deine Shell aufmotzen', color: '--purple' },
    {
      type: 'tools',
      tools: [
        { name: 'Oh My Zsh', tag: 'zsh', desc: 'Das populärste Framework für zsh: Themes, Plugins und sinnvolle Defaults per Ein-Zeilen-Install.', install: 'sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"', repo: 'https://github.com/ohmyzsh/ohmyzsh' },
        { name: 'Starship', tag: 'Prompt', desc: 'Ein blitzschneller, schöner Prompt für <b>jede</b> Shell (bash, zsh, fish). Zeigt Git-Status, Sprache, Laufzeit — alles in Rust.', install: 'curl -sS https://starship.rs/install.sh | sh', repo: 'https://github.com/starship/starship', homepage: 'https://starship.rs' },
        { name: 'fish', tag: 'Shell', desc: 'Die „friendly interactive shell“. Autovorschläge und Syntax-Highlighting ohne jede Konfiguration.', install: 'sudo apt install fish', repo: 'https://github.com/fish-shell/fish-shell', homepage: 'https://fishshell.com' },
        { name: 'zsh-autosuggestions', tag: 'zsh', desc: 'Bringt fish-artige Vorschläge (grauer Geistertext aus der History) in zsh.', install: 'git clone …/zsh-autosuggestions', repo: 'https://github.com/zsh-users/zsh-autosuggestions' },
        { name: 'atuin', tag: 'History', desc: 'Ersetzt deine Shell-History durch eine durchsuchbare Datenbank — synchronisierbar über mehrere Rechner.', install: 'curl … | bash', repo: 'https://github.com/atuinsh/atuin' },
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Standard-Shell wechseln',
      html: `Mit <code>chsh -s $(which zsh)</code> machst du zsh zu deiner Login-Shell (beim nächsten Login aktiv). Vorher installieren und einmal ausprobieren, indem du sie direkt startest: einfach <code>zsh</code> tippen.`,
    },
  ],
};
