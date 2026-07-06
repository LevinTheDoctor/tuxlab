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

export const builtins: Record<string, Builtin> = {
  pwd: (sh) => ok(segmentsToPath(sh.cwd) + '\n'),

  echo: (_sh, args) => {
    let a = args;
    let newline = true;
    if (a[0] === '-n') { newline = false; a = a.slice(1); }
    return ok(a.join(' ') + (newline ? '\n' : ''));
  },

  cd: (sh, args) => {
    const target = args[0] ?? '~';
    const segs = resolvePath(segmentsToPath(sh.cwd), target);
    const node = getNode(sh.fs, segs);
    if (!node) return fail(`cd: ${target}: Datei oder Verzeichnis nicht gefunden\n`);
    if (node.type !== 'dir') return fail(`cd: ${target}: Kein Verzeichnis\n`);
    sh.cwd = segs;
    return ok();
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
    let text = stdin;
    const fileArg = rest[1];
    if (fileArg) {
      const node = getNode(sh.fs, resolvePath(segmentsToPath(sh.cwd), fileArg));
      if (!node || node.type !== 'file') return fail(`grep: ${fileArg}: Nicht gefunden\n`);
      text = node.content;
    }
    const ci = flags.some((f) => f.includes('i'));
    const inv = flags.some((f) => f.includes('v'));
    const lines = text.replace(/\n$/, '').split('\n');
    let re: RegExp;
    try {
      re = new RegExp(pattern, ci ? 'i' : '');
    } catch {
      return fail('grep: ungültiges Suchmuster\n');
    }
    const matched = lines.filter((l) => re.test(l) !== inv);
    return matched.length ? ok(matched.join('\n') + '\n') : { out: '', err: '', code: 1 };
  },

  mkdir: (sh, args) => {
    const name = args.find((a) => !a.startsWith('-'));
    if (!name) return fail('mkdir: Operand fehlt\n');
    const segs = resolvePath(segmentsToPath(sh.cwd), name);
    const info = parentDir(sh.fs, segs);
    if (!info) return fail(`mkdir: kann '${name}' nicht anlegen\n`);
    if (info.parent.children[info.name]) return fail(`mkdir: '${name}' existiert bereits\n`);
    info.parent.children[info.name] = { type: 'dir', children: {} };
    return ok();
  },

  touch: (sh, args) => {
    const name = args[0];
    if (!name) return fail('touch: Operand fehlt\n');
    const segs = resolvePath(segmentsToPath(sh.cwd), name);
    const info = parentDir(sh.fs, segs);
    if (!info) return fail(`touch: '${name}' nicht möglich\n`);
    if (!info.parent.children[info.name]) info.parent.children[info.name] = { type: 'file', content: '' };
    return ok();
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
      'Verfügbare Befehle: ls cat cd pwd echo grep wc head tail mkdir touch rm whoami date clear\n' +
        'Sprachkonstrukte: Variablen (NAME=wert, $NAME), if/then/else/fi, for, while, test/[ ], Pipes |, Redirects > >>\n' +
        'Tippe `man tux` für einen Bonus. 🐧\n',
    ),
};

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
