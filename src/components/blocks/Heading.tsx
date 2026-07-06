import './blocks.css';

/** Abschnittsüberschrift innerhalb eines Themas. */
export function Heading({ text, color }: { text: string; color?: string }) {
  return (
    <h2 className="block-heading" style={color ? { color: `var(${color})` } : undefined}>
      {text}
    </h2>
  );
}
