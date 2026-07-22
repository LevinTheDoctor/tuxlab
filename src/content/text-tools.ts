import type { Topic } from '../types/content';

const kbd = (s: string) => `<span class="kbd">${s}</span>`;

/** Text lesen, filtern und umbauen — grep, sort, uniq, cut, tr & Co. */
export const textTools: Topic = {
  id: 'text-tools',
  title: 'Text lesen & filtern',
  icon: '🔎',
  level: 'intermediate',
  category: 'grundlagen',
  summary: 'grep richtig können, dazu sort, uniq, cut, tr und wc — die Werkzeuge für Logs und Configs.',
  blocks: [
    {
      type: 'prose',
      html: `Linux-Administration ist zu 80% <b>Textarbeit</b>: Logs lesen, Configs durchsuchen, Listen auswerten. Dafür gibt es eine Familie kleiner Werkzeuge, die alle demselben Prinzip folgen: sie lesen Text (aus einer Datei oder von der Pipe), tun <b>eine Sache</b> damit und geben Text wieder aus. Einzeln unscheinbar — verkettet ersetzen sie so manche Tabellenkalkulation.`,
    },

    { type: 'heading', text: 'Lesen: cat, less, head, tail', color: '--purple' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Lesen',
          rows: [
            { key: `cat ${kbd('datei')}`, info: 'Ganze Datei ausgeben, auch mehrere hintereinander.', why: 'concatenate. cat -n nummeriert die Zeilen.' },
            { key: `less ${kbd('datei')}`, info: 'Seitenweise lesen: scrollen, suchen, nichts kaputt machen.', why: `${kbd('/')} sucht, ${kbd('n')} nächster Treffer, ${kbd('G')} ans Ende, ${kbd('q')} beendet.` },
            { key: `head -n 5 ${kbd('datei')}`, info: 'Nur die ersten 5 Zeilen.', why: 'Schneller Blick auf den Anfang — reicht oft schon.' },
            { key: `tail -n 20 ${kbd('datei')}`, info: 'Die letzten 20 Zeilen.', why: 'Bei Logs steht das Neueste unten.' },
            { key: `tail -f ${kbd('logdatei')}`, info: 'Datei „verfolgen“: neue Zeilen erscheinen live.', why: 'follow — DER Befehl beim Debuggen von Diensten. Strg+C beendet.' },
          ],
        },
      ],
    },

    { type: 'heading', text: 'grep — das Sieb der Kommandozeile', color: '--purple' },
    {
      type: 'prose',
      html: `<b class="hl-green">grep</b> lässt nur Zeilen durch, die zu einem Muster passen — aus Dateien oder aus einer Pipe. Der seltsame Name kommt aus dem Ur-Editor <code>ed</code>: <b>g</b>/<b>re</b>/<b>p</b> hieß „global / regular expression / print“. Ein voll ausgestatteter Aufruf, wie du ihn täglich brauchst — klick die Teile an:`,
    },
    {
      type: 'breakdown',
      cmd: [
        { t: 'grep', d: 'Filtert Zeilen nach einem Muster. Alles, was nicht passt, wird verworfen.' },
        { t: '-r', d: 'recursive: durchsucht ein ganzes Verzeichnis samt Unterordnern statt einer einzelnen Datei. Jeder Treffer wird mit Dateinamen ausgegeben.' },
        { t: '-n', d: 'number: zeigt die Zeilennummer jedes Treffers — praktisch, um die Stelle im Editor anzuspringen.' },
        { t: '-i', d: 'ignore case: Groß-/Kleinschreibung egal. Findet error, ERROR und Error.' },
        { t: '"error"', d: 'Das Suchmuster — ein regulärer Ausdruck. In Anführungszeichen, damit die Shell Sonderzeichen nicht vorher anfasst.' },
        { t: '/var/log', d: 'Wo gesucht wird. Mit -r ein Verzeichnis, sonst eine oder mehrere Dateien — oder gar nichts, wenn grep aus einer Pipe liest.' },
      ],
    },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'grep-Flags',
          rows: [
            { key: `grep -i ${kbd('muster')}`, info: 'Groß-/Kleinschreibung ignorieren.', why: 'Logs sind selten konsequent — -i findet alles.' },
            { key: `grep -v ${kbd('muster')}`, info: 'Umkehren: nur Zeilen OHNE das Muster.', why: 'invert — Rauschen wegfiltern: grep -v DEBUG.' },
            { key: `grep -c ${kbd('muster')}`, info: 'Nur zählen statt anzeigen.', why: 'count. „Wie oft kam der Fehler vor?“' },
            { key: `grep -l ${kbd('muster')} *`, info: 'Nur die Dateinamen mit Treffern.', why: 'list — „in welchen Dateien steht das überhaupt?“' },
            { key: 'grep -A 3 / -B 3', info: '3 Zeilen Kontext nach (After) bzw. vor (Before) dem Treffer.', why: 'Die Fehlermeldung allein sagt oft wenig — der Kontext schon.' },
            { key: `grep -E ${kbd("'a|b'")}`, info: 'Extended Regex: | (oder), + und ? funktionieren.', why: "grep -E 'ERROR|WARN' findet beides auf einmal." },
          ],
        },
      ],
    },
    {
      type: 'prose',
      html: `Das Muster ist ein <b>regulärer Ausdruck</b> (Regex) — eine Mini-Sprache für Textmuster. Für den Anfang reichen diese Bausteine:`,
    },
    {
      type: 'table',
      table: {
        headers: ['Zeichen', 'Bedeutung', 'Beispiel'],
        rows: [
          ['<code>.</code>', 'Irgendein einzelnes Zeichen', '<code>gr.p</code> findet grep und grap'],
          ['<code>^</code>', 'Zeilenanfang', '<code>^ERROR</code> — nur Zeilen, die mit ERROR beginnen'],
          ['<code>$</code>', 'Zeilenende', '<code>bash$</code> — Zeilen, die auf bash enden'],
          ['<code>[abc]</code>, <code>[0-9]</code>', 'Eines der Zeichen aus der Menge', '<code>[Ee]rror</code> findet Error und error'],
          ['<code>*</code>', 'Das Vorherige beliebig oft (auch 0×)', '<code>e.*r</code> — e, irgendwas, r'],
          ['<code>\\.</code>', 'Ein Sonderzeichen wörtlich meinen', '<code>192\\.168</code> — der Punkt als Punkt'],
        ],
      },
    },
    {
      type: 'callout',
      variant: 'warn',
      title: 'Der Punkt-Klassiker',
      html: `<code>grep 192.168.1.1 log</code> findet auch <code>192x168y1z1</code> — der Punkt heißt „irgendein Zeichen“. Wörtliche Punkte escapen: <code>grep '192\\.168\\.1\\.1'</code>. Und Muster generell in Anführungszeichen setzen, sonst interpretiert die <b>Shell</b> Zeichen wie <code>*</code>, bevor grep sie je sieht.`,
    },
    { type: 'terminal', intro: '# Filter das Log: grep ERROR logs/app.log, grep -c ERROR logs/app.log, grep -v INFO logs/app.log, grep bash /etc/passwd' },

    { type: 'heading', text: 'Umbauen: sort, uniq, cut, tr, wc', color: '--cyan' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Sortieren & Zählen',
          rows: [
            { key: `sort ${kbd('datei')}`, info: 'Zeilen alphabetisch sortieren.', why: 'sort -r rückwärts, sort -u sortiert und entfernt Doubletten.' },
            { key: 'sort -n', info: 'Numerisch sortieren statt alphabetisch.', why: 'Alphabetisch käme 10 vor 9 — -n rechnet richtig.' },
            { key: 'uniq -c', info: 'Gleiche NACHBAR-Zeilen zusammenfassen und zählen.', why: 'Fast immer als sort | uniq -c — siehe Kasten unten.' },
            { key: `wc -l ${kbd('datei')}`, info: 'Zeilen zählen (-w Wörter, -c Zeichen).', why: 'word count. Am Ende einer Pipe: „wie viele Treffer?“' },
          ],
        },
        {
          name: 'Spalten & Zeichen',
          rows: [
            { key: `cut -d, -f1 ${kbd('datei.csv')}`, info: 'Spalte 1 herausschneiden, Trenner ist das Komma.', why: '-d = delimiter, -f = field. Auch -f1,3 oder -f1-3.' },
            { key: "tr a-z A-Z", info: 'Zeichen ersetzen: klein → GROSS.', why: 'translate. Liest nur von der Pipe: echo hi | tr a-z A-Z.' },
            { key: "tr -d ' '", info: 'Zeichen löschen (hier: alle Leerzeichen).', why: 'delete — z.B. Formatierung entfernen.' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Warum immer sort VOR uniq?',
      html: `<code>uniq</code> vergleicht nur <b>direkt benachbarte</b> Zeilen — stehen zwei gleiche Zeilen nicht untereinander, zählt es sie getrennt. <code>sort</code> stellt Gleiches untereinander, dann stimmt die Zählung: <code>sort | uniq -c</code> ist deshalb ein festes Pärchen. Das Ergebnis noch nach Häufigkeit ordnen: <code>… | sort -rn</code>.`,
    },
    {
      type: 'scriptSim',
      title: 'Log-Analyse: Welcher Fehler nervt am meisten?',
      interactive: true,
      script: [
        {
          line: 'grep ERROR logs/app.log',
          explain: 'Schritt 1: nur die Fehlerzeilen. Aus zehn Zeilen Log werden vier — aber welche kommt am häufigsten vor?',
          output: 'ERROR Datenbank nicht erreichbar\nERROR Datenbank nicht erreichbar\nERROR Timeout bei /api/users\nERROR Datenbank nicht erreichbar',
        },
        {
          line: 'grep ERROR logs/app.log | sort',
          explain: 'Schritt 2: sortieren, damit gleiche Zeilen untereinander stehen — die Vorbereitung für uniq.',
          output: 'ERROR Datenbank nicht erreichbar\nERROR Datenbank nicht erreichbar\nERROR Datenbank nicht erreichbar\nERROR Timeout bei /api/users',
        },
        {
          line: 'grep ERROR logs/app.log | sort | uniq -c',
          explain: 'Schritt 3: <code>uniq -c</code> fasst die Nachbar-Doubletten zusammen und schreibt die Anzahl davor.',
          output: '      3 ERROR Datenbank nicht erreichbar\n      1 ERROR Timeout bei /api/users',
        },
        {
          line: 'grep ERROR logs/app.log | sort | uniq -c | sort -rn | head -n 1',
          explain: 'Schritt 4: nach der Zahl vorne sortieren (<code>-rn</code> = numerisch, größte zuerst) und nur den Spitzenreiter behalten. Fertig ist die „Top-Fehler“-Auswertung — vier kleine Tools, ein Ergebnis.',
          output: '      3 ERROR Datenbank nicht erreichbar',
        },
      ],
    },
    { type: 'terminal', intro: '# Die CSV auswerten: cat benutzer.csv, cut -d, -f1 benutzer.csv, cut -d, -f3 benutzer.csv | sort | uniq -c' },

    { type: 'heading', text: 'diff — was ist anders?', color: '--cyan' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Vergleichen',
          rows: [
            { key: `diff ${kbd('alt')} ${kbd('neu')}`, info: 'Unterschiede zweier Dateien zeigen.', why: 'Keine Ausgabe = identisch. Ideal vor/nach Config-Änderungen.' },
            { key: 'diff -u', info: 'Unified-Format: Kontext, - für alt, + für neu.', why: 'Das Format, das du aus git diff kennst.' },
            { key: `diff -r ${kbd('dirA')} ${kbd('dirB')}`, info: 'Ganze Verzeichnisse vergleichen.', why: '„Was unterscheidet Backup und Original?“' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Die modernen Geschwister',
      html: `Für große Projekte gibt es schnellere Nachfahren: <code>rg</code> (ripgrep) ist ein grep mit Turbolader, <code>bat</code> ein cat mit Syntax-Highlighting. Beide und mehr findest du unter <a href="#/devtools">Moderne CLI-Tools</a> — die Klassiker hier musst du trotzdem können, denn sie sind auf <b>jedem</b> Server vorinstalliert.`,
    },
  ],
};

/** Dateien und Befehle finden: find, which, locate, du/df. */
export const finding: Topic = {
  id: 'suchen',
  title: 'Suchen & Finden',
  icon: '🧭',
  level: 'intermediate',
  category: 'grundlagen',
  summary: 'find nach Name, Typ, Größe und Alter — plus which, locate und die Platzfresser-Suche mit du.',
  blocks: [
    {
      type: 'prose',
      html: `Zwei Fragen, zwei Werkzeuge: <b>„Wo liegt die Datei?“</b> beantwortet <b class="hl-green">find</b>, das nach Namen und Eigenschaften sucht. <b>„In welcher Datei steht …?“</b> beantwortet <b class="hl-cyan">grep -r</b>, das in Inhalte hineinschaut. Wer beide auseinanderhält, findet alles.`,
    },
    {
      type: 'table',
      table: {
        headers: ['', '<code>find</code>', '<code>grep -r</code>'],
        rows: [
          ['Sucht nach', 'Datei-<b>Eigenschaften</b>: Name, Typ, Größe, Alter', 'Datei-<b>Inhalten</b>: Textmuster in den Zeilen'],
          ['Antwortet mit', 'Pfaden gefundener Dateien', 'den Zeilen, in denen das Muster vorkommt'],
          ['Typische Frage', '„Wo sind alle .log-Dateien über 100 MB?“', '„Wo wird PORT=8080 gesetzt?“'],
        ],
      },
    },

    { type: 'heading', text: 'find — die Suchmaschine im Dateibaum', color: '--purple' },
    {
      type: 'prose',
      html: `<code>find</code> läuft von einem Startpunkt aus durch <b>jeden</b> Unterordner und prüft jede Datei gegen deine Kriterien. Der Aufbau ist immer gleich: <code>find</code> <b class="hl-cyan">wo</b> <b class="hl-pink">wonach</b>. Mehrere Kriterien gelten zusammen (UND-Verknüpfung).`,
    },
    {
      type: 'breakdown',
      cmd: [
        { t: 'find', d: 'Durchläuft den Dateibaum ab dem Startpunkt — rekursiv, jede Ebene.' },
        { t: '/var/log', d: 'Der Startpunkt. Auch . (hier) oder ~ (Home) sind üblich. Ohne Angabe nimmt find das aktuelle Verzeichnis.' },
        { t: '-name "*.log"', d: 'Kriterium 1: der Dateiname, mit * als Platzhalter. Die Anführungszeichen sind wichtig — sonst expandiert die Shell den Stern, bevor find ihn sieht.' },
        { t: '-type f', d: 'Kriterium 2: nur echte Dateien (f = file). -type d fände nur Verzeichnisse (directories).' },
      ],
    },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Kriterien',
          rows: [
            { key: `find . -name ${kbd('"*.conf"')}`, info: 'Nach Namensmuster suchen.', why: '-iname ignoriert Groß-/Kleinschreibung.' },
            { key: 'find . -type f / -type d', info: 'Nur Dateien bzw. nur Verzeichnisse.', why: 'Filtert die halbe Trefferliste weg.' },
            { key: 'find / -size +100M', info: 'Dateien über 100 Megabyte.', why: '+100M größer, -1M kleiner. Der Platzfresser-Finder.' },
            { key: 'find . -mtime -1', info: 'In den letzten 24 Stunden geändert.', why: 'mtime zählt in Tagen: -1 = jünger als 1 Tag, +30 = älter als 30.' },
          ],
        },
        {
          name: 'Mit Treffern arbeiten',
          rows: [
            { key: `find . -name "*.tmp" -exec rm {} \\;`, info: 'Für jeden Treffer einen Befehl ausführen.', why: '{} wird durch den Pfad ersetzt, \\; beendet den Befehl. Erst ohne -exec testen!' },
            { key: 'find . -name "*.tmp" -delete', info: 'Treffer direkt löschen.', why: 'Kürzer als -exec rm — und genauso endgültig. Vorher ohne -delete anschauen.' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'warn',
      title: 'Erst gucken, dann löschen',
      html: `Bei allem mit <code>-exec rm</code> oder <code>-delete</code>: führ das <code>find</code> <b>zuerst ohne</b> den Lösch-Teil aus und lies die Trefferliste. Ein zu breites Muster („ach, <code>-name "*"</code> passt schon“) löscht sonst zuverlässig das Falsche.`,
    },
    { type: 'terminal', intro: '# Such los: find /var/log -name "*.log", find ~ -type d, find . -name "*.md" -type f' },

    { type: 'heading', text: 'Wo kommt ein Befehl her?', color: '--cyan' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Befehle finden',
          rows: [
            { key: `which ${kbd('befehl')}`, info: 'Vollständigen Pfad eines Programms zeigen.', why: 'which python3 → /usr/bin/python3. Klärt, WAS da eigentlich läuft.' },
            { key: `type ${kbd('befehl')}`, info: 'Programm, Builtin oder Alias?', why: 'Sieht auch Aliase und Shell-Funktionen — gründlicher als which.' },
            { key: `whereis ${kbd('befehl')}`, info: 'Programm + zugehörige man-Page + Quellen.', why: 'Der Rundumschlag in eine Zeile.' },
          ],
        },
        {
          name: 'Schnellsuche',
          rows: [
            { key: `locate ${kbd('name')}`, info: 'Blitzschnell im Datei-Index suchen.', why: 'Sucht in einer Datenbank statt auf der Platte — dafür evtl. veraltet.' },
            { key: 'sudo updatedb', info: 'Den locate-Index aktualisieren.', why: 'Läuft sonst 1× täglich. Neue Dateien kennt locate erst danach.' },
          ],
        },
      ],
    },

    { type: 'heading', text: 'Wo ist mein Speicherplatz hin?', color: '--cyan' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Platz-Detektive',
          rows: [
            { key: 'df -h', info: 'Freien Platz aller eingebundenen Dateisysteme zeigen.', why: 'disk free. Der erste Befehl, wenn „die Platte voll“ ist.' },
            { key: `du -sh ${kbd('ordner')}`, info: 'Gesamtgröße eines Ordners.', why: 'disk usage; -s = nur Summe, -h = lesbar.' },
            { key: 'du -h --max-depth=1 | sort -rh', info: 'Größe jedes Unterordners, größte zuerst.', why: 'Damit kreist du den Platzfresser Ebene für Ebene ein.' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'ncdu: du zum Durchklicken',
      html: `<code>ncdu /</code> zeigt die Plattenbelegung als interaktive Liste, in der du mit den Pfeiltasten hinabsteigst — die schnellste Art, einen vollen Server aufzuräumen. Mehr solcher Helfer unter <a href="#/devtools">Moderne CLI-Tools</a>.`,
    },
  ],
};
