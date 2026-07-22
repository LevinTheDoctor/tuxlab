import {
  getNode,
  resolvePath,
  segmentsToPath,
  type FsDir,
  type FsNode,
} from '../fakeFs';
import { fail, ok, type CmdResult, type Shell } from './types';

/** Ein Builtin bekommt Argumente + optionalen stdin (aus einer Pipe). */
export type Builtin = (sh: Shell, args: string[], stdin: string) => CmdResult;

function parentDir(root: FsDir, segs: string[]): { parent: FsDir; name: string } | null {
  if (segs.length === 0) return null;
  const name = segs[segs.length - 1];
  const parentNode = getNode(root, segs.slice(0, -1));
  if (!parentNode || parentNode.type !== 'dir') return null;
  return { parent: parentNode, name };
}

function listDir(node: FsNode): string[] {
  if (node.type !== 'dir') return [];
  return Object.keys(node.children).sort();
}

/** Tiefe Kopie eines Knotens (für cp). */
function cloneNode(node: FsNode): FsNode {
  if (node.type === 'file') return { type: 'file', content: node.content };
  const children: Record<string, FsNode> = {};
  for (const [name, child] of Object.entries(node.children)) children[name] = cloneNode(child);
  return { type: 'dir', children };
}

/** Liest eine Datei oder nimmt stdin — das Muster von cat/grep/sort & Co. */
function fileOrStdin(sh: Shell, file: string | undefined, stdin: string, cmd: string): { text: string } | { error: string } {
  if (!file) return { text: stdin };
  const node = getNode(sh.fs, resolvePath(segmentsToPath(sh.cwd), file));
  if (!node || node.type !== 'file') return { error: `${cmd}: ${file}: Nicht gefunden\n` };
  return { text: node.content };
}

function toLines(text: string): string[] {
  return text ? text.replace(/\n$/, '').split('\n') : [];
}

export const builtins: Record<string, Builtin> = {
  pwd: (sh) => ok(segmentsToPath(sh.cwd) + '\n'),

  echo: (_sh, args) => {
    let a = args;
    let newline = true;
    if (a[0] === '-n') { newline = false; a = a.slice(1); }
    return ok(a.join(' ') + (newline ? '\n' : ''));
  },

  cd: (sh, args) => {
    let target = args[0] ?? '~';
    const back = target === '-';
    if (back) {
      if (!sh.prevCwd) return fail('cd: kein vorheriges Verzeichnis\n');
      target = segmentsToPath(sh.prevCwd);
    }
    const segs = resolvePath(segmentsToPath(sh.cwd), target);
    const node = getNode(sh.fs, segs);
    if (!node) return fail(`cd: ${target}: Datei oder Verzeichnis nicht gefunden\n`);
    if (node.type !== 'dir') return fail(`cd: ${target}: Kein Verzeichnis\n`);
    sh.prevCwd = sh.cwd;
    sh.cwd = segs;
    // Wie in bash: `cd -` sagt dir, wo du gelandet bist.
    return ok(back ? segmentsToPath(segs) + '\n' : '');
  },

  ls: (sh, args) => {
    const paths = args.filter((a) => !a.startsWith('-'));
    const long = args.some((a) => a.startsWith('-') && a.includes('l'));
    const all = args.some((a) => a.startsWith('-') && a.includes('a'));
    const target = paths[0] ?? '.';
    const segs = resolvePath(segmentsToPath(sh.cwd), target);
    const node = getNode(sh.fs, segs);
    if (!node) return fail(`ls: Zugriff auf '${target}' nicht möglich: Nicht gefunden\n`);
    if (node.type === 'file') return ok(target + '\n');
    let names = listDir(node);
    if (!all) names = names.filter((n) => !n.startsWith('.'));
    if (!long) return ok(names.length ? names.join('  ') + '\n' : '');
    const rows = names.map((n) => {
      const child = node.children[n];
      const isDir = child.type === 'dir';
      const perm = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
      const size = child.type === 'file' ? child.content.length : 4096;
      const label = isDir ? n + '/' : n;
      return `${perm} levin levin ${String(size).padStart(5)} Jul  6 10:00 ${label}`;
    });
    return ok(rows.join('\n') + (rows.length ? '\n' : ''));
  },

  cat: (sh, args, stdin) => {
    if (args.length === 0) return ok(stdin);
    let out = '';
    for (const a of args) {
      const segs = resolvePath(segmentsToPath(sh.cwd), a);
      const node = getNode(sh.fs, segs);
      if (!node) return fail(`cat: ${a}: Datei oder Verzeichnis nicht gefunden\n`);
      if (node.type === 'dir') return fail(`cat: ${a}: Ist ein Verzeichnis\n`);
      out += node.content;
    }
    return ok(out);
  },

  head: (sh, args, stdin) => runLines(sh, args, stdin, (lines, n) => lines.slice(0, n)),
  tail: (sh, args, stdin) => runLines(sh, args, stdin, (lines, n) => lines.slice(-n)),

  wc: (sh, args, stdin) => {
    const flag = args.find((a) => a.startsWith('-'));
    const file = args.find((a) => !a.startsWith('-'));
    let text = stdin;
    if (file) {
      const node = getNode(sh.fs, resolvePath(segmentsToPath(sh.cwd), file));
      if (!node || node.type !== 'file') return fail(`wc: ${file}: Nicht gefunden\n`);
      text = node.content;
    }
    const lines = text ? text.replace(/\n$/, '').split('\n').length : 0;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    if (flag === '-l') return ok(`${lines}\n`);
    if (flag === '-w') return ok(`${words}\n`);
    if (flag === '-c') return ok(`${chars}\n`);
    return ok(`${String(lines).padStart(7)} ${String(words).padStart(7)} ${String(chars).padStart(7)}${file ? ' ' + file : ''}\n`);
  },

  grep: (sh, args, stdin) => {
    const flags = args.filter((a) => a.startsWith('-'));
    const rest = args.filter((a) => !a.startsWith('-'));
    const pattern = rest[0];
    if (pattern === undefined) return fail('grep: Suchmuster fehlt\n');
    const has = (c: string) => flags.some((f) => f.includes(c));
    const ci = has('i');
    const inv = has('v');
    const cnt = has('c');
    const num = has('n');
    const rec = has('r');
    let re: RegExp;
    try {
      re = new RegExp(pattern, ci ? 'i' : '');
    } catch {
      return fail('grep: ungültiges Suchmuster\n');
    }

    // Quellen einsammeln: stdin, Datei(en), mit -r ganze Verzeichnisse.
    const sources: { label: string | null; text: string }[] = [];
    for (const fa of rest.slice(1)) {
      const node = getNode(sh.fs, resolvePath(segmentsToPath(sh.cwd), fa));
      if (!node) return fail(`grep: ${fa}: Datei oder Verzeichnis nicht gefunden\n`);
      if (node.type === 'dir') {
        if (!rec) return fail(`grep: ${fa}: Ist ein Verzeichnis (nutze -r)\n`);
        const walk = (n: FsNode, p: string) => {
          if (n.type === 'file') sources.push({ label: p, text: n.content });
          else for (const name of Object.keys(n.children).sort()) walk(n.children[name], p === '/' ? '/' + name : p + '/' + name);
        };
        walk(node, fa.replace(/\/+$/, '') || '/');
      } else {
        sources.push({ label: fa, text: node.content });
      }
    }
    if (sources.length === 0) sources.push({ label: null, text: stdin });

    // Präfix wie beim echten grep: bei mehreren Dateien oder -r immer den Dateinamen zeigen.
    const withPrefix = sources.length > 1 || rec;
    const out: string[] = [];
    let any = false;
    for (const src of sources) {
      const lines = src.text.replace(/\n$/, '').split('\n');
      const hits: string[] = [];
      lines.forEach((l, i) => {
        if (re.test(l) !== inv) hits.push(num ? `${i + 1}:${l}` : l);
      });
      if (hits.length) any = true;
      const prefix = withPrefix && src.label ? src.label + ':' : '';
      if (cnt) out.push(prefix + hits.length);
      else for (const h of hits) out.push(prefix + h);
    }
    const text = out.length ? out.join('\n') + '\n' : '';
    // Wie beim echten grep: keine Treffer → Exit-Code 1 (auch wenn -c eine 0 ausgibt).
    return any ? ok(text) : { out: text, err: '', code: 1 };
  },

  mkdir: (sh, args) => {
    const parents = args.some((a) => a.startsWith('-') && a.includes('p'));
    const names = args.filter((a) => !a.startsWith('-'));
    if (names.length === 0) return fail('mkdir: Operand fehlt\n');
    for (const name of names) {
      const segs = resolvePath(segmentsToPath(sh.cwd), name);
      if (parents) {
        // -p: den ganzen Pfad anlegen, existierende Ordner sind ok.
        let node: FsDir = sh.fs;
        for (const s of segs) {
          const next: FsNode | undefined = node.children[s];
          if (!next) {
            const d: FsDir = { type: 'dir', children: {} };
            node.children[s] = d;
            node = d;
          } else if (next.type === 'dir') {
            node = next;
          } else {
            return fail(`mkdir: '${name}': Datei existiert bereits\n`);
          }
        }
        continue;
      }
      const info = parentDir(sh.fs, segs);
      if (!info) return fail(`mkdir: kann '${name}' nicht anlegen (Elternordner fehlt — Tipp: -p)\n`);
      if (info.parent.children[info.name]) return fail(`mkdir: '${name}' existiert bereits\n`);
      info.parent.children[info.name] = { type: 'dir', children: {} };
    }
    return ok();
  },

  touch: (sh, args) => {
    const names = args.filter((a) => !a.startsWith('-'));
    if (names.length === 0) return fail('touch: Operand fehlt\n');
    for (const name of names) {
      const segs = resolvePath(segmentsToPath(sh.cwd), name);
      const info = parentDir(sh.fs, segs);
      if (!info) return fail(`touch: '${name}' nicht möglich\n`);
      if (!info.parent.children[info.name]) info.parent.children[info.name] = { type: 'file', content: '' };
    }
    return ok();
  },

  cp: (sh, args) => {
    const recursive = args.some((a) => a.startsWith('-') && a.includes('r'));
    const paths = args.filter((a) => !a.startsWith('-'));
    if (paths.length < 2) return fail('cp: Quelle und Ziel fehlen\n');
    const destArg = paths[paths.length - 1];
    const sources = paths.slice(0, -1);
    const destSegs = resolvePath(segmentsToPath(sh.cwd), destArg);
    const destNode = getNode(sh.fs, destSegs);
    const destIsDir = destNode?.type === 'dir';
    if (sources.length > 1 && !destIsDir) return fail(`cp: Ziel '${destArg}' ist kein Verzeichnis\n`);
    for (const src of sources) {
      const srcSegs = resolvePath(segmentsToPath(sh.cwd), src);
      const srcNode = getNode(sh.fs, srcSegs);
      if (!srcNode) return fail(`cp: '${src}': Datei oder Verzeichnis nicht gefunden\n`);
      if (srcNode.type === 'dir' && !recursive) return fail(`cp: '${src}' ist ein Verzeichnis (nutze -r)\n`);
      const targetSegs = destIsDir ? [...destSegs, srcSegs[srcSegs.length - 1]] : destSegs;
      const info = parentDir(sh.fs, targetSegs);
      if (!info) return fail(`cp: Zielverzeichnis für '${destArg}' existiert nicht\n`);
      info.parent.children[info.name] = cloneNode(srcNode);
    }
    return ok();
  },

  mv: (sh, args) => {
    const paths = args.filter((a) => !a.startsWith('-'));
    if (paths.length < 2) return fail('mv: Quelle und Ziel fehlen\n');
    const destArg = paths[paths.length - 1];
    const sources = paths.slice(0, -1);
    const destSegs = resolvePath(segmentsToPath(sh.cwd), destArg);
    const destNode = getNode(sh.fs, destSegs);
    const destIsDir = destNode?.type === 'dir';
    if (sources.length > 1 && !destIsDir) return fail(`mv: Ziel '${destArg}' ist kein Verzeichnis\n`);
    for (const src of sources) {
      const srcSegs = resolvePath(segmentsToPath(sh.cwd), src);
      const srcInfo = parentDir(sh.fs, srcSegs);
      const srcNode = srcInfo ? srcInfo.parent.children[srcInfo.name] : null;
      if (!srcInfo || !srcNode) return fail(`mv: '${src}': Datei oder Verzeichnis nicht gefunden\n`);
      const targetSegs = destIsDir ? [...destSegs, srcSegs[srcSegs.length - 1]] : destSegs;
      const info = parentDir(sh.fs, targetSegs);
      if (!info) return fail(`mv: Zielverzeichnis für '${destArg}' existiert nicht\n`);
      info.parent.children[info.name] = srcNode;
      delete srcInfo.parent.children[srcInfo.name];
    }
    return ok();
  },

  rmdir: (sh, args) => {
    const names = args.filter((a) => !a.startsWith('-'));
    if (names.length === 0) return fail('rmdir: Operand fehlt\n');
    for (const t of names) {
      const segs = resolvePath(segmentsToPath(sh.cwd), t);
      const info = parentDir(sh.fs, segs);
      const node = info ? info.parent.children[info.name] : null;
      if (!info || !node) return fail(`rmdir: '${t}': Nicht gefunden\n`);
      if (node.type !== 'dir') return fail(`rmdir: '${t}': Kein Verzeichnis\n`);
      if (Object.keys(node.children).length > 0) return fail(`rmdir: '${t}': Verzeichnis ist nicht leer\n`);
      delete info.parent.children[info.name];
    }
    return ok();
  },

  sort: (sh, args, stdin) => {
    const flags = args.filter((a) => a.startsWith('-')).join('');
    const file = args.find((a) => !a.startsWith('-'));
    const r = fileOrStdin(sh, file, stdin, 'sort');
    if ('error' in r) return fail(r.error);
    let lines = toLines(r.text);
    if (flags.includes('n')) lines.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0));
    else lines.sort();
    if (flags.includes('u')) lines = lines.filter((l, i, arr) => i === 0 || l !== arr[i - 1]);
    if (flags.includes('r')) lines.reverse();
    return ok(lines.length ? lines.join('\n') + '\n' : '');
  },

  uniq: (sh, args, stdin) => {
    const count = args.some((a) => a.startsWith('-') && a.includes('c'));
    const file = args.find((a) => !a.startsWith('-'));
    const r = fileOrStdin(sh, file, stdin, 'uniq');
    if ('error' in r) return fail(r.error);
    const groups: { line: string; n: number }[] = [];
    for (const l of toLines(r.text)) {
      const last = groups[groups.length - 1];
      if (last && last.line === l) last.n++;
      else groups.push({ line: l, n: 1 });
    }
    const rows = groups.map((g) => (count ? `${String(g.n).padStart(7)} ${g.line}` : g.line));
    return ok(rows.length ? rows.join('\n') + '\n' : '');
  },

  cut: (sh, args, stdin) => {
    let delim = '\t';
    let fieldSpec = '';
    const rest: string[] = [];
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a === '-d') delim = args[++i] ?? '\t';
      else if (a.startsWith('-d')) delim = a.slice(2);
      else if (a === '-f') fieldSpec = args[++i] ?? '';
      else if (a.startsWith('-f')) fieldSpec = a.slice(2);
      else rest.push(a);
    }
    if (!fieldSpec) return fail('cut: Feldliste fehlt — nutze -f, z.B. cut -d, -f1\n');
    const wanted = new Set<number>();
    for (const part of fieldSpec.split(',')) {
      const range = part.match(/^(\d+)-(\d+)$/);
      if (range) for (let k = Number(range[1]); k <= Number(range[2]); k++) wanted.add(k);
      else if (/^\d+$/.test(part)) wanted.add(Number(part));
    }
    const r = fileOrStdin(sh, rest[0], stdin, 'cut');
    if ('error' in r) return fail(r.error);
    const out = toLines(r.text).map((l) =>
      l.includes(delim) ? l.split(delim).filter((_, i) => wanted.has(i + 1)).join(delim) : l,
    );
    return ok(out.length ? out.join('\n') + '\n' : '');
  },

  tr: (_sh, args, stdin) => {
    // Erweitert Bereiche wie a-z zu allen Zeichen dazwischen.
    const expand = (s: string): string => {
      let out = '';
      for (let i = 0; i < s.length; i++) {
        if (s[i + 1] === '-' && s[i + 2]) {
          for (let c = s.charCodeAt(i); c <= s.charCodeAt(i + 2); c++) out += String.fromCharCode(c);
          i += 2;
        } else out += s[i];
      }
      return out;
    };
    const del = args[0] === '-d';
    const sets = args.filter((a) => !a.startsWith('-'));
    const set1 = expand(sets[0] ?? '');
    if (del) {
      if (!set1) return fail('tr: Zeichenmenge fehlt, z.B. tr -d aeiou\n');
      return ok([...stdin].filter((c) => !set1.includes(c)).join(''));
    }
    const set2 = expand(sets[1] ?? '');
    if (!set1 || !set2) return fail('tr: zwei Zeichenmengen nötig, z.B. tr a-z A-Z\n');
    return ok(
      [...stdin]
        .map((c) => {
          const i = set1.indexOf(c);
          return i >= 0 ? set2[Math.min(i, set2.length - 1)] : c;
        })
        .join(''),
    );
  },

  find: (sh, args) => {
    const a = [...args];
    let start = '.';
    if (a[0] && !a[0].startsWith('-')) start = a.shift() as string;
    let namePat: string | null = null;
    let typeFilter: string | null = null;
    for (let i = 0; i < a.length; i++) {
      if (a[i] === '-name') namePat = a[++i] ?? null;
      else if (a[i] === '-type') typeFilter = a[++i] ?? null;
      else return fail(`find: Option '${a[i]}' kennt dieses Mini-find nicht (nur -name und -type)\n`);
    }
    const startSegs = resolvePath(segmentsToPath(sh.cwd), start);
    const startNode = getNode(sh.fs, startSegs);
    if (!startNode) return fail(`find: '${start}': Datei oder Verzeichnis nicht gefunden\n`);
    let re: RegExp | null = null;
    if (namePat) {
      const esc = namePat.split('*').map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      re = new RegExp('^' + esc.join('.*') + '$');
    }
    const results: string[] = [];
    const walk = (node: FsNode, path: string, name: string) => {
      const isDir = node.type === 'dir';
      const typeOk = !typeFilter || (typeFilter === 'd' ? isDir : !isDir);
      if (typeOk && (!re || re.test(name))) results.push(path);
      if (isDir) {
        for (const childName of Object.keys(node.children).sort()) {
          const childPath = path === '/' ? '/' + childName : path + '/' + childName;
          walk(node.children[childName], childPath, childName);
        }
      }
    };
    // ~ würde die echte Shell vor find expandieren — hier von Hand.
    const rootLabel =
      start === '/' ? '/'
      : start.startsWith('~') ? segmentsToPath(startSegs)
      : start.replace(/\/+$/, '') || '.';
    walk(startNode, rootLabel, startSegs[startSegs.length - 1] ?? '/');
    return ok(results.length ? results.join('\n') + '\n' : '');
  },

  rm: (sh, args) => {
    const targets = args.filter((a) => !a.startsWith('-'));
    const recursive = args.some((a) => a.startsWith('-') && a.includes('r'));
    if (targets.length === 0) return fail('rm: Operand fehlt\n');
    for (const t of targets) {
      const segs = resolvePath(segmentsToPath(sh.cwd), t);
      const info = parentDir(sh.fs, segs);
      if (!info || !info.parent.children[info.name]) return fail(`rm: '${t}': Nicht gefunden\n`);
      if (info.parent.children[info.name].type === 'dir' && !recursive)
        return fail(`rm: '${t}': Ist ein Verzeichnis (nutze -r)\n`);
      delete info.parent.children[info.name];
    }
    return ok();
  },

  whoami: () => ok('levin\n'),
  hostname: () => ok('ubuntu\n'),
  date: () => ok('Mon Jul  6 10:00:00 CEST 2026\n'),
  clear: () => ({ out: '\x00CLEAR\x00', err: '', code: 0 }),
  true: () => ok(),
  false: () => ({ out: '', err: '', code: 1 }),

  test: (sh, args) => testBuiltin(sh, args),
  '[': (sh, args) => {
    // schließende ] entfernen
    const a = [...args];
    if (a[a.length - 1] === ']') a.pop();
    return testBuiltin(sh, a);
  },

  help: () =>
    ok(
      'Dateien:   ls cat less head tail touch mkdir rm rmdir cp mv\n' +
        'Text:      grep sort uniq cut tr wc echo\n' +
        'Suchen:    find (-name, -type)\n' +
        'Sonstiges: cd pwd whoami hostname date clear\n' +
        'Sprachkonstrukte: Variablen (NAME=wert, $NAME), if/then/else/fi, for, while, test/[ ], Pipes |, Redirects > >>\n' +
        'Tippe `man tux` für einen Bonus. 🐧\n',
    ),
};

// less verhält sich hier wie cat — das Mini-Terminal hat keinen Pager.
builtins.less = builtins.cat;

function runLines(
  sh: Shell,
  args: string[],
  stdin: string,
  pick: (lines: string[], n: number) => string[],
): CmdResult {
  let n = 10;
  const rest: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-n') { n = parseInt(args[++i], 10) || 10; }
    else if (/^-\d+$/.test(args[i])) { n = parseInt(args[i].slice(1), 10); }
    else rest.push(args[i]);
  }
  let text = stdin;
  if (rest[0]) {
    const node = getNode(sh.fs, resolvePath(segmentsToPath(sh.cwd), rest[0]));
    if (!node || node.type !== 'file') return fail(`${rest[0]}: Nicht gefunden\n`);
    text = node.content;
  }
  const lines = text.replace(/\n$/, '').split('\n');
  return ok(pick(lines, n).join('\n') + '\n');
}

/** Minimales test/[ ]: -f, -d, -e, -z, -n, =, !=, -eq, -lt, -gt. */
function testBuiltin(sh: Shell, args: string[]): CmdResult {
  const codeFor = (b: boolean): CmdResult => ({ out: '', err: '', code: b ? 0 : 1 });
  // Negation: [ ! ... ]
  if (args[0] === '!') {
    const r = testBuiltin(sh, args.slice(1));
    return { out: '', err: '', code: r.code === 0 ? 1 : 0 };
  }
  if (args.length === 0) return codeFor(false);
  if (args.length === 1) return codeFor(args[0].length > 0);
  if (args.length === 2) {
    const [op, val] = args;
    const node = getNode(sh.fs, resolvePath(segmentsToPath(sh.cwd), val));
    if (op === '-f') return codeFor(!!node && node.type === 'file');
    if (op === '-d') return codeFor(!!node && node.type === 'dir');
    if (op === '-e') return codeFor(!!node);
    if (op === '-z') return codeFor(val.length === 0);
    if (op === '-n') return codeFor(val.length > 0);
    return codeFor(false);
  }
  const [l, op, r] = args;
  switch (op) {
    case '=':
    case '==': return codeFor(l === r);
    case '!=': return codeFor(l !== r);
    case '-eq': return codeFor(Number(l) === Number(r));
    case '-ne': return codeFor(Number(l) !== Number(r));
    case '-lt': return codeFor(Number(l) < Number(r));
    case '-le': return codeFor(Number(l) <= Number(r));
    case '-gt': return codeFor(Number(l) > Number(r));
    case '-ge': return codeFor(Number(l) >= Number(r));
    default: return codeFor(false);
  }
}
