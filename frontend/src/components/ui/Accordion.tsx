import { useId, useState } from 'react';
import { cn } from '@/lib/utils';

export interface AccordionItem {
  q: string;
  a: string;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Index opened on first render; pass null for all-closed. */
  defaultOpen?: number | null;
  className?: string;
}

const EASE = 'ease-[cubic-bezier(.2,.7,.1,1)]';

/**
 * Disclosure list used for the FAQ. Native buttons + aria-expanded so the
 * questions stay reachable by keyboard and readable by search crawlers —
 * answers are always in the DOM, only visually collapsed.
 *
 * Look: ruled rows (reference "steps" table), a mono index, and a round +
 * that turns into × as its row opens; the answer slides open by animating
 * grid-template-rows 0fr → 1fr.
 */
export function Accordion({ items, defaultOpen = 0, className }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <div className={cn('border-t-[1.5px] border-[var(--as-line-strong,var(--color-border-strong))]', className)}>
      {items.map((item, i) => {
        const expanded = open === i;
        return (
          <div key={item.q} className="border-b-[1.5px] border-[var(--as-line,var(--color-border))]">
            <h3>
              <button
                type="button"
                id={`${baseId}-btn-${i}`}
                aria-expanded={expanded}
                aria-controls={`${baseId}-panel-${i}`}
                onClick={() => setOpen(expanded ? null : i)}
                className="group flex w-full cursor-pointer items-start gap-3 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--as-accent,var(--color-focus))] md:gap-5 md:py-7"
              >
                <span
                  aria-hidden
                  className="w-7 shrink-0 pt-[.55em] font-mono text-[11px] tracking-[.06em] text-[var(--as-fg-soft,var(--color-text-muted))] md:w-9"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'min-w-0 flex-1 font-display text-[17px] font-bold leading-[1.18] tracking-[-.015em] [font-stretch:112%] transition-[color,transform] duration-500 md:text-[23px]',
                    EASE,
                    'group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0',
                    expanded ? 'text-[var(--as-accent,var(--color-primary))]' : 'text-[var(--as-fg,var(--color-text))]',
                  )}
                >
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    'relative grid h-10 w-10 shrink-0 place-items-center rounded-full border-[1.5px] transition-[transform,background-color,border-color,color] duration-500 motion-reduce:transition-none md:h-12 md:w-12',
                    EASE,
                    expanded
                      ? 'rotate-[135deg] border-[var(--as-accent,var(--color-primary))] bg-[var(--as-accent,var(--color-primary))] text-[var(--as-bg,var(--color-bg))]'
                      : 'border-[var(--as-line-strong,var(--color-border-strong))] text-[var(--as-fg,var(--color-text))] group-hover:rotate-90',
                  )}
                >
                  <span className="absolute h-[2px] w-[38%] rounded-full bg-current" />
                  <span className="absolute h-[38%] w-[2px] rounded-full bg-current" />
                </span>
              </button>
            </h3>
            <div
              id={`${baseId}-panel-${i}`}
              role="region"
              aria-labelledby={`${baseId}-btn-${i}`}
              className={cn(
                'grid transition-[grid-template-rows,opacity] duration-500 motion-reduce:transition-none',
                EASE,
                expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <p
                  className={cn(
                    'max-w-[68ch] pb-7 pl-10 pr-2 text-[15px] leading-[1.65] text-[var(--as-fg-soft,var(--color-text-muted))] transition-transform duration-500 motion-reduce:transition-none md:pb-9 md:pl-14 md:pr-16 md:text-[17px]',
                    EASE,
                    expanded ? 'translate-y-0' : '-translate-y-3',
                  )}
                >
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
