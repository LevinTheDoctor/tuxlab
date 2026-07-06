import type { Topic } from '../types/content';

export const history: Topic = {
  id: 'geschichte',
  title: 'Geschichte & Tux',
  icon: '📜',
  level: 'basic',
  category: 'kultur',
  summary: 'Von Unix über GNU zu Linux — und wie ein Pinguin zum Maskottchen wurde.',
  blocks: [
    {
      type: 'prose',
      html: `Linux fiel nicht vom Himmel. Es ist die Fortsetzung einer Idee, die 1969 in den Bell Labs begann: <b>Unix</b> — ein Betriebssystem, das aus kleinen, kombinierbaren Werkzeugen besteht und in dem <b>alles eine Datei</b> ist. Diese Philosophie steckt bis heute in jedem <code>ls | grep</code>, das du tippst.`,
    },
    { type: 'heading', text: 'Die Zeitleiste', color: '--purple' },
    {
      type: 'timeline',
      entries: [
        { year: '1969', title: 'Unix entsteht', text: 'Ken Thompson und Dennis Ritchie bauen in den <b>Bell Labs</b> Unix. Ab 1973 in <b>C</b> neu geschrieben — dadurch portierbar auf andere Hardware. Der Urknall.' },
        { year: '1983', title: 'GNU beginnt', text: 'Richard Stallman startet das <b>GNU-Projekt</b> („GNU\'s Not Unix“) für ein komplett freies Unix. Es entstehen die Werkzeuge (bash, gcc, coreutils) — nur der Kern fehlt noch.' },
        { year: '1991', title: 'Linux, der Kernel', text: 'Der Student <b>Linus Torvalds</b> postet in einer Newsgroup: „I\'m doing a (free) operating system (just a hobby, won\'t be big and professional…)“. Der <b>Linux-Kernel</b> ist geboren und verbindet sich mit den GNU-Tools zu <b>GNU/Linux</b>.' },
        { year: '1993', title: 'Debian & Slackware', text: 'Die ersten <b>Distributionen</b> bündeln Kernel + Tools + Paketverwaltung zu einem installierbaren System. Debian legt den Grundstein für Ubuntu & Co.' },
        { year: '1996', title: 'Tux erscheint', text: 'Linux bekommt ein Maskottchen — mehr dazu gleich unten. 🐧' },
        { year: '2004', title: 'Ubuntu macht Linux alltagstauglich', text: 'Canonical bringt <b>Ubuntu</b>: Debian, aber poliert und mit festem Release-Rhythmus. Linux auf dem Desktop wird für Normalsterbliche machbar.' },
        { year: '2008', title: 'Android = Linux in der Tasche', text: 'Android baut auf dem Linux-Kernel auf. Seitdem trägt fast jeder Mensch einen Linux-Kernel mit sich herum, ohne es zu wissen.' },
        { year: 'heute', title: 'Linux ist überall', text: 'Server, Cloud, Supercomputer (alle Top-500 laufen auf Linux), Router, Autos, das James-Webb-Teleskop. Nur auf dem Desktop bleibt es die neugierige Minderheit — zu der du jetzt gehörst.' },
      ],
    },
    { type: 'heading', text: 'Die Geschichte von Tux 🐧', color: '--purple' },
    {
      type: 'prose',
      html: `1996 suchte die Linux-Community ein Maskottchen. <b>Linus Torvalds</b> mochte Pinguine — angeblich, weil ihn im Zoo von Canberra ein kleiner Pinguin gebissen hatte („Penguinitis“, scherzte er). <b>Larry Ewing</b> zeichnete daraufhin den runden, zufriedenen Pinguin in <b>GIMP</b> (dem freien Photoshop). Den Namen <b>Tux</b> schlug James Hughes vor — als „<b>T</b>orvalds <b>U</b>ni<b>x</b>“ und weil Pinguine aussehen, als trügen sie einen Smoking (englisch <i>tuxedo</i>).`,
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Warum ein Pinguin und kein Drache?',
      html: `Tux ist bewusst <b>freundlich und satt</b> — ein Pinguin, der gerade gut gegessen hat. Das passt zur Kultur: Linux soll einladend wirken, nicht bedrohlich. Und weil Larry Ewing das Bild frei zur Verfügung stellte, darf es jeder benutzen. Genau wie Linux selbst. Du findest ihn hier oben in der Seitenleiste — klick ihn an.`,
    },
    { type: 'heading', text: 'Warum das für dich zählt', color: '--purple' },
    {
      type: 'prose',
      html: `Zwei Dinge aus dieser Geschichte begegnen dir täglich: <b>1)</b> „GNU/Linux“ heißt, dass das, was du bedienst, aus <b>zwei Teilen</b> besteht — dem Kernel (Linux) und den Werkzeugen (GNU). <b>2)</b> Fast alles ist <b>Open Source</b>: du darfst den Quellcode lesen, ändern und weitergeben. Deshalb kannst du bei jedem Werkzeug in dieser App auf „Repo“ klicken und den echten Code auf GitHub anschauen. Das ist kein Zufall — es ist das Grundprinzip.`,
    },
  ],
};
