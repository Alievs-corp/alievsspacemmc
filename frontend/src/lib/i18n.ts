/* eslint-disable @typescript-eslint/no-explicit-any */
import en from '@/locales/en';
import ru from '@/locales/ru';
import az from '@/locales/az';
import { EXTRA } from '@/locales/extra/index';

export type Locale =
  | 'en'
  | 'az'
  | 'ru'
  | 'de'
  | 'fr'
  | 'ka'
  | 'zh'
  | 'ja'
  | 'ko'
  | 'vi';

export interface LocaleMeta {
  code: Locale;
  /** Endonym — always shown in the language's own script. */
  label: string;
  /** Short badge used in compact UI. */
  short: string;
  flag: string;
  /** BCP-47 tag used for <html lang>, hreflang and Intl formatting. */
  tag: string;
  dir?: 'ltr' | 'rtl';
}

export const SUPPORTED_LOCALES: LocaleMeta[] = [
  { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧', tag: 'en' },
  { code: 'az', label: 'Azərbaycanca', short: 'AZ', flag: '🇦🇿', tag: 'az' },
  { code: 'ru', label: 'Русский', short: 'RU', flag: '🇷🇺', tag: 'ru' },
  { code: 'de', label: 'Deutsch', short: 'DE', flag: '🇩🇪', tag: 'de' },
  { code: 'fr', label: 'Français', short: 'FR', flag: '🇫🇷', tag: 'fr' },
  { code: 'ka', label: 'ქართული', short: 'KA', flag: '🇬🇪', tag: 'ka' },
  { code: 'zh', label: '中文', short: 'ZH', flag: '🇨🇳', tag: 'zh-Hans' },
  { code: 'ja', label: '日本語', short: 'JA', flag: '🇯🇵', tag: 'ja' },
  { code: 'ko', label: '한국어', short: 'KO', flag: '🇰🇷', tag: 'ko' },
  { code: 'vi', label: 'Tiếng Việt', short: 'VI', flag: '🇻🇳', tag: 'vi' },
];

export const DEFAULT_LOCALE: Locale = 'az';
/** Every miss falls back here before the caller's own fallback string. */
export const FALLBACK_LOCALE: Locale = 'en';

const LOCALE_KEY = 'alievs_space_locale';

export function getLocaleMeta(code: Locale): LocaleMeta {
  return SUPPORTED_LOCALES.find((l) => l.code === code) || SUPPORTED_LOCALES[0];
}

function isSupported(code: string): code is Locale {
  return SUPPORTED_LOCALES.some((l) => l.code === code);
}

function getNavigatorLocale(): Locale | null {
  try {
    const candidates = [navigator.language, ...(navigator.languages || [])].filter(Boolean);
    for (const raw of candidates) {
      const lower = raw.toLowerCase();
      // zh-CN / zh-TW / zh-Hans all resolve to our single Chinese bundle.
      const short = lower.slice(0, 2);
      if (isSupported(short)) return short;
    }
    return null;
  } catch {
    return null;
  }
}

/** Reads `/?lang=de` so shared links and ad campaigns can pin a language. */
function getQueryLocale(): Locale | null {
  try {
    const q = new URLSearchParams(window.location.search).get('lang');
    if (q && isSupported(q.toLowerCase())) return q.toLowerCase() as Locale;
    return null;
  } catch {
    return null;
  }
}

function getStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(LOCALE_KEY);
    return stored && isSupported(stored) ? stored : null;
  } catch {
    return null;
  }
}

/**
 * Resolved once per session and then held in memory: `t()` runs on every
 * render, and re-reading localStorage (or the URL) each time would both cost
 * work and let a stale `?lang=` in the address bar override a later switch.
 */
let current: Locale | null = null;

export function getLocale(): Locale {
  if (current) return current;
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  // Priority on first load: shared link > previous choice > browser > default.
  current = getQueryLocale() || getStoredLocale() || getNavigatorLocale() || DEFAULT_LOCALE;
  return current;
}

export function setLocale(code: Locale): void {
  if (!isSupported(code)) return;
  current = code;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCALE_KEY, code);
  } catch {
    /* private mode — the choice simply won't persist */
  }
  const meta = getLocaleMeta(code);
  document.documentElement.lang = meta.tag;
  document.documentElement.dir = meta.dir || 'ltr';
}

/** Deep-merges the add-on bundle over the base bundle (add-on wins). */
function merge<T extends Record<string, any>>(base: T, extra: Record<string, any>): T {
  const out: Record<string, any> = Array.isArray(base) ? [...(base as any)] : { ...base };
  for (const [key, value] of Object.entries(extra || {})) {
    const current = out[key];
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      current &&
      typeof current === 'object' &&
      !Array.isArray(current)
    ) {
      out[key] = merge(current, value);
    } else {
      out[key] = value;
    }
  }
  return out as T;
}

const BASE: Partial<Record<Locale, Record<string, any>>> = { en, ru, az };

const translations = SUPPORTED_LOCALES.reduce((acc, { code }) => {
  // Locales without a full base bundle inherit English and override what they translate.
  const base = BASE[code] || (en as Record<string, any>);
  acc[code] = merge(base, EXTRA[code] || {});
  return acc;
}, {} as Record<Locale, Record<string, any>>);

function getPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

/** Raw lookup — returns objects and arrays as-is (lists, tables, step definitions). */
export function tRaw<T = any>(key: string, fallback?: T): T {
  const lang = getLocale();
  const primary = getPath(translations[lang], key);
  if (primary !== undefined) return primary as T;
  const fallbackLang = getPath(translations[FALLBACK_LOCALE], key);
  if (fallbackLang !== undefined) return fallbackLang as T;
  return fallback as T;
}

export function t(key: string, fallback = ''): string {
  const val = tRaw<any>(key);
  if (typeof val === 'string') return val;
  if (val === undefined || val === null) return fallback || key;
  return String(val);
}

/** Always-English lookup, used for SEO markup that must stay crawlable. */
export function tEn(key: string, fallback = ''): string {
  const val = getPath(translations[FALLBACK_LOCALE], key);
  return typeof val === 'string' ? val : fallback || key;
}
