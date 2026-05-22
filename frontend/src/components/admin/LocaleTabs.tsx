import { cn } from '@/lib/utils';

interface LocaleOption {
  code: string;
  label: string;
}

interface LocaleTabsProps {
  locales: LocaleOption[];
  active: string;
  onChange: (code: string) => void;
  className?: string;
}

/**
 * Language switcher for multi-locale admin forms. Lets the editor work on
 * one language at a time instead of scrolling a stacked 3-language form.
 */
export function LocaleTabs({ locales, active, onChange, className }: LocaleTabsProps) {
  return (
    <div className={cn('inline-flex gap-1 rounded-lg border border-border bg-surface-2 p-1', className)}>
      {locales.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => onChange(l.code)}
          aria-pressed={active === l.code}
          className={cn(
            'rounded-md px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
            active === l.code ? 'bg-primary text-on-primary' : 'text-text-muted hover:bg-surface-3 hover:text-text',
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
