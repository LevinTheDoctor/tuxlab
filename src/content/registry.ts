import type { Topic } from '../types/content';
import { terminalBasics, files } from './basics-terminal';
import { textTools, finding } from './text-tools';
import { archives } from './archives';
import { dockerfileCompose } from './dockerfile';
import { directories } from './directories';
import { permissions } from './permissions';
import { users } from './users';
import { mounting } from './mounting';
import { packages } from './packages';
import { sharing } from './sharing';
import { shellScripting } from './shell-scripting';
import { shells } from './shells';
import { git } from './git';
import { tmux } from './tmux';
import { docker } from './docker';
import { nvim } from './nvim';
import { sync } from './sync';
import { devtools } from './devtools';
import { wineProton } from './wine-proton';
import { processes, streamsPipes, networking, systemd, kernel } from './concepts';
import { bestPractices } from './best-practices';
import { history } from './history';
import { distributions } from './distros';
import { memes } from './memes';
import { raspberry } from './raspberry';

/**
 * DIE Registry. Diese eine Liste treibt alles ab: Sidebar (nach category),
 * Roadmap (nach level), Command-Palette (Suche) und Routing (nach id).
 * Neues Thema hinzufügen = neue Content-Datei importieren und hier eintragen.
 */
export const topics: Topic[] = [
  // Grundlagen
  terminalBasics,
  files,
  directories,
  textTools,
  finding,
  // System
  permissions,
  users,
  mounting,
  packages,
  sharing,
  // Werkzeuge
  shells,
  shellScripting,
  archives,
  git,
  tmux,
  docker,
  dockerfileCompose,
  nvim,
  sync,
  devtools,
  wineProton,
  // Konzepte
  processes,
  streamsPipes,
  networking,
  systemd,
  kernel,
  bestPractices,
  // Kultur & Geschichte
  history,
  distributions,
  // Fun & Community
  memes,
  raspberry,
];

export const topicById = (id: string): Topic | undefined => topics.find((t) => t.id === id);
