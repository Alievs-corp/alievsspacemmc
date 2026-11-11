import type { CSSProperties } from 'react';
import { useId, useState } from 'react';
import { useReveal } from '@/components/site/blocks';
import { cn } from '@/lib/utils';

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Ruled disclosure list in the walk style. Native buttons + aria-expanded keep
 * every question keyboard-reachable; an opened answer fades and rises in
 * (opacity/transform only), and the plus turns into a cross.
 */
export function FaqList({ items, defaultOpen = 0 }: { items: FaqItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();
  const ref = useReveal();

  return (
    <div ref={ref} className="border-t-[1.5px] border-[var(--as-line-strong)]">
      {items.map((item, i) => {
        const expanded = open === i;
        return (
          <div
            key={item.q}
            data-reveal
            style={{ '--d': `${Math.min(i, 5) * 60}ms` } as CSSProperties}
            className="border-b-[1.5px] border-[var(--as-line)]"
          >
            <h3>
              <button
                type="button"
                id={`${baseId}-btn-${i}`}
                aria-expanded={expanded}
                aria-controls={`${baseId}-panel-${i}`}
                onClick={() => setOpen(expanded ? null : i)}
                className="group flex w-full cursor-pointer items-start justify-between gap-5 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--as-accent)] md:py-7"
              >
                <span
                  className={cn(
                    'font-[family-name:var(--as-display)] text-[clamp(18px,1.7vw,24px)] font-semibold leading-[1.2] tracking-[-.015em] transition-colors duration-300 [font-stretch:105%]',
                    expanded ? 'text-[var(--as-accent)]' : 'group-hover:text-[var(--as-accent)]',
                  )}
                >
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-current transition-transform duration-500 ease-[var(--as-ease)]',
                    expanded && 'rotate-45 text-[var(--as-accent)]',
                  )}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
            </h3>
            <div id={`${baseId}-panel-${i}`} role="region" aria-labelledby={`${baseId}-btn-${i}`} hidden={!expanded}>
              <p className="max-w-[62ch] pb-7 pr-12 text-[15px] leading-relaxed text-[var(--as-fg-soft)] animate-[as-page-in_.6s_var(--as-ease)_both] motion-reduce:animate-none md:text-[16.5px]">
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FaqList;
