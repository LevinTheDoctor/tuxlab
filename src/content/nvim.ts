import type { Topic, EditorMode } from '../types/content';

const kbd = (s: string) => `<span class="kbd">${s}</span>`;

const modes: EditorMode[] = [
  { name: 'Normal', enter: 'Esc', desc: 'Der Ausgangsmodus zum Navigieren und Kommandieren. Tasten sind hier Befehle, kein Text. Mit Esc kommst du aus jedem anderen Modus hierher zurück.' },
  { name: 'Insert', enter: 'i, a, o', desc: 'Hier tippst du Text wie in jedem normalen Editor. i fügt vor dem Cursor ein, a dahinter, o öffnet eine neue Zeile darunter.' },
  { name: 'Visual', enter: 'v, V, Strg+v', desc: 'Zum Markieren. v markiert zeichenweise, V ganze Zeilen, Strg+v blockweise (Spalten). Danach z.B. d zum Löschen oder y zum Kopieren der Auswahl.' },
  { name: 'Command', enter: ':', desc: 'Die Kommandozeile am unteren Rand. Hier laufen Befehle wie :w (speichern), :q (beenden) sowie Suchen und Ersetzen.' },
];

export const nvim: Topic = {
  id: 'nvim',
  title: 'Neovim',
  icon: '📝',
  level: 'intermediate',
  category: 'werkzeuge',
  summary: 'Der modale Editor: dieselbe Taste tut je nach Modus etwas anderes.',
  blocks: [
    {
      type: 'prose',
      html: `<b class="hl-green">Neovim</b> ist ein modaler Editor: dieselbe Taste tut je nach Modus etwas anderes. Das ist der ganze Trick hinter Vim und der Grund, warum Anfänger anfangs stolpern. Verstehst du die Modi, verstehst du den Editor.`,
    },
    { type: 'heading', text: 'Die Modi (klick einen an)', color: '--green' },
    { type: 'modeMachine', modes },
    {
      type: 'callout',
      variant: 'danger',
      title: 'Der Klassiker: wie komme ich hier wieder raus?',
      html: `Erst <code>Esc</code> drücken (zurück in den Normal-Modus), dann <code>:wq</code> zum Speichern und Beenden oder <code>:q!</code> zum Beenden ohne Speichern.`,
    },
    { type: 'heading', text: 'Die wichtigsten Tasten', color: '--green' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Bewegen',
          rows: [
            { key: `${kbd('h')} ${kbd('j')} ${kbd('k')} ${kbd('l')}`, info: 'Cursor links, unten, oben, rechts.', why: 'Finger bleiben auf der Grundreihe, das ist der ganze Sinn.' },
            { key: `${kbd('w')} / ${kbd('b')}`, info: 'Ein Wort vorwärts / rückwärts.', why: 'w = word, b = back.' },
            { key: `${kbd('gg')} / ${kbd('G')}`, info: 'An den Anfang / ans Ende der Datei.', why: 'Schneller als ewiges Scrollen.' },
            { key: `${kbd('0')} / ${kbd('$')}`, info: 'An den Zeilenanfang / das Zeilenende.', why: '0 ganz links, $ ganz rechts.' },
            { key: `${kbd('/')}<span class="kbd">text</span>`, info: 'Vorwärts suchen, n springt zum nächsten Treffer.', why: 'Die schnellste Art, irgendwo hinzukommen.' },
          ],
        },
        {
          name: 'Bearbeiten',
          rows: [
            { key: kbd('x'), info: 'Zeichen unter dem Cursor löschen.', why: 'Wie die Entf-Taste, nur im Normal-Modus.' },
            { key: kbd('dd'), info: 'Ganze Zeile löschen (und merken).', why: 'Landet im Register, kann mit p wieder eingefügt werden.' },
            { key: kbd('yy'), info: 'Zeile kopieren (yank).', why: 'y = yank, das Vim-Wort für kopieren.' },
            { key: kbd('p'), info: 'Zuletzt Kopiertes/Gelöschtes einfügen (paste).', why: 'Kleines p fügt hinter, großes P davor ein.' },
            { key: `${kbd('u')} / ${kbd('Strg+r')}`, info: 'Rückgängig / wiederherstellen.', why: 'u = undo, Strg+r = redo.' },
            { key: `${kbd('ciw')}`, info: 'Wort ersetzen (change inner word).', why: 'Verben (c/d/y) + Objekte (iw, i", ap) = Vims Grammatik.' },
          ],
        },
        {
          name: 'Speichern/Beenden',
          rows: [
            { key: kbd(':w'), info: 'Speichern (write), ohne zu beenden.', why: 'Praktisch zwischendurch.' },
            { key: kbd(':q'), info: 'Beenden (quit).', why: 'Meckert, wenn es ungespeicherte Änderungen gibt.' },
            { key: kbd(':wq'), info: 'Speichern und beenden in einem.', why: 'Der Alltagsbefehl zum Rausgehen.' },
            { key: kbd(':q!'), info: 'Beenden ohne Speichern, Änderungen verwerfen.', why: "Das ! heißt 'trotzdem, ich meine es ernst'." },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Die Vim-Grammatik',
      html: `Vim-Befehle sind wie Sätze: <b>Verb + Objekt</b>. <code>d</code> (delete) + <code>w</code> (word) = <code>dw</code> löscht ein Wort. <code>c</code> (change) + <code>i"</code> (inner quotes) = <code>ci"</code> ersetzt den Text in Anführungszeichen. Hast du die Grammatik verstanden, kombinierst du selbst neue Befehle, die du nie gelernt hast.`,
    },
  ],
};
