/* =========================================================================
   FAKE-FS — ein virtuelles Dateisystem im RAM.
   Wird vom Terminal UND vom Skript-Interpreter geteilt, damit `cat datei.txt`
   überall dieselbe Welt sieht. Bewusst simpel: Verzeichnisse sind Objekte,
   Dateien sind Strings.
   ========================================================================= */

export interface FsDir {
  type: 'dir';
  children: Record<string, FsNode>;
}
export interface FsFile {
  type: 'file';
  content: string;
}
export type FsNode = FsDir | FsFile;

function dir(children: Record<string, FsNode> = {}): FsDir {
  return { type: 'dir', children };
}
function file(content: string): FsFile {
  return { type: 'file', content };
}

/** Baut ein frisches Standard-Dateisystem (Ubuntu-nah, an die Lerninhalte angelehnt). */
export function makeDefaultFs(): FsDir {
  return dir({
    bin: dir({}),
    etc: dir({
      passwd: file(
        'root:x:0:0:root:/root:/bin/bash\n' +
          'levin:x:1000:1000:Levin:/home/levin:/bin/bash\n' +
          'max:x:1001:1001:Max:/home/max:/bin/bash\n',
      ),
      hostname: file('ubuntu\n'),
      hosts: file('127.0.0.1\tlocalhost\n127.0.1.1\tubuntu\n'),
      'os-release': file('NAME="Ubuntu"\nVERSION="24.04 LTS (Noble Numbat)"\nID=ubuntu\n'),
      fstab: file(
        '# <device>            <mount>   <type>  <options>       <dump> <pass>\n' +
          'UUID=1234-abcd        /         ext4    defaults,noatime  0      1\n' +
          'UUID=9f8e-77aa        /boot     ext4    defaults          0      2\n',
      ),
    }),
    home: dir({
      levin: dir({
        'notizen.txt': file('TODO:\n- Linux lernen\n- Backup einrichten\n- Tux fuettern\n'),
        'hallo.sh': file('#!/bin/bash\necho "Hallo, $USER!"\n'),
        projekte: dir({
          'readme.md': file('# Mein Projekt\nEin kleines Homelab.\n'),
        }),
        '.bashrc': file('# ~/.bashrc\nalias ll="ls -la"\nexport EDITOR=nvim\n'),
      }),
      max: dir({}),
    }),
    var: dir({
      log: dir({
        'syslog': file('Jul  6 10:00:01 ubuntu systemd[1]: Started Daily apt.\nJul  6 10:00:02 ubuntu kernel: [ok] Tux ist online.\n'),
        'auth.log': file('Jul  6 09:59:00 ubuntu sshd[1337]: Accepted publickey for levin\n'),
      }),
      www: dir({ html: dir({ 'index.html': file('<h1>It works!</h1>\n') }) }),
    }),
    tmp: dir({}),
    root: dir({}),
  });
}

/** Normalisiert einen Pfad relativ zu cwd zu einem absoluten Segment-Array. */
export function resolvePath(cwd: string, path: string): string[] {
  const base = path.startsWith('/') ? [] : cwd.split('/').filter(Boolean);
  const parts = path.split('/').filter(Boolean);
  const stack = [...base];
  for (const p of parts) {
    if (p === '.') continue;
    if (p === '..') stack.pop();
    else if (p === '~') stack.splice(0, stack.length, 'home', 'levin');
    else stack.push(p);
  }
  return stack;
}

export function segmentsToPath(segs: string[]): string {
  return '/' + segs.join('/');
}

/** Läuft den Baum entlang und liefert den Knoten (oder null). */
export function getNode(root: FsDir, segs: string[]): FsNode | null {
  let node: FsNode = root;
  for (const s of segs) {
    if (node.type !== 'dir') return null;
    const next: FsNode | undefined = node.children[s];
    if (!next) return null;
    node = next;
  }
  return node;
}

export { dir, file };
