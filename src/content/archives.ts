import type { Topic } from '../types/content';

const kbd = (s: string) => `<span class="kbd">${s}</span>`;

/** tar, gzip, zip — packen, entpacken, reinschauen. */
export const archives: Topic = {
  id: 'archive',
  title: 'Archive & Kompression',
  icon: '🗜️',
  level: 'intermediate',
  category: 'werkzeuge',
  summary: 'tar endlich verstehen (czvf/xzvf/tzf), dazu gzip, zip und das Lesen rotierter Logs.',
  blocks: [
    {
      type: 'prose',
      html: `Unter Linux sind das <b>zwei getrennte Jobs</b>: <b class="hl-green">tar</b> („tape archive“, ein Fossil aus der Bandlaufwerk-Zeit) bündelt viele Dateien zu <b>einer</b>, komprimiert aber nichts. <b class="hl-cyan">gzip</b> komprimiert, kann aber nur <b>eine</b> Datei. Deshalb die Doppel-Endung <code>.tar.gz</code>: erst gebündelt, dann komprimiert. Praktisch macht tar heute beides in einem Aufruf — mit den berüchtigten Flag-Kombis, die wir jetzt entwirren.`,
    },

    { type: 'heading', text: 'Ein Archiv packen', color: '--purple' },
    {
      type: 'breakdown',
      cmd: [
        { t: 'tar', d: 'Das Archiv-Werkzeug. Bündelt Ordner und Dateien, erhält dabei Rechte und Struktur.' },
        { t: '-c', d: 'create: ein neues Archiv anlegen. Das Gegenstück ist -x (extract, auspacken).' },
        { t: '-z', d: 'gzip: das Archiv direkt komprimieren. Ergibt .tar.gz. Mit -j käme bzip2, mit -J xz heraus.' },
        { t: '-v', d: 'verbose: jede Datei beim Packen anzeigen. Kann man weglassen, beruhigt aber.' },
        { t: '-f backup.tar.gz', d: 'file: der Name des Archivs. WICHTIG: -f muss das letzte Flag sein, denn direkt danach kommt der Dateiname.' },
        { t: 'projekte/', d: 'Was hinein soll — ein Ordner (samt Inhalt) oder eine Liste von Dateien.' },
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Die Merkhilfe',
      html: `<b>Packen:</b> <code>tar -czf</code> — <b>c</b>reate, <b>z</b>ip, <b>f</b>ile. <b>Auspacken:</b> <code>tar -xzf</code> — e<b>x</b>tract, <b>z</b>ip, <b>f</b>ile. <b>Reinschauen:</b> <code>tar -tzf</code> — <b>t</b> wie table of contents. Nur ein Buchstabe wechselt: <b>c</b> packt, <b>x</b> entpackt, <b>t</b> guckt.`,
    },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'tar-Alltag',
          rows: [
            { key: `tar -czf ${kbd('ziel.tar.gz')} ${kbd('ordner/')}`, info: 'Ordner in ein komprimiertes Archiv packen.', why: 'Der Standard-Dreiklang fürs Packen.' },
            { key: `tar -xzf ${kbd('archiv.tar.gz')}`, info: 'Archiv ins aktuelle Verzeichnis entpacken.', why: 'x = extract. Überschreibt existierende Dateien kommentarlos!' },
            { key: `tar -tzf ${kbd('archiv.tar.gz')}`, info: 'Inhalt anzeigen, OHNE zu entpacken.', why: 'Immer erst reinschauen — siehe Warnung unten.' },
            { key: `tar -xzf a.tar.gz -C ${kbd('zielordner/')}`, info: 'In einen bestimmten Ordner entpacken.', why: '-C = change directory. Hält das Chaos aus dem aktuellen Ordner.' },
            { key: `tar -xzf a.tar.gz ${kbd('pfad/datei')}`, info: 'Nur eine einzelne Datei herausholen.', why: 'Der Pfad muss exakt so heißen wie in tar -tzf angezeigt.' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'warn',
      title: 'Die Tarbomb',
      html: `Ein gut erzogenes Archiv enthält <b>einen</b> Ordner obendrauf. Eine „Tarbomb“ dagegen kippt dir hunderte lose Dateien direkt ins aktuelle Verzeichnis. Darum vor dem Entpacken fremder Archive: <code>tar -tzf archiv.tar.gz | head</code> — und im Zweifel mit <code>-C</code> in einen frischen Ordner entpacken.`,
    },

    { type: 'heading', text: 'Ein Backup, einmal komplett durchgespielt', color: '--cyan' },
    {
      type: 'scriptSim',
      title: 'backup.tar.gz: packen, prüfen, woanders auspacken',
      script: [
        {
          line: 'tar -czvf backup.tar.gz projekte/',
          explain: 'Packen mit -v, damit wir sehen, was hineinwandert. tar nimmt den Ordner samt allem, was darin liegt.',
          output: 'projekte/\nprojekte/ideen.md\nprojekte/readme.md\nprojekte/todo.txt',
        },
        {
          line: 'ls -lh backup.tar.gz',
          explain: 'Kontrollblick: das Archiv existiert und ist dank -z schön klein. -h zeigt die Größe lesbar an.',
          output: '-rw-r--r-- 1 levin levin 312 Jul 19 10:00 backup.tar.gz',
        },
        {
          line: 'tar -tzf backup.tar.gz',
          explain: 'Reinschauen ohne Auspacken: -t listet den Inhalt. So prüfst du auch Monate später noch, was in einem Backup steckt.',
          output: 'projekte/\nprojekte/ideen.md\nprojekte/readme.md\nprojekte/todo.txt',
        },
        {
          line: 'mkdir -p /tmp/restore && tar -xzvf backup.tar.gz -C /tmp/restore',
          explain: 'Wiederherstellen — bewusst nach /tmp/restore statt über das Original. Ein Backup, das man nie probeweise zurückgespielt hat, ist keins.',
          output: 'projekte/\nprojekte/ideen.md\nprojekte/readme.md\nprojekte/todo.txt',
        },
      ],
    },

    { type: 'heading', text: 'gzip, zip und die rotierten Logs', color: '--cyan' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Einzeldateien',
          rows: [
            { key: `gzip ${kbd('datei')}`, info: 'Datei komprimieren → datei.gz.', why: 'Achtung: ERSETZT das Original. gzip -k behält es.' },
            { key: `gunzip ${kbd('datei.gz')}`, info: 'Wieder dekomprimieren.', why: 'Auch als gzip -d zu haben.' },
            { key: `zcat ${kbd('datei.gz')}`, info: 'Komprimierte Datei lesen, ohne sie zu entpacken.', why: 'Auch zless und zgrep gibt es — der .gz-Werkzeugkasten.' },
          ],
        },
        {
          name: 'Austausch mit Windows',
          rows: [
            { key: `zip -r ${kbd('ziel.zip')} ${kbd('ordner/')}`, info: 'Ein .zip erstellen (-r für Ordner).', why: 'zip = Bündeln + Komprimieren in einem Format.' },
            { key: `unzip ${kbd('archiv.zip')}`, info: 'Ein .zip entpacken.', why: 'unzip -l zeigt vorher den Inhalt.' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Warum in /var/log lauter .gz-Dateien liegen',
      html: `Logrotate archiviert alte Logs automatisch: aus <code>syslog</code> wird <code>syslog.1</code>, dann <code>syslog.2.gz</code> und so weiter. Zum Suchen in der Vergangenheit musst du nichts entpacken: <code>zgrep "ERROR" /var/log/syslog.2.gz</code> — oder gleich über alle: <code>zgrep "ERROR" /var/log/syslog*</code>.`,
    },
    {
      type: 'table',
      table: {
        headers: ['Endung', 'Werkzeug', 'Wann nehmen?'],
        rows: [
          ['<code>.tar.gz</code> / <code>.tgz</code>', '<code>tar -czf</code> / <code>-xzf</code>', 'Der Linux-Standard: Backups, Software-Downloads.'],
          ['<code>.tar.xz</code>', '<code>tar -cJf</code> / <code>-xJf</code>', 'Deutlich kleiner, aber langsamer — Distributions-Pakete.'],
          ['<code>.zip</code>', '<code>zip</code> / <code>unzip</code>', 'Austausch mit Windows und macOS.'],
          ['<code>.gz</code> (allein)', '<code>gzip</code> / <code>zcat</code>', 'Einzelne komprimierte Dateien, v.a. rotierte Logs.'],
        ],
      },
    },
  ],
};
