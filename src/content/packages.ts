import type { Topic } from '../types/content';

const kbd = (s: string) => `<span class="kbd">${s}</span>`;

export const packages: Topic = {
  id: 'pakete',
  title: 'Pakete & Software',
  icon: '📦',
  level: 'intermediate',
  category: 'system',
  summary: 'Wie Software auf Linux kommt: apt, Snap/Flatpak, AppImage — und wo der Code herkommt.',
  blocks: [
    {
      type: 'prose',
      html: `Unter Linux lädst du Software fast nie als „.exe von einer Website“. Stattdessen holst du sie aus einem <b>Repository</b> über einen <b>Paketmanager</b>. Der Vorteil: alles ist signiert, geprüft, und ein einziger Befehl aktualisiert dein <b>ganzes</b> System auf einmal — inklusive aller Programme.`,
    },
    { type: 'heading', text: 'Der klassische Weg: apt (Ubuntu/Debian)', color: '--cyan' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Alltag',
          rows: [
            { key: 'sudo apt update', info: 'Paketlisten aktualisieren (was gibt es Neues?).', why: 'Immer ZUERST, bevor du installierst.' },
            { key: 'sudo apt upgrade', info: 'Alle installierten Pakete aktualisieren.', why: 'Der wöchentliche Wartungs-Befehl.' },
            { key: `sudo apt install ${kbd('paket')}`, info: 'Software installieren.', why: 'Abhängigkeiten kommen automatisch mit.' },
            { key: `sudo apt remove ${kbd('paket')}`, info: 'Software entfernen.', why: 'purge löscht auch die Konfiguration mit.' },
            { key: `apt search ${kbd('begriff')}`, info: 'Nach einem Paket suchen.', why: 'apt show paket zeigt Details.' },
            { key: 'sudo apt autoremove', info: 'Nicht mehr benötigte Abhängigkeiten aufräumen.', why: 'Hält das System schlank.' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'apt vs. dpkg',
      html: `<code>dpkg</code> ist das nackte Werkzeug, das einzelne <code>.deb</code>-Dateien installiert — kümmert sich aber nicht um Abhängigkeiten. <code>apt</code> ist die kluge Schicht darüber: es löst Abhängigkeiten auf und holt alles aus den Repositories. Im Alltag nutzt du fast immer <code>apt</code>.`,
    },
    { type: 'heading', text: 'Die neuen Universal-Formate', color: '--cyan' },
    {
      type: 'table',
      table: {
        headers: ['Format', 'Idee', 'Stärke', 'Schwäche'],
        rows: [
          ['<b>Snap</b>', 'Paket + alle Abhängigkeiten, sandboxed (Canonical)', 'Auto-Updates, distro-übergreifend', 'Größer, langsamer Start, ein Store'],
          ['<b>Flatpak</b>', 'Sandboxed Apps über Flathub', 'Distro-neutral, gute Sandbox, offen', 'Braucht Laufzeiten, viel Speicher'],
          ['<b>AppImage</b>', 'Eine Datei = die ganze App', 'Kein Install: <code>chmod +x</code>, doppelklick', 'Keine Auto-Updates, keine Sandbox'],
        ],
      },
    },
    {
      type: 'prose',
      html: `Faustregel: <b>System-Werkzeuge</b> aus <code>apt</code>/<code>dnf</code>, <b>große Desktop-Apps</b> (Browser, IDEs) gern als Flatpak, und ein schnelles Tool zum Ausprobieren als AppImage. Für Entwickler-Umgebungen gibt es zusätzlich Sprach-eigene Manager wie <code>pip</code> (Python), <code>npm</code> (Node) oder <code>cargo</code> (Rust).`,
    },
    { type: 'heading', text: 'Flatpak in der Praxis', color: '--cyan' },
    {
      type: 'prose',
      html: `<b>Flatpak</b> löst ein altes Linux-Problem: eine App läuft auf <b>jeder</b> Distro gleich, weil sie ihre Abhängigkeiten (eine gemeinsame „<b>Runtime</b>“) selbst mitbringt. Dazu kommt eine <b>Sandbox</b> — jede App läuft abgeschottet und darf nur, was du ihr erlaubst (Zugriff auf Dateien, Kamera, Netzwerk). Der große Store dahinter heißt <b>Flathub</b>.`,
    },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Flatpak',
          rows: [
            { key: 'flatpak remote-add --if-not-exists flathub …', info: 'Einmalig Flathub als Quelle hinzufügen.', why: 'Danach hast du Zugriff auf tausende Apps.' },
            { key: `flatpak install flathub ${kbd('org.gimp.GIMP')}`, info: 'Eine App per ihrer App-ID installieren.', why: 'Die ID findest du auf flathub.org.' },
            { key: `flatpak run ${kbd('org.gimp.GIMP')}`, info: 'Eine Flatpak-App starten.', why: 'Im Menü taucht sie meist ganz normal auf.' },
            { key: 'flatpak update', info: 'Alle Flatpak-Apps aktualisieren.', why: 'Getrennt von apt — beides regelmäßig laufen lassen.' },
            { key: 'flatpak list', info: 'Installierte Flatpaks und Runtimes anzeigen.', why: 'flatpak uninstall --unused räumt alte Runtimes weg.' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Die Sandbox verstehen',
      html: `Eine Flatpak-App sieht standardmäßig <b>nicht</b> dein ganzes Dateisystem — das ist gewollt und sicher. Wenn ein Programm plötzlich einen Ordner „nicht findet“, fehlt ihm die Berechtigung. Mit dem Tool <b>Flatseal</b> (grafisch) oder <code>flatpak override</code> gibst du gezielt Zugriff frei, z.B. auf <code>~/Downloads</code>.`,
    },
    {
      type: 'tools',
      tools: [
        { name: 'Flatseal', tag: 'Berechtigungen', desc: 'Grafisches Werkzeug, um die Sandbox-Rechte deiner Flatpak-Apps zu sehen und anzupassen (Dateizugriff, Netzwerk, Geräte).', install: 'flatpak install flathub com.github.tchx84.Flatseal', repo: 'https://github.com/tchx84/Flatseal' },
      ],
    },
    { type: 'heading', text: 'Praktische native Software', color: '--cyan' },
    {
      type: 'tools',
      tools: [
        { name: 'OCRmyPDF', tag: 'PDF/OCR', desc: 'Macht gescannte PDFs durchsuchbar, indem es eine unsichtbare Textschicht per OCR hinzufügt. Ein Befehl, riesiger Nutzen.', install: 'sudo apt install ocrmypdf', repo: 'https://github.com/ocrmypdf/OCRmyPDF' },
        { name: 'Flatpak', tag: 'Pakete', desc: 'Der Standard für sandboxed Desktop-Apps. Nach der Einrichtung ziehst du Software von <b>Flathub</b>.', install: 'sudo apt install flatpak', repo: 'https://github.com/flatpak/flatpak', homepage: 'https://flathub.org' },
        { name: 'yt-dlp', tag: 'Download', desc: 'Lädt Videos und Audio von tausenden Seiten. Der aktiv gepflegte Nachfolger von youtube-dl.', install: 'sudo apt install yt-dlp', repo: 'https://github.com/yt-dlp/yt-dlp' },
        { name: 'ImageMagick', tag: 'Bilder', desc: 'Bilder von der Kommandozeile konvertieren, skalieren, beschneiden. <code>convert bild.png bild.jpg</code>.', install: 'sudo apt install imagemagick', homepage: 'https://imagemagick.org' },
        { name: 'Pandoc', tag: 'Dokumente', desc: 'Das Schweizer Taschenmesser für Dokumente: Markdown → PDF, DOCX, HTML und zurück.', install: 'sudo apt install pandoc', repo: 'https://github.com/jgm/pandoc', homepage: 'https://pandoc.org' },
        { name: 'FFmpeg', tag: 'Video/Audio', desc: 'Der Standard für alles mit Video und Audio: konvertieren, schneiden, streamen. Läuft unter fast jeder Media-Software.', install: 'sudo apt install ffmpeg', homepage: 'https://ffmpeg.org' },
      ],
    },
  ],
};
