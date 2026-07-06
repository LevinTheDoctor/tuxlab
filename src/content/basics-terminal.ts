import type { Topic } from '../types/content';

const kbd = (s: string) => `<span class="kbd">${s}</span>`;

/** Absolute Grundlagen: was ist das Terminal, wie ist ein Befehl aufgebaut. */
export const terminalBasics: Topic = {
  id: 'terminal',
  title: 'Das Terminal',
  icon: '⌨️',
  level: 'basic',
  category: 'grundlagen',
  summary: 'Prompt, Shell, der Aufbau jedes Befehls — und ein Terminal zum Selbertippen.',
  blocks: [
    {
      type: 'prose',
      html: `Das <b>Terminal</b> ist ein Fenster, in das du Befehle tippst. Dahinter läuft die <b class="hl-purple">Shell</b> (meist <code>bash</code> oder <code>zsh</code>) — ein Programm, das deine Zeile liest, ausführt und die Ausgabe zurückgibt. Klingt altmodisch, ist aber der schnellste und mächtigste Weg, einen Computer zu steuern: alles ist Text, alles ist wiederholbar, alles ist skriptbar.`,
    },
    {
      type: 'prose',
      html: `Der <b>Prompt</b> ist die Zeile, die auf deine Eingabe wartet:<br>
      <code><span class="hl-green">levin@ubuntu</span>:<span class="hl-cyan">~</span>$</code><br>
      Er verrät dir <b>wer</b> du bist (<span class="hl-green">levin</span>), auf <b>welchem Rechner</b> (<span class="hl-green">ubuntu</span>) und in <b>welchem Ordner</b> (<span class="hl-cyan">~</span>, dein Home). Das <code>$</code> heißt „normaler User“ — bei root steht dort ein <code>#</code>.`,
    },
    { type: 'heading', text: 'Wie ein Befehl aufgebaut ist', color: '--purple' },
    {
      type: 'prose',
      html: `Fast jeder Befehl folgt demselben Muster: <b class="hl-green">Kommando</b> <b class="hl-pink">Optionen</b> <b class="hl-cyan">Argumente</b>. Klick die Teile an:`,
    },
    {
      type: 'breakdown',
      cmd: [
        { t: 'ls', d: 'Das Kommando — das Programm, das ausgeführt wird. ls = „list“, listet Verzeichnisinhalte.' },
        { t: '-l', d: 'Eine Option (Flag), beginnt mit einem Bindestrich. -l = „long“, zeigt eine Zeile pro Datei mit Rechten, Besitzer, Größe und Datum.' },
        { t: '-a', d: 'Noch eine Option. -a = „all“, zeigt auch versteckte Dateien (die mit einem Punkt beginnen, z.B. .bashrc). Kurzoptionen lassen sich zu -la zusammenfassen.' },
        { t: '/home', d: 'Das Argument — worauf der Befehl wirkt. Hier: welchen Ordner ls auflisten soll. Ohne Argument nimmt ls das aktuelle Verzeichnis.' },
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Lange und kurze Optionen',
      html: `Viele Optionen gibt es kurz und lang: <code>-a</code> ist dasselbe wie <code>--all</code>. Kurz ist schnell getippt, lang ist selbsterklärend in Skripten. Und im Zweifel: <code>ls --help</code> oder <code>man ls</code> zeigt alle Optionen.`,
    },
    { type: 'heading', text: 'Deine ersten Befehle', color: '--purple' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Orientieren',
          rows: [
            { key: 'pwd', info: 'Wo bin ich? Zeigt den aktuellen Pfad.', why: 'print working directory.' },
            { key: 'ls', info: 'Was liegt hier? Listet den Ordner.', why: 'Mit -l ausführlich, mit -a auch Verstecktes.' },
            { key: `cd ${kbd('ordner')}`, info: 'In einen Ordner wechseln.', why: 'cd .. geht eine Ebene hoch, cd allein nach Hause.' },
            { key: 'cd -', info: 'Zurück ins vorherige Verzeichnis.', why: 'Wie der Zurück-Button für Ordner.' },
          ],
        },
        {
          name: 'Hilfe',
          rows: [
            { key: `man ${kbd('befehl')}`, info: 'Das Handbuch zu einem Befehl.', why: 'Mit q wieder raus, mit / suchen.' },
            { key: `${kbd('befehl')} --help`, info: 'Kurze Hilfe direkt im Terminal.', why: 'Schneller Blick auf die Optionen.' },
            { key: `type ${kbd('befehl')}`, info: 'Ist das ein Programm, Alias oder Builtin?', why: 'Erklärt, woher ein Befehl kommt.' },
          ],
        },
        {
          name: 'Tricks',
          rows: [
            { key: kbd('Tab'), info: 'Pfad oder Befehl automatisch vervollständigen.', why: 'Der wichtigste Handgriff überhaupt. Zweimal Tab zeigt alle Optionen.' },
            { key: kbd('Strg+R'), info: 'Rückwärts durch die Befehls-History suchen.', why: 'Tipp einen Teil, es findet den letzten passenden Befehl.' },
            { key: kbd('Strg+C'), info: 'Laufenden Befehl abbrechen.', why: 'Wenn etwas hängt oder du es dir anders überlegst.' },
            { key: kbd('↑'), info: 'Den vorherigen Befehl zurückholen.', why: 'History durchblättern, nichts neu tippen.' },
          ],
        },
      ],
    },
    { type: 'heading', text: 'Selber ausprobieren', color: '--green' },
    {
      type: 'terminal',
      intro: '# Willkommen! Dies ist ein echtes Mini-Terminal. Probier: pwd, ls, ls -la, cd /etc, cat os-release',
    },
  ],
};

/** Dateien anschauen und bewegen. */
export const files: Topic = {
  id: 'dateien',
  title: 'Dateien & Ordner',
  icon: '📁',
  level: 'basic',
  category: 'grundlagen',
  summary: 'Anschauen (cat, less), bewegen (cp, mv), anlegen und löschen — mit Netz und ohne.',
  blocks: [
    {
      type: 'prose',
      html: `Unter Linux gilt: <b>alles ist eine Datei</b> — Texte, Programme, sogar Geräte. Diese Handvoll Befehle bewegt und liest sie. Wichtig: die Kommandozeile hat <b>keinen Papierkorb</b>. Was <code>rm</code> löscht, ist weg.`,
    },
    { type: 'heading', text: 'Anschauen', color: '--purple' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Lesen',
          rows: [
            { key: `cat ${kbd('datei')}`, info: 'Ganze Datei ausgeben.', why: 'Gut für kurze Dateien. Bei langen scrollt alles durch.' },
            { key: `less ${kbd('datei')}`, info: 'Datei seitenweise anschauen (scrollbar).', why: 'Mit q raus, / suchen, Pfeiltasten scrollen.' },
            { key: `head -n 20 ${kbd('datei')}`, info: 'Die ersten 20 Zeilen.', why: 'tail zeigt die letzten — ideal für Logs.' },
            { key: `tail -f ${kbd('logdatei')}`, info: 'Log live mitverfolgen.', why: '-f = follow, neue Zeilen erscheinen sofort.' },
          ],
        },
        {
          name: 'Bewegen & Kopieren',
          rows: [
            { key: `cp ${kbd('quelle')} ${kbd('ziel')}`, info: 'Datei kopieren.', why: 'cp -r kopiert ganze Ordner (rekursiv).' },
            { key: `mv ${kbd('alt')} ${kbd('neu')}`, info: 'Verschieben ODER umbenennen.', why: 'Im selben Ordner ist mv das Umbenennen.' },
            { key: `mkdir ${kbd('ordner')}`, info: 'Neuen Ordner anlegen.', why: 'mkdir -p a/b/c legt gleich den ganzen Pfad an.' },
            { key: `touch ${kbd('datei')}`, info: 'Leere Datei anlegen (oder Zeitstempel setzen).', why: 'Schnellster Weg zu einer neuen Datei.' },
          ],
        },
        {
          name: 'Löschen',
          rows: [
            { key: `rm ${kbd('datei')}`, info: 'Datei löschen. Endgültig.', why: 'Kein Papierkorb. Doppelt hinschauen.' },
            { key: `rm -r ${kbd('ordner')}`, info: 'Ordner samt Inhalt löschen.', why: '-r = rekursiv. Mit -i fragt es vor jedem Löschen nach.' },
            { key: `rmdir ${kbd('ordner')}`, info: 'Leeren Ordner löschen.', why: 'Meckert, wenn noch etwas drin ist — ein Sicherheitsnetz.' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'danger',
      title: 'Der gefährlichste Tippfehler',
      html: `<code>rm -rf /</code> löscht das ganze System. Ein versehentliches Leerzeichen macht aus <code>rm -rf ./tmp</code> schnell <code>rm -rf / tmp</code>. Nutz <code>rm -i</code> zum Nachfragen und schau bei <code>rm -r</code> immer zweimal auf den Pfad. (Tux passt hier im Terminal auf dich auf — versuch's ruhig.)`,
    },
    { type: 'heading', text: 'Selber ausprobieren', color: '--green' },
    {
      type: 'terminal',
      intro: '# Leg was an und lies es wieder: touch test.txt, echo "hallo" > test.txt, cat test.txt, ls',
    },
  ],
};
