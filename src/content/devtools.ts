import type { Topic } from '../types/content';

export const devtools: Topic = {
  id: 'devtools',
  title: 'Moderne CLI-Tools',
  icon: '🛠️',
  level: 'advanced',
  category: 'werkzeuge',
  summary: 'Die Werkzeuge, die Profis täglich nutzen: schneller suchen, springen, verstehen.',
  blocks: [
    {
      type: 'prose',
      html: `Die klassischen Unix-Werkzeuge (<code>grep</code>, <code>find</code>, <code>cat</code>, <code>ls</code>) funktionieren seit 40 Jahren. Eine neue Generation — meist in <b>Rust</b> oder <b>Go</b> geschrieben — macht dieselben Aufgaben schneller, bunter und angenehmer. Als Dev oder Admin sparst du damit jeden Tag echte Zeit. Klick bei jedem auf <b>Repo</b>, um den Code anzusehen.`,
    },
    { type: 'heading', text: 'Suchen & Finden', color: '--purple' },
    {
      type: 'tools',
      tools: [
        { name: 'ripgrep (rg)', tag: 'ersetzt grep', desc: 'Durchsucht ganze Projekte in Millisekunden, respektiert automatisch <code>.gitignore</code>. Der neue Standard zum Suchen im Code.', install: 'sudo apt install ripgrep', repo: 'https://github.com/BurntSushi/ripgrep' },
        { name: 'fd', tag: 'ersetzt find', desc: 'Dateien finden mit einfacher Syntax und schöner Ausgabe. <code>fd config</code> statt <code>find . -name "*config*"</code>.', install: 'sudo apt install fd-find', repo: 'https://github.com/sharkdp/fd' },
        { name: 'fzf', tag: 'Fuzzy-Finder', desc: 'Interaktives Filtern von allem — Dateien, History, Prozesse. In Kombination mit Strg+R ein Gamechanger.', install: 'sudo apt install fzf', repo: 'https://github.com/junegunn/fzf' },
        { name: 'zoxide', tag: 'ersetzt cd', desc: 'Merkt sich, wohin du oft wechselst. <code>z proj</code> springt direkt in dein Projekt, egal wo du bist.', install: 'sudo apt install zoxide', repo: 'https://github.com/ajeetdsouza/zoxide' },
      ],
    },
    { type: 'heading', text: 'Anschauen & Verstehen', color: '--purple' },
    {
      type: 'tools',
      tools: [
        { name: 'bat', tag: 'ersetzt cat', desc: 'Zeigt Dateien mit Syntax-Highlighting, Zeilennummern und Git-Markierungen. <code>cat</code> mit Superkräften.', install: 'sudo apt install bat', repo: 'https://github.com/sharkdp/bat' },
        { name: 'eza', tag: 'ersetzt ls', desc: 'Modernes <code>ls</code> mit Farben, Icons, Git-Status und Baum-Ansicht (<code>eza --tree</code>).', install: 'sudo apt install eza', repo: 'https://github.com/eza-community/eza' },
        { name: 'jq', tag: 'JSON', desc: 'Filtert und formt JSON auf der Kommandozeile. Unverzichtbar, sobald du mit APIs arbeitest: <code>curl … | jq .</code>.', install: 'sudo apt install jq', repo: 'https://github.com/jqlang/jq' },
        { name: 'tldr', tag: 'Hilfe', desc: 'Kurze Beispiele statt endloser man-pages. <code>tldr tar</code> zeigt sofort die fünf Befehle, die du wirklich brauchst.', install: 'sudo apt install tldr', repo: 'https://github.com/tldr-pages/tldr' },
      ],
    },
    { type: 'heading', text: 'System & Prozesse', color: '--purple' },
    {
      type: 'tools',
      tools: [
        { name: 'htop', tag: 'Prozesse', desc: 'Der beliebte interaktive Prozess-Monitor: farbige Balken, Prozesse per Tastendruck sortieren und beenden. Der Klassiker vor btop.', install: 'sudo apt install htop', repo: 'https://github.com/htop-dev/htop', homepage: 'https://htop.dev' },
        { name: 'btop', tag: 'ersetzt top', desc: 'Wunderschöner Ressourcen-Monitor: CPU, RAM, Netz, Prozesse — mit Maus-Bedienung und Graphen. Der modernere große Bruder von htop.', install: 'sudo apt install btop', repo: 'https://github.com/aristocratos/btop' },
        { name: 'tree', tag: 'Ordner', desc: 'Zeigt Verzeichnisse als übersichtlichen Baum. <code>tree -L 2</code> begrenzt die Tiefe, <code>tree -a</code> zeigt auch Verstecktes.', install: 'sudo apt install tree', homepage: 'https://gitlab.com/OldManProgrammer/unix-tree' },
        { name: 'ncdu', tag: 'Speicher', desc: 'Findet, was den Platz frisst: durchsuchbare Größen-Übersicht deiner Ordner. Der Retter bei „Disk voll“.', install: 'sudo apt install ncdu', repo: 'https://code.blicky.net/yorhel/ncdu' },
        { name: 'lazygit', tag: 'Git-UI', desc: 'Ein Terminal-Interface für Git: stagen, committen, branchen und rebasen per Tastendruck statt langer Befehle.', install: 'sudo apt install lazygit', repo: 'https://github.com/jesseduffield/lazygit' },
        { name: 'delta', tag: 'Git-Diffs', desc: 'Macht <code>git diff</code> lesbar: Syntax-Highlighting, Zeilennummern, Side-by-Side. Ein Muss für Code-Reviews im Terminal.', install: 'sudo apt install git-delta', repo: 'https://github.com/dandavison/delta' },
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Der Umstieg lohnt sich schrittweise',
      html: `Du musst nicht alles auf einmal lernen. Nimm dir <b>eins pro Woche</b> vor. Und lege dir Aliase in deiner <code>~/.bashrc</code> oder <code>~/.zshrc</code> an, z.B. <code>alias cat="bat"</code> oder <code>alias ls="eza"</code> — dann nutzt du die neuen Tools automatisch, ohne umzudenken.`,
    },
  ],
};
