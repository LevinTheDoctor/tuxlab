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
            { key: 'history', info: 'Alle bisherigen Befehle auflisten.', why: 'Mit !123 führst du Nummer 123 nochmal aus, !! den letzten.' },
            { key: kbd('Strg+L'), info: 'Bildschirm leeren.', why: 'Dasselbe wie clear, nur schneller.' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Im man-Handbuch navigieren',
      html: `<code>man ls</code> öffnet einen <b>Pager</b> (less): ${kbd('Leertaste')} blättert eine Seite weiter, ${kbd('/')} sucht (dann ${kbd('n')} für den nächsten Treffer), ${kbd('g')} springt an den Anfang, ${kbd('q')} beendet. Wer man-Seiten lesen kann, braucht kein Stack Overflow für Optionen.`,
    },
    { type: 'heading', text: 'Selber ausprobieren', color: '--green' },
    {
      type: 'terminal',
      intro: '# Willkommen! Dies ist ein echtes Mini-Terminal. Probier: pwd, ls, ls -la, cd /etc, cat os-release',
    },
  ],
};

/** Dateien anschauen und bewegen — der Deep-Dive in die Alltagsbefehle. */
export const files: Topic = {
  id: 'dateien',
  title: 'Dateien & Ordner',
  icon: '📁',
  level: 'basic',
  category: 'grundlagen',
  summary: 'Pfade, ls, cd, cp, mv, rm und das Schreiben mit > — jeder Befehl richtig erklärt.',
  blocks: [
    {
      type: 'prose',
      html: `Unter Linux gilt: <b>alles ist eine Datei</b> — Texte, Programme, sogar Geräte. Auf dieser Seite lernst du die Befehle, mit denen du dich bewegst, Dateien anlegst, kopierst, verschiebst und löschst — <b>gründlich</b>, mit allen Flags, die du wirklich brauchst. Wichtig vorweg: die Kommandozeile hat <b>keinen Papierkorb</b>. Was <code>rm</code> löscht, ist weg.`,
    },

    { type: 'heading', text: 'Pfade: absolut, relativ und die Abkürzungen', color: '--purple' },
    {
      type: 'prose',
      html: `Jede Datei hat eine Adresse, ihren <b>Pfad</b>. Ein <b class="hl-cyan">absoluter Pfad</b> beginnt mit <code>/</code> und funktioniert von überall: <code>/home/levin/notizen.txt</code>. Ein <b class="hl-green">relativer Pfad</b> beginnt beim aktuellen Verzeichnis: stehst du in <code>/home/levin</code>, meint <code>projekte/readme.md</code> dieselbe Datei wie <code>/home/levin/projekte/readme.md</code>. Welche Schreibweise du nimmst, ist Geschmackssache — Skripte sind mit absoluten Pfaden robuster, zum Tippen sind relative kürzer.`,
    },
    {
      type: 'table',
      table: {
        headers: ['Schreibweise', 'Bedeutung', 'Beispiel'],
        rows: [
          ['<code>/…</code>', 'Absoluter Pfad — startet an der Wurzel', '<code>cd /var/log</code>'],
          ['<code>.</code>', 'Das aktuelle Verzeichnis', '<code>cp /etc/hosts .</code> — „hierher kopieren“'],
          ['<code>..</code>', 'Das Verzeichnis eine Ebene höher', '<code>cd ..</code>, auch mehrfach: <code>cd ../..</code>'],
          ['<code>~</code>', 'Dein Home-Verzeichnis (<code>/home/levin</code>)', '<code>cd ~/projekte</code> — klappt von überall'],
          ['<code>-</code>', 'Das vorherige Verzeichnis (nur bei <code>cd</code>)', '<code>cd -</code> — springt hin und her'],
        ],
      },
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'cd ohne alles',
      html: `<code>cd</code> ganz ohne Argument bringt dich immer nach Hause (<code>~</code>). Und <code>cd -</code> wechselt zwischen den letzten zwei Orten — perfekt, wenn du zwischen Projekt und <code>/etc</code> pendelst.`,
    },

    { type: 'heading', text: 'ls — anschauen, was da ist', color: '--purple' },
    {
      type: 'prose',
      html: `<code>ls</code> kennst du schon. Seine wahre Stärke kommt mit den Flags. Die wichtigste Kombination ist <code>ls -lah</code> — klick die Teile an:`,
    },
    {
      type: 'breakdown',
      cmd: [
        { t: 'ls', d: 'list — zeigt den Inhalt eines Verzeichnisses. Ohne Argument: das aktuelle.' },
        { t: '-l', d: 'long: eine Zeile pro Eintrag mit Rechten, Besitzer, Größe und Änderungsdatum statt nur Namen.' },
        { t: '-a', d: 'all: zeigt auch versteckte Einträge. Unter Linux ist alles versteckt, was mit einem Punkt beginnt — z.B. .bashrc. Kein Sicherheitsfeature, nur Konvention gegen Unordnung.' },
        { t: '-h', d: 'human-readable: Größen als 4,0K, 2,3M, 1,1G statt roher Byte-Zahlen. Wirkt nur zusammen mit -l.' },
      ],
    },
    {
      type: 'prose',
      html: `Was <code>ls -l</code> ausgibt, sieht kryptisch aus, folgt aber einem festen Schema. Eine Zeile auseinandergenommen — klick die Spalten an:`,
    },
    {
      type: 'breakdown',
      cmd: [
        { t: '-rw-r--r--', d: 'Typ und Rechte: das erste Zeichen ist der Typ (- = Datei, d = Ordner, l = Link). Danach dreimal rwx: lesen/schreiben/ausführen für Besitzer, Gruppe und alle anderen. Die Details stehen im Thema „Rechte & chmod“.' },
        { t: '1', d: 'Anzahl der Hardlinks. Für den Einstieg: darfst du ignorieren.' },
        { t: 'levin', d: 'Der Besitzer der Datei.' },
        { t: 'levin', d: 'Die Gruppe. Standardmäßig hat jeder User eine eigene Gruppe mit seinem Namen.' },
        { t: '4096', d: 'Größe in Bytes. Mit -h wird daraus lesbar „4,0K“. Ordner zeigen fast immer 4096 — das ist die Größe des Ordner-Eintrags selbst, nicht seines Inhalts.' },
        { t: 'Jul 6 10:00', d: 'Wann die Datei zuletzt geändert wurde.' },
        { t: 'notizen.txt', d: 'Der Name. Ordner erkennst du am d vorne — viele Terminals färben sie zusätzlich ein.' },
      ],
    },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'ls-Flags',
          rows: [
            { key: 'ls -l', info: 'Ausführliche Liste: Rechte, Besitzer, Größe, Datum.', why: 'Die Detailansicht. Fast immer mit -h kombiniert.' },
            { key: 'ls -a', info: 'Auch versteckte Dateien (.*) zeigen.', why: 'Ohne -a fehlen .bashrc & Co. — sie sind da, nur ausgeblendet.' },
            { key: 'ls -lt', info: 'Nach Änderungszeit sortieren, Neuestes zuerst.', why: '„Was hab ich zuletzt angefasst?“ — mit -ltr Neuestes unten.' },
            { key: 'ls -lS', info: 'Nach Größe sortieren, Größtes zuerst.', why: 'Speicherfresser finden.' },
            { key: 'ls -R', info: 'Rekursiv: auch alle Unterordner auflisten.', why: 'Bei tiefen Bäumen wird das schnell viel — tree ist oft schöner.' },
            { key: `ls ${kbd('pfad')}`, info: 'Anderen Ordner listen, ohne hinzuwechseln.', why: 'ls /var/log — gucken ohne umziehen.' },
          ],
        },
      ],
    },
    { type: 'terminal', intro: '# Schau dich um: pwd, ls -la, ls /var/log, cd projekte, pwd, cd .., cd -' },

    { type: 'heading', text: 'mkdir & touch — anlegen', color: '--cyan' },
    {
      type: 'prose',
      html: `<code>mkdir</code> (<i>make directory</i>) legt Ordner an, <code>touch</code> leere Dateien. <code>touch</code> heißt eigentlich „anfassen“: sein Hauptjob ist, den Zeitstempel einer Datei auf jetzt zu setzen — dass er fehlende Dateien dabei leer anlegt, ist der Nebeneffekt, für den ihn alle benutzen.`,
    },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Anlegen',
          rows: [
            { key: `mkdir ${kbd('ordner')}`, info: 'Einen neuen Ordner anlegen.', why: 'Meckert, wenn der Elternordner fehlt — dann hilft -p.' },
            { key: `mkdir -p a/b/c`, info: 'Den ganzen Pfad auf einmal anlegen.', why: 'parents: legt alle Zwischenebenen an, existierende stören nicht.' },
            { key: `touch ${kbd('datei')}`, info: 'Leere Datei anlegen bzw. Zeitstempel aktualisieren.', why: 'Auch mehrere auf einmal: touch a.txt b.txt c.txt' },
          ],
        },
      ],
    },

    { type: 'heading', text: 'cp — kopieren', color: '--cyan' },
    {
      type: 'breakdown',
      cmd: [
        { t: 'cp', d: 'copy — kopiert Dateien oder Ordner. Das Original bleibt unangetastet.' },
        { t: '-r', d: 'recursive: nötig, sobald du einen Ordner kopierst — cp steigt dann in alle Unterordner hinab. Ohne -r verweigert cp bei Ordnern die Arbeit.' },
        { t: '-v', d: 'verbose: zeigt jede kopierte Datei an. Beruhigend bei großen Ordnern.' },
        { t: 'projekte/', d: 'Die Quelle — was kopiert werden soll.' },
        { t: 'backup/', d: 'Das Ziel. Ist es ein existierender Ordner, landet die Quelle DARIN. Sonst wird es der neue Name der Kopie.' },
      ],
    },
    {
      type: 'prose',
      html: `Die eine Regel, die man bei <code>cp</code> (und <code>mv</code>) verstehen muss: <b>das letzte Argument ist das Ziel</b> — und sein Typ entscheidet. Ist das Ziel ein <b class="hl-cyan">existierender Ordner</b>, wird hineinkopiert: <code>cp notiz.txt backup/</code> → <code>backup/notiz.txt</code>. Ist es <b class="hl-orange">kein Ordner</b>, ist es der neue Name: <code>cp notiz.txt kopie.txt</code>. Deshalb kannst du auch viele Dateien auf einmal in einen Ordner werfen: <code>cp a.txt b.txt c.txt backup/</code>.`,
    },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'cp-Flags',
          rows: [
            { key: `cp ${kbd('quelle')} ${kbd('ziel')}`, info: 'Datei kopieren.', why: 'Ziel = Ordner → hineinkopieren. Ziel = Name → Kopie mit dem Namen.' },
            { key: `cp -r ${kbd('ordner')} ${kbd('ziel')}`, info: 'Ordner samt Inhalt kopieren.', why: 'recursive — ohne geht bei Ordnern nichts.' },
            { key: 'cp -i', info: 'Vor dem Überschreiben nachfragen.', why: 'interactive. cp überschreibt sonst kommentarlos!' },
            { key: 'cp -a', info: 'Archiv-Modus: alles erhalten (Rechte, Zeiten, Links).', why: 'Der richtige Modus für Backups.' },
          ],
        },
      ],
    },

    { type: 'heading', text: 'mv — verschieben & umbenennen', color: '--cyan' },
    {
      type: 'prose',
      html: `<code>mv</code> (<i>move</i>) verschiebt — und weil „umbenennen“ für Linux nur „an denselben Ort mit neuem Namen verschieben“ ist, gibt es <b>keinen eigenen rename-Befehl</b>: <code>mv alt.txt neu.txt</code> benennt um, <code>mv notiz.txt projekte/</code> verschiebt. Anders als <code>cp</code> braucht <code>mv</code> kein <code>-r</code> — ein Ordner wird einfach als Ganzes umgehängt, egal wie groß.`,
    },
    {
      type: 'callout',
      variant: 'warn',
      title: 'mv überschreibt ohne Warnung',
      html: `Existiert das Ziel schon, ist es nach <code>mv</code> <b>ersatzlos weg</b> — kein Nachfragen, kein Papierkorb. <code>mv -i</code> fragt vorher nach. Wer öfter hektisch tippt, legt sich in der Shell-Konfiguration <code>alias mv='mv -i'</code> an (gleiches gilt für <code>cp</code> und <code>rm</code>).`,
    },

    { type: 'heading', text: 'rm — löschen, endgültig', color: '--orange' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Löschen',
          rows: [
            { key: `rm ${kbd('datei')}`, info: 'Datei löschen. Endgültig.', why: 'Kein Papierkorb. Doppelt hinschauen.' },
            { key: `rm -r ${kbd('ordner')}`, info: 'Ordner samt Inhalt löschen.', why: 'recursive — steigt in alle Unterordner hinab.' },
            { key: 'rm -i', info: 'Vor jedem Löschen einzeln nachfragen.', why: 'interactive — das Sicherheitsnetz für wichtige Ordner.' },
            { key: 'rm -f', info: 'force: keine Nachfragen, keine Fehler bei fehlenden Dateien.', why: 'Praktisch in Skripten, gefährlich in Handarbeit.' },
            { key: `rmdir ${kbd('ordner')}`, info: 'Nur LEERE Ordner löschen.', why: 'Meckert, wenn noch etwas drin ist — ein Sicherheitsnetz.' },
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
    { type: 'terminal', intro: '# Baustelle: mkdir -p uebung/archiv, touch uebung/notiz.txt, cp uebung/notiz.txt uebung/archiv/, mv uebung/notiz.txt plan.txt, ls uebung/archiv, rm -r uebung' },

    { type: 'heading', text: 'Mit > in Dateien schreiben', color: '--green' },
    {
      type: 'prose',
      html: `Bis jetzt haben Befehle ihre Ausgabe ins Terminal geschrieben. Mit <b class="hl-green"><code>&gt;</code></b> lenkst du sie stattdessen <b>in eine Datei</b> um: <code>echo "Hallo" &gt; gruss.txt</code> erzeugt die Datei und schreibt „Hallo“ hinein. Das funktioniert mit <b>jedem</b> Befehl — <code>ls -l &gt; inventar.txt</code> speichert die Ordnerliste. Der Unterschied zwischen den beiden Pfeilen ist entscheidend: <code>&gt;</code> <b class="hl-orange">überschreibt</b> die Datei komplett, <code>&gt;&gt;</code> <b class="hl-cyan">hängt an</b>.`,
    },
    {
      type: 'table',
      table: {
        headers: ['Operator', 'Was passiert', 'Typischer Einsatz'],
        rows: [
          ['<code>&gt;</code>', 'Ausgabe in Datei schreiben — <b>überschreibt</b> den alten Inhalt restlos', '<code>ls -l &gt; inventar.txt</code>'],
          ['<code>&gt;&gt;</code>', 'Ausgabe <b>anhängen</b> — alter Inhalt bleibt', '<code>echo "neuer Eintrag" &gt;&gt; log.txt</code>'],
          ['<code>|</code>', 'Ausgabe an den <b>nächsten Befehl</b> weiterreichen statt in eine Datei', '<code>cat log.txt | grep ERROR</code>'],
        ],
      },
    },
    {
      type: 'callout',
      variant: 'warn',
      title: '> fragt nicht nach',
      html: `<code>echo x &gt; wichtige-datei</code> und der alte Inhalt ist weg — <code>&gt;</code> leert die Datei, <b>bevor</b> der Befehl überhaupt läuft. Wenn du anhängen willst, immer <code>&gt;&gt;</code>. Wie die Umleitungen intern funktionieren (stdout, stderr, <code>2&gt;</code>, <code>tee</code>), erklärt das Thema <a href="#/streams-pipes">Streams &amp; Pipes</a>.`,
    },
    { type: 'terminal', intro: '# Schreib was: echo "Hallo" > gruss.txt, cat gruss.txt, echo "Welt" >> gruss.txt, cat gruss.txt, wc -l gruss.txt' },

    { type: 'heading', text: 'Spickzettel: alles auf einen Blick', color: '--green' },
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
        {
          name: 'Schreiben',
          rows: [
            { key: `${kbd('befehl')} > datei`, info: 'Ausgabe in Datei schreiben (überschreibt).', why: 'Funktioniert mit jedem Befehl.' },
            { key: `${kbd('befehl')} >> datei`, info: 'Ausgabe an Datei anhängen.', why: 'Der sichere Pfeil — nichts geht verloren.' },
          ],
        },
      ],
    },
  ],
};
