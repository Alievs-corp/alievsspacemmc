import type { ReactNode } from 'react';
import { useLayoutEffect } from 'react';
import { Check, Globe } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { Dropdown } from '@/components/ui/Dropdown';
import { CRM_LOCALES, getCrmLocale, getLocaleMeta, saveCrmLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/**
 * The CRM keeps its own language (Azerbaijani by default, or Russian/English),
 * independent of the language picked on the public site. Wraps every /crm page,
 * the access gate included; leaving the CRM hands the site language back.
 */
export function CrmLocaleScope({ children }: { children: ReactNode }) {
  const { setScope } = useI18n();
  // Layout effect: the switch lands before the first paint, so nothing flashes in the site language.
  useLayoutEffect(() => {
    setScope(getCrmLocale());
    return () => setScope(null);
  }, [setScope]);
  return <>{children}</>;
}

export function CrmLanguageSwitcher() {
  const { t, locale, setScope } = useI18n();
  const current = getLocaleMeta(locale);

  return (
    <Dropdown
      compact
      ariaLabel={t('ui.language', 'Language')}
      label={
        <span className="flex items-center gap-1.5">
          <Globe aria-hidden className="h-4 w-4" />
          <span>{current.short}</span>
        </span>
      }
    >
      {(close) => (
        <ul className="py-1.5">
          {CRM_LOCALES.map((code) => {
            const l = getLocaleMeta(code);
            const on = locale === code;
            return (
              <li key={code}>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={on}
                  onClick={() => {
                    saveCrmLocale(code);
                    setScope(code);
                    close();
                  }}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-2.5 px-4 py-2 text-left text-[13px] transition-colors hover:bg-surface-3',
                    on ? 'text-primary' : 'text-text-muted',
                  )}
                >
                  <span aria-hidden className="text-[15px] leading-none">{l.flag}</span>
                  <span className="flex-1">{l.label}</span>
                  {on && <Check aria-hidden className="h-3.5 w-3.5" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Dropdown>
  );
}
