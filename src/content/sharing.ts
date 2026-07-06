import type { Topic } from '../types/content';

const kbd = (s: string) => `<span class="kbd">${s}</span>`;

export const sharing: Topic = {
  id: 'sharing',
  title: 'Netzwerk-Freigaben (Samba & NFS)',
  icon: '🗂️',
  level: 'advanced',
  category: 'system',
  summary: 'Ordner im Netzwerk teilen: Samba für Windows, NFS für Linux/Unix.',
  blocks: [
    {
      type: 'prose',
      html: `Willst du einen Ordner mit anderen Rechnern teilen — etwa Medien vom Homeserver oder ein gemeinsames Projektverzeichnis — brauchst du eine <b>Netzwerk-Freigabe</b>. Zwei Standards decken das ab: <b class="hl-cyan">Samba</b> (spricht Windows-Protokoll SMB) und <b class="hl-green">NFS</b> (das native Unix-Protokoll).`,
    },
    {
      type: 'table',
      table: {
        headers: ['', 'Samba (SMB/CIFS)', 'NFS'],
        rows: [
          ['Kommt aus', 'Windows-Welt', 'Unix-Welt'],
          ['Ideal wenn', 'Windows, macOS & Linux gemischt', 'Nur Linux/Unix im Netz'],
          ['Benutzer/Rechte', 'Eigene Samba-User & Passwörter', 'Über UID/GID der Hosts'],
          ['Typischer Einsatz', 'NAS, Familie, gemischtes Büro', 'Server-Cluster, Homelab'],
          ['Geschwindigkeit', 'Gut', 'Sehr gut (weniger Overhead)'],
        ],
      },
    },
    { type: 'heading', text: 'Samba einrichten', color: '--cyan' },
    {
      type: 'prose',
      html: `<b>Samba</b> lässt einen Linux-Rechner so aussehen, als wäre er ein Windows-Dateiserver. Andere Geräte sehen die Freigabe unter <code>\\\\server\\name</code> (Windows) oder <code>smb://server/name</code> (Linux/macOS). Konfiguriert wird alles in einer Datei:`,
    },
    {
      type: 'fileCards',
      cards: [
        {
          file: '/etc/samba/smb.conf',
          perm: 'rw-r--r--  (644)',
          desc: 'Die zentrale Samba-Konfiguration. Am Ende definierst du in eckigen Klammern eine Freigabe mit Pfad und Rechten. Nach dem Ändern: sudo systemctl restart smbd.',
          code: '[medien]\n   path = /srv/medien\n   read only = no\n   valid users = levin\n<span class="c">^ Freigabename ^ Ordner ^ wer darf schreiben</span>',
        },
      ],
    },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Samba',
          rows: [
            { key: 'sudo apt install samba', info: 'Samba-Server installieren.', why: 'Bringt smbd (Dateien) und nmbd (Namen) mit.' },
            { key: `sudo smbpasswd -a ${kbd('levin')}`, info: 'Einen Samba-User anlegen (eigenes Passwort!).', why: 'Samba-Passwörter sind getrennt von den Linux-Logins.' },
            { key: 'testparm', info: 'smb.conf auf Fehler prüfen.', why: 'Immer vor dem Neustart — fängt Tippfehler ab.' },
            { key: 'sudo systemctl restart smbd', info: 'Nach Änderungen den Dienst neu starten.', why: 'Erst dann greift die neue Konfiguration.' },
          ],
        },
        {
          name: 'Client (mounten)',
          rows: [
            { key: `sudo mount -t cifs //server/medien /mnt`, info: 'Eine Samba-Freigabe einhängen.', why: '-o username=levin für die Anmeldung.' },
            { key: `sudo mount -t nfs server:/srv/daten /mnt`, info: 'Eine NFS-Freigabe einhängen.', why: 'NFS braucht keinen Login, es zählt die IP/UID.' },
            { key: 'smbclient -L //server', info: 'Freigaben eines Servers auflisten.', why: 'Wie „ls“ fürs Netzwerk — was gibt es dort?' },
          ],
        },
      ],
    },
    { type: 'heading', text: 'NFS in Kürze', color: '--green' },
    {
      type: 'prose',
      html: `<b>NFS</b> ist unter Linux schlanker und schneller. Der Server trägt seine Freigaben in <code>/etc/exports</code> ein (z.B. <code>/srv/daten 192.168.1.0/24(rw,sync)</code>), dann <code>sudo exportfs -ra</code>. Rechte laufen über die <b>UID/GID</b> — deshalb sollten die Benutzer auf beiden Rechnern dieselbe UID haben, sonst gibt es Überraschungen bei den Dateibesitzern.`,
    },
    { type: 'heading', text: 'Werkzeuge', color: '--cyan' },
    {
      type: 'tools',
      tools: [
        { name: 'Samba', tag: 'SMB', desc: 'Die freie Implementierung des SMB/CIFS-Protokolls. Das Herz fast jedes NAS und Homeservers.', install: 'sudo apt install samba', repo: 'https://github.com/samba-team/samba', homepage: 'https://www.samba.org' },
        { name: 'Cockpit', tag: 'Admin-UI', desc: 'Web-Oberfläche zum Verwalten von Linux-Servern — inklusive Freigaben, Diensten und Logs, ohne die Kommandozeile.', install: 'sudo apt install cockpit', repo: 'https://github.com/cockpit-project/cockpit', homepage: 'https://cockpit-project.org' },
        { name: 'Syncthing', tag: 'P2P-Sync', desc: 'Alternative ohne zentralen Server: spiegelt Ordner direkt und verschlüsselt zwischen deinen Geräten.', install: 'sudo apt install syncthing', repo: 'https://github.com/syncthing/syncthing', homepage: 'https://syncthing.net' },
      ],
    },
    {
      type: 'callout',
      variant: 'warn',
      title: 'Best Practice: Freigaben absichern',
      html: `Gib Freigaben niemals blind für alle frei. Bei Samba: <code>valid users</code> setzen und nicht <code>guest ok = yes</code> im Heimnetz vergessen abzuschalten. Bei NFS: den Zugriff auf dein Subnetz beschränken (<code>192.168.1.0/24</code>), nicht auf <code>*</code>. Und exponiere weder Samba noch NFS ins offene Internet — dafür nimmt man ein VPN wie WireGuard.`,
    },
  ],
};
