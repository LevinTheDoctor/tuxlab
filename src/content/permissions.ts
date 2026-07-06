import type { Topic } from '../types/content';

export const permissions: Topic = {
  id: 'rechte',
  title: 'Rechte & chmod',
  icon: '🔐',
  level: 'intermediate',
  category: 'system',
  summary: 'Wer darf lesen, schreiben, ausführen? Die 9 Bits, symbolisch und oktal.',
  blocks: [
    {
      type: 'prose',
      html: `Jede Datei hat 9 Rechte-Bits: je <b class="hl-green">r</b>ead, <b class="hl-orange">w</b>rite und e<b class="hl-pink">x</b>ecute für <b>Besitzer</b>, <b>Gruppe</b> und <b>alle anderen</b>. Klick die Bits an und sieh, wie sich die symbolische Schreibweise (<code>rwxr-xr-x</code>) und die Oktalzahl (<code>755</code>) verändern.`,
    },
    { type: 'chmod', start: '755' },
    {
      type: 'callout',
      variant: 'info',
      title: 'So liest du ls -l',
      html: `<code>-rwxr-xr-x</code>: das erste Zeichen ist der Typ (<code>-</code> Datei, <code>d</code> Verzeichnis, <code>l</code> Symlink). Dann drei Dreiergruppen: Besitzer, Gruppe, Rest. Bei Verzeichnissen bedeutet <code>x</code> „hineinwechseln dürfen“, nicht „ausführen“.`,
    },
    { type: 'heading', text: 'Ändern: chmod, chown, umask', color: '--purple' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'chmod',
          rows: [
            { key: 'chmod 644 <span class="kbd">datei</span>', info: 'Rechte oktal setzen (rw-r--r--).', why: 'Am schnellsten, wenn du die Zahl kennst.' },
            { key: 'chmod u+x <span class="kbd">skript.sh</span>', info: 'Dem Besitzer Ausführrecht geben.', why: 'u/g/o + r/w/x — symbolisch, gut fürs gezielte Anpassen.' },
            { key: 'chmod -R 755 <span class="kbd">ordner</span>', info: 'Rekursiv für alles darunter.', why: 'Vorsicht: trifft auch alle Unterdateien.' },
            { key: 'chmod go-w <span class="kbd">datei</span>', info: 'Gruppe & anderen das Schreiben nehmen.', why: 'Minus entzieht, Plus vergibt Rechte.' },
          ],
        },
        {
          name: 'Besitz',
          rows: [
            { key: 'chown levin <span class="kbd">datei</span>', info: 'Besitzer ändern (meist mit sudo).', why: 'Nur root darf Dateien verschenken.' },
            { key: 'chown levin:devs <span class="kbd">datei</span>', info: 'Besitzer UND Gruppe setzen.', why: 'Nach dem Doppelpunkt steht die Gruppe.' },
            { key: 'chgrp docker <span class="kbd">datei</span>', info: 'Nur die Gruppe ändern.', why: 'Kurzform, wenn der Besitzer bleiben soll.' },
          ],
        },
        {
          name: 'umask',
          rows: [
            { key: 'umask', info: 'Zeigt die Standard-Maske (z.B. 022).', why: 'Bestimmt, welche Rechte NEUE Dateien NICHT bekommen.' },
            { key: 'umask 077', info: 'Neue Dateien werden privat (nur du).', why: '600 für Dateien, 700 für Ordner — gut auf Servern.' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'warn',
      title: 'Best Practice',
      html: `<code>chmod 777</code> ist fast nie die Lösung — es macht eine Datei für jeden beschreibbar. Für einen SSH-Key brauchst du sogar streng <code>600</code>, sonst verweigert ssh den Dienst. Faustregel: so wenig Rechte wie möglich, so viele wie nötig.`,
    },
  ],
};
