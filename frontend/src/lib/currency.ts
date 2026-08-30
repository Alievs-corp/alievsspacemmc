export type CurrencyCode = 'AZN' | 'USD' | 'EUR' | 'GEL';

export interface CurrencyMeta {
  code: CurrencyCode;
  symbol: string;
  /** Units of this currency per 1 AZN. Base currency is AZN, so its rate is 1. */
  rate: number;
  /** Where the symbol sits relative to the amount. */
  position: 'before' | 'after';
  flag: string;
}

/**
 * Indicative rates, updated manually. Prices are contractually set in AZN —
 * other currencies are a convenience for the visitor and are re-confirmed on
 * the invoice, which is what `packages.currencyNote` tells the reader.
 * Last reviewed: 2026-08.
 */
export const CURRENCIES: CurrencyMeta[] = [
  { code: 'AZN', symbol: '₼', rate: 1, position: 'after', flag: '🇦🇿' },
  { code: 'USD', symbol: '$', rate: 0.588, position: 'before', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', rate: 0.545, position: 'before', flag: '🇪🇺' },
  { code: 'GEL', symbol: '₾', rate: 1.59, position: 'after', flag: '🇬🇪' },
];

export const DEFAULT_CURRENCY: CurrencyCode = 'AZN';
export const CURRENCY_KEY = 'alievs_space_currency';

export function getCurrencyMeta(code: CurrencyCode): CurrencyMeta {
  return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
}

/** Maps a visitor's locale to the currency they most likely think in. */
export function guessCurrency(locale: string): CurrencyCode {
  switch (locale) {
    case 'az':
      return 'AZN';
    case 'ka':
      return 'GEL';
    case 'de':
    case 'fr':
      return 'EUR';
    case 'en':
    case 'zh':
    case 'ja':
    case 'ko':
    case 'vi':
    case 'ru':
      return 'USD';
    default:
      return DEFAULT_CURRENCY;
  }
}

/** Rounds to a price-tag-looking number so converted amounts don't read as noise. */
function roundPrice(value: number): number {
  if (value >= 1000) return Math.round(value / 50) * 50;
  if (value >= 100) return Math.round(value / 10) * 10;
  return Math.round(value);
}

export function convert(amountAzn: number, code: CurrencyCode): number {
  return roundPrice(amountAzn * getCurrencyMeta(code).rate);
}

export function formatAmount(amountAzn: number, code: CurrencyCode, localeTag = 'en'): string {
  const meta = getCurrencyMeta(code);
  const value = convert(amountAzn, code);
  let digits: string;
  try {
    digits = new Intl.NumberFormat(localeTag, { maximumFractionDigits: 0 }).format(value);
  } catch {
    digits = String(value);
  }
  return meta.position === 'before' ? `${meta.symbol}${digits}` : `${digits} ${meta.symbol}`;
}
