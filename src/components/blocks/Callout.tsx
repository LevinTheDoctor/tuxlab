import './blocks.css';

const ICON = { tip: '💡', warn: '⚠️', danger: '🔥', info: 'ℹ️' } as const;

/** Hervorgehobener Hinweis (aus .tip / .escape-tip generalisiert). */
export function Callout({
  variant,
  title,
  html,
}: {
  variant: 'tip' | 'warn' | 'danger' | 'info';
  title: string;
  html: string;
}) {
  return (
    <div className={`callout callout-${variant}`}>
      <strong className="callout-title">
        <span className="callout-ico">{ICON[variant]}</span> {title}
      </strong>
      <span className="callout-body" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
