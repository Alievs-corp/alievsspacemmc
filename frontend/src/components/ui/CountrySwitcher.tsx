import { useI18n } from '@/contexts/I18nContext';
import { useMarket } from '@/contexts/MarketContext';
import { Dropdown } from './Dropdown';
import { cn } from '@/lib/utils';

/**
 * Country picker for the pricing page. Choosing a market re-prices every
 * package for it and switches the display currency to that country's own.
 */
export function CountrySwitcher({
  className,
  compact = false,
  align = 'right',
}: {
  className?: string;
  compact?: boolean;
  align?: 'left' | 'right';
}) {
  const { t } = useI18n();
  const { market, setMarket, markets } = useMarket();

  return (
    <Dropdown
      className={className}
      compact={compact}
      align={align}
      ariaLabel={t('market.label', 'Country')}
      label={
        <span className="flex items-center gap-1.5">
          <span aria-hidden>{market.flag}</span>
          <span>{t(`market.countries.${market.code}`)}</span>
        </span>
      }
      panelClassName="max-h-[70vh] w-[240px] overflow-y-auto"
    >
      {(close) => (
        <>
          <ul className="py-1.5">
            {markets.map((m) => (
              <li key={m.code}>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={market.code === m.code}
                  onClick={() => {
                    setMarket(m.code);
                    close();
                  }}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-2.5 px-4 py-2 text-left text-[13px] transition-colors hover:bg-surface-3',
                    market.code === m.code ? 'text-primary' : 'text-text-muted',
                  )}
                >
                  <span aria-hidden className="text-[15px] leading-none">
                    {m.flag}
                  </span>
                  <span className="flex-1">{t(`market.countries.${m.code}`)}</span>
                  <span className="font-mono text-[11px] text-text-subtle">{m.currency}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="border-t border-border px-4 py-2.5 text-[11px] leading-snug text-text-subtle">
            {t('market.note')}
          </p>
        </>
      )}
    </Dropdown>
  );
}

export default CountrySwitcher;
