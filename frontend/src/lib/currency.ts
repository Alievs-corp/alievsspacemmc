export type CurrencyCode =
  | 'AZN'
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'GEL'
  | 'RUB'
  | 'CNY'
  | 'JPY'
  | 'KRW'
  | 'VND';

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
 *
 * Last reviewed 2026-08:
 *  - USD: the manat is pegged at 1.70 AZN = 1 USD, so this rate is stable.
 *  - EUR: floating, ~1.96 AZN per euro.
 *  - GBP: floating, ~2.26 AZN per pound.
 *  - GEL: floating, derived through USD (~2.60 GEL per USD).
 *  - RUB / CNY / JPY / KRW / VND: derived through USD at roughly 85 ₽, 7.1 ¥,
 *    150 円, 1,350 ₩ and 25,500 ₫ per dollar.
 * Re-check the floating rates a few times a year.
 */
export const CURRENCIES: CurrencyMeta[] = [
  { code: 'AZN', symbol: '₼', rate: 1, position: 'after', flag: '🇦🇿' },
  { code: 'USD', symbol: '$', rate: 0.588, position: 'before', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', rate: 0.51, position: 'before', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', rate: 0.442, position: 'before', flag: '🇬🇧' },
  { code: 'GEL', symbol: '₾', rate: 1.53, position: 'after', flag: '🇬🇪' },
  { code: 'RUB', symbol: '₽', rate: 50, position: 'after', flag: '🇷🇺' },
  { code: 'CNY', symbol: '¥', rate: 4.17, position: 'before', flag: '🇨🇳' },
  { code: 'JPY', symbol: '¥', rate: 88.2, position: 'before', flag: '🇯🇵' },
  { code: 'KRW', symbol: '₩', rate: 794, position: 'before', flag: '🇰🇷' },
  { code: 'VND', symbol: '₫', rate: 15000, position: 'after', flag: '🇻🇳' },
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
      return 'GBP';
    case 'ru':
      return 'RUB';
    case 'zh':
      return 'CNY';
    case 'ja':
      return 'JPY';
    case 'ko':
      return 'KRW';
    case 'vi':
      return 'VND';
    default:
      return DEFAULT_CURRENCY;
  }
}

/**
 * Rounds to a price-tag-looking number so converted amounts don't read as
 * noise. The step grows with the amount: ₩794,140 and 8,847,300 ₫ have to
 * land on a round figure for the same reason $71 has to become $70.
 */
function roundPrice(value: number): number {
  if (value >= 1_000_000) return Math.round(value / 50_000) * 50_000;
  if (value >= 100_000) return Math.round(value / 5_000) * 5_000;
  if (value >= 10_000) return Math.round(value / 500) * 500;
  if (value >= 1_000) return Math.round(value / 50) * 50;
  if (value >= 100) return Math.round(value / 10) * 10;
  // Small monthly figures: $71 reads like a calculation, $70 like a price.
  return Math.round(value / 5) * 5;
}

export function convert(amountAzn: number, code: CurrencyCode): number {
  const { rate } = getCurrencyMeta(code);
  // AZN is the contractual price — show it exactly as set, never rounded.
  if (rate === 1) return amountAzn;
  return roundPrice(amountAzn * rate);
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
