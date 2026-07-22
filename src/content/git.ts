import type { Topic } from '../types/content';

const kbd = (s: string) => `<span class="kbd">${s}</span>`;

export const git: Topic = {
  id: 'git',
  title: 'Git',
  icon: '🔀',
  level: 'advanced',
  category: 'werkzeuge',
  summary: 'Versionskontrolle verstehen: die drei Bereiche, der Alltag, Branches & Remotes.',
  blocks: [
    {
      type: 'prose',
      html: `<b class="hl-orange">Git</b> ist eine Zeitmaschine für deinen Code. Es speichert Schnappschüsse (<i>Commits</i>) deines Projekts, sodass du jederzeit zurückspringen, Änderungen vergleichen und parallel an mehreren Ideen arbeiten kannst. Fast die ganze Softwarewelt läuft darauf.`,
    },
    { type: 'heading', text: 'Die drei Bereiche', color: '--orange' },
    {
      type: 'lifecycle',
      stages: [
        { ico: '✏️', name: 'Working Dir', desc: 'Deine Dateien, wie du sie gerade bearbeitest.', via: 'git add' },
        { ico: '📋', name: 'Staging Area', desc: 'Was in den nächsten Commit soll — bewusst ausgewählt.', via: 'git commit' },
        { ico: '📦', name: 'Repository', desc: 'Die gespeicherte Historie aller Commits.', via: 'git push' },
        { ico: '☁️', name: 'Remote', desc: 'Die geteilte Kopie auf GitHub/GitLab.', via: 'git pull' },
      ],
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Warum eine Staging Area?',
      html: `Der Zwischenschritt <code>git add</code> lässt dich <b>auswählen</b>, was in einen Commit kommt. So kannst du zehn geänderte Dateien auf mehrere sinnvolle Commits aufteilen, statt alles in einen Klumpen zu werfen. Ein Commit sollte eine Sache tun.`,
    },
    { type: 'heading', text: 'Einen Commit-Befehl zerlegen', color: '--orange' },
    {
      type: 'breakdown',
      cmd: [
        { t: 'git', d: 'Das Versionskontroll-Werkzeug.' },
        { t: 'commit', d: 'Macht einen Schnappschuss von allem, was in der Staging Area liegt.' },
        { t: '-m', d: 'message: die Commit-Nachricht folgt direkt danach. Ohne -m öffnet Git deinen Editor (oft nvim!).' },
        { t: '"Login-Bug behoben"', d: 'Die Nachricht. Gute Nachrichten sind kurz, im Imperativ und erklären das WARUM, nicht nur das WAS.' },
      ],
    },
    { type: 'heading', text: 'Der tägliche Ablauf', color: '--orange' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Alltag',
          rows: [
            { key: 'git status', info: 'Was ist geändert, was ist gestaged?', why: 'Der Befehl, den du am häufigsten tippst. Im Zweifel: status.' },
            { key: `git add ${kbd('datei')}`, info: 'Datei in die Staging Area legen.', why: 'git add . nimmt alles. git add -p fragt Stück für Stück.' },
            { key: 'git commit -m "..."', info: 'Schnappschuss der Staging Area speichern.', why: 'Siehe die Zerlegung oben.' },
            { key: 'git log --oneline', info: 'Die Historie kompakt anschauen.', why: 'Jeder Commit eine Zeile, mit Kurz-Hash.' },
            { key: `git diff`, info: 'Was hat sich seit dem letzten Stand geändert?', why: 'Ohne Argument: ungestagte Änderungen.' },
          ],
        },
        {
          name: 'Branches',
          rows: [
            { key: `git switch -c ${kbd('feature')}`, info: 'Neuen Branch anlegen und hinwechseln.', why: 'Branches sind billig — für jede Idee einen.' },
            { key: `git switch ${kbd('main')}`, info: 'Zu einem bestehenden Branch wechseln.', why: 'Früher: git checkout. switch ist der neuere, klarere Befehl.' },
            { key: `git merge ${kbd('feature')}`, info: 'Einen Branch in den aktuellen einfließen lassen.', why: 'Führt zwei Entwicklungslinien zusammen.' },
            { key: 'git branch', info: 'Alle Branches auflisten.', why: 'Der aktuelle ist mit * markiert.' },
          ],
        },
        {
          name: 'Remote',
          rows: [
            { key: `git clone ${kbd('url')}`, info: 'Ein Repository von GitHub herunterladen.', why: 'Holt die komplette Historie, nicht nur die Dateien.' },
            { key: 'git pull', info: 'Änderungen vom Remote holen und einbauen.', why: 'Vor dem Loslegen: erst pullen.' },
            { key: 'git push', info: 'Deine Commits zum Remote hochladen.', why: 'Erst nach dem Commit. Beim ersten Mal: -u origin branch.' },
          ],
        },
        {
          name: 'Retten',
          rows: [
            { key: `git restore ${kbd('datei')}`, info: 'Ungespeicherte Änderungen einer Datei verwerfen.', why: 'Zurück zum letzten committeten Stand.' },
            { key: 'git commit --amend', info: 'Den letzten Commit nachträglich korrigieren.', why: 'Tippfehler in der Nachricht? Vergessene Datei? Kein Problem.' },
            { key: `git revert ${kbd('hash')}`, info: 'Einen Commit rückgängig machen (als neuer Commit).', why: 'Sicher, weil die Historie erhalten bleibt.' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'warn',
      title: 'Merksatz',
      html: `<code>git add</code> wählt aus, <code>git commit</code> speichert lokal, <code>git push</code> teilt. Diese drei Schritte sind der ganze Kern. Alles andere baut darauf auf. Und: committe früh und oft — kleine Commits sind leichter zu verstehen und zurückzunehmen.`,
    },
  ],
};
