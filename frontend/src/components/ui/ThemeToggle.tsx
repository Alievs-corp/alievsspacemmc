import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';

/**
 * Light/dark switch. Lives in the header on every breakpoint — on mobile it
 * sits next to the language and currency pickers, where the burger used to be.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();

  const isDark = theme === 'dark';
  const label = isDark ? t('ui.themeLight', 'Light mode') : t('ui.themeDark', 'Dark mode');

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      data-theme-toggle=""
      className={cn(
        'flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border text-text transition-colors hover:border-border-strong hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus lg:h-9 lg:w-9',
        className,
      )}
    >
      {isDark ? <Sun aria-hidden className="h-4 w-4" /> : <Moon aria-hidden className="h-4 w-4" />}
    </button>
  );
}

export default ThemeToggle;
