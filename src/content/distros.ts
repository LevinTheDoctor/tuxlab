import type { Topic, DistroEntry } from '../types/content';

const distros: DistroEntry[] = [
  { name: 'Ubuntu', logo: 'ubuntu', based: 'Debian-Familie', pkg: 'apt / dpkg', accent: '#E95420', flavor: 'Einsteiger, Desktop, Server', desc: 'Der freundliche Standard. Poliert, riesige Community, feste Releases (LTS = 5 Jahre Support). <b>Unser Fokus in dieser App.</b>' },
  { name: 'Debian', logo: 'debian', based: 'Ur-Distribution', pkg: 'apt / dpkg', accent: '#A81D33', flavor: 'Server, Puristen, Stabilität', desc: 'Die Mutter von Ubuntu. Extrem stabil und konservativ — Software ist älter, aber grundsolide. Das Fundament unzähliger Systeme.' },
  { name: 'Linux Mint', logo: 'mint', based: 'Ubuntu', pkg: 'apt / dpkg', accent: '#87CF3E', flavor: 'Windows-Umsteiger', desc: 'Ubuntu ohne Ecken und Kanten. Klassischer Desktop (Cinnamon), sehr einsteigerfreundlich. Beliebt bei Umsteigern von Windows.' },
  { name: 'Fedora', logo: 'fedora', based: 'Red-Hat-Familie', pkg: 'dnf / rpm', accent: '#3C6EB4', flavor: 'Entwickler, neueste Technik', desc: 'Immer nah am Neuesten (systemd, Wayland kamen hier zuerst). Testfeld für <b>Red Hat Enterprise Linux</b>. Beliebt bei Devs.' },
  { name: 'Arch Linux', logo: 'arch', based: 'Eigenständig', pkg: 'pacman', accent: '#1793D1', flavor: 'Profis, Bastler, Kontrolle', desc: 'Rolling Release: du baust dein System selbst zusammen, immer topaktuell. Das legendäre <b>Arch Wiki</b> ist die beste Linux-Doku überhaupt. „I use Arch btw.“' },
  { name: 'openSUSE', logo: 'opensuse', based: 'Eigenständig (SUSE)', pkg: 'zypper / rpm', accent: '#73BA25', flavor: 'Admins, YaST-Fans', desc: 'Zwei Varianten: <code>Leap</code> (stabil) und <code>Tumbleweed</code> (rolling). Das Setup-Tool <b>YaST</b> ist einzigartig komfortabel für Server-Admins.' },
  { name: 'RHEL / Rocky', logo: 'redhat', based: 'Red-Hat-Familie', pkg: 'dnf / rpm', accent: '#EE0000', flavor: 'Firmen, Enterprise-Server', desc: 'Der Enterprise-Standard mit bezahltem Support. <b>Rocky Linux</b> und AlmaLinux sind kostenlose 1:1-Klone — der Server-Alltag großer Firmen.' },
  { name: 'Kali Linux', logo: 'kali', based: 'Debian', pkg: 'apt / dpkg', accent: '#367BF0', flavor: 'Security & Pentesting', desc: 'Debian, vollgepackt mit Sicherheits- und Penetration-Testing-Werkzeugen. Kein Alltagssystem, sondern ein Werkzeugkasten für autorisierte Security-Arbeit.' },
];

export const distributions: Topic = {
  id: 'distributionen',
  title: 'Distributionen',
  icon: '🎁',
  level: 'basic',
  category: 'kultur',
  summary: 'Ein Kernel, viele Geschmacksrichtungen: Ubuntu, Debian, Fedora, Arch & Co.',
  blocks: [
    {
      type: 'prose',
      html: `„Linux“ ist streng genommen nur der Kernel. Eine <b>Distribution</b> („Distro“) schnürt daraus ein fertiges System: Kernel + GNU-Werkzeuge + Desktop + <b>Paketverwaltung</b> + Standardeinstellungen. Der größte Unterschied im Alltag ist die <b>Paketfamilie</b> — sie bestimmt, wie du Software installierst.`,
    },
    { type: 'heading', text: 'Die wichtigsten Distros', color: '--purple' },
    { type: 'distros', distros },
    { type: 'heading', text: 'Die drei Paketwelten', color: '--purple' },
    {
      type: 'prose',
      html: `Welche Distro du wählst, entscheidet vor allem, <b>welchen Paketmanager</b> du tippst. Dieselbe Software, drei Sprachen:`,
    },
    {
      type: 'table',
      table: {
        headers: ['Aufgabe', 'Debian/Ubuntu <code>apt</code>', 'Fedora/RHEL <code>dnf</code>', 'Arch <code>pacman</code>'],
        rows: [
          ['Paketlisten aktualisieren', 'sudo apt update', 'sudo dnf check-update', 'sudo pacman -Sy'],
          ['System aktualisieren', 'sudo apt upgrade', 'sudo dnf upgrade', 'sudo pacman -Syu'],
          ['Paket installieren', 'sudo apt install <code>htop</code>', 'sudo dnf install <code>htop</code>', 'sudo pacman -S <code>htop</code>'],
          ['Paket entfernen', 'sudo apt remove <code>htop</code>', 'sudo dnf remove <code>htop</code>', 'sudo pacman -R <code>htop</code>'],
          ['Nach Paket suchen', 'apt search <code>begriff</code>', 'dnf search <code>begriff</code>', 'pacman -Ss <code>begriff</code>'],
        ],
      },
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Welche soll ich nehmen?',
      html: `Als Einstieg: <b>Ubuntu</b> oder <b>Linux Mint</b> — größte Community, meiste Anleitungen, nichts kaputt zu machen. Willst du verstehen, wie alles zusammensteckt und immer das Neueste haben: <b>Arch</b> (mit dem grandiosen Wiki). Für Server in Firmen: <b>Debian</b>, <b>Rocky</b> oder <b>Ubuntu Server</b>. Es gibt kein „falsch“ — der Kernel darunter ist derselbe.`,
    },
  ],
};
