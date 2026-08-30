import { SUPPORTED_LOCALES } from '@/lib/i18n';

/** Canonical origin. Override per environment with VITE_SITE_URL. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://alievsspace.com').replace(/\/$/, '');

export interface PhoneNumber {
  /** E.164 — used for tel: links and the wa.me path. */
  e164: string;
  /** Human-readable form shown on the page. */
  display: string;
  /** ISO country code of the line, for structured data. */
  country: string;
}

/** The three lines the company answers on. */
export const PHONE_NUMBERS: Record<'az' | 'ge' | 'intl', PhoneNumber> = {
  az: { e164: '+994517003500', display: '+994 51 700 35 00', country: 'AZ' },
  ge: { e164: '+995577271352', display: '+995 577 271 352', country: 'GE' },
  intl: { e164: '+421952480349', display: '+421 952 480 349', country: 'SK' },
};

/**
 * Which line a visitor sees. Georgian speakers get the Tbilisi number and
 * Azerbaijani speakers the Baku number; every other language gets the
 * international line.
 */
export function phoneForLocale(locale: string): PhoneNumber {
  if (locale === 'ka') return PHONE_NUMBERS.ge;
  if (locale === 'az') return PHONE_NUMBERS.az;
  return PHONE_NUMBERS.intl;
}

export function telHref(phone: PhoneNumber): string {
  return `tel:${phone.e164}`;
}

/** wa.me expects digits only, no leading plus. */
export function whatsappHref(phone: PhoneNumber, text?: string): string {
  const digits = phone.e164.replace(/\D/g, '');
  return text
    ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${digits}`;
}

export const ORGANIZATION = {
  name: 'Alievs Space MMC',
  legalName: 'Alievs Space LLC',
  alternateName: 'Alievs Space',
  email: 'info@alievsspace.com',
  /** Registered head office line — used where a single number is required. */
  phone: PHONE_NUMBERS.az.e164,
  phoneDisplay: PHONE_NUMBERS.az.display,
  foundingDate: '2019',
  street: 'Baku',
  city: 'Baku',
  region: 'Baku',
  postalCode: 'AZ1000',
  country: 'AZ',
  latitude: 40.4093,
  longitude: 49.8671,
  social: [
    'https://www.instagram.com/alievsspace/',
    'https://www.linkedin.com/company/alievs-space-mmc',
  ],
  /** Markets we actively sell into — used for LocalBusiness areaServed. */
  areaServed: ['AZ', 'GE', 'TR', 'DE', 'FR', 'GB', 'US', 'CN', 'JP', 'KR', 'VN', 'AE'],
} as const;

export function absoluteUrl(path: string): string {
  if (!path || path === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * hreflang alternates. The site serves one URL per page for every language
 * (the language is a user preference, not a path segment), so alternates point
 * at the same path with a ?lang= hint that `getLocale()` honours on load.
 */
export function hreflangAlternates(path: string) {
  const base = absoluteUrl(path);
  const joiner = base.includes('?') ? '&' : '?';
  return [
    ...SUPPORTED_LOCALES.map(({ tag, code }) => ({
      hrefLang: tag,
      href: `${base}${joiner}lang=${code}`,
    })),
    { hrefLang: 'x-default', href: base },
  ];
}
