import type { Topic } from '../types/content';

const kbd = (s: string) => `<span class="kbd">${s}</span>`;

/** Prozesse & Jobs. */
export const processes: Topic = {
  id: 'prozesse',
  title: 'Prozesse & Jobs',
  icon: '⚙️',
  level: 'advanced',
  category: 'konzepte',
  summary: 'Was läuft gerade? PIDs, Signale, Vorder- und Hintergrund, top & kill.',
  blocks: [
    {
      type: 'prose',
      html: `Jedes laufende Programm ist ein <b>Prozess</b> mit einer eindeutigen Nummer, der <b class="hl-cyan">PID</b>. Prozesse bilden einen Baum: jeder hat einen Elternprozess. Ganz oben steht <code>init</code> bzw. <code>systemd</code> mit PID 1 — der Urahn aller Prozesse.`,
    },
    { type: 'heading', text: 'Anschauen & steuern', color: '--purple' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Ansehen',
          rows: [
            { key: 'ps aux', info: 'Alle laufenden Prozesse mit Details.', why: 'Klassiker. Mit grep filtern: ps aux | grep nginx.' },
            { key: 'top', info: 'Live-Ansicht: CPU, RAM, aktivste Prozesse.', why: 'htop ist die schönere, bunte Variante.' },
            { key: `pgrep ${kbd('name')}`, info: 'PID(s) eines Programms per Name finden.', why: 'Schneller als ps | grep.' },
          ],
        },
        {
          name: 'Beenden',
          rows: [
            { key: `kill ${kbd('PID')}`, info: 'Höflich ums Beenden bitten (Signal TERM).', why: 'Das Programm darf aufräumen und speichern.' },
            { key: `kill -9 ${kbd('PID')}`, info: 'Hart abschießen (Signal KILL).', why: 'Letzter Ausweg — kein Aufräumen mehr möglich.' },
            { key: `killall ${kbd('name')}`, info: 'Alle Prozesse mit diesem Namen beenden.', why: 'Praktisch, wenn mehrere laufen.' },
          ],
        },
        {
          name: 'Jobs',
          rows: [
            { key: `${kbd('befehl')} &`, info: 'Programm im Hintergrund starten.', why: 'Das Terminal bleibt frei für Weiteres.' },
            { key: kbd('Strg+Z'), info: 'Laufenden Vordergrund-Job pausieren.', why: 'Danach bg (Hintergrund) oder fg (zurück).' },
            { key: 'jobs', info: 'Hintergrund-Jobs dieser Shell auflisten.', why: 'fg %1 holt Job 1 zurück in den Vordergrund.' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Signale sind Nachrichten',
      html: `<code>kill</code> „killt“ nicht wörtlich — es schickt ein <b>Signal</b>. <code>TERM</code> (15) heißt „bitte beenden“, <code>KILL</code> (9) „sofort weg, keine Widerrede“, <code>HUP</code> (1) oft „lies deine Konfiguration neu“. Ein Prozess kann auf die meisten Signale reagieren — nur KILL nicht.`,
    },
    { type: 'heading', text: 'Live erkunden', color: '--green' },
    { type: 'terminal', cwd: '/proc', intro: '# Der Kernel als Dateien: cat /proc/cpuinfo | head, cat /proc/meminfo | head' },
  ],
};

/** Streams, Pipes, Redirects. */
export const streamsPipes: Topic = {
  id: 'streams-pipes',
  title: 'Streams & Pipes',
  icon: '🔀',
  level: 'advanced',
  category: 'konzepte',
  summary: 'stdin/stdout/stderr, das | und die Kunst, kleine Tools zu verketten.',
  blocks: [
    {
      type: 'prose',
      html: `Die Unix-Philosophie: <b>kleine Werkzeuge, die eine Sache gut können</b> und sich verketten lassen. Der Klebstoff dafür sind drei Datenströme, die jeder Prozess hat: <b class="hl-green">stdin</b> (Eingabe, 0), <b class="hl-cyan">stdout</b> (Ausgabe, 1) und <b class="hl-red">stderr</b> (Fehler, 2).`,
    },
    {
      type: 'breakdown',
      cmd: [
        { t: 'cat /etc/passwd', d: 'Gibt den Inhalt der Datei auf stdout aus.' },
        { t: '|', d: 'Die Pipe. Sie verbindet die stdout des linken Befehls mit der stdin des rechten. So wandern Daten von Tool zu Tool.' },
        { t: 'grep bash', d: 'Liest von stdin und lässt nur Zeilen durch, die „bash“ enthalten.' },
        { t: '|', d: 'Noch eine Pipe — Ketten können beliebig lang werden.' },
        { t: 'wc -l', d: 'Zählt die Zeilen, die ankommen. Ergebnis: wie viele User haben bash als Shell.' },
      ],
    },
    { type: 'heading', text: 'Umleiten', color: '--purple' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Redirects',
          rows: [
            { key: `${kbd('befehl')} > datei`, info: 'stdout in eine Datei schreiben (überschreibt).', why: 'Die Datei wird neu angelegt oder geleert.' },
            { key: `${kbd('befehl')} >> datei`, info: 'stdout anhängen, ohne zu überschreiben.', why: 'Ideal für Logs.' },
            { key: `${kbd('befehl')} 2> fehler.log`, info: 'Nur stderr umleiten.', why: '2 ist die Nummer von stderr.' },
            { key: `${kbd('befehl')} &> alles.log`, info: 'stdout UND stderr zusammen umleiten.', why: 'Fängt wirklich alles ein.' },
            { key: `${kbd('befehl')} < eingabe.txt`, info: 'Eine Datei als stdin hineinreichen.', why: 'Das Gegenstück zu >.' },
          ],
        },
        {
          name: 'Nützliche Filter',
          rows: [
            { key: 'grep', info: 'Zeilen nach Muster filtern.', why: 'Das Sieb der Kommandozeile.' },
            { key: 'sort', info: 'Zeilen sortieren.', why: 'sort -u sortiert und entfernt Doubletten.' },
            { key: 'uniq -c', info: 'Gleiche Nachbarzeilen zählen.', why: 'Fast immer nach sort benutzt.' },
            { key: 'cut / awk', info: 'Spalten herausschneiden bzw. verarbeiten.', why: 'awk ist eine kleine Sprache für Textzeilen.' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'stdout vs. stderr — warum getrennt?',
      html: `Ein Programm schickt Ergebnisse auf <b>stdout</b> und Fehler/Warnungen auf <b>stderr</b>. So kannst du das Ergebnis in eine Datei leiten und Fehler trotzdem im Terminal sehen. In einer Pipe wandert nur stdout weiter — Fehler bleiben sichtbar. Das ist kein Zufall, sondern Design.`,
    },
    { type: 'heading', text: 'Ketten selbst bauen', color: '--green' },
    { type: 'terminal', cwd: '/etc', intro: '# Verkette Tools: cat passwd | grep bash | wc -l  — oder: ls / | sort' },
  ],
};

/** Netzwerk & Protokolle. */
export const networking: Topic = {
  id: 'netzwerk',
  title: 'Netzwerk & Protokolle',
  icon: '🌐',
  level: 'senior',
  category: 'konzepte',
  summary: 'IP, Ports, TCP/IP, DNS, HTTP und SSH — wie Rechner miteinander reden.',
  blocks: [
    {
      type: 'prose',
      html: `Netzwerke sind Schichten (der <b>TCP/IP-Stack</b>). Ganz unten schickt <b>IP</b> Pakete an Adressen. Darüber sorgt <b>TCP</b> für eine zuverlässige, geordnete Verbindung (oder <b>UDP</b> für schnell-und-egal). Ganz oben leben die <b>Anwendungsprotokolle</b> wie HTTP, SSH oder DNS. Jede Schicht verlässt sich auf die darunter.`,
    },
    { type: 'heading', text: 'Adressen & Ports', color: '--purple' },
    {
      type: 'prose',
      html: `Eine <b class="hl-cyan">IP-Adresse</b> ist wie die Hausnummer eines Rechners (z.B. <code>192.168.1.10</code>). Ein <b class="hl-pink">Port</b> ist die Wohnungstür für einen bestimmten Dienst: <code>22</code> für SSH, <code>80</code> für HTTP, <code>443</code> für HTTPS, <code>53</code> für DNS. Zusammen — IP + Port — landest du bei genau einem Dienst auf genau einem Rechner.`,
    },
    { type: 'heading', text: 'Die wichtigsten Protokolle', color: '--purple' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Protokolle',
          rows: [
            { key: 'DNS · Port 53', info: 'Übersetzt Namen (example.com) in IP-Adressen.', why: 'Das Telefonbuch des Internets. Ohne DNS nur Zahlen.' },
            { key: 'HTTP/S · 80/443', info: 'Das Web: Anfragen und Antworten für Seiten und APIs.', why: 'HTTPS ist HTTP in einem TLS-Tunnel (verschlüsselt).' },
            { key: 'SSH · Port 22', info: 'Verschlüsselte Fernsteuerung einer Shell.', why: 'Login per Schlüssel statt Passwort ist Standard.' },
            { key: 'TCP vs. UDP', info: 'Zuverlässig-geordnet vs. schnell-verbindungslos.', why: 'TCP für Web/SSH, UDP für DNS, Spiele, Streaming.' },
          ],
        },
        {
          name: 'Werkzeuge',
          rows: [
            { key: 'ip a', info: 'Eigene IP-Adressen und Interfaces anzeigen.', why: 'Der moderne Nachfolger von ifconfig.' },
            { key: `ping ${kbd('host')}`, info: 'Ist ein Rechner erreichbar?', why: 'Schickt kleine Pakete und misst die Antwortzeit.' },
            { key: 'ss -tulpn', info: 'Welche Ports lauschen auf diesem Rechner?', why: 'Zeigt offene Dienste. Ersetzt das alte netstat.' },
            { key: `curl ${kbd('url')}`, info: 'Eine HTTP-Anfrage von der Kommandozeile.', why: 'curl -I zeigt nur die Antwort-Header.' },
            { key: `dig ${kbd('domain')}`, info: 'DNS-Auflösung nachschlagen.', why: 'Zeigt, welche IP hinter einem Namen steckt.' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Was beim Aufruf einer Webseite passiert',
      html: `1) <b>DNS</b> übersetzt <code>example.com</code> in eine IP. 2) Dein Rechner baut per <b>TCP</b> eine Verbindung zu Port <b>443</b> auf. 3) <b>TLS</b> handelt Verschlüsselung aus. 4) <b>HTTP</b> schickt „GET /“ und bekommt die Seite zurück. Vier Protokolle, ein Klick.`,
    },
  ],
};

/** systemd & Dienste. */
export const systemd: Topic = {
  id: 'systemd',
  title: 'systemd & Dienste',
  icon: '🧩',
  level: 'senior',
  category: 'konzepte',
  summary: 'Was PID 1 macht: Dienste starten, überwachen, Logs mit journalctl.',
  blocks: [
    {
      type: 'prose',
      html: `<b class="hl-cyan">systemd</b> ist der erste Prozess (PID 1), den der Kernel startet, und der Manager für alles Weitere. Es bringt <b>Dienste</b> (units) in der richtigen Reihenfolge hoch, startet abgestürzte neu und sammelt alle Logs zentral. Auf Ubuntu läuft heute praktisch alles über systemd.`,
    },
    { type: 'heading', text: 'Dienste steuern', color: '--purple' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'systemctl',
          rows: [
            { key: `systemctl status ${kbd('nginx')}`, info: 'Läuft der Dienst? Seit wann? Letzte Logs.', why: 'Der erste Blick bei Problemen.' },
            { key: `sudo systemctl start ${kbd('nginx')}`, info: 'Dienst jetzt starten.', why: 'stop hält an, restart macht beides.' },
            { key: `sudo systemctl enable ${kbd('nginx')}`, info: 'Dienst beim Booten automatisch starten.', why: 'enable --now startet zusätzlich sofort.' },
            { key: `sudo systemctl reload ${kbd('nginx')}`, info: 'Konfiguration neu laden, ohne Neustart.', why: 'Schont bestehende Verbindungen.' },
            { key: 'systemctl list-units --failed', info: 'Welche Dienste sind abgestürzt?', why: 'Schneller Gesundheits-Check des Systems.' },
          ],
        },
        {
          name: 'Logs (journalctl)',
          rows: [
            { key: `journalctl -u ${kbd('nginx')}`, info: 'Logs eines bestimmten Dienstes.', why: 'Alles zentral, kein Suchen in /var/log.' },
            { key: 'journalctl -f', info: 'Logs live mitverfolgen.', why: 'Wie tail -f, aber systemweit.' },
            { key: 'journalctl -b', info: 'Logs seit dem letzten Boot.', why: '-b -1 zeigt den Boot davor.' },
            { key: 'journalctl -p err', info: 'Nur Fehler und Schlimmeres.', why: 'Filtert das Rauschen heraus.' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Eine Unit ist nur eine Textdatei',
      html: `Ein Dienst wird durch eine <code>.service</code>-Datei beschrieben (unter <code>/etc/systemd/system/</code>). Darin steht, welches Programm gestartet wird, wann, als welcher User und ob es bei Absturz neu starten soll. Nach dem Ändern: <code>sudo systemctl daemon-reload</code>, dann <code>restart</code>.`,
    },
  ],
};

/** Kernel & Userspace. */
export const kernel: Topic = {
  id: 'kernel',
  title: 'Kernel & Userspace',
  icon: '🧠',
  level: 'senior',
  category: 'konzepte',
  summary: 'Das große Bild: was der Kernel macht, Syscalls und /proc & /sys.',
  blocks: [
    {
      type: 'prose',
      html: `„Linux“ ist streng genommen nur der <b class="hl-red">Kernel</b> — der Kern, der direkt mit der Hardware redet. Alles andere (Shell, Programme, Desktop) ist <b class="hl-green">Userspace</b>. Der Kernel verwaltet CPU-Zeit, Speicher, Geräte und Dateisysteme und hält die Programme sauber voneinander getrennt.`,
    },
    { type: 'heading', text: 'Die Grenze: der Syscall', color: '--purple' },
    {
      type: 'prose',
      html: `Ein normales Programm darf die Hardware <b>nicht direkt</b> anfassen. Will es eine Datei lesen, Speicher anfordern oder ein Netzwerkpaket senden, bittet es den Kernel über einen <b>Syscall</b> (System Call) darum. Der Kernel prüft die Rechte und erledigt es. Diese Trennung ist der Grund, warum ein abstürzendes Programm nicht gleich das ganze System mitreißt.`,
    },
    {
      type: 'breakdown',
      cmd: [
        { t: 'Programm (Userspace)', d: 'Deine App läuft mit eingeschränkten Rechten und sieht nur ihren eigenen Speicher.' },
        { t: '→ Syscall →', d: 'Der kontrollierte Übergang: open(), read(), write(), fork()... Das Programm bittet, der Kernel entscheidet.' },
        { t: 'Kernel', d: 'Prüft Rechte, spricht mit Treibern und Hardware, gibt das Ergebnis zurück.' },
        { t: 'Hardware', d: 'CPU, RAM, Platte, Netzwerkkarte — nur der Kernel redet direkt mit ihnen.' },
      ],
    },
    { type: 'heading', text: 'Den Kernel befragen', color: '--purple' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Virtuelle FS',
          rows: [
            { key: 'cat /proc/cpuinfo', info: 'Details zur CPU — als Datei.', why: '/proc bildet Prozesse und Kernel-Zustand als Dateien ab.' },
            { key: 'cat /proc/meminfo', info: 'Speicherbelegung direkt vom Kernel.', why: 'free und top lesen genau hier.' },
            { key: 'ls /sys/class/', info: 'Geräte und Treiber als Baum.', why: '/sys ist der moderne Draht zum Kernel (Lüfter, LEDs, ...).' },
          ],
        },
        {
          name: 'Kernel-Info',
          rows: [
            { key: 'uname -r', info: 'Version des laufenden Kernels.', why: 'Wichtig bei Treiber- und Modulfragen.' },
            { key: 'dmesg', info: 'Meldungen des Kernels (Boot, Hardware).', why: 'Erste Anlaufstelle bei Hardware-Problemen.' },
            { key: `lsmod`, info: 'Geladene Kernel-Module (Treiber).', why: 'Der Kernel ist modular — Treiber werden nachgeladen.' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Warum „alles ist eine Datei“ so mächtig ist',
      html: `Weil der Kernel Geräte, Prozesse und Einstellungen als Dateien darstellt (<code>/dev</code>, <code>/proc</code>, <code>/sys</code>), kannst du sie mit denselben Werkzeugen anfassen wie Texte: <code>cat</code>, <code>grep</code>, Umleitungen. Ein einziges, konsistentes Modell für das ganze System — das ist die Idee hinter Unix.`,
    },
    { type: 'heading', text: 'Selbst nachsehen', color: '--green' },
    { type: 'terminal', cwd: '/proc', intro: '# Frag den Kernel: cat cpuinfo | head, cat meminfo | head, ls /sys' },
  ],
};
