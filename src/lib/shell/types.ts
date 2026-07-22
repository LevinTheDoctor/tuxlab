import type { FsDir } from '../fakeFs';

/** Der Zustand einer Shell-Sitzung. */
export interface Shell {
  fs: FsDir;
  cwd: string[]; // Pfad-Segmente, z.B. ['home','levin']
  prevCwd?: string[]; // für `cd -`
  vars: Record<string, string>;
  lastExit: number;
}

/** Ergebnis eines einzelnen Kommandos. */
export interface CmdResult {
  out: string; // stdout (kann an eine Pipe weitergehen)
  err: string; // stderr (rot im Terminal)
  code: number; // Exit-Code (0 = ok)
}

export const ok = (out = ''): CmdResult => ({ out, err: '', code: 0 });
export const fail = (err: string, code = 1): CmdResult => ({ out: '', err, code });

/** Eine Zeile Terminal-Ausgabe mit Typ (für Einfärbung). */
export interface OutLine {
  text: string;
  kind: 'out' | 'err' | 'sys';
}
