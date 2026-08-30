import { useI18n } from '@/contexts/I18nContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Dropdown } from './Dropdown';
import { cn } from '@/lib/utils';

/**
 * Header currency picker. Package prices are stored in AZN and converted for
 * display, so switching here re-prices every amount on the site at once.
 */
export function CurrencySwitcher({ className }: { className?: string }) {
  const { t } = useI18n();
  const { currency, meta, setCurrency, currencies } = useCurrency();

  return (
    <Dropdown
      className={className}
      ariaLabel={t('ui.currency', 'Currency')}
      label={
        <span className="flex items-center gap-1">
          <span aria-hidden>{meta.symbol}</span>
          <span>{meta.code}</span>
        </span>
      }
    >
      {(close) => (
        <>
          <ul className="py-1.5">
            {currencies.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={currency === c.code}
                  onClick={() => {
                    setCurrency(c.code);
                    close();
                  }}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-2.5 px-4 py-2 text-left text-[13px] transition-colors hover:bg-surface-3',
                    currency === c.code ? 'text-primary' : 'text-text-muted',
                  )}
                >
                  <span aria-hidden className="w-4 text-center font-medium">
                    {c.symbol}
                  </span>
                  <span className="font-medium">{c.code}</span>
                  <span className="flex-1 truncate text-[12px] text-text-subtle">
                    {t(`currency.${c.code.toLowerCase()}`)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="border-t border-border px-4 py-2.5 text-[11px] leading-snug text-text-subtle">
            {t('currency.note')}
          </p>
        </>
      )}
    </Dropdown>
  );
}

export default CurrencySwitcher;
