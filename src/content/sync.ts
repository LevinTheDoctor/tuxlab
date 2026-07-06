import type { Topic } from '../types/content';

export const sync: Topic = {
  id: 'sync',
  title: 'Sync & Backup',
  icon: '🔁',
  level: 'advanced',
  category: 'werkzeuge',
  summary: 'rsync, inotify und lsyncd: Dateien effizient kopieren und live spiegeln.',
  blocks: [
    {
      type: 'prose',
      html: `Dateien von A nach B bringen klingt trivial — bis es um 100 GB, laufende Änderungen oder ein entferntes Ziel geht. Drei Werkzeuge decken fast jeden Fall ab: <b class="hl-green">rsync</b> (schlau kopieren), <b class="hl-cyan">inotify</b> (Änderungen bemerken) und <b class="hl-purple">lsyncd</b> (die beiden verheiraten).`,
    },
    { type: 'heading', text: 'rsync — der Klassiker', color: '--green' },
    {
      type: 'prose',
      html: `<b>rsync</b> kopiert nur, was sich <b>geändert</b> hat (und sogar nur die geänderten <i>Teile</i> einer Datei). Ein zweiter Lauf über denselben Ordner ist deshalb blitzschnell. Es funktioniert lokal und über SSH — ideal für Backups auf einen Server.`,
    },
    {
      type: 'breakdown',
      cmd: [
        { t: 'rsync', d: 'Das Sync-Werkzeug: kopiert nur Unterschiede statt alles.' },
        { t: '-a', d: 'archive: kopiert rekursiv und erhält Rechte, Zeitstempel, Symlinks und Besitzer. Der Standard für Backups.' },
        { t: '-v', d: 'verbose: zeigt, welche Dateien übertragen werden.' },
        { t: '-z', d: 'komprimiert die Daten während der Übertragung — spart Bandbreite über SSH.' },
        { t: '--delete', d: 'löscht im Ziel, was in der Quelle nicht mehr existiert. Macht das Ziel zur exakten Kopie. Mit Vorsicht benutzen!' },
        { t: '~/projekte/', d: 'Die Quelle. Der Schrägstrich am Ende bedeutet „der INHALT von projekte“, nicht der Ordner selbst.' },
        { t: 'server:/backup/', d: 'Das Ziel über SSH: Benutzer@Host:/pfad. Ohne Doppelpunkt wäre es ein lokaler Pfad.' },
      ],
    },
    {
      type: 'callout',
      variant: 'warn',
      title: 'Der Schrägstrich-Fallstrick',
      html: `<code>rsync -a quelle/ ziel</code> kopiert den <b>Inhalt</b> von quelle nach ziel. <code>rsync -a quelle ziel</code> (ohne Slash) legt <b>quelle als Unterordner</b> in ziel an. Dieser eine Slash entscheidet über die Ordnerstruktur — immer erst mit <code>--dry-run</code> (Probelauf, ändert nichts) testen.`,
    },
    { type: 'heading', text: 'inotify — Änderungen bemerken', color: '--cyan' },
    {
      type: 'prose',
      html: `<b>inotify</b> ist eine Kernel-Funktion, die dir sofort meldet, wenn sich eine Datei ändert, entsteht oder gelöscht wird — ohne ständiges Nachschauen (Polling). Mit <code>inotify-tools</code> nutzt du das direkt in der Shell: <code>inotifywait -m ~/ordner</code> wartet und gibt jede Änderung live aus. So triggerst du Aktionen genau dann, wenn wirklich etwas passiert.`,
    },
    { type: 'heading', text: 'lsyncd — Live-Spiegelung', color: '--purple' },
    {
      type: 'prose',
      html: `<b>lsyncd</b> („Live Syncing Daemon“) kombiniert beide: es <b>lauscht per inotify</b> auf einen Ordner und startet bei jeder Änderung automatisch ein <b>rsync</b>. Ergebnis: ein Verzeichnis, das quasi in Echtzeit auf einen anderen Rechner gespiegelt wird. Perfekt, um z.B. einen Webordner ständig auf einen zweiten Server zu synchronisieren — ohne Cronjob, ohne Verzögerung.`,
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Wann welches Werkzeug?',
      html: `<b>Einmaliges/geplantes Backup</b> → rsync (evtl. per Cron oder systemd-Timer). <b>Nur auf Änderungen reagieren</b> (Build starten, neu laden) → inotifywait. <b>Ordner dauerhaft live spiegeln</b> → lsyncd. Für versionierte Backups mit Deduplizierung schau dir zusätzlich <code>restic</code> oder <code>borg</code> an.`,
    },
    { type: 'heading', text: 'Die Werkzeuge', color: '--green' },
    {
      type: 'tools',
      tools: [
        { name: 'rsync', tag: 'Kopieren', desc: 'Der De-facto-Standard für effizientes, inkrementelles Kopieren — lokal und über SSH.', install: 'sudo apt install rsync', repo: 'https://github.com/RsyncProject/rsync', homepage: 'https://rsync.samba.org' },
        { name: 'inotify-tools', tag: 'Watch', desc: 'Kommandozeilen-Zugang zu inotify: <code>inotifywait</code> und <code>inotifywatch</code> reagieren auf Dateisystem-Events.', install: 'sudo apt install inotify-tools', repo: 'https://github.com/inotify-tools/inotify-tools' },
        { name: 'lsyncd', tag: 'Live-Sync', desc: 'Spiegelt Verzeichnisse in Echtzeit, indem es inotify-Events sammelt und rsync anstößt.', install: 'sudo apt install lsyncd', repo: 'https://github.com/lsyncd/lsyncd' },
        { name: 'restic', tag: 'Backup', desc: 'Modernes Backup mit Verschlüsselung, Deduplizierung und Snapshots. Zielt auf lokale Platten oder Cloud.', install: 'sudo apt install restic', repo: 'https://github.com/restic/restic', homepage: 'https://restic.net' },
        { name: 'rclone', tag: 'Cloud', desc: '„rsync für die Cloud“: synct gegen 70+ Anbieter (S3, Drive, Nextcloud …) mit einer einheitlichen Syntax.', install: 'sudo apt install rclone', repo: 'https://github.com/rclone/rclone', homepage: 'https://rclone.org' },
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Die 3-2-1-Regel',
      html: `Gutes Backup heißt: <b>3</b> Kopien deiner Daten, auf <b>2</b> verschiedenen Medien, davon <b>1</b> außer Haus (offsite). Ein Sync ist noch kein Backup — wenn <code>--delete</code> einen Fehler mitspiegelt, ist er überall. Echte Backups haben <b>Versionen</b>, aus denen du zurückrollen kannst.`,
    },
  ],
};
