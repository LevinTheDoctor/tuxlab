import type { Topic } from '../types/content';

export const bestPractices: Topic = {
  id: 'best-practices',
  title: 'Best Practices (Admin & Dev)',
  icon: '🎯',
  level: 'senior',
  category: 'konzepte',
  summary: 'Die Gewohnheiten, die Profis von Bastlern unterscheiden — Sicherheit, Backups, Ordnung.',
  blocks: [
    {
      type: 'prose',
      html: `Linux lässt dich alles tun — auch dich selbst aussperren oder Daten unwiederbringlich löschen. Was einen <b>Senior</b> ausmacht, sind nicht exotische Befehle, sondern <b>Gewohnheiten</b>, die Fehler von vornherein verhindern. Hier die wichtigsten.`,
    },
    { type: 'heading', text: 'Sicherheit', color: '--red' },
    {
      type: 'callout',
      variant: 'danger',
      title: 'Least Privilege — so wenig Rechte wie möglich',
      html: `Arbeite als normaler User, nutze <code>sudo</code> nur für einzelne Schritte, wohne nie als root. Dienste laufen als eigene, eingeschränkte User (nicht als root). Dateirechte so eng wie möglich (<code>600</code> für Keys, nie <code>777</code>). Ein kompromittierter Prozess soll so wenig wie möglich anrichten können.`,
    },
    {
      type: 'callout',
      variant: 'warn',
      title: 'SSH richtig absichern',
      html: `Logins per <b>Schlüssel</b> statt Passwort (<code>ssh-keygen -t ed25519</code>), dann in <code>/etc/ssh/sshd_config</code> <code>PasswordAuthentication no</code> und <code>PermitRootLogin no</code>. Ändere den Port nicht als „Sicherheit“ (das ist nur Kosmetik), sondern setze lieber <b>fail2ban</b> ein, das Brute-Force-Versuche automatisch sperrt.`,
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Firewall & Updates',
      html: `Nur die Ports öffnen, die wirklich gebraucht werden — mit <code>ufw</code> (die einfache Firewall auf Ubuntu): <code>sudo ufw allow 22</code>, dann <code>sudo ufw enable</code>. Und: Updates zeitnah einspielen. <code>unattended-upgrades</code> installiert Sicherheitspatches automatisch.`,
    },
    { type: 'heading', text: 'Bevor du etwas kaputt machst', color: '--orange' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Sicher arbeiten',
          rows: [
            { key: 'cp datei datei.bak', info: 'Vor jeder Config-Änderung eine Kopie anlegen.', why: 'Der billigste Rückweg, den es gibt.' },
            { key: 'command --dry-run', info: 'Erst simulieren, was ein Befehl täte.', why: 'rsync, apt, viele Tools können das. Immer zuerst.' },
            { key: 'rm -i datei', info: 'Löschen mit Rückfrage.', why: 'Ein Alias alias rm="rm -i" rettet Nerven.' },
            { key: 'sudo visudo', info: 'sudoers nur so bearbeiten — es prüft die Syntax.', why: 'Ein Tippfehler dort und sudo ist kaputt.' },
            { key: 'tmux / screen', info: 'Lange Befehle auf Servern in tmux laufen lassen.', why: 'Verbindung bricht ab? Der Prozess läuft weiter.' },
          ],
        },
      ],
    },
    { type: 'heading', text: 'Backups & Wiederherstellung', color: '--green' },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Ein Backup, das du nie getestet hast, ist kein Backup',
      html: `Halte dich an <b>3-2-1</b> (3 Kopien, 2 Medien, 1 offsite). Automatisiere es (systemd-Timer statt „mache ich manuell“). Und — das Wichtigste — <b>stelle regelmäßig testweise wieder her</b>. Der schlimmste Moment, um zu merken, dass das Backup leer ist, ist nach dem Datenverlust.`,
    },
    { type: 'heading', text: 'Ordnung, die skaliert', color: '--cyan' },
    {
      type: 'prose',
      html: `<b>Konfiguration als Code:</b> Lege deine Dotfiles (<code>.bashrc</code>, <code>.gitconfig</code> …) in ein Git-Repo — so ist ein neuer Rechner in Minuten eingerichtet. <b>Idempotenz:</b> Skripte so schreiben, dass ein zweiter Lauf nichts kaputt macht (prüfen, ob etwas schon existiert, bevor du es anlegst). <b>Alles dokumentieren:</b> ein <code>README</code> im Projekt und Kommentare in Configs sind Geschenke an dein zukünftiges Ich.`,
    },
    { type: 'heading', text: 'Wenn etwas nicht läuft', color: '--purple' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Debugging-Reflexe',
          rows: [
            { key: 'systemctl status dienst', info: 'Läuft der Dienst? Was sagt er zuletzt?', why: 'Immer der erste Griff.' },
            { key: 'journalctl -u dienst -e', info: 'Die Logs des Dienstes, ans Ende gescrollt.', why: 'Die Fehlermeldung steht fast immer schon da.' },
            { key: 'journalctl -p err -b', info: 'Alle Fehler seit dem letzten Boot.', why: 'Der Gesundheits-Check des Systems.' },
            { key: 'ss -tulpn', info: 'Lauscht der Port, den du erwartest?', why: 'Klärt „Dienst läuft, aber nicht erreichbar“.' },
            { key: 'df -h  /  du -sh *', info: 'Ist die Platte voll?', why: 'Erstaunlich oft die wahre Ursache.' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Die richtige Denkweise',
      html: `Ändere <b>eine Sache</b> zur Zeit und teste dann. Lies die Fehlermeldung wirklich (sie sagt fast immer, was fehlt). Und bevor du einen Befehl aus dem Internet mit <code>sudo</code> ausführst: verstehe, was er tut. Genau das trennt jemanden, der Systeme betreibt, von jemandem, der hofft, dass sie laufen.`,
    },
  ],
};
