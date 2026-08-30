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

/**
 * Disclosure list used for the FAQ. Native buttons + aria-expanded so the
 * questions stay reachable by keyboard and readable by search crawlers —
 * answers are always in the DOM, only visually collapsed.
 */
export function Accordion({ items, defaultOpen = 0, className }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <div className={cn('divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface/60', className)}>
      {items.map((item, i) => {
        const expanded = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                id={`${baseId}-btn-${i}`}
                aria-expanded={expanded}
                aria-controls={`${baseId}-panel-${i}`}
                onClick={() => setOpen(expanded ? null : i)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus md:px-7 md:py-6"
              >
                <span className="font-display text-[15px] font-semibold text-white md:text-[18px]">
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-text-muted transition-transform duration-300',
                    expanded && 'rotate-45 border-primary text-primary',
                  )}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={`${baseId}-panel-${i}`}
              role="region"
              aria-labelledby={`${baseId}-btn-${i}`}
              className={cn(
                'grid transition-all duration-300 ease-out',
                expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-6 text-[14px] leading-relaxed text-text-muted md:px-7 md:text-[16px]">
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
