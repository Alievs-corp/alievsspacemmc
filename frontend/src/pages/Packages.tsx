import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useMarket } from '@/contexts/MarketContext';
import { Seo } from '@/components/Seo';
import type { AccordionItem } from '@/components/ui/Accordion';
import { CurrencySwitcher } from '@/components/ui/CurrencySwitcher';
import { CountrySwitcher } from '@/components/ui/CountrySwitcher';
import { CtaWalk, Pill, PageHero, SectionHead, Ticker, useReveal, WALL } from '@/components/site/blocks';
import { Check, Disclosure } from '@/components/site/offer/parts';
import { ADDONS, COMPARISON_ROWS, PACKAGE_TIERS, type PackageTier } from '@/data/packages';
import { convert } from '@/lib/currency';
import { absoluteUrl } from '@/lib/site';
import { cn } from '@/lib/utils';

interface AddonCopy {
  name: string;
  desc: string;
}

function TierCard({ tier, index }: { tier: PackageTier; index: number }) {
  const { t, tRaw } = useI18n();
  const { formatPrice } = useMarket();
  const navigate = useNavigate();

  const base = `packages.tiers.${tier.id}`;
  const features = tRaw<string[]>(`${base}.features`, []) || [];

  return (
    <div data-reveal style={{ '--d': `${index * 90}ms` } as CSSProperties} className="min-w-0">
      <article
        style={tier.featured ? ({ '--c': WALL.burnt.c } as CSSProperties) : undefined}
        className={cn('ofr-tier', tier.featured && 'ofr-tier--featured as-stucco as-on-color')}
      >
        {tier.featured && <span className="ofr-tier__badge">{t('packages.mostPopular')}</span>}

        <h3 className="ofr-tier__name">{t(`${base}.name`)}</h3>
        <p className="ofr-tier__tag">{t(`${base}.tagline`)}</p>

        <div className="mt-6 flex flex-wrap items-baseline gap-x-2">
          {tier.startingAt && <span className="as-mono opacity-80">{t('packages.from')}</span>}
          <span className="ofr-tier__price">{formatPrice(tier.price)}</span>
        </div>
        <p className="as-mono mt-2 opacity-70">{t('packages.perProject')}</p>

        <p className="mt-5 text-[14.5px] leading-relaxed text-[var(--as-fg-soft)]">{t(`${base}.summary`)}</p>

        {/* Stacked rather than inline: the label/value columns get too narrow
          to read once four cards share a row. */}
        <dl className="ofr-tier__meta">
          <div>
            <dt>{t('packages.timeline')}</dt>
            <dd>{t(`${base}.timeline`)}</dd>
          </div>
          <div>
            <dt>{t('packages.bestFor')}</dt>
            <dd>{t(`${base}.bestFor`)}</dd>
          </div>
        </dl>

        <p className="as-mono mt-5 opacity-80">{t('packages.includes')}</p>
        <ul className="ofr-tier__features">
          {features.map((feature) => (
            <li key={feature}>
              <Check />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => navigate(`/contact?package=${tier.id}`)}
          className={cn('as-btn as-btn--block mt-8', tier.featured ? 'as-btn--light' : 'as-btn--ghost')}
        >
          <span>{t('packages.choose')}</span>
          <span className="as-arrow" aria-hidden>
            →
          </span>
        </button>
      </article>
    </div>
  );
}

function ComparisonTable() {
  const { t } = useI18n();
  const ref = useReveal();

  return (
    <div ref={ref} data-reveal>
      <p className="as-mono mb-4 text-text-muted lg:hidden">{t('site.offer.packages.swipeHint')} →</p>
      <div className="ofr-compare__scroll">
        <table className="ofr-table">
          <caption className="sr-only">{t('packages.compare')}</caption>
          <thead>
            <tr>
              <th scope="col">{t('packages.feature')}</th>
              {PACKAGE_TIERS.map((tier) => (
                <th key={tier.id} scope="col" className={cn(tier.featured && 'is-featured')}>
                  {t(`packages.tiers.${tier.id}.name`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.labelKey}>
                <th scope="row">{t(`packages.${row.labelKey}`)}</th>
                {PACKAGE_TIERS.map((tier) => {
                  const value = row.values[tier.id];
                  return (
                    <td key={tier.id} className={cn(tier.featured && 'is-featured')}>
                      {typeof value === 'boolean' ? (
                        value ? (
                          <>
                            <Check />
                            <span className="sr-only">{t('site.offer.packages.included')}</span>
                          </>
                        ) : (
                          <>
                            <span aria-hidden className="ofr-table__no">
                              —
                            </span>
                            <span className="sr-only">{t('site.offer.packages.notIncluded')}</span>
                          </>
                        )
                      ) : value.startsWith('compareLabels.') ? (
                        t(`packages.${value}`)
                      ) : (
                        value
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Packages() {
  const { t, tRaw } = useI18n();
  const { market, priceOf } = useMarket();
  const { currency, format } = useCurrency();
  const tiersRef = useReveal();
  const addonsRef = useReveal<HTMLUListElement>();
  const guaranteeRef = useReveal<HTMLOListElement>();

  const addonCopy = tRaw<AddonCopy[]>('packages.addons.items', []) || [];
  const guarantees = tRaw<string[]>('packages.guarantee.items', []) || [];
  const faqItems = (tRaw<AccordionItem[]>('faq.items', []) || []).slice(0, 5);

  // An OfferCatalog lets search engines show the price range for these services.
  const offerSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Website development',
    provider: { '@type': 'Organization', name: 'Alievs Space MMC', url: absoluteUrl('/') },
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: t('packages.title'),
      itemListElement: PACKAGE_TIERS.map((tier) => ({
        '@type': 'Offer',
        name: t(`packages.tiers.${tier.id}.name`),
        description: t(`packages.tiers.${tier.id}.summary`),
        price: convert(priceOf(tier.price), currency),
        priceCurrency: currency,
        url: absoluteUrl('/packages'),
        availability: 'https://schema.org/InStock',
      })),
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <>
      <Seo page="packages" schema={[offerSchema, faqSchema]} breadcrumbs={[{ name: t('nav.packages'), path: '/packages' }]} />

      <PageHero
        word={t('site.offer.packages.word')}
        num={String(PACKAGE_TIERS.length)}
        tone="mustard"
        eyebrow={t('nav.pricing')}
        title={t('packages.title')}
        lead={t('packages.subtitle')}
        crumbs={[{ label: t('nav.home'), to: '/' }, { label: t('nav.packages') }]}
      />

      {/* Market + currency pickers: the whole page re-prices from here. */}
      <div className="as-wrap">
        <div className="ofr-controls">
          <div className="grid gap-2">
            <p className="as-eyebrow">{t('site.offer.packages.controlsEyebrow')}</p>
            <p className="max-w-[70ch] text-[14.5px] leading-relaxed text-text-muted">{t('packages.intro')}</p>
          </div>
          <div className="grid gap-3 lg:justify-items-end">
            <div className="ofr-controls__pickers">
              <div>
                <span className="as-mono text-text-muted">{t('market.label')}</span>
                <CountrySwitcher align="left" />
              </div>
              <div>
                <span className="as-mono text-text-muted">{t('currency.label')}</span>
                <CurrencySwitcher />
              </div>
            </div>
            <p className="max-w-[52ch] text-[12.5px] leading-relaxed text-text-subtle lg:text-right">
              {t('market.priceNote').replace('{country}', t(`market.countries.${market.code}`))}
            </p>
          </div>
        </div>
      </div>

      {/* Tiers. */}
      <section className="as-section--tight">
        <div className="as-wrap">
          <SectionHead
            eyebrow={t('site.offer.packages.tiersEyebrow')}
            title={t('site.offer.packages.tiersTitle')}
            size="md"
            className="mb-10 md:mb-14"
          />
          <div ref={tiersRef} className="ofr-tiers">
            {PACKAGE_TIERS.map((tier, i) => (
              <TierCard key={tier.id} tier={tier} index={i} />
            ))}
          </div>
          <p className="mt-8 max-w-[80ch] text-[12.5px] leading-relaxed text-text-subtle">
            {t('market.note')} {t('packages.vatNote')}
          </p>
        </div>
      </section>

      <Ticker items={PACKAGE_TIERS.map((tier) => t(`packages.tiers.${tier.id}.tagline`))} duration={36} />

      {/* Comparison table. */}
      <section className="as-section as-bg-cream">
        <div className="as-wrap">
          <SectionHead
            eyebrow={t('site.offer.packages.compareEyebrow')}
            title={t('packages.compare')}
            size="md"
            className="mb-10 md:mb-14"
          />
          <ComparisonTable />
        </div>
      </section>

      {/* Add-ons as a ruled price list. */}
      <section className="as-section">
        <div className="as-wrap grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div className="lg:sticky lg:top-[calc(var(--as-header-h)+40px)] lg:self-start">
            <SectionHead
              eyebrow={t('site.offer.packages.addonsEyebrow')}
              title={t('packages.addons.title')}
              lead={t('packages.addons.subtitle')}
              size="sm"
            />
          </div>
          <ul ref={addonsRef} className="ofr-addons">
            {addonCopy.map((addon, i) => {
              const pricing = ADDONS[i];
              if (!pricing) return null;
              return (
                <li key={addon.name} data-reveal style={{ '--d': `${Math.min(i, 5) * 70}ms` } as CSSProperties}>
                  <div className="min-w-0">
                    <h3 className="as-h3 text-[clamp(19px,1.8vw,26px)]">{addon.name}</h3>
                    <p>{addon.desc}</p>
                  </div>
                  <p className="ofr-addons__price m-0">
                    {format(priceOf(pricing.price))}
                    {pricing.recurring && <span className="ofr-addons__per">/ {t('packages.perMonth')}</span>}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Guarantees on a plaster wall. */}
      <section className="as-section as-stucco as-on-color" style={{ '--c': WALL.amber.c } as CSSProperties}>
        <div className="as-wrap grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div className="grid content-start justify-items-start gap-4">
            <p className="as-eyebrow">{t('site.offer.packages.guaranteeEyebrow')}</p>
            <h2 className="as-title as-title--sm">{t('packages.guarantee.title')}</h2>
          </div>
          <ol ref={guaranteeRef} className="as-steps">
            {guarantees.map((item, i) => (
              <li key={item} data-reveal style={{ '--d': `${Math.min(i, 5) * 70}ms` } as CSSProperties}>
                <span className="as-step-n text-[var(--as-white)]">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-1 max-w-none text-[clamp(17px,1.5vw,21px)] font-semibold leading-snug text-[var(--as-white)]">{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ. */}
      <section className="as-section">
        <div className="as-wrap grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div className="grid content-start justify-items-start gap-6 lg:sticky lg:top-[calc(var(--as-header-h)+40px)] lg:self-start">
            <SectionHead eyebrow={t('site.offer.packages.faqEyebrow')} title={t('faq.title')} lead={t('faq.subtitle')} size="sm" />
            <Pill to="/faq" variant="ghost" size="sm">
              {t('home.faqCta')}
            </Pill>
          </div>
          <Disclosure items={faqItems} />
        </div>
      </section>

      <CtaWalk
        tone="burnt"
        eyebrow={t('site.offer.packages.ctaEyebrow')}
        title={t('packages.ctaTitle')}
        lead={t('packages.ctaCopy')}
        actions={
          <Pill to="/contact" variant="light">
            {t('packages.ctaButton')}
          </Pill>
        }
      />
    </>
  );
}

export default Packages;
