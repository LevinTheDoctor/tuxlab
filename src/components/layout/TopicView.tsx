import { LEVEL_META, type Topic } from '../../types/content';
import { BlockRenderer } from '../blocks/BlockRenderer';
import './TopicView.css';

interface Props {
  topic: Topic;
  isDone: boolean;
  onToggleDone: () => void;
}

export function TopicView({ topic, isDone, onToggleDone }: Props) {
  const lvl = LEVEL_META[topic.level];
  return (
    <article className="topic">
      <header className="shell-frame">
        <div className="shell-titlebar">
          <span className="dot r" /><span className="dot y" /><span className="dot g" />
          <span className="shell-title">bash — levin@ubuntu: ~/lernen/{topic.id}</span>
        </div>
        <div className="shell-body">
          <div className="shell-prompt">
            <span className="p-user">levin@ubuntu</span>
            <span className="p-sep">:</span>
            <span className="p-path">~/lernen</span>
            <span className="p-sep">$</span> man {topic.id}
          </div>
          <div className="topic-headrow">
            <h1 className="topic-title">
              <span className="topic-ico">{topic.icon}</span> {topic.title}
            </h1>
            <span className="topic-lvl" style={{ color: `var(${lvl.varName})`, borderColor: `var(${lvl.varName})` }}>
              {lvl.label}
            </span>
          </div>
          <p className="topic-summary">{topic.summary}</p>
        </div>
      </header>

      <div className="topic-blocks">
        {topic.blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </div>

      <footer className="topic-foot">
        <button className={`done-btn ${isDone ? 'is-done' : ''}`} onClick={onToggleDone}>
          {isDone ? '✓ Als gelernt markiert' : 'Als gelernt markieren'}
        </button>
      </footer>
    </article>
  );
}
