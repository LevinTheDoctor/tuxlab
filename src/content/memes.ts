import type { Topic } from '../types/content';

export const memes: Topic = {
  id: 'memes',
  title: 'Absurditäten & Memes',
  icon: '🃏',
  level: 'basic',
  category: 'fun',
  summary: 'Die kuriosen, legendären und komischen Ecken der Linux-Welt.',
  blocks: [
    {
      type: 'prose',
      html: `Linux ist mächtig — aber die Community nimmt sich selten zu ernst. Weil jeder eine eigene Distro bauen darf, entstanden über die Jahre einige … <b>besondere</b> Projekte. Dazu ein paar Insider-Witze, die dir im Netz garantiert begegnen. Willkommen im Spaßteil. 🐧`,
    },
    { type: 'heading', text: 'Kuriose Distributionen', color: '--pink' },
    {
      type: 'tools',
      tools: [
        { name: 'Hannah Montana Linux', tag: 'legendär', desc: 'Ein echtes, komplett lilanes Kubuntu von 2009 — durchgestylt mit Hannah-Montana-Optik, Sounds und Wallpapers. Das Aushängeschild dafür, dass unter Linux <b>wirklich</b> alles möglich ist.', homepage: 'https://sourceforge.net/projects/hannahmontana/' },
        { name: 'TempleOS', tag: 'legendär', desc: 'Von Terry A. Davis <b>im Alleingang</b> gebaut: eigener Kernel, eigener Compiler, eigene Sprache (HolyC), 640×480. Kein Linux, aber ein ehrfurchtgebietendes Solo-Werk, das die Community bis heute respektiert.', homepage: 'https://templeos.org' },
        { name: 'Suicide Linux', tag: 'gefährlich', desc: 'Jeder <b>Tippfehler</b> auf der Kommandozeile wird zu <code>rm -rf /</code>. Ein Witz-Paket, das eindrucksvoll lehrt, warum man Befehle genau liest. Bitte nur in einer VM. 💀', homepage: 'https://qntm.org/suicide' },
        { name: 'Gentoo', tag: 'kult', desc: 'Real und ernst gemeint — aber du kompilierst <b>alles</b> selbst aus dem Quellcode. Der Running Gag: „Ich installiere noch, seit letztem Dienstag.“', homepage: 'https://www.gentoo.org' },
      ],
    },
    { type: 'heading', text: 'Klassische Memes & Lore', color: '--pink' },
    {
      type: 'callout',
      variant: 'info',
      title: '„I use Arch, btw.“',
      html: `Der wohl bekannteste Linux-Spruch. Arch-Nutzer wird nachgesagt, es in <b>jedes</b> Gespräch einzubauen — ob es passt oder nicht. Inzwischen liebevoll-ironisch von allen benutzt. Es gibt sogar T-Shirts.`,
    },
    {
      type: 'callout',
      variant: 'warn',
      title: 'Wie beende ich vim??',
      html: `Eine der meistgelesenen Fragen der Programmier-Geschichte auf Stack Overflow (über 3 Millionen Aufrufe). Die Rettung: <code>Esc</code>, dann <code>:q!</code>. Wir haben dir dafür ein ganzes Kapitel gebaut — und Tux hilft, falls du im Terminal <code>:q</code> tippst.`,
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Das Jahr des Linux-Desktops',
      html: `Seit den frühen 2000ern heißt es jedes Jahr, <b>„dieses“</b> Jahr sei endlich das Jahr, in dem Linux den Desktop erobert. Es ist zum liebevollen Dauer-Meme geworden. (Nebenbei: auf Servern, in der Cloud und in jedem Android-Handy hat Linux längst gewonnen.)`,
    },
    {
      type: 'callout',
      variant: 'danger',
      title: 'sudo rm -rf / — der Endgegner',
      html: `Der berühmteste „mach das <b>niemals</b>“-Befehl. Löscht (fast) alles. Er ist so berüchtigt, dass moderne Systeme ihn mit <code>--no-preserve-root</code> extra absichern. Probier ihn ruhig hier im Terminal — Tux stellt sich schützend davor.`,
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'xkcd: „sudo make me a sandwich“',
      html: `Der Comic-Klassiker: „Mach mir ein Sandwich.“ — „Nein.“ — „<b>sudo</b> mach mir ein Sandwich.“ — „Okay.“ Erklärt in zwei Sätzen, was <code>sudo</code> tut. Jeder Linux-Mensch kennt ihn.`,
    },
    { type: 'heading', text: 'Bonus: die ewigen Grabenkämpfe', color: '--pink' },
    {
      type: 'prose',
      html: `Nichts entfacht in Foren so schnell einen Streit wie diese Fragen: <b>vim oder Emacs?</b> · <b>systemd — Segen oder Sündenfall?</b> · <b>tabs oder spaces?</b> · <b>Ubuntu ist zu einfach / Arch ist zu kompliziert.</b> Der Running Gag: am Ende funktioniert bei allen dasselbe — sie streiten trotzdem gern. Willkommen in der Familie. 🐧`,
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Probier ein Easter Egg',
      html: `Tipp im Terminal <code>cowsay Hallo</code>, drück den <b>Konami-Code</b> (↑↑↓↓←→←→ b a) irgendwo, oder öffne die Palette (⌘/Strg+K) und tippe <code>man tux</code>. Es gibt noch mehr zu finden.`,
    },
  ],
};
