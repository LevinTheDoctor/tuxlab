import type { FileCard } from '../../types/content';
import './blocks.css';

/** Karten für zentrale Config-Dateien. Migriert aus der User-Sektion. */
export function FileCards({ cards }: { cards: FileCard[] }) {
  return (
    <div className="cards">
      {cards.map((f) => (
        <div className="card" key={f.file}>
          <span className="perm">{f.perm}</span>
          <div className="file">{f.file}</div>
          <p>{f.desc}</p>
          <code dangerouslySetInnerHTML={{ __html: f.code }} />
        </div>
      ))}
    </div>
  );
}
