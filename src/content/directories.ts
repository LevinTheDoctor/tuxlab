import type { Topic, DirEntry } from '../types/content';

// Filesystem Hierarchy Standard — Texte 1:1 aus der ursprünglichen HTML übernommen.
const dirs: DirEntry[] = [
  { path: '/', role: 'Wurzel', desc: 'Der Ausgangspunkt von allem. Jeder Pfad beginnt hier. Es gibt unter Linux keine Laufwerksbuchstaben wie C: sondern nur diesen einen Baum.', inside: ['alle anderen Ordner'], tip: 'Alles hängt an /. USB-Sticks oder Platten werden per mount irgendwo in diesen Baum eingehängt.' },
  { path: '/bin', role: 'Programme', desc: 'Grundlegende Kommandos die jeder braucht, auch wenn sonst nichts läuft. Auf modernen Systemen meist ein Symlink nach /usr/bin.', inside: ['ls', 'cp', 'cat', 'mv', 'bash'], tip: 'Wenn du ls tippst, wird hier (bzw. in /usr/bin) das Programm gefunden.' },
  { path: '/sbin', role: 'Admin-Tools', desc: 'System-Binaries für die Verwaltung. Meist nur als root sinnvoll ausführbar.', inside: ['fdisk', 'reboot', 'ip', 'mkfs'], tip: 's steht für system. Diese Befehle verändern das System, sei vorsichtig.' },
  { path: '/etc', role: 'Konfiguration', desc: 'Systemweite Konfigurationsdateien, fast alles reiner Text. Kein einziges Programm liegt hier, nur Einstellungen.', inside: ['passwd', 'fstab', 'hosts', 'ssh/sshd_config'], tip: 'Merksatz: /etc = editierbare Textconfig. Vor dem Ändern immer eine Kopie machen (sudo cp datei datei.bak).' },
  { path: '/home', role: 'User-Daten', desc: 'Hier liegen die persönlichen Ordner der normalen Benutzer. Deine Dateien, Downloads und dein ~/.config landen hier.', inside: ['/home/levin', '/home/max'], tip: 'Die Tilde ~ ist eine Abkürzung für dein eigenes Home, also /home/levin.' },
  { path: '/root', role: 'Root-Home', desc: 'Das Home-Verzeichnis des Superusers root. Absichtlich NICHT unter /home, damit root auch dann noch ran kommt, wenn /home mal nicht eingehängt ist.', inside: ['.bashrc', '.ssh/'], tip: 'Verwechsle /root (Home von root) nicht mit / (die Wurzel).' },
  { path: '/var', role: 'Variable Daten', desc: 'Daten die sich ständig ändern und wachsen: Logdateien, Mail-Queues, Caches, Datenbanken, Webseiten.', inside: ['log/', 'www/', 'cache/', 'lib/'], tip: 'Bei Problemen zuerst nach /var/log schauen, dort steht was schief lief (z.B. journalctl oder /var/log/syslog).' },
  { path: '/tmp', role: 'Temporär', desc: 'Ablage für kurzlebige Dateien. Wird beim Reboot oft geleert. Jeder darf hier schreiben, aber nur eigene Dateien löschen (Sticky Bit).', inside: ['Session-Dateien', 'Installer-Reste'], tip: 'Nichts Wichtiges hier ablegen, kann jederzeit weg sein.' },
  { path: '/usr', role: 'System-Ressourcen', desc: 'Die große zweite Ebene: fast alle installierten Programme, Bibliotheken und geteilte Daten die nicht zum Booten nötig sind.', inside: ['bin/', 'lib/', 'local/', 'share/'], tip: '/usr/local ist für selbst kompilierte Software, damit sie nicht mit Paketen aus dem Paketmanager kollidiert.' },
  { path: '/opt', role: 'Fremd-Software', desc: 'Optionale Zusatzsoftware, oft von Drittanbietern, die alles in einem eigenen Unterordner mitbringt (statt sich über /usr zu verteilen).', inside: ['/opt/google/chrome', '/opt/vendor'], tip: 'Praktisch: eine App komplett wieder löschen heißt hier oft nur den Ordner entfernen.' },
  { path: '/boot', role: 'Startdateien', desc: 'Alles was zum Hochfahren gebraucht wird: der Kernel, die initramfs und der Bootloader GRUB.', inside: ['vmlinuz', 'initrd.img', 'grub/'], tip: 'Hier bitte nur wissen, was du tust — ein kaputter Bootloader und das System startet nicht mehr.' },
  { path: '/dev', role: 'Geräte', desc: 'Unter Linux ist jedes Gerät eine Datei. Festplatten, Terminals und sogar Nichts finden sich hier.', inside: ['sda', 'null', 'zero', 'tty'], tip: '/dev/null ist die Mülltonne: alles was du dort hinschickst, verschwindet spurlos.' },
  { path: '/proc', role: 'Kernel-Info', desc: 'Ein virtuelles Dateisystem (nicht auf der Platte). Zeigt live laufende Prozesse und Kernel-Infos als Dateien.', inside: ['cpuinfo', 'meminfo', '[PID]/'], tip: 'cat /proc/cpuinfo zeigt dir deine CPU, ganz ohne Extra-Tool.' },
  { path: '/sys', role: 'Hardware-Info', desc: 'Ebenfalls virtuell. Moderner Draht zum Kernel für Geräte, Treiber und Einstellungen (z.B. Lüfter, LEDs).', inside: ['class/', 'devices/', 'block/'], tip: 'Wird selten direkt angefasst, meist von Tools im Hintergrund genutzt.' },
  { path: '/mnt', role: 'Mount-Punkt', desc: 'Leerer Ordner zum manuellen, temporären Einhängen von Dateisystemen.', inside: ['(meist leer)'], tip: 'sudo mount /dev/sdb1 /mnt hängt einen Datenträger schnell mal dort ein.' },
  { path: '/media', role: 'Wechselmedien', desc: 'Hier werden USB-Sticks, SD-Karten und CDs automatisch eingehängt, wenn du sie einsteckst.', inside: ['/media/levin/USB-STICK'], tip: 'Dein frisch eingesteckter Stick taucht beim Einstecken hier auf.' },
  { path: '/srv', role: 'Dienst-Daten', desc: 'Daten für Services die dein Rechner nach außen anbietet, etwa Web- oder FTP-Inhalte.', inside: ['www/', 'ftp/'], tip: 'Auf vielen Desktop-Systemen bleibt der Ordner leer.' },
  { path: '/run', role: 'Laufzeit', desc: 'Flüchtige Laufzeitdaten seit dem letzten Boot: PID-Dateien, Sockets. Liegt im RAM (tmpfs), also nach dem Neustart weg.', inside: ['*.pid', '*.sock'], tip: 'Früher lag das in /var/run, das ist heute nur noch ein Verweis hierher.' },
];

export const directories: Topic = {
  id: 'dateisystem',
  title: 'Das Dateisystem',
  icon: '🌳',
  level: 'basic',
  category: 'grundlagen',
  summary: 'Ein Baum, keine Laufwerksbuchstaben. Was in /, /etc, /home, /var & Co. lebt.',
  blocks: [
    {
      type: 'prose',
      html: `Unter Linux gibt es kein <code>C:</code> und kein <code>D:</code>. Es gibt genau <b>einen Baum</b>, der bei <span class="hl-cyan">/</span> (der Wurzel) beginnt. Alles — jede Platte, jeder USB-Stick, jedes Gerät — hängt irgendwo in diesem einen Baum. Diese Ordnung ist standardisiert (Filesystem Hierarchy Standard), damit sich Programme und Menschen auf jedem Linux zurechtfinden.`,
    },
    { type: 'heading', text: 'Klick dich durch den Baum', color: '--purple' },
    { type: 'directoryExplorer', dirs, startIndex: 3 },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Merkhilfe',
      html: `Die drei wichtigsten für den Alltag: <code>/etc</code> (Einstellungen), <code>/home</code> (deine Sachen), <code>/var/log</code> (was schiefging). Wenn etwas nicht läuft, führt der Weg fast immer über <code>/var/log</code>.`,
    },
  ],
};
