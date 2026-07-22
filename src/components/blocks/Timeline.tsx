import type { TimelineEntry } from '../../types/content';
import './extras.css';

/** Vertikale Zeitleiste (Linux-Geschichte). */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="timeline">
      {entries.map((e, i) => (
        <div className="tl-item" key={i}>
          <div className="tl-marker">
            <span className="tl-dot" />
            <span className="tl-year">{e.year}</span>
          </div>
          <div className="tl-content">
            <h4 className="tl-title">{e.title}</h4>
            <p className="tl-text" dangerouslySetInnerHTML={{ __html: e.text }} />
          </div>
        </div>
      ))}
    </div>
  );
}
