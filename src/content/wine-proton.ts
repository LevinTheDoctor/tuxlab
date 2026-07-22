import type { Topic } from '../types/content';

const kbd = (s: string) => `<span class="kbd">${s}</span>`;

export const wineProton: Topic = {
  id: 'wine-proton',
  title: 'Wine, Proton & Gaming',
  icon: '🍷',
  level: 'advanced',
  category: 'werkzeuge',
  summary: 'Windows-Programme und Spiele unter Linux laufen lassen — ohne Windows.',
  blocks: [
    {
      type: 'prose',
      html: `„Aber mein Programm/Spiel gibt es nur für Windows.“ — Muss kein Hindernis sein. <b class="hl-red">Wine</b> übersetzt Windows-Aufrufe live in Linux-Aufrufe, sodass viele <code>.exe</code>-Dateien einfach laufen. Und <b class="hl-purple">Proton</b> (von Valve) macht daraus eine der Hauptarten, wie Millionen Menschen heute unter Linux zocken.`,
    },
    {
      type: 'callout',
      variant: 'info',
      title: 'Wine ist KEIN Emulator',
      html: `Der Name steht für „<b>W</b>ine <b>I</b>s <b>N</b>ot an <b>E</b>mulator“. Es wird kein Windows nachgebaut und nichts emuliert. Wine ist eine <b>Kompatibilitätsschicht</b>: es fängt die Anfragen eines Windows-Programms ab und beantwortet sie mit Linux-Bordmitteln. Deshalb läuft es oft <b>fast ohne Geschwindigkeitsverlust</b>.`,
    },
    { type: 'heading', text: 'Vom Programm zum Spiel', color: '--purple' },
    {
      type: 'lifecycle',
      stages: [
        { ico: '🍷', name: 'Wine', desc: 'Übersetzt Windows-API → Linux. Die Basis für alles.', via: 'baut auf' },
        { ico: '🎮', name: 'Proton', desc: 'Valves Wine-Fork, optimiert für Spiele.', via: 'steckt in' },
        { ico: '🚂', name: 'Steam Play', desc: 'Ein Klick auf „Installieren“, Proton läuft im Hintergrund.', via: 'ergänzt durch' },
        { ico: '🗃️', name: 'Lutris / Bottles', desc: 'Verwalten Nicht-Steam-Spiele & Windows-Apps.', via: '' },
      ],
    },
    { type: 'heading', text: 'Die Bausteine erklärt', color: '--purple' },
    {
      type: 'prose',
      html: `<b>Proton</b> bündelt Wine plus <b>DXVK</b>/<b>VKD3D</b> — Übersetzer, die Windows-Grafik (DirectX) in <b>Vulkan</b> umwandeln, das Grafikformat von Linux. Genau das bringt bei Spielen die Leistung. In den Steam-Einstellungen aktivierst du „<b>Steam Play für alle Titel</b>“, und plötzlich lassen sich auch Windows-only-Spiele installieren. Ob ein bestimmtes Spiel läuft, verrät dir die Community-Datenbank <b>ProtonDB</b> (mit Gold/Platin-Bewertungen).`,
    },
    {
      type: 'cheatsheet',
      categories: [
        {
          name: 'Wine',
          rows: [
            { key: 'sudo apt install wine', info: 'Wine installieren.', why: 'Danach lassen sich viele .exe direkt starten.' },
            { key: `wine ${kbd('setup.exe')}`, info: 'Ein Windows-Programm ausführen.', why: 'Der einfachste Fall — doppelklick geht oft auch.' },
            { key: 'winecfg', info: 'Wine konfigurieren (Windows-Version, Laufwerke).', why: 'Jede App lebt in einem eigenen „Prefix“ (Wine-Ordner).' },
            { key: 'WINEPREFIX=~/mein-spiel wine …', info: 'Eine App in einen eigenen Prefix sperren.', why: 'Verhindert, dass sich Programme gegenseitig stören.' },
          ],
        },
        {
          name: 'Gaming',
          rows: [
            { key: 'Steam → Einstellungen → Compatibility', info: 'Steam Play (Proton) für alle Titel aktivieren.', why: 'Danach installierst du Windows-Spiele wie native.' },
            { key: 'protondb.com', info: 'Nachschauen, wie gut ein Spiel läuft.', why: 'Gold/Platin = läuft praktisch perfekt.' },
            { key: 'MangoHud', info: 'FPS- und Auslastungs-Overlay einblenden.', why: 'Zum Prüfen, ob die Leistung stimmt.' },
          ],
        },
      ],
    },
    { type: 'heading', text: 'Die Werkzeuge', color: '--purple' },
    {
      type: 'tools',
      tools: [
        { name: 'Wine', tag: 'Basis', desc: 'Die Kompatibilitätsschicht, auf der alles aufbaut. Führt Windows-Programme unter Linux aus.', install: 'sudo apt install wine', repo: 'https://gitlab.winehq.org/wine/wine', homepage: 'https://www.winehq.org' },
        { name: 'Proton (GE)', tag: 'Gaming', desc: 'Valves Proton, hier als Community-Version „GE“ mit extra Fixes und neueren Komponenten für Steam.', install: 'via ProtonUp-Qt', repo: 'https://github.com/GloriousEggroll/proton-ge-custom' },
        { name: 'Lutris', tag: 'Launcher', desc: 'Verwaltet Spiele aus vielen Quellen (GOG, Epic, Battle.net) und richtet Wine automatisch passend ein.', install: 'sudo apt install lutris', repo: 'https://github.com/lutris/lutris', homepage: 'https://lutris.net' },
        { name: 'Bottles', tag: 'Windows-Apps', desc: 'Schöne Oberfläche, um Windows-Programme in isolierten „Bottles“ (Prefixes) zu installieren und zu verwalten.', install: 'flatpak install flathub com.usebottles.bottles', repo: 'https://github.com/bottlesdevs/Bottles', homepage: 'https://usebottles.com' },
        { name: 'DXVK', tag: 'Grafik', desc: 'Übersetzt DirectX 9/10/11 in Vulkan — der Grund, warum Spiele unter Proton so flüssig laufen.', install: 'steckt in Proton', repo: 'https://github.com/doitsujin/dxvk' },
        { name: 'ProtonUp-Qt', tag: 'Helfer', desc: 'Installiert und verwaltet Proton-GE-Versionen für Steam und Lutris per Klick.', install: 'flatpak install flathub net.davidotek.pupgui2', repo: 'https://github.com/DavidoTek/ProtonUp-Qt' },
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Realistische Erwartung',
      html: `Sehr viel läuft heute erstaunlich gut — Singleplayer-Spiele oft besser als auf Windows. Der häufigste Stolperstein sind <b>Anti-Cheat-Systeme</b> mancher Online-Games, die Linux (noch) blockieren. Ein Blick auf <b>ProtonDB</b> oder <b>areweanticheatyet.com</b> vor dem Kauf spart Frust.`,
    },
  ],
};
