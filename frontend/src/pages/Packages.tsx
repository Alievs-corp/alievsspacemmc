import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Seo } from '@/components/Seo';
import Container from '@/components/ui/Container';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Accordion, type AccordionItem } from '@/components/ui/Accordion';
import { CurrencySwitcher } from '@/components/ui/CurrencySwitcher';
import { ADDONS, COMPARISON_ROWS, PACKAGE_TIERS, type PackageTier } from '@/data/packages';
import { absoluteUrl } from '@/lib/site';
import { cn } from '@/lib/utils';

interface AddonCopy {
  name: string;
  desc: string;
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={cn('h-4 w-4 shrink-0', className)} fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function TierCard({ tier, index }: { tier: PackageTier; index: number }) {
  const { t, tRaw } = useI18n();
  const { format } = useCurrency();
  const navigate = useNavigate();

  const base = `packages.tiers.${tier.id}`;
  const features = tRaw<string[]>(`${base}.features`, []) || [];

  return (
    <Reveal
      as="article"
      delay={index * 80}
      className={cn(
        'relative flex flex-col rounded-2xl border p-6 transition-all duration-300 lg:p-7',
        tier.featured
          ? 'border-primary/60 bg-gradient-to-b from-orange-900/25 to-surface shadow-[var(--shadow-glow-primary)]'
          : 'border-border bg-surface/60 hover:-translate-y-1 hover:border-border-strong',
      )}
    >
      {tier.featured && (
        <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-on-primary">
          {t('packages.mostPopular')}
        </span>
      )}

      <h3 className="font-display text-[22px] font-bold text-white">{t(`${base}.name`)}</h3>
      <p className="mt-1 text-[13px] text-primary">{t(`${base}.tagline`)}</p>

      <div className="mt-5 flex items-baseline gap-2">
        {tier.startingAt && (
          <span className="text-[13px] text-text-subtle">{t('packages.from')}</span>
        )}
        <span className="font-display text-[32px] font-bold leading-none text-white lg:text-[38px]">
          {format(tier.price)}
        </span>
      </div>
      <p className="mt-1 text-[12px] text-text-subtle">{t('packages.perProject')}</p>

      <p className="mt-5 text-[13.5px] leading-relaxed text-text-muted">{t(`${base}.summary`)}</p>

      {/* Stacked rather than inline: the label/value columns get too narrow
          to read once four cards share a row. */}
      <dl className="mt-5 space-y-3 border-y border-border py-4 text-[12.5px]">
        <div>
          <dt className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-text-subtle">
            {t('packages.timeline')}
          </dt>
          <dd className="mt-1 text-[13px] text-text">{t(`${base}.timeline`)}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-text-subtle">
            {t('packages.bestFor')}
          </dt>
          <dd className="mt-1 text-[13px] text-text">{t(`${base}.bestFor`)}</dd>
        </div>
      </dl>

      <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-text-subtle">
        {t('packages.includes')}
      </p>
      <ul className="mt-3 flex-1 space-y-2.5">
        {features.map((feature) => (
          <li key={feature} className="flex gap-2.5 text-[13.5px] leading-snug text-text-muted">
            <CheckIcon className="mt-0.5 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => navigate(`/contact?package=${tier.id}`)}
        className={cn(
          'mt-7 w-full cursor-pointer rounded-lg px-4 py-3 text-[14px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
          tier.featured
            ? 'bg-primary text-on-primary hover:bg-primary-hover'
            : 'border border-border-strong text-text hover:bg-surface-3',
        )}
      >
        {t('packages.choose')}
      </button>
    </Reveal>
  );
}

function ComparisonTable() {
  const { t } = useI18n();

  return (
    <Reveal className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <caption className="sr-only">{t('packages.compare')}</caption>
        <thead>
          <tr className="bg-surface-2">
            <th scope="col" className="px-5 py-4 text-[12px] font-medium uppercase tracking-wider text-text-subtle">
              {t('packages.feature')}
            </th>
            {PACKAGE_TIERS.map((tier) => (
              <th
                key={tier.id}
                scope="col"
                className={cn(
                  'px-5 py-4 text-center font-display text-[15px] font-semibold',
                  tier.featured ? 'text-primary' : 'text-white',
                )}
              >
                {t(`packages.tiers.${tier.id}.name`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {COMPARISON_ROWS.map((row) => (
            <tr key={row.labelKey} className="transition-colors hover:bg-surface-2/60">
              <th scope="row" className="px-5 py-3.5 text-[13.5px] font-normal text-text-muted">
                {t(`packages.${row.labelKey}`)}
              </th>
              {PACKAGE_TIERS.map((tier) => {
                const value = row.values[tier.id];
                return (
                  <td key={tier.id} className="px-5 py-3.5 text-center text-[13.5px] text-text">
                    {typeof value === 'boolean' ? (
                      value ? (
                        <CheckIcon className="mx-auto text-primary" />
                      ) : (
                        <span aria-label="—" className="text-text-disabled">
                          —
                        </span>
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
    </Reveal>
  );
}

export function Packages() {
  const { t, tRaw } = useI18n();
  const { format } = useCurrency();

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
        price: tier.price,
        priceCurrency: 'AZN',
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
      <Seo
        page="packages"
        schema={[offerSchema, faqSchema]}
        breadcrumbs={[{ name: t('nav.packages'), path: '/packages' }]}
      />

      <div className="glow-bg relative z-20">
        <Container className="pb-4 pt-16 md:pt-24">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">{t('nav.pricing')}</span>
            <h1 className="mt-5 font-display text-[32px] font-bold leading-tight text-white md:text-[48px]">
              {t('packages.title')}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[14px] leading-relaxed text-text-muted md:text-[17px]">
              {t('packages.subtitle')}
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-[13px] leading-relaxed text-text-subtle">
              {t('packages.intro')}
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <span className="text-[13px] text-text-subtle">{t('currency.label')}:</span>
              <CurrencySwitcher />
            </div>
          </Reveal>
        </Container>
      </div>

      <Section tight>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {PACKAGE_TIERS.map((tier, i) => (
            <TierCard key={tier.id} tier={tier} index={i} />
          ))}
        </div>
        <p className="mt-6 text-center text-[12.5px] text-text-subtle">
          {t('packages.currencyNote')} {t('packages.vatNote')}
        </p>
      </Section>

      <Section tight className="bg-ink-950">
        <SectionHeading title={t('packages.compare')} className="mb-10" />
        <ComparisonTable />
      </Section>

      <Section tight>
        <SectionHeading
          title={t('packages.addons.title')}
          subtitle={t('packages.addons.subtitle')}
          className="mb-10"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {addonCopy.map((addon, i) => {
            const pricing = ADDONS[i];
            if (!pricing) return null;
            return (
              <Reveal
                key={addon.name}
                delay={i * 60}
                className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-border-strong"
              >
                <div>
                  <h3 className="font-display text-[16px] font-semibold text-white">{addon.name}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-text-muted">{addon.desc}</p>
                </div>
                <p className="font-display text-[20px] font-bold text-primary">
                  {format(pricing.price)}
                  {pricing.recurring && (
                    <span className="ml-1 text-[12px] font-normal text-text-subtle">
                      / {t('packages.perMonth')}
                    </span>
                  )}
                </p>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section tight className="bg-ink-950">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeading align="left" title={t('packages.guarantee.title')} />
          <Reveal>
            <ul className="space-y-4">
              {guarantees.map((item) => (
                <li key={item} className="flex gap-3 text-[14px] leading-relaxed text-text-muted md:text-[15.5px]">
                  <CheckIcon className="mt-1 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section tight>
        <SectionHeading title={t('faq.title')} subtitle={t('faq.subtitle')} className="mb-10" />
        <div className="mx-auto max-w-3xl">
          <Accordion items={faqItems} />
          <p className="mt-6 text-center">
            <Link to="/faq" className="text-[14px] font-medium text-primary hover:underline">
              {t('home.faqCta')} →
            </Link>
          </p>
        </div>
      </Section>

      <Section tight className="glow-bg bg-ink-950">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-[26px] font-bold text-white md:text-[36px]">
            {t('packages.ctaTitle')}
          </h2>
          <p className="mx-auto mt-4 text-[14px] leading-relaxed text-text-muted md:text-[16px]">
            {t('packages.ctaCopy')}
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-7 py-3.5 text-[15px] font-semibold text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            {t('packages.ctaButton')}
          </Link>
        </Reveal>
      </Section>
    </>
  );
}

export default Packages;
