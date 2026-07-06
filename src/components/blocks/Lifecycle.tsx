import { Fragment } from 'react';
import type { LifecycleStage } from '../../types/content';
import './blocks.css';

/** Horizontale Prozess-Kette (z.B. Docker Dockerfile -> Image -> Container). */
export function Lifecycle({ stages }: { stages: LifecycleStage[] }) {
  return (
    <div className="lifecycle">
      {stages.map((s, i) => (
        <Fragment key={s.name}>
          <div className="stage">
            <div className="ico">{s.ico}</div>
            <h4>{s.name}</h4>
            <p>{s.desc}</p>
            {s.via && <span className="via">{s.via}</span>}
          </div>
          {i < stages.length - 1 && <div className="stage-arrow">→</div>}
        </Fragment>
      ))}
    </div>
  );
}
