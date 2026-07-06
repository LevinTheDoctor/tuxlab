import type { Topic, FileCard } from '../types/content';

const userFiles: FileCard[] = [
  {
    file: '/etc/passwd',
    perm: 'rw-r--r--  (644)',
    desc: 'Liste aller Benutzerkonten. Trotz des Namens stehen hier KEINE Passwörter mehr, nur Name, UID, GID, Home-Ordner und Login-Shell. Von allen lesbar.',
    code: 'levin:x:1000:1000:Levin:/home/levin:/bin/bash\n<span class="c">Name  ^  UID  GID       Home        Shell</span>',
  },
  {
    file: '/etc/shadow',
    perm: 'rw-------  (600)',
    desc: 'Hier liegen die verschlüsselten Passwort-Hashes (z.B. mit Argon2id oder bcrypt). Nur root darf diese Datei lesen, deshalb die strengen Rechte 600.',
    code: 'levin:$y$j9T$...hash...:19700:0:99999:7:::\n<span class="c">Name ^ Hash-Verfahren + Passwort-Hash</span>',
  },
  {
    file: '/etc/group',
    perm: 'rw-r--r--  (644)',
    desc: 'Definiert Gruppen und welche User dazugehören. Über Gruppen wie sudo oder docker bekommst du zusätzliche Rechte, ohne ständig root zu sein.',
    code: 'sudo:x:27:levin\n<span class="c">Gruppe ^ GID  Mitglieder</span>',
  },
];

export const users: Topic = {
  id: 'user',
  title: 'User, Gruppen & sudo',
  icon: '👥',
  level: 'intermediate',
  category: 'system',
  summary: 'UID, GID, /etc/passwd & shadow — und warum du selten root sein solltest.',
  blocks: [
    {
      type: 'prose',
      html: `Wer darf was? Unter Linux ist alles an <b>User</b> (UID) und <b>Gruppen</b> (GID) gebunden. Der Superuser <span class="hl-red">root</span> (UID 0) darf alles. Alle anderen sind normale User mit begrenzten Rechten. Diese drei Dateien in <span class="hl-cyan">/etc</span> steuern das Ganze:`,
    },
    { type: 'fileCards', cards: userFiles },
    { type: 'heading', text: 'User & Gruppen verwalten', color: '--purple' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Anlegen',
          rows: [
            { key: 'sudo adduser <span class="kbd">max</span>', info: 'Neuen User samt Home und Passwort anlegen.', why: 'adduser ist das freundliche Frontend, useradd das nackte Werkzeug.' },
            { key: 'sudo usermod -aG <span class="kbd">docker</span> levin', info: 'User zu einer Gruppe hinzufügen.', why: '-aG = append. Ohne -a fliegst du aus allen anderen Gruppen!' },
            { key: 'sudo passwd <span class="kbd">max</span>', info: 'Passwort setzen oder ändern.', why: 'Ohne Namen änderst du dein eigenes.' },
          ],
        },
        {
          name: 'Nachsehen',
          rows: [
            { key: 'id', info: 'Deine UID, GID und alle Gruppen.', why: 'Der schnellste Blick auf „wer bin ich“.' },
            { key: 'whoami', info: 'Nur der aktuelle Benutzername.', why: 'Praktisch nach einem su.' },
            { key: 'groups <span class="kbd">levin</span>', info: 'In welchen Gruppen ein User ist.', why: 'Erklärt oft, warum jemand etwas (nicht) darf.' },
          ],
        },
        {
          name: 'sudo',
          rows: [
            { key: 'sudo <span class="kbd">befehl</span>', info: 'Einen einzelnen Befehl als root ausführen.', why: 'Besser als dauerhaft root zu sein.' },
            { key: 'sudo -i', info: 'Eine echte root-Shell öffnen.', why: 'Nur wenn du wirklich mehrere Admin-Schritte machst.' },
            { key: 'visudo', info: 'Die sudoers-Datei sicher bearbeiten.', why: 'Prüft auf Syntaxfehler, bevor du dich aussperrst.' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'warn',
      title: 'Best Practice: nicht als root leben',
      html: `Arbeite immer als normaler User und nutze <code>sudo</code> nur für einzelne Admin-Schritte. So schützt dich das System vor Tippfehlern (<code>rm</code> im falschen Ordner) und Schadsoftware bekommt nicht sofort die volle Kontrolle. Wer als root wohnt, hat kein Sicherheitsnetz mehr.`,
    },
  ],
};
