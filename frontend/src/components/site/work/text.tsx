import type { ReactNode } from 'react';

/**
 * Paints the last word of a closing-band title in the accent colour (`<em>`).
 * The wrapper trims the type a little on phones so long words stay whole.
 */
export function accentLast(text: string): ReactNode {
  const words = text.trim().split(/\s+/);
  const last = words.pop();
  return (
    <span className="wk-cta-fit">
      {words.length > 0 && `${words.join(' ')} `}
      <em>{last}</em>
    </span>
  );
}

/** Fills `{name}` placeholders in a translated template. */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in values ? values[k] : m));
}
