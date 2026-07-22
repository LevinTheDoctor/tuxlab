import type { Topic } from '../types/content';

const kbd = (s: string) => `<span class="kbd">${s}</span>`;

/** Eigene Images bauen und ganze Stacks starten: Dockerfile & Compose. */
export const dockerfileCompose: Topic = {
  id: 'dockerfile',
  title: 'Dockerfile & Compose',
  icon: '🏗️',
  level: 'advanced',
  category: 'werkzeuge',
  summary: 'Ein Dockerfile Zeile für Zeile schreiben, Layers & Cache verstehen, Multi-Stage — und der ganze Stack per compose.yml.',
  blocks: [
    {
      type: 'prose',
      html: `Ein <b class="hl-cyan">Dockerfile</b> ist das Rezept für ein Image: eine Textdatei mit Anweisungen, die Docker von oben nach unten abarbeitet. Jede Zeile beginnt mit einer <b>Instruktion</b> in Großbuchstaben (<code>FROM</code>, <code>COPY</code>, <code>RUN</code>, …) und beschreibt einen Bauschritt. Wer ein Dockerfile lesen kann, weiß exakt, was in einem Image steckt — und wer eins schreiben kann, verschifft seine Anwendung auf jeden Server der Welt. Genau das machen wir jetzt, am Beispiel einer kleinen Node.js-App.`,
    },

    { type: 'heading', text: 'Ein echtes Dockerfile, Zeile für Zeile', color: '--cyan' },
    {
      type: 'scriptSim',
      title: 'Dockerfile für eine Node.js-App — klick dich durch die Zeilen',
      script: [
        {
          line: 'FROM node:22-slim',
          explain: 'Jedes Image beginnt mit einem <b>Basis-Image</b>. <code>node:22-slim</code> bringt Node.js 22 auf einem abgespeckten Debian mit. Die Variante ist bewusst gewählt: <code>slim</code> ist ~200 MB kleiner als das volle Image. Immer eine konkrete Version pinnen — <code>FROM node</code> ohne Tag holt „latest“ und baut morgen etwas anderes als heute.',
        },
        {
          line: 'WORKDIR /app',
          explain: 'Setzt das Arbeitsverzeichnis für alle folgenden Befehle — wie ein dauerhaftes <code>cd</code>. Existiert <code>/app</code> nicht, wird es angelegt. Ohne WORKDIR läge alles wild in <code>/</code> herum.',
        },
        {
          line: 'COPY package*.json ./',
          explain: 'Kopiert NUR <code>package.json</code> und <code>package-lock.json</code> ins Image — noch nicht den restlichen Code! Das ist der wichtigste Trick im ganzen Dockerfile: solange sich diese Dateien nicht ändern, kann Docker den nächsten (teuren) Schritt aus dem Cache ziehen. Warum das so viel bringt, klärt der Abschnitt über Layers.',
        },
        {
          line: 'RUN npm ci --omit=dev',
          explain: '<code>RUN</code> führt einen Befehl <b>beim Bauen</b> aus, hier die Installation der Abhängigkeiten. <code>npm ci</code> installiert exakt die Versionen aus dem Lockfile (reproduzierbar!), <code>--omit=dev</code> lässt Entwicklungswerkzeuge weg — die haben in Produktion nichts verloren.',
        },
        {
          line: 'COPY . .',
          explain: 'Jetzt erst kommt der Anwendungscode ins Image (von deinem Ordner nach /app). Code ändert sich ständig — deshalb steht diese Zeile NACH der Installation: so wirft eine Codeänderung nur diesen billigen Schritt aus dem Cache, nicht das npm ci.',
        },
        {
          line: 'ENV NODE_ENV=production',
          explain: 'Setzt eine Umgebungsvariable, die auch im laufenden Container gilt. Viele Frameworks schalten damit Debug-Ausgaben ab und Optimierungen an.',
        },
        {
          line: 'EXPOSE 3000',
          explain: 'Reine <b>Dokumentation</b>: „diese App lauscht auf Port 3000“. Es öffnet KEINEN Port — das machst du beim Start mit <code>docker run -p 8080:3000</code>. Trotzdem hinschreiben: Menschen und Werkzeuge lesen es.',
        },
        {
          line: 'USER node',
          explain: 'Ab hier läuft alles als unprivilegierter User statt als root. Das Node-Basis-Image bringt den User <code>node</code> schon mit. Bricht jemand in die App ein, ist er nicht gleich root im Container — ein Muss für Produktion.',
        },
        {
          line: 'CMD ["node", "server.js"]',
          explain: 'Der Befehl, der <b>beim Start</b> des Containers läuft (nicht beim Bauen!). Die eckige-Klammer-Schreibweise („exec form“) ist die richtige: der Prozess läuft direkt als PID 1 und bekommt Signale wie das Stop-Signal sauber mit. Pro Dockerfile gilt nur das letzte CMD.',
        },
      ],
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'RUN vs. CMD — der Kern des Ganzen',
      html: `<code>RUN</code> passiert <b>einmal beim Bauen</b> und sein Ergebnis wird im Image eingefroren. <code>CMD</code> passiert <b>jedes Mal beim Starten</b> eines Containers. Merksatz: RUN backt den Kuchen, CMD serviert ihn.`,
    },
    {
      type: 'fileCards',
      cards: [
        {
          file: 'Dockerfile',
          perm: 'Rezept',
          desc: 'Das komplette Beispiel zum Kopieren. Liegt im Projektordner, gebaut wird mit docker build.',
          code: '<span class="c"># Basis: Node 22 auf schlankem Debian</span>\nFROM node:22-slim\nWORKDIR /app\n\n<span class="c"># Erst die Abhängigkeiten (Cache!)…</span>\nCOPY package*.json ./\nRUN npm ci --omit=dev\n\n<span class="c"># …dann der Code</span>\nCOPY . .\n\nENV NODE_ENV=production\nEXPOSE 3000\nUSER node\nCMD ["node", "server.js"]',
        },
        {
          file: '.dockerignore',
          perm: 'Filter',
          desc: 'Was NICHT ins Image kopiert werden soll. Ohne diese Datei schleppt COPY . . auch node_modules und .git mit.',
          code: 'node_modules\n.git\n*.log\n.env\n<span class="c"># .env draußen lassen: Geheimnisse gehören nicht ins Image</span>',
        },
      ],
    },
    { type: 'heading', text: 'Bauen und starten', color: '--cyan' },
    {
      type: 'breakdown',
      cmd: [
        { t: 'docker', d: 'Das Docker-Kommandozeilenwerkzeug.' },
        { t: 'build', d: 'Baut ein Image: liest das Dockerfile und führt Schritt für Schritt aus.' },
        { t: '-t meine-app:1.0', d: 'tag: gibt dem Image einen Namen und eine Version. Ohne -t bekommst du nur eine kryptische ID. meine-app:latest wäre der Default-Tag.' },
        { t: '.', d: 'Der Build-Kontext: dieser Ordner wird an Docker übergeben — hierin sucht es das Dockerfile, und nur was hier liegt, kann COPY kopieren. Der Punkt heißt „aktueller Ordner“.' },
      ],
    },
    {
      type: 'prose',
      html: `Danach existiert das Image lokal (<code>docker images</code>) und startet wie jedes andere: <code>docker run -d -p 8080:3000 --name app meine-app:1.0</code>. Im Browser: <code>localhost:8080</code>.`,
    },

    { type: 'heading', text: 'Die Instruktionen im Überblick', color: '--purple' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Basis',
          rows: [
            { key: `FROM ${kbd('image:tag')}`, info: 'Das Basis-Image — immer die erste Zeile.', why: 'Version pinnen (node:22-slim), nie blind latest.' },
            { key: `WORKDIR ${kbd('/app')}`, info: 'Arbeitsverzeichnis für alles Folgende.', why: 'Legt den Ordner bei Bedarf an. Besser als cd in RUN-Zeilen.' },
            { key: `COPY ${kbd('quelle ziel')}`, info: 'Dateien aus dem Build-Kontext ins Image kopieren.', why: 'Respektiert .dockerignore.' },
            { key: `ADD ${kbd('quelle ziel')}`, info: 'Wie COPY, kann zusätzlich URLs laden und Archive entpacken.', why: 'Genau deshalb: fast immer COPY nehmen — es tut nichts Überraschendes.' },
          ],
        },
        {
          name: 'Bauen',
          rows: [
            { key: `RUN ${kbd('befehl')}`, info: 'Befehl beim BAUEN ausführen (Pakete installieren, kompilieren).', why: 'Jedes RUN erzeugt einen Layer — verwandte Befehle mit && bündeln.' },
            { key: `ENV ${kbd('NAME=wert')}`, info: 'Umgebungsvariable — gilt beim Bauen UND im Container.', why: 'Konfiguration, die die App zur Laufzeit liest.' },
            { key: `ARG ${kbd('NAME')}`, info: 'Build-Variable — gilt NUR beim Bauen.', why: 'Von außen setzbar: docker build --build-arg NAME=x' },
          ],
        },
        {
          name: 'Starten',
          rows: [
            { key: 'CMD ["prog", "arg"]', info: 'Standard-Befehl beim Containerstart.', why: 'Von docker run überschreibbar: docker run image bash' },
            { key: 'ENTRYPOINT ["prog"]', info: 'Fester Start-Befehl; CMD/Argumente werden angehängt.', why: 'Für Images, die sich wie EIN Befehl verhalten sollen.' },
            { key: `EXPOSE ${kbd('port')}`, info: 'Dokumentiert den Lausch-Port.', why: 'Öffnet nichts — das tut erst -p beim run.' },
            { key: `USER ${kbd('name')}`, info: 'Ab hier als dieser User statt root.', why: 'Sicherheits-Grundregel für Produktions-Images.' },
            { key: 'HEALTHCHECK CMD curl -f …', info: 'Regelmäßiger Gesundheits-Test des Containers.', why: 'docker ps zeigt dann healthy/unhealthy statt nur „läuft“.' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'CMD vs. ENTRYPOINT — der Dauerbrenner',
      html: `Beide legen fest, was beim Start passiert. Der Unterschied zeigt sich bei <code>docker run image XYZ</code>: bei <b>CMD</b> ersetzt XYZ den Befehl komplett, bei <b>ENTRYPOINT</b> wird XYZ als <b>Argument angehängt</b>. Klassisches Duo: <code>ENTRYPOINT ["python"]</code> + <code>CMD ["app.py"]</code> — Standard ist <code>python app.py</code>, aber <code>docker run image anderes.py</code> startet stattdessen dieses.`,
    },

    { type: 'heading', text: 'Layers & Build-Cache: warum die Reihenfolge zählt', color: '--purple' },
    {
      type: 'prose',
      html: `Jede Instruktion erzeugt einen <b class="hl-orange">Layer</b> — eine eingefrorene Schicht des Dateisystems. Beim nächsten Build prüft Docker pro Zeile: „Hat sich hier etwas geändert?“ Wenn nein, nimmt es den Layer aus dem <b class="hl-green">Cache</b>, in Nullzeit. Aber: ändert sich <b>eine</b> Zeile, werden sie und <b>alle danach</b> neu gebaut. Daraus folgt die goldene Regel: <b>Stabiles nach oben, Flüchtiges nach unten.</b>`,
    },
    {
      type: 'lifecycle',
      stages: [
        { ico: '🧱', name: 'FROM node:22-slim', desc: 'Ändert sich fast nie — immer aus dem Cache.', via: 'ändert sich selten' },
        { ico: '📋', name: 'COPY package*.json + RUN npm ci', desc: 'Nur neu, wenn sich Abhängigkeiten ändern.', via: 'ändert sich ständig' },
        { ico: '📝', name: 'COPY . .', desc: 'Bei jeder Codeänderung neu — aber billig.' },
      ],
    },
    {
      type: 'callout',
      variant: 'warn',
      title: 'Das Anti-Pattern',
      html: `Steht <code>COPY . .</code> <b>vor</b> <code>RUN npm ci</code>, macht jede noch so kleine Codeänderung den Cache für die Installation kaputt — und jeder Build lädt alle Abhängigkeiten neu herunter. Minutenlanges Warten, selbst verschuldet. Die richtige Reihenfolge (erst Manifest, dann installieren, dann Code) macht aus 5 Minuten 5 Sekunden.`,
    },

    { type: 'heading', text: 'Multi-Stage: erst bauen, dann schlank ausliefern', color: '--purple' },
    {
      type: 'prose',
      html: `Zum <b>Bauen</b> einer App brauchst du Compiler, npm und tausend Pakete — zum <b>Ausliefern</b> nur das fertige Ergebnis. Ein <b class="hl-cyan">Multi-Stage-Build</b> nutzt deshalb mehrere <code>FROM</code>-Blöcke: die erste Stage baut, die zweite kopiert sich nur die Artefakte heraus. Alles aus Stage 1 fliegt am Ende weg — übrig bleibt ein Mini-Image.`,
    },
    {
      type: 'fileCards',
      cards: [
        {
          file: 'Dockerfile (Multi-Stage)',
          perm: '2 Stages',
          desc: 'Eine Vite/React-App: Stage 1 baut mit Node (~400 MB), ausgeliefert wird nur der statische Output per nginx (~50 MB).',
          code: '<span class="c"># ---- Stage 1: bauen ----</span>\nFROM node:22-slim AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n<span class="c"># ---- Stage 2: ausliefern ----</span>\nFROM nginx:alpine\nCOPY --from=build /app/dist /usr/share/nginx/html\nEXPOSE 80\n<span class="c"># CMD kommt vom nginx-Image — nichts weiter nötig</span>',
        },
      ],
    },
    {
      type: 'prose',
      html: `Der Schlüssel ist <code>COPY --from=build</code>: es bedient sich aus der benannten Stage (<code>AS build</code>) statt aus deinem Ordner. Node, npm, node_modules, Quellcode — nichts davon landet im finalen Image. Kleiner heißt: schneller verteilt, weniger Angriffsfläche, billiger gelagert.`,
    },

    { type: 'heading', text: 'Docker Compose: der ganze Stack in einer Datei', color: '--green' },
    {
      type: 'prose',
      html: `Echte Anwendungen bestehen selten aus einem Container: App + Datenbank + vielleicht ein Cache. Die alle von Hand mit <code>docker run</code>, Netzwerken und Volumes zu verkabeln, ist fehleranfällig und nicht reproduzierbar. <b class="hl-green">Docker Compose</b> beschreibt den ganzen Stack deklarativ in einer <code>compose.yml</code> — und <code>docker compose up</code> baut daraus Netzwerk, Volumes und Container in der richtigen Reihenfolge.`,
    },
    {
      type: 'fileCards',
      cards: [
        {
          file: 'compose.yml',
          perm: 'Stack',
          desc: 'App + PostgreSQL: die App wird aus dem Dockerfile im Ordner gebaut, die Datenbank kommt fertig — mit Volume, Healthcheck und geordneter Startreihenfolge.',
          code: 'services:\n  app:\n    build: .                    <span class="c"># baut das Dockerfile hier im Ordner</span>\n    ports:\n      - "8080:3000"             <span class="c"># Host:Container, wie bei docker run -p</span>\n    environment:\n      DATABASE_URL: postgres://app:geheim@db:5432/app\n    depends_on:\n      db:\n        condition: service_healthy  <span class="c"># warten, bis die DB WIRKLICH bereit ist</span>\n    restart: unless-stopped\n\n  db:\n    image: postgres:17          <span class="c"># fertiges Image, wird nicht gebaut</span>\n    environment:\n      POSTGRES_USER: app\n      POSTGRES_PASSWORD: geheim\n      POSTGRES_DB: app\n    volumes:\n      - dbdaten:/var/lib/postgresql/data  <span class="c"># überlebt jedes down/up</span>\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U app"]\n      interval: 5s\n      retries: 5\n\nvolumes:\n  dbdaten:                      <span class="c"># Named Volume, von Docker verwaltet</span>',
        },
      ],
    },
    {
      type: 'prose',
      html: `Das Wichtigste steckt zwischen den Zeilen: Compose legt automatisch ein <b>gemeinsames Netzwerk</b> an, in dem die Services einander <b>per Namen</b> erreichen — die App spricht die Datenbank einfach als <code>db:5432</code> an (siehe die URL oben). Kein Port-Freigeben nach außen nötig: <code>db</code> hat gar kein <code>ports:</code> und ist damit von außen unsichtbar. Nur die App ist erreichbar.`,
    },
    {
      type: 'breakdown',
      cmd: [
        { t: 'docker', d: 'Das Docker-CLI — Compose ist heute eingebaut (docker compose, mit Leerzeichen; das alte docker-compose mit Bindestrich ist die Vorgänger-Generation).' },
        { t: 'compose', d: 'Arbeitet mit dem Stack aus der compose.yml im aktuellen Ordner.' },
        { t: 'up', d: 'Legt Netzwerk, Volumes und Container an und startet alles in Abhängigkeits-Reihenfolge (erst db, dann app).' },
        { t: '-d', d: 'detached: im Hintergrund. Ohne -d siehst du alle Logs live — praktisch beim ersten Start.' },
        { t: '--build', d: 'Baut die eigenen Images vorher neu. Ohne das Flag nutzt Compose das zuletzt gebaute Image — Codeänderungen kämen nicht an!' },
      ],
    },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Compose-Alltag',
          rows: [
            { key: 'docker compose up -d', info: 'Stack starten (und bei Bedarf anlegen).', why: 'Mit --build, wenn sich Code geändert hat.' },
            { key: 'docker compose down', info: 'Stack stoppen, Container + Netzwerk entfernen.', why: 'Named Volumes bleiben — die Daten sind sicher.' },
            { key: 'docker compose down -v', info: 'Stack UND Volumes löschen.', why: 'Der Datenbank-Killer. Nur, wenn du es wirklich meinst.' },
            { key: `docker compose logs -f ${kbd('app')}`, info: 'Logs live, optional nur ein Service.', why: 'Ohne Servicename: alle bunt gemischt.' },
            { key: `docker compose exec ${kbd('db')} psql -U app`, info: 'Befehl in einem laufenden Service ausführen.', why: 'Wie docker exec, aber mit Servicenamen.' },
            { key: 'docker compose ps', info: 'Status aller Services des Stacks.', why: 'Zeigt auch den Healthcheck-Zustand.' },
            { key: 'docker compose pull', info: 'Neuere Versionen der Images holen.', why: 'Danach up -d — das Update-Duo für Server.' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Geheimnisse in die .env',
      html: `Passwörter gehören nicht in die compose.yml (die landet in Git!). Compose liest automatisch eine <code>.env</code>-Datei im selben Ordner: dort <code>POSTGRES_PASSWORD=geheim</code> hinterlegen und in der YAML mit <code>\${POSTGRES_PASSWORD}</code> referenzieren. Die <code>.env</code> kommt in die <code>.gitignore</code> — und in die <code>.dockerignore</code>.`,
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Best Practices in einer Zeile pro Stück',
      html: `Kleine Basis-Images nehmen (<code>slim</code>/<code>alpine</code>) · Versionen pinnen, nie <code>latest</code> in Produktion · <code>.dockerignore</code> pflegen · erst Abhängigkeits-Manifeste kopieren, dann installieren, dann Code · als <code>USER</code> ohne Root laufen · ein Prozess pro Container · Daten in Volumes, Konfiguration in Umgebungsvariablen, Geheimnisse in der <code>.env</code>.`,
    },
  ],
};
