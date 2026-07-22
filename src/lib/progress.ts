/* Fortschritt: welche Topics als "erledigt" markiert wurden. Reine
   localStorage-Helfer; die Roadmap liest daraus ihren Balken. */

const KEY = 'tuxlab:done';

export function loadDone(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function saveDone(done: Set<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...done]));
  } catch {
    /* ignorieren */
  }
}
