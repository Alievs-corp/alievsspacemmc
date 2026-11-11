import type { CSSProperties } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { CountUp, useReveal } from '@/components/site/blocks';

interface Stat {
  value: string;
  label: string;
}

/** Hard numbers on a ruled band; each figure counts up as it scrolls in. */
const StatsBand = () => {
  const { t, tRaw } = useI18n();
  const stats = tRaw<Stat[]>('home.stats', []) || [];
  const ref = useReveal<HTMLDListElement>();

  return (
    <section className="as-wrap as-section--tight" aria-label={t('site.home.statsEyebrow')}>
      <p className="as-eyebrow mb-8">{t('site.home.statsEyebrow')}</p>
      <dl ref={ref} className="grid grid-cols-2 border-t-[1.5px] border-[var(--as-line-strong)] lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            data-reveal
            style={{ '--d': `${i * 90}ms` } as CSSProperties}
            className="flex min-w-0 flex-col-reverse justify-end gap-3 border-b-[1.5px] border-[var(--as-line)] py-7 pr-3 even:border-l-[1.5px] even:pl-4 sm:pr-6 sm:even:pl-6 lg:border-b-0 lg:py-10 lg:[&:not(:first-child)]:border-l-[1.5px] lg:[&:not(:first-child)]:pl-6"
          >
            <dt className="max-w-[22ch] text-[13.5px] leading-snug text-[var(--as-fg-soft)] md:text-[15px]">{stat.label}</dt>
            <dd className="font-[family-name:var(--as-display)] text-[clamp(46px,6vw,96px)] font-extrabold leading-[.86] tracking-[-.04em] [font-stretch:125%]">
              <CountUp value={stat.value} className={i === stats.length - 1 ? 'text-[var(--as-accent)]' : undefined} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default StatsBand;
