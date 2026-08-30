import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  CURRENCIES,
  CURRENCY_KEY,
  DEFAULT_CURRENCY,
  formatAmount,
  getCurrencyMeta,
  guessCurrency,
  type CurrencyCode,
  type CurrencyMeta,
} from '@/lib/currency';
import { useI18n } from './I18nContext';

interface CurrencyContextType {
  currency: CurrencyCode;
  meta: CurrencyMeta;
  setCurrency: (code: CurrencyCode) => void;
  /** Formats an AZN base price in the visitor's chosen currency. */
  format: (amountAzn: number) => string;
  currencies: CurrencyMeta[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

function readStoredCurrency(): CurrencyCode | null {
  try {
    const stored = localStorage.getItem(CURRENCY_KEY);
    return stored && CURRENCIES.some((c) => c.code === stored) ? (stored as CurrencyCode) : null;
  } catch {
    return null;
  }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { locale, localeTag } = useI18n();

  // A stored choice pins the currency; until then it follows the language,
  // derived during render so switching language needs no state sync.
  const [chosen, setChosen] = useState<CurrencyCode | null>(readStoredCurrency);
  const currency = chosen ?? guessCurrency(locale) ?? DEFAULT_CURRENCY;

  const setCurrency = useCallback((code: CurrencyCode) => {
    setChosen(code);
    try {
      localStorage.setItem(CURRENCY_KEY, code);
    } catch {
      /* private mode — the choice simply won't persist */
    }
  }, []);

  const value = useMemo<CurrencyContextType>(
    () => ({
      currency,
      meta: getCurrencyMeta(currency),
      setCurrency,
      format: (amountAzn: number) => formatAmount(amountAzn, currency, localeTag),
      currencies: CURRENCIES,
    }),
    [currency, setCurrency, localeTag],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
}
