import type { CSSProperties } from 'react';
import { useState } from 'react';
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
import {
  CtaWalk,
  PageHero,
  Pill,
  RevealGrid,
  SectionHead,
  StackCards,
  Steps,
  Ticker,
  useReveal,
  type WallTone,
} from '@/components/site/blocks';
import { absoluteUrl } from '@/lib/site';
import { cn } from '@/lib/utils';

interface ServiceCard {
  id: string;
  tone: WallTone;
  baseKey: string;
  /** Leaf names under `<baseKey>.reqs`. */
  reqs: string[];
}

const SERVICES: ServiceCard[] = [
  {
    id: 'web-development',
    tone: 'mustard',
    baseKey: 'public.services.items.web',
    reqs: ['premiumUi', 'performancePages', 'analyticsReady', 'cleanDocs'],
  },
  {
    id: 'ecommerce',
    tone: 'burnt',
    baseKey: 'public.services.items.ecommerce',
    reqs: ['catalogFiltersSearch', 'cartCheckout', 'commissionPayout', 'ownerDashboards'],
  },
  {
    id: 'banking-fintech',
    tone: 'rust',
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
    tags: ['frontend', 'backend', 'database', 'apiIntegration', 'testing', 'performance', 'security', 'versionControl'],
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

export function Services() {
  const { t, tRaw } = useI18n();
  const wallWords = tRaw<string[]>('site.offer.services.words', []) || [];
  const [activeBusiness, setActiveBusiness] = useState(BUSINESS_TYPES[0].id);
  const phasesRef = useReveal();
  const resultRef = useReveal();

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

  const tickerItems = [...SERVICES.map((s) => t(`${s.baseKey}.category`)), ...PHASES.map((p) => t(`public.servicesProcess.${p.id}.title`))];

  return (
    <>
      <Seo page="services" schema={serviceSchema} breadcrumbs={[{ name: t('nav.services'), path: '/services' }]} />

      <PageHero
        word={t('site.offer.services.word')}
        num={String(SERVICES.length)}
        tone="burnt"
        eyebrow={t('nav.services')}
        title={t('services.heroTitle')}
        lead={t('public.servicesIntro')}
        crumbs={[{ label: t('nav.home'), to: '/' }, { label: t('nav.services') }]}
        actions={
          <>
            <Pill to="/contact" variant="light">
              {t('nav.getQuote')}
            </Pill>
            <Pill to="/packages" variant="ghost">
              {t('home.ctaSecondary')}
            </Pill>
          </>
        }
      >
        <p className="as-mono max-w-[60ch] leading-relaxed opacity-80">{t('home.heroNote')}</p>
      </PageHero>

      {/* Service lines as stacked plaster cards. */}
      <section className="as-section">
        <div className="as-wrap">
          <SectionHead
            eyebrow={t('site.offer.services.stackEyebrow')}
            title={t('home.servicesTitle')}
            lead={t('home.servicesSubtitle')}
            className="mb-12 md:mb-16"
          />
          <StackCards
            items={SERVICES.map((service, i) => ({
              word: wallWords[i] || t(`${service.baseKey}.category`).toLocaleUpperCase(),
              tone: service.tone,
              title: t(`${service.baseKey}.title`),
              text: t(`${service.baseKey}.description`),
              tags: service.reqs.map((req) => t(`${service.baseKey}.reqs.${req}`)),
              extra: (
                <div className="pt-2">
                  <Pill to={`/contact?service=${service.id}`} variant="light" size="sm">
                    {t('services.discuss')}
                  </Pill>
                </div>
              ),
            }))}
          />
        </div>
      </section>

      <Ticker items={tickerItems} duration={30} />

      {/* Interactive structure builder. */}
      <section className="as-section as-bg-cream">
        <div className="as-wrap">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <SectionHead
              eyebrow={t('site.offer.services.builderEyebrow')}
              title={t('public.servicesBuilder.title')}
              lead={t('services.builderHint')}
              size="md"
            />
            <div className="flex flex-wrap gap-2 lg:justify-end" role="group" aria-label={t('public.servicesBuilder.title')}>
              {BUSINESS_TYPES.map((type) => {
                const active = type.id === business.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveBusiness(type.id)}
                    className={cn('as-btn as-btn--sm', !active && 'as-btn--ghost')}
                  >
                    <type.icon aria-hidden className="text-[14px]" />
                    <span>{t(`public.servicesBuilder.businessTypes.${type.id}`)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Keyed by business so the cards re-animate when the tab changes. */}
          <RevealGrid key={business.id} className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" step={80}>
            {business.pages.map((page, i) => (
              <article key={page.id} className="as-tile as-tile--hover flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="as-mono text-text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-on-primary">
                    <page.icon aria-hidden className="text-[16px]" />
                  </span>
                </div>
                <h3 className="as-h3 mt-10">{t(`public.servicesBuilder.pages.${business.id}.${page.id}.title`)}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
                  {t(`public.servicesBuilder.pages.${business.id}.${page.id}.desc`)}
                </p>
              </article>
            ))}
          </RevealGrid>
        </div>
      </section>

      {/* The three phases every engagement runs through. */}
      <section className="as-section">
        <div className="as-wrap">
          <SectionHead
            eyebrow={t('site.offer.services.phasesEyebrow')}
            title={t('services.includedTitle')}
            lead={t('services.includedSubtitle')}
            className="mb-12 md:mb-16"
          />
          <div ref={phasesRef} className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
            {PHASES.map((phase, i) => (
              <div
                key={phase.id}
                data-reveal
                style={{ '--d': `${i * 110}ms` } as CSSProperties}
                className="border-t-[1.5px] border-[var(--as-line-strong)] pt-6"
              >
                <div className="flex items-baseline gap-4">
                  <span className="as-step-n">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="as-h3">{t(`public.servicesProcess.${phase.id}.title`)}</h3>
                </div>
                <ul className="as-tags mt-6">
                  {phase.tags.map((tag) => (
                    <li key={tag}>{t(`public.servicesProcess.${phase.id}.tags.${tag}`)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery model: ruled steps on ink. */}
      <section className="as-section as-bg-ink" style={{ '--as-line-strong': 'rgba(242, 235, 223, .7)' } as CSSProperties}>
        <div className="as-wrap grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div className="lg:sticky lg:top-[calc(var(--as-header-h)+40px)] lg:self-start">
            <SectionHead
              eyebrow={t('site.offer.services.deliveryEyebrow')}
              title={t('public.deliveryTitle')}
              lead={t('public.deliveryCopy')}
              size="sm"
            />
          </div>
          <div>
            <Steps
              items={DELIVERY_STEPS.map((step) => ({
                title: t(`public.delivery.steps.${step}.title`),
                text: t(`public.delivery.steps.${step}.desc`),
              }))}
            />
            <div ref={resultRef} className="mt-10 grid justify-items-start gap-5" data-reveal>
              <p className="as-lead">{t('public.delivery.result')}</p>
              <Pill to="/process" variant="ghost" size="sm">
                {t('nav.process')}
              </Pill>
            </div>
          </div>
        </div>
      </section>

      <CtaWalk
        tone="rust"
        eyebrow={t('site.offer.services.ctaEyebrow')}
        title={t('home.finalTitle')}
        lead={t('home.finalCopy')}
        actions={
          <>
            <Pill to="/contact" variant="light">
              {t('home.finalCta')}
            </Pill>
            <Pill to="/packages" variant="ghost">
              {t('home.packagesCta')}
            </Pill>
          </>
        }
      />
    </>
  );
}
