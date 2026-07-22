# 🐧 Zu Tuxlab beitragen

Danke, dass du mithelfen willst! Tuxlab lebt davon, dass immer mehr Linux-Themen
verständlich erklärt werden — jeder Beitrag ist willkommen.

## Was du beitragen kannst

- **Neue Themen** — ein neues `Topic` in `src/content/` (siehe „Neues Thema hinzufügen“ in der README)
- **Bestehende Inhalte verbessern** — Tippfehler, Verständlichkeit, fehlende Befehle
- **Neue interaktive Bausteine** — ein neuer `Block`-Typ + Komponente (siehe README)
- **Mini-Bash-Interpreter** — fehlende Befehle oder Konstrukte in `src/lib/shell/`
- **Bugs** — melde sie als Issue oder schick direkt einen Fix

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # muss ohne Fehler durchlaufen
```

Voraussetzung: Node ≥ 18.

## Bevor du einen Pull Request öffnest

1. `npm run build` läuft ohne TypeScript- oder Build-Fehler durch.
2. Neue Themen sind in `src/content/registry.ts` eingetragen.
3. Neue Block-Typen haben einen `case` im `BlockRenderer` (TypeScript erzwingt das
   über eine `never`-Prüfung — der Compiler meckert, wenn du es vergisst).
4. Inhalte bleiben auf **Deutsch**, Stil und Stimme passen zu den bestehenden Themen.
5. Keine neuen Runtime-Dependencies ohne Diskussion im Issue — aktuell bewusst
   dependency-arm (nur React + Vite).

## Stil

- Inhalte sind **Daten**, kein Markup — alles als `Block`-Objekte, nicht als rohes HTML
  in der Komponente.
- Dracula-Palette, JetBrains Mono, „die App ist ein Terminal“.
- Keine Kommentare im Code, außer sie erklären etwas Nicht-Offensichtliches.

## Pull Request

- Ein Thema/Feature pro PR — hält Reviews klein.
- Beschreibe im PR, *was* sich geändert hat und *warum*.
- Bei neuen Themen: gib im PR an, in welche Roadmap-Stufe (`basic | intermediate |
  advanced | senior`) das Thema gehört.

## Issues

Für Bugs, Feature-Wünsche oder neue Themen-Ideen: einfach ein Issue aufmachen mit
der passenden Vorlage (`.github/ISSUE_TEMPLATE/`).

## Verhalten

Sei freundlich, geduldig und respektvoll. Wir alle lernen — das ist der Punkt
des Projekts.