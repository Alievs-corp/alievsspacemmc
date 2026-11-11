import type { CSSProperties } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { SectionHead, useReveal, WordsReveal } from '@/components/site/blocks';

/** Who we are: a scroll-lit statement, then the five values as a ruled list of big words. */
const WhoWeAre = () => {
  const { t, tRaw } = useI18n();
  const values = [
    t('public.about.who.values.responsibility'),
    t('public.about.who.values.transparency'),
    t('public.about.who.values.premiumQuality'),
    t('public.about.who.values.securityReliability'),
    t('public.about.who.values.longTermPartnership'),
  ];
  const listRef = useReveal<HTMLDivElement>();

  return (
    <section className="as-section" aria-labelledby="about-who">
      <div className="as-wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <SectionHead
            className="lg:col-span-4 lg:self-start"
            eyebrow={t('site.company.about.whoEyebrow')}
            title={t('public.about.whoTitle')}
            id="about-who"
            size="sm"
          />
          <WordsReveal
            className="text-[clamp(21px,2.45vw,38px)] leading-[1.22] lg:col-span-8"
            text={t('public.about.whoCopy')}
            highlight={tRaw<string[]>('site.company.about.whoHighlight', []) || []}
          />
        </div>

        <div ref={listRef} className="mt-20 grid gap-6 md:mt-28 lg:grid-cols-12 lg:gap-12">
          <p className="as-eyebrow lg:col-span-4" data-reveal>
            {t('site.company.about.valuesEyebrow')}
          </p>
          <ul className="cmp-values lg:col-span-8">
            {values.map((v, i) => (
              <li key={i} data-reveal style={{ '--d': `${i * 80}ms` } as CSSProperties}>
                <h3>{v}</h3>
                <span className="as-mono">{String(i + 1).padStart(2, '0')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
