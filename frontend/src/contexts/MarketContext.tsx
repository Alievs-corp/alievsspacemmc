import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  DEFAULT_MARKET,
  getMarket,
  guessMarket,
  isMarketCode,
  MARKET_KEY,
  MARKETS,
  marketPrice,
  type Market,
  type MarketCode,
} from '@/data/markets';
import { useCurrency } from './CurrencyContext';
import { useI18n } from './I18nContext';

interface MarketContextType {
  market: Market;
  setMarket: (code: MarketCode) => void;
  markets: Market[];
  /** Base AZN price re-priced for the selected market, still in AZN. */
  priceOf: (baseAzn: number) => number;
  /** Re-priced for the market and formatted in the selected currency. */
  formatPrice: (baseAzn: number) => string;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

function readStoredMarket(): MarketCode | null {
  try {
    const stored = localStorage.getItem(MARKET_KEY);
    return stored && isMarketCode(stored) ? stored : null;
  } catch {
    return null;
  }
}

/**
 * Must render inside CurrencyProvider: picking a country also switches the
 * currency, because a buyer in Seoul comparing our price to a local quote
 * needs it in won, not manat.
 */
export function MarketProvider({ children }: { children: ReactNode }) {
  const { locale } = useI18n();
  const { format, setCurrency } = useCurrency();

  // Same pattern as the currency: a stored choice pins the market, otherwise
  // it follows the language, derived during render so no state sync is needed.
  const [chosen, setChosen] = useState<MarketCode | null>(readStoredMarket);
  const code = chosen ?? guessMarket(locale) ?? DEFAULT_MARKET;
  const market = getMarket(code);

  const setMarket = useCallback(
    (next: MarketCode) => {
      setChosen(next);
      setCurrency(getMarket(next).currency);
      try {
        localStorage.setItem(MARKET_KEY, next);
      } catch {
        /* private mode — the choice simply won't persist */
      }
    },
    [setCurrency],
  );

  const value = useMemo<MarketContextType>(() => {
    const priceOf = (baseAzn: number) => marketPrice(baseAzn, market.index);
    return {
      market,
      setMarket,
      markets: MARKETS,
      priceOf,
      formatPrice: (baseAzn: number) => format(priceOf(baseAzn)),
    };
  }, [market, setMarket, format]);

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}

export function useMarket() {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within MarketProvider');
  }
  return context;
}
