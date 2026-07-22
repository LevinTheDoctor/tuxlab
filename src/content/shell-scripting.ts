import type { Topic } from '../types/content';

export const shellScripting: Topic = {
  id: 'shell-scripting',
  title: 'Shell-Scripting',
  icon: '📜',
  level: 'advanced',
  category: 'werkzeuge',
  summary: 'Shebang, Variablen, if/for/while, Funktionen, Exit-Codes — erklärt und simuliert.',
  blocks: [
    {
      type: 'prose',
      html: `Ein <b>Shell-Skript</b> ist einfach eine Textdatei mit Befehlen, die die Shell nacheinander abarbeitet. Alles, was du im Terminal tippst, kannst du in ein Skript schreiben — und damit wiederholbar machen. Genau so entsteht Automatisierung: einmal geschrieben, tausendmal ausgeführt.`,
    },
    { type: 'heading', text: 'Das Grundgerüst: Shebang & Ausführbarkeit', color: '--orange' },
    {
      type: 'prose',
      html: `Die erste Zeile <code>#!/bin/bash</code> heißt <b>Shebang</b>. Sie sagt dem System, mit welchem Programm die Datei ausgeführt werden soll. Danach machst du das Skript mit <code>chmod +x skript.sh</code> ausführbar und startest es mit <code>./skript.sh</code>.`,
    },
    {
      type: 'scriptSim',
      title: 'hallo.sh',
      interactive: true,
      script: [
        { line: '#!/bin/bash', explain: '<b>Shebang.</b> Muss die allererste Zeile sein. Nach dem Ausführen entscheidet sie: „führe mich mit /bin/bash aus“.', output: '' },
        { line: '# Ein Kommentar erklärt, was passiert', explain: 'Alles nach <code>#</code> ignoriert die Shell. Kommentare sind für Menschen, nicht für den Computer.', output: '' },
        { line: 'name="Tux"', explain: '<b>Variable zuweisen.</b> Wichtig: KEINE Leerzeichen um das <code>=</code>. <code>name = "Tux"</code> wäre ein Fehler.', output: '' },
        { line: 'echo "Hallo, $name!"', explain: 'Mit <code>$name</code> holst du den Wert wieder heraus. In doppelten Anführungszeichen wird die Variable ersetzt.', output: 'Hallo, Tux!' },
        { line: "echo 'Hallo, $name!'", explain: 'In EINFACHEN Anführungszeichen wird NICHTS ersetzt — der Text bleibt wörtlich. Ein häufiger Stolperstein.', output: 'Hallo, $name!' },
      ],
    },
    { type: 'heading', text: 'Variablen & Eingaben', color: '--orange' },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Variablen',
          rows: [
            { key: 'name="Tux"', info: 'Zuweisen — ohne Leerzeichen ums =.', why: 'Namen ohne $, Zugriff mit $.' },
            { key: 'echo "$name"', info: 'Wert benutzen, immer in Anführungszeichen.', why: 'Schützt vor Problemen mit Leerzeichen.' },
            { key: 'echo "${name}s"', info: 'Geschweifte Klammern grenzen den Namen ab.', why: 'Nötig, wenn direkt Text folgt.' },
            { key: 'pfad=$(pwd)', info: 'Ausgabe eines Befehls in eine Variable.', why: 'Command Substitution mit $( ).' },
          ],
        },
        {
          name: 'Argumente',
          rows: [
            { key: '$1 $2 $3', info: 'Die Argumente beim Aufruf des Skripts.', why: './backup.sh /home nutzt $1 = /home.' },
            { key: '$0', info: 'Der Name des Skripts selbst.', why: 'Nützlich in Fehlermeldungen.' },
            { key: '$#', info: 'Anzahl der übergebenen Argumente.', why: 'Zum Prüfen, ob genug mitgegeben wurde.' },
            { key: '$?', info: 'Exit-Code des letzten Befehls.', why: '0 = ok, alles andere = Fehler.' },
          ],
        },
      ],
    },
    { type: 'heading', text: 'Bedingungen: if & test', color: '--orange' },
    {
      type: 'prose',
      html: `Mit <code>if</code> triffst du Entscheidungen. Die Bedingung ist meist ein <code>test</code>, kurz geschrieben als <code>[ ... ]</code>. <b>Die Leerzeichen innerhalb der Klammern sind Pflicht.</b>`,
    },
    {
      type: 'scriptSim',
      title: 'pruefen.sh',
      interactive: true,
      script: [
        { line: '#!/bin/bash', explain: 'Wie immer: Shebang zuerst.', output: '' },
        { line: 'datei="notizen.txt"', explain: 'Wir merken uns einen Dateinamen in einer Variable.', output: '' },
        { line: 'if [ -f "$datei" ]; then', explain: '<code>-f</code> prüft: existiert diese Datei? Die eckigen Klammern sind das Kommando <code>test</code>. Achte auf die Leerzeichen!', output: '' },
        { line: '  echo "$datei existiert."', explain: 'Dieser Zweig läuft nur, wenn der Test wahr war (Exit-Code 0). Einrückung ist Kosmetik, aber hilft beim Lesen.', output: 'notizen.txt existiert.' },
        { line: 'else', explain: 'Sonst-Zweig — läuft, wenn die Datei fehlt.', output: '' },
        { line: '  echo "$datei fehlt!"', explain: 'Würde hier stehen, wenn die Datei nicht existierte.', output: '' },
        { line: 'fi', explain: '<code>fi</code> (if rückwärts) schließt den if-Block ab. Genauso schließt <code>done</code> Schleifen.', output: '' },
      ],
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Die wichtigsten Tests',
      html: `<code>-f</code> Datei existiert · <code>-d</code> Ordner existiert · <code>-e</code> existiert (egal was) · <code>-z</code> String ist leer · <code>=</code> Strings gleich · <code>-eq -lt -gt</code> Zahlen vergleichen. Beispiel: <code>[ "$a" -gt 10 ]</code>.`,
    },
    { type: 'heading', text: 'Schleifen: for & while', color: '--orange' },
    {
      type: 'scriptSim',
      title: 'schleife.sh',
      interactive: true,
      script: [
        { line: '#!/bin/bash', explain: 'Shebang.', output: '' },
        { line: 'for i in 1 2 3; do', explain: '<code>for</code> läuft über eine Liste von Wörtern. <code>i</code> nimmt nacheinander jeden Wert an. <code>do</code> beginnt den Schleifenkörper.', output: '' },
        { line: '  echo "Durchlauf $i"', explain: 'Wird für jeden Wert einmal ausgeführt — hier also dreimal.', output: 'Durchlauf 1\nDurchlauf 2\nDurchlauf 3' },
        { line: 'done', explain: '<code>done</code> schließt die Schleife. Fertig.', output: '' },
      ],
    },
    { type: 'heading', text: 'Ein echtes Beispiel: Backup-Skript', color: '--orange' },
    {
      type: 'scriptSim',
      title: 'backup.sh',
      script: [
        { line: '#!/bin/bash', explain: 'Shebang.', output: '' },
        { line: 'set -e', explain: '<b>Best Practice.</b> Bricht das Skript sofort ab, wenn ein Befehl fehlschlägt. Verhindert, dass ein halb kaputtes Skript weiterläuft.', output: '' },
        { line: 'quelle="$HOME/projekte"', explain: 'Die Variable, die wir sichern wollen. <code>$HOME</code> ist dein Home-Verzeichnis.', output: '' },
        { line: 'datum=$(date +%F)', explain: 'Command Substitution: <code>date +%F</code> liefert das heutige Datum wie 2026-07-06. Das landet in <code>$datum</code>.', output: '' },
        { line: 'ziel="/backup/projekte-$datum.tar.gz"', explain: 'Wir bauen den Zielnamen mit dem Datum zusammen — so überschreibt sich kein Backup.', output: '' },
        { line: 'if [ ! -d "$quelle" ]; then', explain: '<code>!</code> kehrt den Test um: „wenn der Quellordner NICHT existiert“. Erst prüfen, dann handeln.', output: '' },
        { line: '  echo "Quelle fehlt: $quelle" >&2', explain: '<code>&gt;&amp;2</code> schickt die Meldung auf stderr (Fehlerkanal), nicht in die normale Ausgabe.', output: 'Quelle fehlt: /home/levin/projekte' },
        { line: '  exit 1', explain: '<code>exit 1</code> beendet das Skript mit Fehler-Code 1. 0 wäre Erfolg. So merkt der Aufrufer, dass etwas schiefging.', output: '' },
        { line: 'fi', explain: 'Ende des if-Blocks.', output: '' },
        { line: 'tar -czf "$ziel" "$quelle"', explain: 'Das eigentliche Backup: <code>tar</code> packt den Ordner in ein komprimiertes Archiv. <code>-c</code> create, <code>-z</code> gzip, <code>-f</code> Datei.', output: '' },
        { line: 'echo "Backup fertig: $ziel"', explain: 'Erfolg melden. Ein gutes Skript sagt, was es getan hat.', output: 'Backup fertig: /backup/projekte-2026-07-06.tar.gz' },
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Best Practices für robuste Skripte',
      html: `Beginne mit <code>set -euo pipefail</code> (abbrechen bei Fehlern, unbekannten Variablen und kaputten Pipes). Setze Variablen immer in <code>"$anführungszeichen"</code>. Prüfe Eingaben, bevor du sie benutzt. Und teste mit <code>shellcheck skript.sh</code> — ein Linter, der die typischen Fallen findet.`,
    },
    { type: 'heading', text: 'Freies Terminal — schreib selbst', color: '--green' },
    {
      type: 'terminal',
      intro: '# Probier Skript-Zeilen direkt: name="Tux"; echo "Hi $name" — oder: for i in a b c; do echo $i; done',
    },
  ],
};
