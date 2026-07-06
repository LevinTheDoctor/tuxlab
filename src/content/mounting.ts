import type { Topic } from '../types/content';

const kbd = (s: string) => `<span class="kbd">${s}</span>`;

export const mounting: Topic = {
  id: 'mounten',
  title: 'Mounten & Datenträger',
  icon: '💾',
  level: 'intermediate',
  category: 'system',
  summary: 'Wie Platten und USB-Sticks in den einen Baum kommen — mount, fstab, lsblk.',
  blocks: [
    {
      type: 'prose',
      html: `Erinnerst du dich: Linux hat <b>keine Laufwerksbuchstaben</b>, nur den einen Baum ab <code>/</code>. Wie kommt dann ein USB-Stick hinein? Durch <b class="hl-cyan">Mounten</b> (Einhängen): du verbindest das Dateisystem eines Datenträgers mit einem leeren Ordner im Baum — dem <b>Mount-Punkt</b>. Ab dann erscheint der Stick-Inhalt einfach dort.`,
    },
    {
      type: 'lifecycle',
      stages: [
        { ico: '🔌', name: 'Gerät', desc: 'Die Hardware, z.B. /dev/sdb1.', via: 'lsblk' },
        { ico: '📂', name: 'Mount-Punkt', desc: 'Ein Ordner, z.B. /mnt oder /media/levin.', via: 'mount' },
        { ico: '🌳', name: 'Im Baum', desc: 'Inhalt erscheint dort, ganz normal nutzbar.', via: 'umount' },
      ],
    },
    { type: 'heading', text: 'Gerätenamen verstehen', color: '--cyan' },
    {
      type: 'prose',
      html: `Datenträger leben unter <code>/dev</code>. <code>sda</code> ist die erste Platte, <code>sdb</code> die zweite; die Zahl dahinter ist die Partition: <code>sda1</code>, <code>sda2</code>. Bei NVMe-SSDs heißt es <code>nvme0n1p1</code>. Der Befehl <code>lsblk</code> zeigt dir alle Geräte als Baum — der beste Startpunkt.`,
    },
    { type: 'heading', text: 'Die Befehle', color: '--cyan' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Nachsehen',
          rows: [
            { key: 'lsblk', info: 'Alle Blockgeräte und ihre Mount-Punkte als Baum.', why: 'Der erste Blick: was ist da und wo hängt es?' },
            { key: 'df -h', info: 'Belegter/freier Platz je Dateisystem.', why: '-h = human readable (GB statt Blöcke).' },
            { key: `blkid`, info: 'UUIDs und Dateisystem-Typen der Partitionen.', why: 'Die UUID brauchst du für die fstab.' },
          ],
        },
        {
          name: 'Ein- & Aushängen',
          rows: [
            { key: `sudo mount ${kbd('/dev/sdb1')} /mnt`, info: 'Gerät an einem Mount-Punkt einhängen.', why: 'Der Ordner /mnt ist genau dafür da.' },
            { key: `sudo umount /mnt`, info: 'Wieder aushängen.', why: 'Immer aushängen, bevor du den Stick abziehst — sonst Datenverlust.' },
            { key: `sudo mount -o ro ${kbd('/dev/sdb1')} /mnt`, info: 'Nur lesend einhängen (read only).', why: 'Sicher, wenn du nichts verändern willst.' },
          ],
        },
      ],
    },
    { type: 'heading', text: 'Automatisch beim Booten: /etc/fstab', color: '--cyan' },
    {
      type: 'prose',
      html: `Damit ein Datenträger bei jedem Start automatisch eingehängt wird, trägst du ihn in <code>/etc/fstab</code> ein. Jede Zeile beschreibt ein Dateisystem: <b>welches Gerät</b>, <b>wohin</b>, <b>welcher Typ</b>, <b>welche Optionen</b>.`,
    },
    {
      type: 'fileCards',
      cards: [
        {
          file: '/etc/fstab',
          perm: 'rw-r--r--  (644)',
          desc: 'Die Tabelle der Dateisysteme, die beim Booten eingehängt werden. Geräte werden per UUID angesprochen (stabiler als /dev/sdb1, das sich bei anderer Steckreihenfolge ändern kann).',
          code: 'UUID=9f8e-77aa  /boot  ext4  defaults  0  2\n<span class="c">Gerät ^         Ziel   Typ   Optionen  dump pass</span>',
        },
      ],
    },
    {
      type: 'callout',
      variant: 'danger',
      title: 'Vorsicht mit der fstab',
      html: `Ein Tippfehler in <code>/etc/fstab</code> kann verhindern, dass das System bootet. Immer erst eine Kopie machen (<code>sudo cp /etc/fstab /etc/fstab.bak</code>) und mit <code>sudo mount -a</code> testen, ob alle Einträge sauber greifen, <b>bevor</b> du neu startest.`,
    },
    { type: 'heading', text: 'Selber ausprobieren', color: '--green' },
    {
      type: 'terminal',
      cwd: '/etc',
      intro: '# Schau dir die fstab an: cat fstab — oder erkunde: ls /, ls /mnt',
    },
  ],
};
