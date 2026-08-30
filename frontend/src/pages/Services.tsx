import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { IconType } from 'react-icons';
import {
  FaUtensils,
  FaShoppingCart,
  FaUniversity,
  FaGraduationCap,
  FaSearch,
  FaCalendarAlt,
  FaImages,
  FaMapMarkerAlt,
  FaTags,
  FaShoppingBag,
  FaCreditCard,
  FaMoneyBillWave,
  FaUsers,
  FaLock,
  FaExchangeAlt,
  FaBook,
  FaChalkboardTeacher,
  FaCertificate,
} from 'react-icons/fa';

import { useI18n } from '@/contexts/I18nContext';
import { Seo } from '@/components/Seo';
import Container from '@/components/ui/Container';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { absoluteUrl } from '@/lib/site';
import { cn } from '@/lib/utils';

import webDevelopment from '../assets/images/web-development.svg';
import bankingFintech from '../assets/images/banking-fintech.svg';
import eCommerceSite from '../assets/images/e-commerce-site.svg';

interface ServiceCard {
  id: string;
  image: string;
  baseKey: string;
  /** Leaf names under `<baseKey>.reqs`. */
  reqs: string[];
}

const SERVICES: ServiceCard[] = [
  {
    id: 'web-development',
    image: webDevelopment,
    baseKey: 'public.services.items.web',
    reqs: ['premiumUi', 'performancePages', 'analyticsReady', 'cleanDocs'],
  },
  {
    id: 'ecommerce',
    image: eCommerceSite,
    baseKey: 'public.services.items.ecommerce',
    reqs: ['catalogFiltersSearch', 'cartCheckout', 'commissionPayout', 'ownerDashboards'],
  },
  {
    id: 'banking-fintech',
    image: bankingFintech,
    baseKey: 'public.services.items.banking',
    reqs: ['rbac', 'auditReporting', 'secureWorkflow', 'complianceFriendly'],
  },
];

/** Phases every engagement runs through, with the tag keys under each. */
const PHASES: Array<{ id: string; tags: string[] }> = [
  {
    id: 'design',
    tags: ['uiux', 'wireframing', 'prototyping', 'designSystem', 'responsive'],
  },
  {
    id: 'development',
    tags: [
      'frontend',
      'backend',
      'database',
      'apiIntegration',
      'testing',
      'performance',
      'security',
      'versionControl',
    ],
  },
  {
    id: 'launch',
    tags: ['domain', 'hosting', 'ssl', 'deployment', 'monitoring', 'maintenance'],
  },
];

const DELIVERY_STEPS = ['1', '2', '3', '4', '5'];

interface BusinessType {
  id: string;
  icon: IconType;
  pages: Array<{ id: string; icon: IconType }>;
}

const BUSINESS_TYPES: BusinessType[] = [
  {
    id: 'restaurant',
    icon: FaUtensils,
    pages: [
      { id: 'menu', icon: FaSearch },
      { id: 'reservation', icon: FaCalendarAlt },
      { id: 'gallery', icon: FaImages },
      { id: 'location', icon: FaMapMarkerAlt },
    ],
  },
  {
    id: 'ecommerce',
    icon: FaShoppingCart,
    pages: [
      { id: 'products', icon: FaTags },
      { id: 'categories', icon: FaShoppingBag },
      { id: 'cart', icon: FaShoppingCart },
      { id: 'checkout', icon: FaCreditCard },
    ],
  },
  {
    id: 'banking',
    icon: FaUniversity,
    pages: [
      { id: 'accounts', icon: FaUniversity },
      { id: 'payments', icon: FaMoneyBillWave },
      { id: 'security', icon: FaLock },
      { id: 'transactions', icon: FaExchangeAlt },
    ],
  },
  {
    id: 'education',
    icon: FaGraduationCap,
    pages: [
      { id: 'courses', icon: FaBook },
      { id: 'students', icon: FaUsers },
      { id: 'lessons', icon: FaChalkboardTeacher },
      { id: 'certificates', icon: FaCertificate },
    ],
  },
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={cn('h-4 w-4 shrink-0', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function Services() {
  const { t } = useI18n();
  const [activeBusiness, setActiveBusiness] = useState(BUSINESS_TYPES[0].id);

  const business = BUSINESS_TYPES.find((b) => b.id === activeBusiness) ?? BUSINESS_TYPES[0];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('nav.services'),
    itemListElement: SERVICES.map((service, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: t(`${service.baseKey}.title`),
        description: t(`${service.baseKey}.description`),
        serviceType: t(`${service.baseKey}.category`),
        provider: { '@type': 'Organization', name: 'Alievs Space MMC', url: absoluteUrl('/') },
        url: absoluteUrl('/services'),
      },
    })),
  };

  return (
    <>
      <Seo
        page="services"
        schema={serviceSchema}
        breadcrumbs={[{ name: t('nav.services'), path: '/services' }]}
      />

      <div className="glow-bg">
        <Container className="pb-4 pt-16 md:pt-24">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">{t('nav.services')}</span>
            <h1 className="mt-5 font-display text-[32px] font-bold leading-tight text-white md:text-[48px]">
              {t('services.heroTitle')}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[14px] leading-relaxed text-text-muted md:text-[17px]">
              {t('public.servicesIntro')}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/contact"
                className="rounded-lg bg-primary px-6 py-3.5 text-[14px] font-semibold text-on-primary shadow-[var(--shadow-glow-primary)] transition-colors hover:bg-primary-hover md:text-[15px]"
              >
                {t('nav.getQuote')}
              </Link>
              <Link
                to="/packages"
                className="rounded-lg border border-border-strong px-6 py-3.5 text-[14px] font-medium text-text transition-colors hover:bg-surface-3 md:text-[15px]"
              >
                {t('home.ctaSecondary')}
              </Link>
            </div>

            <p className="mt-6 text-[12.5px] text-text-subtle">{t('home.heroNote')}</p>
          </Reveal>
        </Container>
      </div>

      {/* Three equal columns — no orphaned third card. */}
      <Section tight>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal
              as="article"
              key={service.id}
              delay={i * 80}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
                <img
                  src={service.image}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full border border-border bg-ink-950/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted backdrop-blur">
                  {t(`${service.baseKey}.category`)}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h2 className="font-display text-[20px] font-semibold text-white md:text-[23px]">
                  {t(`${service.baseKey}.title`)}
                </h2>
                <p className="mt-3 text-[13.5px] leading-relaxed text-text-muted md:text-[15px]">
                  {t(`${service.baseKey}.description`)}
                </p>

                <ul className="mt-6 space-y-2.5 border-t border-border pt-5">
                  {service.reqs.map((req) => (
                    <li key={req} className="flex gap-2.5 text-[13.5px] leading-snug text-text-muted">
                      <CheckIcon className="mt-0.5 text-primary" />
                      <span>{t(`${service.baseKey}.reqs.${req}`)}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/contact?service=${service.id}`}
                  className="mt-auto flex items-center gap-1.5 pt-6 text-[13.5px] font-medium text-primary transition-opacity hover:opacity-80"
                >
                  {t('services.discuss')}
                  <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Interactive structure builder — tab buttons instead of a native select. */}
      <Section tight className="bg-ink-950">
        <SectionHeading
          eyebrow={t('nav.services')}
          title={t('public.servicesBuilder.title')}
          subtitle={t('services.builderHint')}
          className="mb-10"
        />

        <Reveal className="mb-10 flex flex-wrap justify-center gap-2">
          {BUSINESS_TYPES.map((type) => {
            const active = type.id === business.id;
            return (
              <button
                key={type.id}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveBusiness(type.id)}
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus md:text-[14px]',
                  active
                    ? 'border-primary bg-primary text-on-primary'
                    : 'border-border bg-surface/60 text-text-muted hover:border-border-strong hover:text-white',
                )}
              >
                <type.icon aria-hidden className="text-[15px]" />
                {t(`public.servicesBuilder.businessTypes.${type.id}`)}
              </button>
            );
          })}
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {business.pages.map((page, i) => (
            <Reveal
              // Keyed by business so the cards re-animate when the tab changes.
              key={`${business.id}-${page.id}`}
              delay={i * 60}
              className="flex h-full flex-col rounded-2xl border border-border bg-surface/50 p-5 transition-colors hover:border-border-strong"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface-2 text-primary">
                <page.icon aria-hidden className="text-[17px]" />
              </span>
              <h3 className="mt-4 font-display text-[16px] font-semibold text-white md:text-[18px]">
                {t(`public.servicesBuilder.pages.${business.id}.${page.id}.title`)}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-text-muted">
                {t(`public.servicesBuilder.pages.${business.id}.${page.id}.desc`)}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* The three phases, built from data instead of three copy-pasted blocks. */}
      <Section tight>
        <SectionHeading
          title={t('services.includedTitle')}
          subtitle={t('services.includedSubtitle')}
          className="mb-12"
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {PHASES.map((phase, i) => (
            <Reveal
              key={phase.id}
              delay={i * 80}
              className="flex h-full flex-col rounded-2xl border border-border bg-surface/50 p-6 transition-colors hover:border-border-strong"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/40 bg-ink-950 font-mono text-[14px] font-bold text-primary">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-[19px] font-semibold text-white md:text-[21px]">
                  {t(`public.servicesProcess.${phase.id}.title`)}
                </h3>
              </div>

              <ul className="mt-5 flex flex-wrap gap-2">
                {phase.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-[12px] text-text-muted"
                  >
                    {t(`public.servicesProcess.${phase.id}.tags.${tag}`)}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Delivery model: equal-width rows, not the old widening staircase. */}
      <Section tight className="bg-ink-950">
        <SectionHeading
          title={t('public.deliveryTitle')}
          subtitle={t('public.deliveryCopy')}
          className="mb-12"
        />

        <Reveal className="mx-auto max-w-4xl divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {DELIVERY_STEPS.map((step) => (
            <div
              key={step}
              className="grid gap-3 p-5 transition-colors hover:bg-surface-2/50 md:grid-cols-[auto_1fr_1.4fr] md:items-center md:gap-6 md:p-6"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border font-mono text-[14px] font-bold text-primary">
                {step}
              </span>
              <h3 className="font-display text-[17px] font-semibold text-white md:text-[19px]">
                {t(`public.delivery.steps.${step}.title`)}
              </h3>
              <p className="text-[13px] leading-relaxed text-text-muted md:text-[14.5px]">
                {t(`public.delivery.steps.${step}.desc`)}
              </p>
            </div>
          ))}
        </Reveal>

        <Reveal className="mx-auto mt-6 max-w-4xl text-center">
          <p className="text-[13.5px] text-text-muted md:text-[15px]">{t('public.delivery.result')}</p>
          <Link
            to="/process"
            className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-primary hover:underline"
          >
            {t('nav.process')}
            <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </Reveal>
      </Section>

      <Section tight className="glow-bg">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-[26px] font-bold text-white md:text-[36px]">
            {t('home.finalTitle')}
          </h2>
          <p className="mx-auto mt-4 text-[14px] leading-relaxed text-text-muted md:text-[16px]">
            {t('home.finalCopy')}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="rounded-lg bg-primary px-7 py-3.5 text-[15px] font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              {t('home.finalCta')}
            </Link>
            <Link
              to="/packages"
              className="rounded-lg border border-border-strong px-7 py-3.5 text-[15px] font-medium text-text transition-colors hover:bg-surface-3"
            >
              {t('home.packagesCta')}
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
