import type { Topic } from '../types/content';

const kbd = (s: string) => `<span class="kbd">${s}</span>`;
const pfx = (k: string) => `Prefix ${kbd(k)}`;

export const tmux: Topic = {
  id: 'tmux',
  title: 'tmux',
  icon: '🪟',
  level: 'advanced',
  category: 'werkzeuge',
  summary: 'Mehrere Terminals in einem, und Sessions, die weiterlaufen wenn SSH abbricht.',
  blocks: [
    {
      type: 'prose',
      html: `<b class="hl-purple">tmux</b> (terminal multiplexer) lässt dich in einem Terminal mehrere Programme parallel laufen lassen und — der Kernvorteil — laufende Prozesse vom Terminal trennen (<i>detach</i>) und später wieder verbinden (<i>attach</i>). Startest du per SSH auf dem Server einen langen Build, läuft er mit tmux weiter, auch wenn die Verbindung abbricht.`,
    },
    { type: 'heading', text: 'Die drei Ebenen: Session ▸ Window ▸ Pane', color: '--purple' },
    {
      type: 'prose',
      html: `<b class="hl-purple">Session</b> = ein Arbeitsbereich auf dem tmux-Server, läuft im Hintergrund weiter. <b class="hl-cyan">Window</b> = wie ein Browser-Tab, füllt die ganze Fläche. <b class="hl-green">Pane</b> = eine Unterteilung im Window, z.B. links Editor, rechts Log.`,
    },
    { type: 'heading', text: 'Panes live ausprobieren', color: '--purple' },
    { type: 'tmuxDemo' },
    { type: 'heading', text: 'Alle Shortcuts', color: '--purple' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Sessions',
          rows: [
            { key: `tmux new -s ${kbd('name')}`, info: 'Neue benannte Session starten.', why: '-s setzt den Session-Namen.' },
            { key: 'tmux ls', info: 'Alle laufenden Sessions auflisten.', why: 'ls ist die Kurzform von list-sessions.' },
            { key: `tmux a -t ${kbd('name')}`, info: 'An eine Session wieder anknüpfen.', why: 'a = attach, -t = target (Ziel-Session).' },
            { key: pfx('d'), info: 'Detach: Session verlassen, läuft im Hintergrund weiter.', why: 'Der Killer-Move: detachen, SSH schließen, später neu attachen.' },
            { key: pfx('s'), info: 'Interaktive Liste aller Sessions zum Wechseln.', why: 'Schneller als der Weg über die Shell.' },
          ],
        },
        {
          name: 'Windows',
          rows: [
            { key: pfx('c'), info: 'Neues Window erstellen (wie ein neuer Tab).', why: 'c = create.' },
            { key: pfx(','), info: 'Aktuelles Window umbenennen.', why: 'Hilft bei vielen offenen Windows den Überblick zu behalten.' },
            { key: `${pfx('n')} / ${pfx('p')}`, info: 'Nächstes / vorheriges Window.', why: 'n = next, p = previous.' },
            { key: pfx('0-9'), info: 'Direkt zum Window mit dieser Nummer springen.', why: 'Am schnellsten, wenn du die Nummer kennst.' },
            { key: pfx('w'), info: 'Übersicht aller Windows und Panes.', why: 'Gut zum Springen über mehrere Sessions hinweg.' },
          ],
        },
        {
          name: 'Panes',
          rows: [
            { key: pfx('%'), info: 'Pane vertikal teilen (neuer Pane rechts).', why: 'Merkhilfe: % hat eine senkrechte Linie in der Mitte.' },
            { key: pfx('"'), info: 'Pane horizontal teilen (neuer Pane unten).', why: 'Merkhilfe: das " sitzt oben, teilt also übereinander.' },
            { key: `${pfx('←')} ${kbd('↓')} ${kbd('↑')} ${kbd('→')}`, info: 'Zum Pane in der jeweiligen Richtung wechseln.', why: 'Prefix, dann Pfeiltaste.' },
            { key: pfx('z'), info: 'Zoom: aktiven Pane auf Vollbild und zurück.', why: 'Toggle, praktisch zum kurzen Fokussieren.' },
            { key: pfx('x'), info: 'Aktuellen Pane schließen (mit Rückfrage).', why: "x wie 'schließen'." },
          ],
        },
        {
          name: 'Copy-Mode',
          rows: [
            { key: pfx('['), info: 'Copy-Mode betreten, jetzt kannst du scrollen.', why: 'Ohne das kannst du bei laufendem tmux nicht hochscrollen.' },
            { key: pfx(']'), info: 'Kopierten Text wieder einfügen (paste).', why: 'Gegenstück zum Kopieren im Copy-Mode.' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Prefix?',
      html: `Fast jeder tmux-Befehl beginnt mit dem <b>Prefix</b>, standardmäßig <code>Strg+b</code>. Du drückst also erst <code>Strg+b</code>, lässt los, dann die eigentliche Taste. Viele Leute biegen das Prefix in der <code>~/.tmux.conf</code> auf <code>Strg+a</code> um.`,
    },
  ],
};
