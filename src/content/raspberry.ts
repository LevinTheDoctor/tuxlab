import type { Topic } from '../types/content';

export const raspberry: Topic = {
  id: 'raspberry',
  title: 'Raspberry Pi & Projekte',
  icon: '🥧',
  level: 'basic',
  category: 'fun',
  summary: 'Ein Mini-Computer für ~50 €, Linux drauf — und ein Haufen Bastelideen.',
  blocks: [
    {
      type: 'prose',
      html: `Der <b class="hl-red">Raspberry Pi</b> ist ein kompletter Computer in Scheckkartengröße für rund 50 €. Darauf läuft <b>Raspberry Pi OS</b> (ein Debian-Abkömmling) — also alles, was du hier lernst, gilt genau so. Weil er wenig Strom braucht und Tag und Nacht durchlaufen kann, ist er <b>das</b> Einsteigergerät, um Linux <i>wirklich</i> zu benutzen statt nur zu lesen.`,
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'So kommst du rein',
      html: `Mit dem <b>Raspberry Pi Imager</b> schreibst du das Betriebssystem auf eine SD-Karte — dabei kannst du direkt SSH aktivieren und WLAN eintragen. Dann brauchst du <b>keinen Monitor</b>: du verbindest dich vom Laptop per <code>ssh pi@raspberrypi.local</code>. „Headless“ nennt man das. Dein ganzes tmux-, Docker- und Terminal-Wissen zahlt sich hier sofort aus.`,
    },
    { type: 'heading', text: 'Projektideen zum Loslegen', color: '--red' },
    {
      type: 'tools',
      tools: [
        { name: 'Pi-hole', tag: 'Netzwerk', desc: 'Ein Werbe- und Tracker-Blocker fürs <b>ganze</b> Heimnetz. Läuft als DNS-Server auf dem Pi — jedes Gerät im WLAN profitiert, ganz ohne App. Das beliebteste Pi-Projekt überhaupt.', install: 'curl -sSL https://install.pi-hole.net | bash', repo: 'https://github.com/pi-hole/pi-hole', homepage: 'https://pi-hole.net' },
        { name: 'Home Assistant', tag: 'Smart Home', desc: 'Steuert deine Smart-Home-Geräte lokal und herstellerübergreifend — ohne Cloud. Der Pi wird zur Zentrale für Licht, Heizung und Sensoren.', repo: 'https://github.com/home-assistant/core', homepage: 'https://www.home-assistant.io' },
        { name: 'RetroPie', tag: 'Gaming', desc: 'Verwandelt den Pi in eine Retro-Spielkonsole für Klassiker. Controller dran, Fernseher an — fertig ist der Emulator-Automat.', repo: 'https://github.com/RetroPie/RetroPie-Setup', homepage: 'https://retropie.org.uk' },
        { name: 'Nextcloud', tag: 'Cloud', desc: 'Deine eigene „Dropbox“ zu Hause: Dateien, Kalender und Kontakte auf deinem Pi statt bei einem Konzern. Datenschutz als Bastelprojekt.', repo: 'https://github.com/nextcloud/server', homepage: 'https://nextcloud.com' },
        { name: 'OctoPrint', tag: '3D-Druck', desc: 'Steuert und überwacht deinen 3D-Drucker übers Netzwerk, inklusive Webcam-Livebild. Ein Pi neben dem Drucker genügt.', repo: 'https://github.com/OctoPrint/OctoPrint', homepage: 'https://octoprint.org' },
        { name: 'Raspberry Pi Imager', tag: 'Setup', desc: 'Das offizielle Tool, um das OS auf die SD-Karte zu schreiben — mit SSH- und WLAN-Vorkonfiguration. Der Startpunkt für alles oben.', repo: 'https://github.com/raspberrypi/rpi-imager', homepage: 'https://www.raspberrypi.com/software/' },
      ],
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Warum das ein perfektes Lernprojekt ist',
      html: `Ein Homeserver auf dem Pi zwingt dich, alles anzuwenden: Dateien und Rechte, SSH, Dienste mit systemd, Docker-Container, Backups mit rsync und ein bisschen Netzwerk. Wenn etwas nicht läuft, debuggst du mit <code>journalctl</code> und <code>systemctl status</code> — genau die Reflexe aus dem Best-Practices-Kapitel. Kaputt machen kannst du wenig: im Zweifel SD-Karte neu beschreiben und weiter geht’s.`,
    },
  ],
};
