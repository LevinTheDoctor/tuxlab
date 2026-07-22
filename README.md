# 🐧 Tuxlab

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Made with React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff.svg)](https://vite.dev)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

> Eine interaktive Plattform, um **Linux von den absoluten Grundlagen bis Senior-Level**
> zu lernen — mit echtem Terminal, simulierten Shell-Skripten, einem Mini-Bash-Interpreter,
> Tux und ein paar Easter Eggs. Alles auf Deutsch, mit Ubuntu-Fokus.

Entstanden aus einer einzelnen `linux-verzeichnisse.html` und ausgebaut zu einer
skalierbaren React-App.

## Screenshots

<!-- Füge hier Screenshots hinzu, sobald vorhanden — z.B.:
![Roadmap](docs/screenshot-roadmap.png)
![Terminal](docs/screenshot-terminal.png)
![Skript-Simulator](docs/screenshot-script.png)
-->

> Platzhalter —Screenshots folgen. Bis dahin: `npm run dev` starten und selbst
> reinschauen. 🐧

## Schnellstart

```bash
npm install      # einmalig
npm run dev      # Dev-Server auf http://localhost:5173
npm run build    # Produktions-Build (Type-Check + Bundle) nach dist/
npm run preview  # den Build lokal ansehen
```

Voraussetzung: Node ≥ 18.

## Was drin ist

24 Themen in fünf Bereichen, sortierbar über eine Roadmap (basic → senior):

- **Grundlagen** — Das Terminal, Dateien & Ordner, Das Dateisystem
- **System** — Rechte & chmod, User/Gruppen/sudo, Mounten, Pakete & Software, Netzwerk-Freigaben (Samba/NFS)
- **Werkzeuge** — Shells (bash/zsh/fish), Shell-Scripting, Git, tmux, Docker, Neovim, Sync & Backup, Moderne CLI-Tools
- **Konzepte** — Prozesse, Streams & Pipes, Netzwerk & Protokolle, systemd, Kernel & Userspace, Best Practices
- **Kultur & Geschichte** — Linux-Geschichte & Tux, Distributionen

Highlights: interaktives Terminal + echter Mini-Bash-Interpreter, Skript-Simulator (Schritt-für-Schritt
*und* „wirklich ausführen“), chmod-Rechner, tmux-Pane-Demo, Command-Palette (⌘/Strg+K), Fortschritts-Tracking.

## Architektur — warum das erweiterbar ist

**Inhalte sind Daten, kein Markup.** Der ganze Trick steckt hier:

```
src/
  types/content.ts        # die Block-Union (das Fundament) + Topic-Typ
  content/                # je Datei ein Themengebiet, exportiert Topic-Objekte
    registry.ts           # eine Liste `topics[]` -> treibt Nav, Roadmap, Suche, Routing
  components/
    blocks/BlockRenderer.tsx  # Dispatcher: Block.type -> Komponente
    blocks/*.tsx          # eine Komponente pro Block-Typ
    layout/               # ShellFrame, Sidebar, TopicView
  lib/
    fakeFs.ts             # virtuelles Dateisystem (Terminal + Interpreter teilen es)
    shell/                # Mini-Bash: tokenizer, parser, exec, builtins
    easterEggs.ts         # Konami, cowsay, rm -rf / -Block, ...
```

### Ein neues Thema hinzufügen

1. Neue Datei in `src/content/`, z.B. `firewall.ts`:

```ts
import type { Topic } from '../types/content';

export const firewall: Topic = {
  id: 'firewall',            // stabil, landet in der URL (#/firewall)
  title: 'Firewall (ufw)',
  icon: '🛡️',
  level: 'advanced',         // basic | intermediate | advanced | senior
  category: 'system',        // grundlagen | system | werkzeuge | konzepte | kultur
  summary: 'Ports öffnen und schließen mit ufw.',
  blocks: [
    { type: 'prose', html: '<p>…</p>' },
    { type: 'cheatsheet', categories: [/* … */] },
  ],
};
```

2. In `src/content/registry.ts` importieren und ins `topics`-Array eintragen. Fertig — Sidebar,
   Roadmap, Suche und Routing nehmen es automatisch auf.

### Einen neuen interaktiven Baustein hinzufügen

1. Variant in die `Block`-Union in `src/types/content.ts` eintragen.
2. Komponente in `src/components/blocks/` bauen.
3. `case` im `BlockRenderer` ergänzen (TypeScript erzwingt das über eine `never`-Prüfung).

## Der Mini-Bash-Interpreter

In `src/lib/shell/` steckt ein bewusst kleiner, aber echter Bash-Interpreter: Variablen, Pipes,
Redirects (`>`/`>>`), `if/for/while`, `test`/`[ ]` und die Kernbefehle (`ls cat cd grep wc …`) gegen
ein virtuelles Dateisystem. **Kein** Ziel ist volles POSIX (z.B. keine `$(( ))`-Arithmetik) — nicht
Unterstütztes gibt eine freundliche Meldung. Terminal und Skript-Simulator teilen sich denselben
Interpreter und dasselbe `fakeFs`.

## Design

Dracula-Palette, „die ganze App ist ein Terminal“, JetBrains Mono als Display-Font. Responsive bis
Mobile, sichtbarer Tastatur-Fokus, `prefers-reduced-motion` respektiert.

## Stack

React 18 · TypeScript · Vite. Keine Router- oder State-Library (Hash-Routing + `localStorage`
reichen). Fonts via Google Fonts.

## Roadmap

Ideen, die noch kommen sollen (siehe auch die Issues):

- [ ] Persistente Terminal-History über Reloads hinweg
- [ ] Themen-spezifische virtuelle Dateisysteme (z.B. `/etc`-Baum für Paket-Themen)
- [ ] Mehr Bash-Konstrukte: `case`, Funktionen, `$(...)`-Subshells
- [ ] Fortschritts-Export / Import (Backup des localStorage)
- [ ] Mehr Sprachen (English als Toggle)

Wenn du eine davon übernehmen willst: einfach ein Issue aufmachen und lostippen.

## Mitmachen

Pull Requests sind herzlich willkommen — siehe [CONTRIBUTING.md](./CONTRIBUTING.md) für
Setup, Stil und Checklist. Für Bugs und Feature-Ideen gibt es Vorlagen unter
`.github/ISSUE_TEMPLATE/`.

## Lizenz

[MIT](./LICENSE) © Levin Rüßmann. Der Tux-Pinguin ist ein eingetragenes Markenzeichen
von Linus Torvalds — dieses Projekt steht nicht in Verbindung mit Linux Foundation oder
Linus Torvalds und nutzt Tux rein zu Lern- und Dekozwecken.
