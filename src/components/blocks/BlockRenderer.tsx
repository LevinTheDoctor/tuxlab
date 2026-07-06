import type { Block } from '../../types/content';
import { Prose } from './Prose';
import { Callout } from './Callout';
import { Heading } from './Heading';
import { CheatSheet } from './CheatSheet';
import { CommandBreakdown } from './CommandBreakdown';
import { DirectoryExplorer } from './DirectoryExplorer';
import { ChmodCalculator } from './ChmodCalculator';
import { FileCards } from './FileCards';
import { ModeMachine } from './ModeMachine';
import { TmuxPaneDemo } from './TmuxPaneDemo';
import { Lifecycle } from './Lifecycle';
import { Terminal } from './Terminal';
import { ScriptSimulator } from './ScriptSimulator';
import { ToolGrid } from './ToolGrid';
import { DistroGrid } from './DistroGrid';
import { Timeline } from './Timeline';
import { DataTable } from './DataTable';

/**
 * Dispatcher: Block.type -> Komponente. DAS Herz der Erweiterbarkeit — ein neuer
 * Interaktionstyp braucht nur einen Union-Variant (types/content.ts) und einen
 * case hier. Die exhaustive-Prüfung (never) erzwingt, dass nichts vergessen wird.
 */
export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'prose':
      return <Prose html={block.html} />;
    case 'callout':
      return <Callout variant={block.variant} title={block.title} html={block.html} />;
    case 'heading':
      return <Heading text={block.text} color={block.color} />;
    case 'cheatsheet':
      return <CheatSheet categories={block.categories} />;
    case 'breakdown':
      return <CommandBreakdown cmd={block.cmd} />;
    case 'directoryExplorer':
      return <DirectoryExplorer dirs={block.dirs} startIndex={block.startIndex} />;
    case 'chmod':
      return <ChmodCalculator start={block.start} />;
    case 'fileCards':
      return <FileCards cards={block.cards} />;
    case 'modeMachine':
      return <ModeMachine modes={block.modes} />;
    case 'tmuxDemo':
      return <TmuxPaneDemo />;
    case 'lifecycle':
      return <Lifecycle stages={block.stages} />;
    case 'terminal':
      return <Terminal intro={block.intro} cwd={block.cwd} />;
    case 'scriptSim':
      return <ScriptSimulator title={block.title} script={block.script} interactive={block.interactive} />;
    case 'tools':
      return <ToolGrid tools={block.tools} />;
    case 'distros':
      return <DistroGrid distros={block.distros} />;
    case 'timeline':
      return <Timeline entries={block.entries} />;
    case 'table':
      return <DataTable table={block.table} />;
    default: {
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}
