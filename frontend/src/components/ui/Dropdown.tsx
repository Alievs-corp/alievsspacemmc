import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
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
}

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
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex cursor-pointer items-center rounded-lg border border-border font-medium text-text transition-colors hover:border-border-strong hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
          compact
            ? 'h-8 gap-1 px-2 text-[11.5px]'
            : 'gap-1.5 px-2.5 py-1.5 text-[12px] xl:text-[13px]',
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
          role="menu"
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
