import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface DropdownProps {
  /** Rendered inside the trigger button. */
  label: ReactNode;
  ariaLabel: string;
  children: (close: () => void) => ReactNode;
  align?: 'left' | 'right';
  className?: string;
  panelClassName?: string;
  /** Tight trigger used in the mobile header, where space is at a premium. */
  compact?: boolean;
  /**
   * Keep the panel on screen: open upwards when there is more room above the
   * trigger, cap its height to the room there and nudge it back inside the
   * viewport edges (the pickers at the bottom of the mobile menu).
   */
  fitViewport?: boolean;
  /** Extra classes for the trigger button. */
  triggerClassName?: string;
}

/** Room kept clear at the top of the screen for the fixed site header. */
const TOP_CLEAR = 76;
const EDGE = 12;
const GAP = 8;

/**
 * Small popover used for the language and currency pickers. Closes on outside
 * click and on Escape, and returns focus to the trigger so keyboard users are
 * not dropped at the top of the page.
 */
export function Dropdown({
  label,
  ariaLabel,
  children,
  align = 'right',
  className,
  panelClassName,
  compact = false,
  fitViewport = false,
  triggerClassName,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  /** Measured placement; null until the panel has been measured once. */
  const [fit, setFit] = useState<{ up: boolean; maxH: number; dx: number } | null>(null);
  /** Horizontal nudge currently applied, so a re-measure can undo it. */
  const dxRef = useRef(0);

  useLayoutEffect(() => {
    if (!open || !fitViewport) return;
    const place = () => {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      if (!trigger || !panel) return;
      const vv = window.visualViewport;
      const vh = vv?.height ?? window.innerHeight;
      const vw = document.documentElement.clientWidth;
      const t = trigger.getBoundingClientRect();
      const below = vh - t.bottom - GAP - EDGE;
      const above = t.top - GAP - TOP_CLEAR;
      const natural = panel.scrollHeight;
      const up = natural > below && above > below;
      // Horizontal: measure where the panel sits without any nudge.
      const r = panel.getBoundingClientRect();
      const left = r.left - dxRef.current;
      const right = left + r.width;
      let dx = 0;
      if (right > vw - EDGE) dx = vw - EDGE - right;
      if (left + dx < EDGE) dx = EDGE - left;
      dxRef.current = Math.round(dx);
      setFit({ up, maxH: Math.max(140, Math.floor(up ? above : below)), dx: dxRef.current });
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [open, fitViewport]);

  const panelStyle: CSSProperties | undefined = fitViewport
    ? fit
      ? {
          maxHeight: fit.maxH,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          transform: fit.dx ? `translateX(${fit.dx}px)` : undefined,
          ...(fit.up ? { top: 'auto', bottom: `calc(100% + ${GAP}px)` } : null),
        }
      : { visibility: 'hidden' }
    : undefined;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          // A fresh open is measured again (hidden for that one frame).
          dxRef.current = 0;
          setFit(null);
          setOpen((v) => !v);
        }}
        className={cn(
          'flex cursor-pointer items-center rounded-lg border border-border font-medium text-text transition-colors hover:border-border-strong hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
          compact
            ? 'h-8 gap-1 px-2 text-[11.5px]'
            : 'gap-1.5 px-2.5 py-1.5 text-[12px] xl:text-[13px]',
          triggerClassName,
        )}
      >
        {label}
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className={cn(
            'h-3 w-3 text-text-subtle transition-transform',
            compact && 'hidden',
            open && 'rotate-180',
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          ref={panelRef}
          role="menu"
          data-lenis-prevent={fitViewport || undefined}
          style={panelStyle}
          className={cn(
            'absolute top-[calc(100%+8px)] z-50 min-w-[190px] animate-fade-in overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--shadow-3)]',
            align === 'right' ? 'right-0' : 'left-0',
            panelClassName,
          )}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
