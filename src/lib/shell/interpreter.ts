import {
  getNode,
  resolvePath,
  segmentsToPath,
  type FsDir,
} from '../fakeFs';
import { builtins } from './builtins';
import type { OutLine, Shell } from './types';

/* =========================================================================
   MINI-BASH-INTERPRETER
   Kein vollständiges POSIX — bewusst ein lehrreicher Ausschnitt: Variablen,
   echo, Pipes, Redirects, if/for/while, test/[ ]. Alles läuft gegen fakeFs.
   Nicht Unterstütztes gibt eine freundliche Meldung.
   ========================================================================= */

export function createShell(fs: FsDir, cwd: string[] = ['home', 'levin']): Shell {
  return { fs, cwd, vars: { USER: 'levin', HOME: '/home/levin', SHELL: '/bin/bash', PWD: '/home/levin' }, lastExit: 0 };
}

/* ---------- Quote-bewusstes Splitten ---------- */

/** Teilt einen String an Top-Level-Trennern (nicht in Quotes). */
function splitTop(str: string, seps: string[]): { parts: string[]; ops: string[] } {
  const parts: string[] = [];
  const ops: string[] = [];
  let cur = '';
  let q: string | null = null;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (q) {
      cur += c;
      if (c === q) q = null;
      continue;
    }
    if (c === "'" || c === '"') { q = c; cur += c; continue; }
    let matched = '';
    for (const s of seps) {
      if (str.startsWith(s, i)) { matched = s; break; }
    }
    if (matched) {
      parts.push(cur);
      ops.push(matched);
      cur = '';
      i += matched.length - 1;
    } else {
      cur += c;
    }
  }
  parts.push(cur);
  return { parts, ops };
}

/** Zerlegt ein ganzes Skript in einzelne Statements (Zeilen + ; ), ohne Kommentare. */
function splitStatements(script: string): string[] {
  const out: string[] = [];
  for (const rawLine of script.split('\n')) {
    // Kommentar am Zeilenende entfernen (nur wenn # nicht in Quotes) — simpel: führendes #.
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const { parts } = splitTop(line, [';']);
    for (const p of parts) {
      let s = p.trim();
      if (!s) continue;
      // Führende Blockmarker abtrennen: "then echo" -> "then" + "echo"
      const m = s.match(/^(then|do|else)\s+(.+)$/);
      if (m) {
        out.push(m[1]);
        s = m[2].trim();
      }
      if (s) out.push(s);
    }
  }
  return out;
}

/* ---------- Tokenisieren + Variablen-Expansion ---------- */

function expandVars(sh: Shell, s: string): string {
  return s
    .replace(/\$\{(\w+)\}/g, (_, n) => sh.vars[n] ?? '')
    .replace(/\$(\w+)/g, (_, n) => sh.vars[n] ?? '')
    .replace(/\$\?/g, () => String(sh.lastExit));
}

/** Liest eine Variable ab Position i (die auf '$' zeigt) und expandiert sie. */
function readVar(sh: Shell, str: string, i: number): { value: string; next: number } {
  i++; // '$' überspringen
  if (str[i] === '{') {
    let name = '';
    i++;
    while (i < str.length && str[i] !== '}') name += str[i++];
    i++; // schließende }
    return { value: sh.vars[name] ?? '', next: i };
  }
  if (str[i] === '?') return { value: String(sh.lastExit), next: i + 1 };
  let name = '';
  while (i < str.length && /\w/.test(str[i])) name += str[i++];
  if (name === '') return { value: '$', next: i }; // einzelnes $
  return { value: sh.vars[name] ?? '', next: i };
}

/** Tokenisiert ein Kommando in Wörter, respektiert Quotes und expandiert Variablen.
 *  Einfache Quotes: wörtlich. Doppelte Quotes & unquoted: Variablen werden ersetzt. */
function tokenize(sh: Shell, str: string): string[] {
  const words: string[] = [];
  let cur = '';
  let has = false;
  let i = 0;
  while (i < str.length) {
    const c = str[i];
    if (c === ' ' || c === '\t') {
      if (has) { words.push(cur); cur = ''; has = false; }
      i++;
    } else if (c === "'") {
      has = true;
      i++;
      while (i < str.length && str[i] !== "'") cur += str[i++]; // keine Expansion
      i++;
    } else if (c === '"') {
      has = true;
      i++;
      let inner = '';
      while (i < str.length && str[i] !== '"') inner += str[i++];
      i++;
      cur += expandVars(sh, inner);
    } else if (c === '$') {
      has = true;
      const { value, next } = readVar(sh, str, i);
      cur += value;
      i = next;
    } else if (c === '\\') {
      has = true;
      if (i + 1 < str.length) cur += str[i + 1];
      i += 2;
    } else {
      has = true;
      cur += c;
      i++;
    }
  }
  if (has) words.push(cur);
  return words;
}

/* ---------- Block-Parser (AST) ---------- */

type Node =
  | { kind: 'cmd'; text: string }
  | { kind: 'if'; branches: { cond: string; body: Node[] }[]; elseBody: Node[] }
  | { kind: 'for'; varName: string; itemsRaw: string; body: Node[] }
  | { kind: 'while'; cond: string; body: Node[] };

const first = (s: string) => s.split(/\s+/)[0];
const STOP = new Set(['then', 'do', 'else', 'elif', 'fi', 'done']);

function parseSeq(stmts: string[], i: number, stops: Set<string>): { nodes: Node[]; i: number } {
  const nodes: Node[] = [];
  while (i < stmts.length) {
    const ft = first(stmts[i]);
    if (stops.has(ft)) break;
    if (ft === 'if') { const r = parseIf(stmts, i); nodes.push(r.node); i = r.i; }
    else if (ft === 'for') { const r = parseFor(stmts, i); nodes.push(r.node); i = r.i; }
    else if (ft === 'while') { const r = parseWhile(stmts, i); nodes.push(r.node); i = r.i; }
    else if (STOP.has(ft)) { i++; }
    else { nodes.push({ kind: 'cmd', text: stmts[i] }); i++; }
  }
  return { nodes, i };
}

function parseIf(stmts: string[], i: number): { node: Node; i: number } {
  const branches: { cond: string; body: Node[] }[] = [];
  let cond = stmts[i].replace(/^if\s+/, '');
  i++;
  const stops = new Set(['elif', 'else', 'fi']);
  for (;;) {
    if (i < stmts.length && first(stmts[i]) === 'then') i++;
    const r = parseSeq(stmts, i, stops);
    branches.push({ cond, body: r.nodes });
    i = r.i;
    if (i < stmts.length && first(stmts[i]) === 'elif') { cond = stmts[i].replace(/^elif\s+/, ''); i++; continue; }
    break;
  }
  let elseBody: Node[] = [];
  if (i < stmts.length && first(stmts[i]) === 'else') {
    i++;
    const r = parseSeq(stmts, i, new Set(['fi']));
    elseBody = r.nodes;
    i = r.i;
  }
  if (i < stmts.length && first(stmts[i]) === 'fi') i++;
  return { node: { kind: 'if', branches, elseBody }, i };
}

function parseFor(stmts: string[], i: number): { node: Node; i: number } {
  const m = stmts[i].match(/^for\s+(\w+)\s+in\s+(.*)$/);
  const varName = m?.[1] ?? 'i';
  const itemsRaw = m?.[2] ?? '';
  i++;
  if (i < stmts.length && first(stmts[i]) === 'do') i++;
  const r = parseSeq(stmts, i, new Set(['done']));
  i = r.i;
  if (i < stmts.length && first(stmts[i]) === 'done') i++;
  return { node: { kind: 'for', varName, itemsRaw, body: r.nodes }, i };
}

function parseWhile(stmts: string[], i: number): { node: Node; i: number } {
  const cond = stmts[i].replace(/^while\s+/, '');
  i++;
  if (i < stmts.length && first(stmts[i]) === 'do') i++;
  const r = parseSeq(stmts, i, new Set(['done']));
  i = r.i;
  if (i < stmts.length && first(stmts[i]) === 'done') i++;
  return { node: { kind: 'while', cond, body: r.nodes }, i };
}

/* ---------- Ausführung ---------- */

const emitStr = (emit: (l: OutLine) => void, s: string, kind: OutLine['kind']) => {
  if (!s) return;
  for (const line of s.replace(/\n$/, '').split('\n')) emit({ text: line, kind });
};

/** Führt eine einzelne Kommandozeile aus (&&/||, Pipes, Redirects, Assignments). */
function execCommandLine(sh: Shell, text: string, emit: (l: OutLine) => void): number {
  const { parts, ops } = splitTop(text, ['&&', '||']);
  let code = 0;
  for (let p = 0; p < parts.length; p++) {
    if (p > 0) {
      const op = ops[p - 1];
      if (op === '&&' && code !== 0) continue;
      if (op === '||' && code === 0) continue;
    }
    code = runPipeline(sh, parts[p], emit);
    sh.lastExit = code;
  }
  return code;
}

function runPipeline(sh: Shell, segment: string, emit: (l: OutLine) => void): number {
  const { parts } = splitTop(segment, ['|']);
  let stdin = '';
  let lastCode = 0;
  for (let idx = 0; idx < parts.length; idx++) {
    const isLast = idx === parts.length - 1;
    let cmdStr = parts[idx].trim();
    if (!cmdStr) continue;

    // Redirect abtrennen (nur stdout > und >>).
    let redirect: { file: string; append: boolean } | null = null;
    const redir = splitTop(cmdStr, ['>>', '>']);
    if (redir.parts.length > 1) {
      const append = redir.ops[0] === '>>';
      cmdStr = redir.parts[0].trim();
      redirect = { file: tokenize(sh, redir.parts[1].trim())[0] ?? '', append };
    }

    const words = tokenize(sh, cmdStr);

    // Führende Zuweisungen (NAME=wert) einsammeln.
    let w = 0;
    while (w < words.length && /^[A-Za-z_]\w*=/.test(words[w])) {
      const eq = words[w].indexOf('=');
      sh.vars[words[w].slice(0, eq)] = words[w].slice(eq + 1);
      w++;
    }
    const rest = words.slice(w);
    if (rest.length === 0) { lastCode = 0; sh.lastExit = 0; continue; } // reine Zuweisung

    const [cmd, ...args] = rest;
    const fn = builtins[cmd];
    let result;
    if (fn) {
      result = fn(sh, args, stdin);
    } else {
      result = { out: '', err: `${cmd}: Kommando nicht gefunden. Tippe \`help\` für die Liste.\n`, code: 127 };
    }

    if (result.out === '\x00CLEAR\x00') { emit({ text: '\x00CLEAR\x00', kind: 'sys' }); result = { out: '', err: '', code: 0 }; }

    lastCode = result.code;
    sh.lastExit = result.code;

    if (result.err) emitStr(emit, result.err, 'err');

    if (redirect) {
      writeFile(sh, redirect.file, result.out, redirect.append);
    } else if (isLast) {
      emitStr(emit, result.out, 'out');
    } else {
      stdin = result.out;
    }
  }
  return lastCode;
}

function writeFile(sh: Shell, path: string, content: string, append: boolean) {
  const segs = resolvePath(segmentsToPath(sh.cwd), path);
  const name = segs[segs.length - 1];
  const parent = getNode(sh.fs, segs.slice(0, -1));
  if (!parent || parent.type !== 'dir') return;
  const existing = parent.children[name];
  if (append && existing && existing.type === 'file') existing.content += content;
  else parent.children[name] = { type: 'file', content };
}

function execSeq(sh: Shell, nodes: Node[], emit: (l: OutLine) => void, budget: { n: number }): number {
  let code = 0;
  for (const node of nodes) {
    if (budget.n <= 0) { emit({ text: 'Abbruch: zu viele Schritte (Schutz vor Endlosschleifen).', kind: 'err' }); return 1; }
    budget.n--;
    code = execNode(sh, node, emit, budget);
  }
  return code;
}

function execNode(sh: Shell, node: Node, emit: (l: OutLine) => void, budget: { n: number }): number {
  switch (node.kind) {
    case 'cmd':
      return execCommandLine(sh, node.text, emit);
    case 'if': {
      for (const br of node.branches) {
        // Bedingung als Kommando ausführen; wir wollen NUR den Exit-Code, keine Ausgabe.
        const code = execCommandLine(sh, br.cond, emit);
        if (code === 0) return execSeq(sh, br.body, emit, budget);
      }
      return execSeq(sh, node.elseBody, emit, budget);
    }
    case 'for': {
      const items = tokenize(sh, node.itemsRaw);
      let code = 0;
      for (const it of items) {
        if (budget.n <= 0) break;
        sh.vars[node.varName] = it;
        code = execSeq(sh, node.body, emit, budget);
      }
      return code;
    }
    case 'while': {
      let code = 0;
      let guard = 0;
      while (guard++ < 1000 && budget.n > 0) {
        if (execCommandLine(sh, node.cond, emit) !== 0) break;
        code = execSeq(sh, node.body, emit, budget);
      }
      return code;
    }
  }
}

/** Öffentliche API: führt ein Skript (mehrere Zeilen) aus und liefert die Ausgabe. */
export function runScript(sh: Shell, script: string): OutLine[] {
  const lines: OutLine[] = [];
  const emit = (l: OutLine) => lines.push(l);
  try {
    const stmts = splitStatements(script);
    const { nodes } = parseSeq(stmts, 0, new Set());
    execSeq(sh, nodes, emit, { n: 5000 });
  } catch (e) {
    lines.push({ text: `Interpreter-Fehler: ${(e as Error).message}`, kind: 'err' });
  }
  return lines;
}
