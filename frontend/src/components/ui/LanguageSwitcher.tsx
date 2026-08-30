import { useI18n } from '@/contexts/I18nContext';
import { Dropdown } from './Dropdown';
import { cn } from '@/lib/utils';

/** Header language picker. Endonyms only — a reader looks for their own word. */
export function LanguageSwitcher({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { t, locale, localeMeta, setLocale, supportedLocales } = useI18n();

  return (
    <Dropdown
      className={className}
      compact={compact}
      ariaLabel={t('ui.language', 'Language')}
      label={
        <span className="flex items-center gap-1.5">
          <span aria-hidden>{localeMeta.flag}</span>
          <span>{localeMeta.short}</span>
        </span>
      }
      panelClassName="max-h-[70vh] overflow-y-auto"
    >
      {(close) => (
        <ul className="py-1.5">
          {supportedLocales.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={locale === l.code}
                onClick={() => {
                  setLocale(l.code);
                  close();
                }}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-2.5 px-4 py-2 text-left text-[13px] transition-colors hover:bg-surface-3',
                  locale === l.code ? 'text-primary' : 'text-text-muted',
                )}
              >
                <span aria-hidden className="text-[15px] leading-none">
                  {l.flag}
                </span>
                <span className="flex-1">{l.label}</span>
                {locale === l.code && (
                  <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Dropdown>
  );
}

export default LanguageSwitcher;
