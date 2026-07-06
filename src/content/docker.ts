import type { Topic } from '../types/content';

const kbd = (s: string) => `<span class="kbd">${s}</span>`;

export const docker: Topic = {
  id: 'docker',
  title: 'Docker',
  icon: '🐳',
  level: 'advanced',
  category: 'werkzeuge',
  summary: 'Image vs. Container, der Lifecycle und die Befehle, die du täglich brauchst.',
  blocks: [
    {
      type: 'prose',
      html: `<b class="hl-cyan">Docker</b> packt eine Anwendung samt allem, was sie braucht, in ein isoliertes Paket. Zwei Begriffe muss man auseinanderhalten: ein <b class="hl-orange">Image</b> ist der unveränderliche Bauplan, ein <b class="hl-green">Container</b> ist eine laufende Instanz davon. Aus einem Image kannst du beliebig viele Container starten.`,
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
  ],
};
