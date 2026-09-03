import { Link } from 'react-router-dom';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { useI18n } from '@/contexts/I18nContext';
import { useMarket } from '@/contexts/MarketContext';
import { PACKAGE_TIERS } from '@/data/packages';
import { cn } from '@/lib/utils';

/** Compact price cards. Full detail lives on /packages. */
const PackagesTeaser = () => {
  const { t } = useI18n();
  const { formatPrice } = useMarket();

  return (
    <Section id="packages">
      <SectionHeading
        eyebrow={t('nav.pricing')}
        title={t('home.packagesTitle')}
        subtitle={t('home.packagesSubtitle')}
        className="mb-12 md:mb-16"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {PACKAGE_TIERS.map((tier, i) => (
          <Reveal
            as="article"
            key={tier.id}
            delay={i * 70}
            className={cn(
              'relative flex flex-col rounded-2xl border p-6 transition-all duration-300',
              tier.featured
                ? 'border-primary/60 bg-gradient-to-b from-orange-900/25 to-surface'
                : 'border-border bg-surface/50 hover:-translate-y-1 hover:border-border-strong',
            )}
          >
            {tier.featured && (
              <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-on-primary">
                {t('packages.mostPopular')}
              </span>
            )}
            <h3 className="font-display text-[19px] font-bold text-white">
              {t(`packages.tiers.${tier.id}.name`)}
            </h3>
            <p className="mt-1 text-[12.5px] text-primary">{t(`packages.tiers.${tier.id}.tagline`)}</p>

            <p className="mt-5 flex items-baseline gap-1.5">
              {tier.startingAt && (
                <span className="text-[12px] text-text-subtle">{t('packages.from')}</span>
              )}
              <span className="font-display text-[27px] font-bold text-white">{formatPrice(tier.price)}</span>
            </p>

            <p className="mt-4 flex-1 text-[13px] leading-relaxed text-text-muted">
              {t(`packages.tiers.${tier.id}.summary`)}
            </p>

            <p className="mt-4 font-mono text-[11.5px] text-text-subtle">
              {t('packages.timeline')}: {t(`packages.tiers.${tier.id}.timeline`)}
            </p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/packages"
          className="rounded-lg bg-primary px-7 py-3.5 text-[14px] font-semibold text-on-primary transition-colors hover:bg-primary-hover md:text-[15px]"
        >
          {t('home.packagesCta')}
        </Link>
        <span className="text-center text-[12px] text-text-subtle">{t('packages.currencyNote')}</span>
      </Reveal>
    </Section>
  );
};

export default PackagesTeaser;
