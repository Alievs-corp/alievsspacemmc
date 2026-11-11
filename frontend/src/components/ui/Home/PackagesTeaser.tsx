import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { useMarket } from '@/contexts/MarketContext';
import { PACKAGE_TIERS } from '@/data/packages';
import { SectionHead, useReveal } from '@/components/site/blocks';
import { cn } from '@/lib/utils';

/**
 * Compact price cards (full detail lives on /packages). Prices go through the
 * market/currency switcher exactly as on the packages page; the featured tier
 * is a burnt plaster card.
 */
const PackagesTeaser = () => {
  const { t } = useI18n();
  const { formatPrice } = useMarket();
  const ref = useReveal();

  return (
    <section id="packages" className="as-bg-cream as-section">
      <div className="as-wrap">
        <div className="grid gap-6 pb-12 md:pb-16 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-16">
          <SectionHead eyebrow={t('nav.pricing')} title={t('home.packagesTitle')} size="md" />
          <p className="as-lead lg:pb-2">{t('home.packagesSubtitle')}</p>
        </div>

        <div ref={ref} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PACKAGE_TIERS.map((tier, i) => (
            <Link
              key={tier.id}
              to="/packages"
              data-reveal
              style={{ '--d': `${i * 80}ms` } as CSSProperties}
              className={cn(
                'as-tile group flex min-w-0 flex-col',
                tier.featured
                  ? 'as-on-color border-transparent text-[var(--as-white)] [background-color:var(--as-burnt)] [background-image:url(/tex/stucco.webp)] [background-size:384px]'
                  : 'bg-[var(--as-bg)]',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="as-mono opacity-70">{String(i + 1).padStart(2, '0')}</span>
                {tier.featured && (
                  <span className="as-tag border-[rgba(255,244,225,.55)] bg-[var(--as-white)] text-[var(--as-ink)]">
                    {t('packages.mostPopular')}
                  </span>
                )}
              </div>
              <h3 className="as-h3 mt-8 text-[clamp(22px,2vw,28px)]">{t(`packages.tiers.${tier.id}.name`)}</h3>
              <p className={cn('mt-1.5 text-[14px]', tier.featured ? 'font-medium text-[var(--as-white)]' : 'text-[var(--as-accent)]')}>
                {t(`packages.tiers.${tier.id}.tagline`)}
              </p>

              <p className="mt-7 flex flex-wrap items-baseline gap-x-2 border-t border-[var(--as-line)] pt-5">
                {tier.startingAt && <span className="as-mono opacity-75">{t('packages.from')}</span>}
                <span className="font-[family-name:var(--as-display)] text-[clamp(30px,2.6vw,40px)] font-extrabold leading-none tracking-[-.03em] [font-stretch:112%]">
                  {formatPrice(tier.price)}
                </span>
              </p>

              <p className="mt-4 flex-1 text-[14px] leading-relaxed text-[var(--as-fg-soft)]">{t(`packages.tiers.${tier.id}.summary`)}</p>

              <p className="as-mono mt-6 flex items-center justify-between gap-3 opacity-80">
                <span>
                  {t('packages.timeline')}: {t(`packages.tiers.${tier.id}.timeline`)}
                </span>
                <span aria-hidden className="text-[15px] transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link to="/packages" className="as-btn">
            <span>{t('home.packagesCta')}</span>
            <span className="as-arrow" aria-hidden>
              →
            </span>
          </Link>
          <p className="max-w-[60ch] text-[13px] leading-relaxed text-[var(--as-fg-soft)]">{t('packages.currencyNote')}</p>
        </div>
      </div>
    </section>
  );
};

export default PackagesTeaser;
