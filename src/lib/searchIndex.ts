import { topics } from '../content/registry';
import type { Block, Topic } from '../types/content';

/* =========================================================================
   VOLLTEXT-SUCHINDEX
   Flacht jedes Topic (inkl. Blockinhalte) zu einem durchsuchbaren Text ab.
   Einmal beim Modul-Laden gebaut, danach nur noch String-Matching.
   ========================================================================= */

/** Entfernt HTML-Tags und häufige Entities aus Content-HTML. */
function strip(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&rarr;/g, '→')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Sammelt den durchsuchbaren Text eines einzelnen Blocks. */
function blockText(block: Block): string {
  switch (block.type) {
    case 'prose':
      return strip(block.html);
    case 'callout':
      return `${block.title} ${strip(block.html)}`;
    case 'heading':
      return block.text;
    case 'cheatsheet':
      return block.categories
        .map((c) => `${c.name} ${c.rows.map((r) => `${strip(r.key)} ${strip(r.info)} ${r.why}`).join(' ')}`)
        .join(' ');
    case 'breakdown':
      return block.cmd.map((t) => `${t.t} ${t.d}`).join(' ');
    case 'directoryExplorer':
      return block.dirs.map((d) => `${d.path} ${d.role} ${d.desc} ${d.inside.join(' ')} ${d.tip}`).join(' ');
    case 'fileCards':
      return block.cards.map((c) => `${c.file} ${c.desc} ${strip(c.code)}`).join(' ');
    case 'modeMachine':
      return block.modes.map((m) => `${m.name} ${m.enter} ${m.desc}`).join(' ');
    case 'lifecycle':
      return block.stages.map((s) => `${s.name} ${s.desc} ${s.via ?? ''}`).join(' ');
    case 'terminal':
      return block.intro ?? '';
    case 'scriptSim':
      return block.script.map((s) => `${s.line} ${strip(s.explain)}`).join(' ');
    case 'tools':
      return block.tools.map((t) => `${t.name} ${strip(t.desc)} ${t.tag ?? ''} ${t.install ?? ''}`).join(' ');
    case 'distros':
      return block.distros.map((d) => `${d.name} ${d.based} ${d.pkg} ${strip(d.desc)} ${d.flavor}`).join(' ');
    case 'timeline':
      return block.entries.map((e) => `${e.year} ${e.title} ${strip(e.text)}`).join(' ');
    case 'table':
      return `${block.table.headers.map(strip).join(' ')} ${block.table.rows.map((r) => r.map(strip).join(' ')).join(' ')}`;
    case 'chmod':
    case 'tmuxDemo':
      return '';
  }
}

export interface SearchDoc {
  topic: Topic;
  haystack: string; // alles klein, für Matching
  body: string;     // Fließtext (für Snippet)
}

const INDEX: SearchDoc[] = topics.map((topic) => {
  const body = topic.blocks.map(blockText).filter(Boolean).join(' • ');
  const haystack = `${topic.title} ${topic.summary} ${topic.id} ${body}`.toLowerCase();
  return { topic, haystack, body };
});

export interface SearchHit {
  topic: Topic;
  score: number;
  snippet?: string; // Textausschnitt um den Treffer (nur bei Body-Treffern)
}

/** Baut einen Snippet um die erste Fundstelle im Body. */
function makeSnippet(body: string, q: string): string | undefined {
  const idx = body.toLowerCase().indexOf(q);
  if (idx < 0) return undefined;
  const start = Math.max(0, idx - 40);
  const end = Math.min(body.length, idx + q.length + 60);
  return (start > 0 ? '…' : '') + body.slice(start, end).trim() + (end < body.length ? '…' : '');
}

/** Durchsucht alle Topics. Leere Query = alle (nach Kategorie-Reihenfolge). */
export function search(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return INDEX.map((d) => ({ topic: d.topic, score: 0 }));

  const hits: SearchHit[] = [];
  for (const doc of INDEX) {
    const inTitle = doc.topic.title.toLowerCase().includes(q);
    const inSummary = doc.topic.summary.toLowerCase().includes(q);
    const inBody = doc.haystack.includes(q);
    if (!inTitle && !inSummary && !inBody) continue;

    // Ranking: Titel > Zusammenfassung > Body.
    const score = inTitle ? 3 : inSummary ? 2 : 1;
    const snippet = !inTitle && !inSummary ? makeSnippet(doc.body, q) : undefined;
    hits.push({ topic: doc.topic, score, snippet });
  }
  return hits.sort((a, b) => b.score - a.score);
}
