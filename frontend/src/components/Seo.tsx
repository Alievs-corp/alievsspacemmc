/* eslint-disable @typescript-eslint/no-explicit-any */
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { absoluteUrl, hreflangAlternates, ORGANIZATION, PHONE_NUMBERS, SITE_URL } from '@/lib/site';
import { SUPPORTED_LOCALES } from '@/lib/i18n';

interface SeoProps {
  /** i18n key under `seo.` — e.g. "packages". Resolves title + description. */
  page?: string;
  title?: string;
  description?: string;
  /** Overrides the canonical path (defaults to the current route). */
  path?: string;
  image?: string;
  /** Extra JSON-LD graph nodes for this page (FAQPage, Service, Offer …). */
  schema?: Record<string, any> | Record<string, any>[];
  /** Breadcrumb trail, root excluded — it is prepended automatically. */
  breadcrumbs?: Array<{ name: string; path: string }>;
  noindex?: boolean;
  type?: 'website' | 'article';
}

const DEFAULT_IMAGE = '/og-image.png';

export function Seo({
  page,
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  schema,
  breadcrumbs,
  noindex,
  type = 'website',
}: SeoProps) {
  const { t, localeTag, locale } = useI18n();
  const location = useLocation();

  const basePath = path ?? location.pathname;

  // hreflang points at `?lang=xx` variants, so a page reached through one must
  // canonicalise to itself — otherwise the two signals contradict each other.
  const langParam = new URLSearchParams(location.search).get('lang');
  const activeLang = SUPPORTED_LOCALES.some((l) => l.code === langParam) ? langParam : null;
  const canonical = activeLang
    ? `${absoluteUrl(basePath)}?lang=${activeLang}`
    : absoluteUrl(basePath);

  const siteName = t('seo.siteName', 'Alievs Space');

  const resolvedTitle = title || (page ? t(`seo.${page}.title`) : t('seo.defaultTitle'));
  const resolvedDescription =
    description || (page ? t(`seo.${page}.description`) : t('seo.home.description'));

  const fullTitle =
    resolvedTitle.includes(siteName) ? resolvedTitle : `${resolvedTitle} | ${siteName}`;

  const alternates = hreflangAlternates(basePath);
  const extraSchemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

  const breadcrumbSchema =
    breadcrumbs && breadcrumbs.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [{ name: siteName, path: '/' }, ...breadcrumbs].map((crumb, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: crumb.name,
            item: absoluteUrl(crumb.path),
          })),
        }
      : null;

  return (
    <Helmet prioritizeSeoTags>
      <html lang={localeTag} />
      <title>{fullTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <link rel="canonical" href={canonical} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {alternates.map((alt) => (
        <link key={alt.hrefLang} rel="alternate" hrefLang={alt.hrefLang} href={alt.href} />
      ))}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={absoluteUrl(image)} />
      <meta property="og:locale" content={localeTag.replace('-', '_')} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={absoluteUrl(image)} />

      {breadcrumbSchema && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      )}
      {extraSchemas.map((node, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(node)}
        </script>
      ))}
      <meta name="language" content={locale} />
    </Helmet>
  );
}

/** Organization + WebSite + LocalBusiness — rendered once, in the Layout. */
export function OrganizationSchema() {
  const { t } = useI18n();

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: ORGANIZATION.name,
        legalName: ORGANIZATION.legalName,
        alternateName: ORGANIZATION.alternateName,
        url: SITE_URL,
        logo: absoluteUrl('/favicon.ico'),
        email: ORGANIZATION.email,
        telephone: ORGANIZATION.phone,
        foundingDate: ORGANIZATION.foundingDate,
        sameAs: [...ORGANIZATION.social],
        address: {
          '@type': 'PostalAddress',
          addressLocality: ORGANIZATION.city,
          addressRegion: ORGANIZATION.region,
          postalCode: ORGANIZATION.postalCode,
          addressCountry: ORGANIZATION.country,
        },
        // One entry per line we actually answer on, so search engines can show
        // the right number to the right market.
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: PHONE_NUMBERS.az.e164,
            email: ORGANIZATION.email,
            contactType: 'sales',
            areaServed: 'AZ',
            availableLanguage: ['az', 'ru', 'en'],
          },
          {
            '@type': 'ContactPoint',
            telephone: PHONE_NUMBERS.ge.e164,
            email: ORGANIZATION.email,
            contactType: 'sales',
            areaServed: 'GE',
            availableLanguage: ['ka', 'ru', 'en'],
          },
          {
            '@type': 'ContactPoint',
            telephone: PHONE_NUMBERS.intl.e164,
            email: ORGANIZATION.email,
            contactType: 'sales',
            availableLanguage: ['en', 'de', 'fr', 'zh', 'ja', 'ko', 'vi', 'ru'],
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: t('seo.siteName', 'Alievs Space'),
        description: t('seo.home.description'),
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: ['en', 'az', 'ru', 'de', 'fr', 'ka', 'zh', 'ja', 'ko', 'vi'],
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${SITE_URL}/#localbusiness`,
        name: ORGANIZATION.name,
        image: absoluteUrl('/og-image.png'),
        url: SITE_URL,
        telephone: ORGANIZATION.phone,
        email: ORGANIZATION.email,
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: ORGANIZATION.street,
          addressLocality: ORGANIZATION.city,
          postalCode: ORGANIZATION.postalCode,
          addressCountry: ORGANIZATION.country,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: ORGANIZATION.latitude,
          longitude: ORGANIZATION.longitude,
        },
        areaServed: ORGANIZATION.areaServed.map((code) => ({ '@type': 'Country', name: code })),
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00',
          },
        ],
      },
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(graph)}</script>
    </Helmet>
  );
}

export default Seo;
