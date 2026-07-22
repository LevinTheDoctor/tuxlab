/* =========================================================================
   CONTENT-MODELL — das Fundament der Skalierbarkeit.
   Inhalte sind DATEN (typisierte "Blocks"), kein Markup. Neue Lektion = neue
   Datei mit Topic-Objekten. Neuer Interaktionstyp = ein Block-Variant hier +
   eine Komponente im BlockRenderer.
   ========================================================================= */

export type Level = 'basic' | 'intermediate' | 'advanced' | 'senior';
export type Category = 'grundlagen' | 'system' | 'werkzeuge' | 'konzepte' | 'kultur' | 'fun';

/* ---- Bausteine, die mehrere Blocks teilen ---- */

export interface CheatRow {
  /** HTML für Taste/Befehl (darf <span class="kbd"> enthalten). */
  key: string;
  info: string;
  /** kurze Begründung / Merkhilfe, gedämpft darunter */
  why: string;
}
export interface CheatCategory {
  name: string;
  rows: CheatRow[];
}

export interface BreakToken {
  t: string; // sichtbarer Text-Teil
  d: string; // Erklärung beim Klick
}

export interface DirEntry {
  path: string;
  role: string;
  desc: string;
  inside: string[];
  tip: string;
}

export interface FileCard {
  file: string;
  perm: string;
  desc: string;
  /** HTML, darf <span class="c"> für Kommentare enthalten */
  code: string;
}

export interface EditorMode {
  name: string;
  enter: string;
  desc: string;
}

export interface LifecycleStage {
  ico: string;
  name: string;
  desc: string;
  via?: string;
}

/** Ein Schritt im geführten Skript-Durchlauf. */
export interface ScriptStep {
  line: string;      // die Codezeile
  explain: string;   // was diese Zeile tut (HTML erlaubt)
  output?: string;   // simulierte Terminalausgabe dieser Zeile (optional)
}

/** Ein Werkzeug mit Repo-Link (Button). */
export interface ToolEntry {
  name: string;
  desc: string;      // HTML erlaubt
  install?: string;  // z.B. "sudo apt install ripgrep"
  repo?: string;     // GitHub/GitLab-URL -> Button
  homepage?: string; // optionale Projekt-Website
  tag?: string;      // z.B. "Suche", "sync"
}

/** Eine Distribution mit Logo-Datei (SVG unter /public/logos/). */
export interface DistroEntry {
  name: string;
  logo: string;      // Schlüssel -> /public/logos/<logo>.svg (siehe DistroGrid)
  based: string;     // Basis/Familie
  pkg: string;       // Paketmanager
  desc: string;      // HTML erlaubt
  flavor: string;    // "für wen"
  accent: string;    // CSS-Var oder Hex für den Akzent
}

/** Ein Eintrag in einer Zeitleiste. */
export interface TimelineEntry {
  year: string;
  title: string;
  text: string;      // HTML erlaubt
}

/** Eine einfache Vergleichstabelle. */
export interface TableData {
  headers: string[];
  rows: string[][];  // Zellen dürfen HTML enthalten
}

/* ---- Die Block-Union ---- */

export type Block =
  | { type: 'prose'; html: string }
  | { type: 'callout'; variant: 'tip' | 'warn' | 'danger' | 'info'; title: string; html: string }
  | { type: 'cheatsheet'; categories: CheatCategory[] }
  | { type: 'breakdown'; cmd: BreakToken[] }
  | { type: 'directoryExplorer'; dirs: DirEntry[]; startIndex?: number }
  | { type: 'chmod'; start?: string }
  | { type: 'fileCards'; cards: FileCard[] }
  | { type: 'modeMachine'; modes: EditorMode[] }
  | { type: 'tmuxDemo' }
  | { type: 'lifecycle'; stages: LifecycleStage[] }
  | { type: 'terminal'; intro?: string; cwd?: string }
  | { type: 'scriptSim'; title?: string; script: ScriptStep[]; interactive?: boolean }
  | { type: 'heading'; text: string; color?: string }
  | { type: 'tools'; tools: ToolEntry[] }
  | { type: 'distros'; distros: DistroEntry[] }
  | { type: 'timeline'; entries: TimelineEntry[] }
  | { type: 'table'; table: TableData };

/* ---- Ein Thema (Seite) ---- */

export interface Topic {
  id: string;      // stabil, für Routing/man/cd/Fortschritt
  title: string;
  icon: string;    // Emoji/Zeichen fürs Nav
  level: Level;
  category: Category;
  summary: string; // Sidebar/Roadmap/Suche
  blocks: Block[];
}

export const LEVEL_META: Record<Level, { label: string; order: number; varName: string }> = {
  basic:        { label: 'Basic',        order: 0, varName: '--lvl-basic' },
  intermediate: { label: 'Fortgeschritten', order: 1, varName: '--lvl-intermediate' },
  advanced:     { label: 'Advanced',     order: 2, varName: '--lvl-advanced' },
  senior:       { label: 'Senior',       order: 3, varName: '--lvl-senior' },
};

export const CATEGORY_META: Record<Category, { label: string; order: number }> = {
  grundlagen: { label: 'Grundlagen', order: 0 },
  system:     { label: 'System',     order: 1 },
  werkzeuge:  { label: 'Werkzeuge',  order: 2 },
  konzepte:   { label: 'Konzepte',   order: 3 },
  kultur:     { label: 'Kultur & Geschichte', order: 4 },
  fun:        { label: 'Fun & Community', order: 5 },
};
