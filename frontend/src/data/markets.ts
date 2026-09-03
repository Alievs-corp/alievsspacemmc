import type { CurrencyCode } from '@/lib/currency';
import type { Locale } from '@/lib/i18n';

/**
 * One market per language we publish in — the visitor picks the country they
 * are buying from and the whole price list re-prices for it.
 */
export interface Market {
  /** ISO 3166-1 alpha-2, lowercased — also the key under `market.countries.*`. */
  code: 'az' | 'ge' | 'ru' | 'vn' | 'cn' | 'kr' | 'jp' | 'fr' | 'gb' | 'de';
  /** Language whose readers get this market by default. */
  locale: Locale;
  /** Currency shown when this market is selected. */
  currency: CurrencyCode;
  flag: string;
  /**
   * Price index against the Azerbaijani list (AZ = 1.00). Set from the 2026
   * comparison below, then pulled down deliberately: the index tracks the
   * *gap* between markets, not the local agency rate, so every figure still
   * lands under what a local studio charges.
   */
  index: number;
  /**
   * What a local studio charges for a comparable custom corporate site in
   * 2026 (mid of the usual range) — kept next to the index so the next person
   * to touch these numbers can see what they were calibrated against.
   */
  localRate: string;
}

/**
 * Reviewed 2026-09 against advertised agency rates for a custom (non-template)
 * multi-page corporate site. The order is cheapest market first, which is also
 * roughly the order of the price cards a visitor will see.
 *
 * The indices are compressed on purpose: a German buyer pays 1.8× the Baku
 * price, not the 6-8× that the local market rate would justify. That keeps
 * every market inside the "noticeably cheaper than local, still a real studio"
 * band that the whole offer is built on.
 */
export const MARKETS: Market[] = [
  { code: 'vn', locale: 'vi', currency: 'VND', flag: '🇻🇳', index: 0.85, localRate: '20-40M ₫' },
  { code: 'ge', locale: 'ka', currency: 'GEL', flag: '🇬🇪', index: 0.95, localRate: '2,500-6,000 ₾' },
  { code: 'az', locale: 'az', currency: 'AZN', flag: '🇦🇿', index: 1.0, localRate: '1,300-3,000 ₼' },
  { code: 'ru', locale: 'ru', currency: 'RUB', flag: '🇷🇺', index: 1.0, localRate: '90,000-250,000 ₽' },
  { code: 'cn', locale: 'zh', currency: 'CNY', flag: '🇨🇳', index: 1.1, localRate: '¥12,000-40,000' },
  { code: 'kr', locale: 'ko', currency: 'KRW', flag: '🇰🇷', index: 1.45, localRate: '₩2,500,000-6,000,000' },
  { code: 'jp', locale: 'ja', currency: 'JPY', flag: '🇯🇵', index: 1.65, localRate: '¥600,000-1,500,000' },
  { code: 'fr', locale: 'fr', currency: 'EUR', flag: '🇫🇷', index: 1.7, localRate: '€3,000-8,000' },
  { code: 'gb', locale: 'en', currency: 'GBP', flag: '🇬🇧', index: 1.75, localRate: '£3,000-8,000' },
  { code: 'de', locale: 'de', currency: 'EUR', flag: '🇩🇪', index: 1.8, localRate: '€3,500-9,000' },
];

export type MarketCode = Market['code'];

export const DEFAULT_MARKET: MarketCode = 'az';
export const MARKET_KEY = 'alievs_space_market';

export function getMarket(code: MarketCode): Market {
  return MARKETS.find((m) => m.code === code) || MARKETS.find((m) => m.code === DEFAULT_MARKET)!;
}

export function isMarketCode(value: string): value is MarketCode {
  return MARKETS.some((m) => m.code === value);
}

/** The market a reader of this language is most likely buying from. */
export function guessMarket(locale: string): MarketCode {
  return MARKETS.find((m) => m.locale === locale)?.code || DEFAULT_MARKET;
}

/**
 * Applies a market index to a base AZN price and lands it on a round figure,
 * so a re-priced list still reads like a price list rather than a conversion.
 */
export function marketPrice(baseAzn: number, index: number): number {
  const value = baseAzn * index;
  if (value === baseAzn) return baseAzn;
  if (value >= 1000) return Math.round(value / 50) * 50;
  if (value >= 100) return Math.round(value / 10) * 10;
  return Math.round(value / 5) * 5;
}
