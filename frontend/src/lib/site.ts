import { SUPPORTED_LOCALES } from '@/lib/i18n';

/** Canonical origin. Override per environment with VITE_SITE_URL. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://alievsspace.com').replace(/\/$/, '');

export const ORGANIZATION = {
  name: 'Alievs Space MMC',
  legalName: 'Alievs Space LLC',
  alternateName: 'Alievs Space',
  email: 'info@alievsspace.com',
  phone: '+994517003500',
  phoneDisplay: '+994 (51) 700 35 00',
  whatsapp: '994517003500',
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
