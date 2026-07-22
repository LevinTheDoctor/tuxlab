import type { Topic } from '../types/content';

const kbd = (s: string) => `<span class="kbd">${s}</span>`;

export const docker: Topic = {
  id: 'docker',
  title: 'Docker',
  icon: '🐳',
  level: 'advanced',
  category: 'werkzeuge',
  summary: 'Image vs. Container, der Lifecycle, Volumes & Netzwerke — und alle Alltagsbefehle.',
  blocks: [
    {
      type: 'prose',
      html: `<b class="hl-cyan">Docker</b> packt eine Anwendung samt allem, was sie braucht, in ein isoliertes Paket. Zwei Begriffe muss man auseinanderhalten: ein <b class="hl-orange">Image</b> ist der unveränderliche Bauplan, ein <b class="hl-green">Container</b> ist eine laufende Instanz davon. Aus einem Image kannst du beliebig viele Container starten.`,
    },
    {
      type: 'prose',
      html: `Ein Container ist dabei <b>keine</b> virtuelle Maschine: er bringt kein eigenes Betriebssystem mit, sondern teilt sich den <b class="hl-red">Kernel</b> des Hosts und wird nur sauber davon abgeschottet (Namespaces & cgroups). Deshalb startet er in Millisekunden statt Minuten:`,
    },
    {
      type: 'table',
      table: {
        headers: ['', 'Container (Docker)', 'Virtuelle Maschine'],
        rows: [
          ['Betriebssystem', 'teilt den Kernel des Hosts', 'bringt ein komplettes eigenes OS mit'],
          ['Start', 'Millisekunden', 'Minuten (bootet ein System)'],
          ['Größe', 'Megabytes', 'Gigabytes'],
          ['Isolation', 'Prozess-Ebene — gut, aber nicht absolut', 'Hardware-Ebene — stärker'],
          ['Typischer Einsatz', 'Dienste, Microservices, CI, Entwicklung', 'fremde Betriebssysteme, harte Trennung'],
        ],
      },
    },
    { type: 'heading', text: 'Vom Bauplan zum laufenden Container', color: '--cyan' },
    {
      type: 'lifecycle',
      stages: [
        { ico: '📄', name: 'Dockerfile', desc: 'Textrezept, wie das Image gebaut wird.', via: 'docker build' },
        { ico: '📦', name: 'Image', desc: 'Fertiger, unveränderlicher Bauplan.', via: 'docker run' },
        { ico: '🟢', name: 'Container (läuft)', desc: 'Laufende Instanz des Images.', via: 'docker stop' },
        { ico: '⏸️', name: 'Container (gestoppt)', desc: 'Angehalten, aber noch da.', via: 'docker rm' },
      ],
    },
    { type: 'heading', text: 'Einen docker run Befehl zerlegen', color: '--cyan' },
    {
      type: 'breakdown',
      cmd: [
        { t: 'docker', d: 'Das Docker-Kommandozeilenwerkzeug.' },
        { t: 'run', d: 'Erzeugt einen neuen Container aus einem Image und startet ihn sofort.' },
        { t: '-d', d: 'detached: der Container läuft im Hintergrund, dein Terminal bleibt frei. Ohne -d klebst du an der Ausgabe fest.' },
        { t: '-p 8080:80', d: 'Port-Mapping. Links dein Host-Port (8080), rechts der Port im Container (80). Im Browser erreichst du den Dienst dann über localhost:8080.' },
        { t: '--name web', d: "Gibt dem Container einen festen Namen. Ohne das vergibt Docker einen zufälligen wie 'nostalgic_tesla'." },
        { t: 'nginx', d: 'Das Image, aus dem der Container gebaut wird. Fehlt es lokal, lädt Docker es automatisch herunter.' },
      ],
    },
    { type: 'heading', text: 'Alle wichtigen Befehle', color: '--cyan' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Container',
          rows: [
            { key: 'docker ps', info: 'Laufende Container anzeigen.', why: 'docker ps -a zeigt auch die gestoppten.' },
            { key: `docker run ${kbd('image')}`, info: 'Container aus einem Image starten.', why: 'Siehe die Zerlegung oben für die Flags.' },
            { key: `docker stop ${kbd('name')}`, info: 'Laufenden Container sauber anhalten.', why: 'Gegenstück: docker start startet ihn wieder.' },
            { key: `docker rm ${kbd('name')}`, info: 'Gestoppten Container entfernen.', why: 'Muss vorher gestoppt sein.' },
            { key: `docker logs -f ${kbd('name')}`, info: 'Ausgaben eines Containers ansehen.', why: '-f folgt live, wie tail -f.' },
            { key: `docker exec -it ${kbd('name')} bash`, info: 'In einen laufenden Container hineinspringen.', why: '-it macht es interaktiv (Tastatur + Terminal).' },
            { key: `docker restart ${kbd('name')}`, info: 'Container neu starten.', why: 'stop + start in einem — der Klassiker nach Config-Änderungen.' },
            { key: `docker cp ${kbd('name')}:/pfad ziel`, info: 'Dateien zwischen Container und Host kopieren.', why: 'Funktioniert in beide Richtungen — wie cp mit Containernamen als Prefix.' },
          ],
        },
        {
          name: 'Images',
          rows: [
            { key: 'docker images', info: 'Lokal vorhandene Images auflisten.', why: 'Zeigt Größe und Tag.' },
            { key: `docker pull ${kbd('image')}`, info: 'Ein Image herunterladen.', why: 'Passiert bei run automatisch, wenn es fehlt.' },
            { key: `docker build -t ${kbd('name')} .`, info: 'Image aus einem Dockerfile bauen.', why: '-t vergibt Name und Tag, der Punkt ist der Build-Ordner.' },
            { key: `docker rmi ${kbd('image')}`, info: 'Ein Image löschen.', why: 'rmi = remove image.' },
          ],
        },
        {
          name: 'Compose',
          rows: [
            { key: 'docker compose up -d', info: 'Alle Dienste aus der compose.yml starten.', why: '-d = im Hintergrund. Der ganze Stack auf einen Schlag.' },
            { key: 'docker compose down', info: 'Dienste stoppen und aufräumen.', why: 'Entfernt Container und Netzwerke des Stacks.' },
            { key: 'docker compose logs -f', info: 'Logs aller Dienste zusammen live ansehen.', why: 'Ideal zum Debuggen, wenn ein Container zickt.' },
            { key: 'docker compose ps', info: 'Status der Dienste im Stack.', why: 'Zeigt, was läuft und was abgestürzt ist.' },
          ],
        },
        {
          name: 'Aufräumen',
          rows: [
            { key: 'docker system df', info: 'Speicherverbrauch von Docker anzeigen.', why: 'Zeigt, ob Images oder Volumes den Platz fressen.' },
            { key: 'docker system prune', info: 'Ungenutzte Container, Netzwerke und Images entfernen.', why: 'Achtung: löscht endgültig. Mit -a wird es noch gründlicher.' },
          ],
        },
      ],
    },

    { type: 'heading', text: 'Volumes: Daten, die den Container überleben', color: '--cyan' },
    {
      type: 'prose',
      html: `Container sind <b>Wegwerfware</b>: bei <code>docker rm</code> ist alles weg, was im Container geschrieben wurde. Daten, die bleiben sollen — Datenbanken, Uploads, Konfiguration — gehören in ein <b class="hl-green">Volume</b>: einen Speicherort außerhalb des Containers, den Docker in ihn hineinhängt. Zwei Spielarten:`,
    },
    {
      type: 'table',
      table: {
        headers: ['', 'Named Volume', 'Bind Mount'],
        rows: [
          ['Syntax', '<code>-v daten:/var/lib/postgresql</code>', '<code>-v ./config:/etc/app</code>'],
          ['Wo liegen die Daten?', 'Docker verwaltet sie (unter /var/lib/docker)', 'in genau DEM Host-Ordner, den du angibst'],
          ['Wofür?', 'Datenbanken, App-Daten — Produktion', 'Configs & Quellcode — Entwicklung, Live-Editieren'],
        ],
      },
    },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Volumes',
          rows: [
            { key: `docker run -v ${kbd('daten')}:/pfad …`, info: 'Named Volume beim Start einhängen.', why: 'Existiert das Volume nicht, legt Docker es an.' },
            { key: 'docker volume ls', info: 'Alle Volumes auflisten.', why: 'docker volume inspect zeigt, wo die Daten wirklich liegen.' },
            { key: 'docker volume prune', info: 'Verwaiste Volumes löschen.', why: 'Achtung: weg heißt weg — vorher docker volume ls lesen.' },
          ],
        },
        {
          name: 'Netzwerke',
          rows: [
            { key: 'docker network create meinnetz', info: 'Eigenes Netzwerk für zusammengehörige Container.', why: 'Grundlage dafür, dass Container einander finden.' },
            { key: `docker run --network meinnetz --name db …`, info: 'Container ins Netzwerk hängen.', why: 'Andere Container im selben Netz erreichen ihn dann als „db“.' },
            { key: 'docker network ls', info: 'Netzwerke auflisten.', why: 'bridge ist der Standard, host verzichtet auf Isolation.' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Container finden sich per Name',
      html: `Im selben (selbst angelegten) Netzwerk ist der <b>Containername der Hostname</b>: deine App erreicht die Datenbank einfach unter <code>db:5432</code> — Docker löst den Namen intern auf. IP-Adressen musst du nie anfassen. Genau dieses Muster automatisiert <a href="#/dockerfile">Docker Compose</a>.`,
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Weiter geht’s',
      html: `Bis hierhin hast du fertige Images benutzt. Der nächste Schritt ist, <b>eigene</b> zu bauen: im Thema <a href="#/dockerfile">Dockerfile &amp; Compose</a> schreibst du ein Dockerfile Zeile für Zeile, verstehst Layers und den Build-Cache und startest einen ganzen Stack mit einer einzigen Datei.`,
    },
  ],
};
