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
        'benutzer.csv': file(
          'name,stadt,shell\n' +
            'levin,Berlin,bash\n' +
            'max,Hamburg,zsh\n' +
            'kim,Berlin,fish\n' +
            'ada,London,bash\n' +
            'linus,Helsinki,bash\n',
        ),
        logs: dir({
          'app.log': file(
            'INFO  Server gestartet auf Port 8080\n' +
              'ERROR Datenbank nicht erreichbar\n' +
              'INFO  Anfrage GET /index\n' +
              'WARN  Speicher wird knapp\n' +
              'ERROR Datenbank nicht erreichbar\n' +
              'INFO  Anfrage GET /login\n' +
              'ERROR Timeout bei /api/users\n' +
              'INFO  Anfrage GET /index\n' +
              'ERROR Datenbank nicht erreichbar\n' +
              'INFO  Verbindung zur Datenbank wiederhergestellt\n',
          ),
        }),
        projekte: dir({
          'readme.md': file('# Mein Projekt\nEin kleines Homelab.\n'),
          'ideen.md': file('# Ideen\n- Pi-hole aufsetzen\n- Eigenen Git-Server hosten\n'),
          'todo.txt': file('backup-skript schreiben\ndocker lernen\n'),
        }),
        '.bashrc': file('# ~/.bashrc\nalias ll="ls -la"\nexport EDITOR=nvim\n'),
      }),
      max: dir({}),
    }),
    var: dir({
      log: dir({
        'syslog': file('Jul  6 10:00:01 ubuntu systemd[1]: Started Daily apt.\nJul  6 10:00:02 ubuntu kernel: [ok] Tux ist online.\n'),
        'auth.log': file('Jul  6 09:59:00 ubuntu sshd[1337]: Accepted publickey for levin\n'),
        'kern.log': file('Jul  6 09:58:00 ubuntu kernel: Linux version 6.8.0-generic\n'),
      }),
      www: dir({ html: dir({ 'index.html': file('<h1>It works!</h1>\n') }) }),
    }),
    proc: dir({
      cpuinfo: file(
        'processor\t: 0\nmodel name\t: Tux-Core i7-1337 @ 2.40GHz\ncpu MHz\t\t: 2400.000\ncache size\t: 8192 KB\n\n' +
          'processor\t: 1\nmodel name\t: Tux-Core i7-1337 @ 2.40GHz\ncpu MHz\t\t: 2400.000\ncache size\t: 8192 KB\n',
      ),
      meminfo: file(
        'MemTotal:       16326428 kB\nMemFree:         8123456 kB\nMemAvailable:   12345678 kB\n' +
          'Buffers:          234567 kB\nCached:          3456789 kB\nSwapTotal:       2097148 kB\nSwapFree:        2097148 kB\n',
      ),
      uptime: file('86400.12 172800.34\n'),
      version: file('Linux version 6.8.0-generic (tux@buildd) #42-Ubuntu SMP\n'),
    }),
    sys: dir({
      class: dir({
        net: dir({ eth0: dir({}), lo: dir({}) }),
        power_supply: dir({}),
        leds: dir({}),
      }),
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
