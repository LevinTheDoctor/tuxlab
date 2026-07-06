import './blocks.css';

/** Fließtext-Erklärung. Content-HTML wird bewusst injiziert (kuratierte,
 *  statische Inhalte aus dem Repo — keine Nutzereingaben). */
export function Prose({ html }: { html: string }) {
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
