import type { CSSProperties } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import eCommerce from '../assets/icons/e-commerce.svg';
import beauty from '../assets/icons/beauty.svg';
import marketplaces from '../assets/icons/marketplaces.svg';
import manufacturing from '../assets/icons/manufacturing.svg';
import logistics from '../assets/icons/logistics.svg';
import finance from '../assets/icons/finance.svg';
import startup from '../assets/icons/startup.svg';
import trustedPeople from '../assets/images/trusted-people.svg';
import { Seo } from '@/components/Seo';
import { CtaWalk, PageHero, Pill, SectionHead, Ticker, useReveal, WALL, type WallTone } from '@/components/site/blocks';
import { cn } from '@/lib/utils';
import '@/components/site/company/company.css';

const ITEMS = [
  ['retail', eCommerce],
  ['marketplaces', marketplaces],
  ['banking', finance],
  ['manufacturing', manufacturing],
  ['beauty', beauty],
  ['logistics', logistics],
  ['startup', startup],
] as const;

const TONES: WallTone[] = ['amber', 'burnt', 'mustard', 'rust'];

export function Industries() {
  const { t, tRaw } = useI18n();
  const gridRef = useReveal<HTMLDivElement>();
  const trustRef = useReveal<HTMLDivElement>();
  const cta = tRaw<string[]>('site.company.industries.ctaTitle', []) || [];

  const industries = ITEMS.map(([key, icon]) => ({
    key,
    icon,
    category: t(`public.industries.items.${key}.category`),
    title: t(`public.industries.items.${key}.title`),
    description: t(`public.industries.items.${key}.description`),
  }));
  const total = String(industries.length).padStart(2, '0');

  return (
    <>
      <Seo page="industries" breadcrumbs={[{ name: t('nav.industries'), path: '/industries' }]} />

      <PageHero
        tone="amber"
        word={t('site.company.industries.word')}
        num={String(industries.length)}
        eyebrow={t('site.company.industries.eyebrow')}
        title={t('nav.industries', 'Industries')}
        lead={t('public.industriesIntro')}
        crumbs={[{ label: t('nav.home'), to: '/' }, { label: t('nav.industries') }]}
        actions={
          <Pill to="/contact" variant="light">
            {t('public.industriesCta')}
          </Pill>
        }
      />

      {/* Sector tiles: a 3-column bento (first and last span two) revealed with a stagger. */}
      <section className="as-section" aria-label={t('nav.industries', 'Industries')}>
        <div ref={gridRef} className="as-wrap grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {industries.map((item, idx) => {
            const tone = WALL[TONES[idx % TONES.length]];
            const wide = idx === 0 || idx === industries.length - 1;
            return (
              <div
                key={item.key}
                data-reveal
                style={{ '--d': `${Math.min(idx, 6) * 70}ms` } as CSSProperties}
                className={cn('flex min-w-0', wide && 'lg:col-span-2', idx === industries.length - 1 && 'md:col-span-2')}
              >
                <article className="as-tile as-tile--hover cmp-ind flex w-full min-w-0 flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <span className="cmp-ind__icon as-stucco" style={{ '--c': tone.c } as CSSProperties}>
                      <img src={item.icon} alt={item.category} width={28} height={28} loading="lazy" decoding="async" />
                    </span>
                    <span className="as-mono text-[var(--as-fg-soft)]">
                      {String(idx + 1).padStart(2, '0')} / {total}
                    </span>
                  </div>
                  <h2 className="as-mono mt-4 text-[var(--as-accent)]">{item.category}</h2>
                  <h3 className={cn('as-h3', wide && 'lg:max-w-[18ch] lg:text-[clamp(26px,2.8vw,40px)]')}>{item.title}</h3>
                  <p className={cn('flex-1 leading-relaxed text-[var(--as-fg-soft)]', wide && 'lg:max-w-[52ch]')}>{item.description}</p>
                  <div className="pt-2">
                    <Pill to="/contact" variant="ghost" size="sm">
                      {t('public.industriesCta')}
                    </Pill>
                  </div>
                  <span className="cmp-ind__ghost" aria-hidden>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </article>
              </div>
            );
          })}
        </div>
      </section>

      <Ticker items={industries.map((i) => i.category)} duration={40} />

      <section className="as-section as-bg-cream" aria-labelledby="industries-trusted">
        <div ref={trustRef} className="as-wrap grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHead
              eyebrow={t('site.company.industries.trustedEyebrow')}
              title={t('public.industries.trustedTitle')}
              id="industries-trusted"
              size="sm"
            />
            <div className="mt-8 grid gap-5 text-[16px] leading-[1.7] text-[var(--as-fg-soft)] md:text-[17px]">
              <p data-reveal style={{ '--d': '160ms' } as CSSProperties}>
                {t('public.industries.trustedCopy1')}
              </p>
              <p data-reveal style={{ '--d': '240ms' } as CSSProperties}>
                {t('public.industries.trustedCopy2')}
              </p>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="cmp-photo mx-auto aspect-square max-w-[460px]" data-reveal="scale" style={{ '--d': '120ms' } as CSSProperties}>
              <img
                src={trustedPeople}
                alt={t('site.company.industries.imgAlt', 'Trusted People')}
                width={243}
                height={243}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <CtaWalk
        tone="rust"
        eyebrow={t('site.company.industries.ctaEyebrow')}
        title={
          <>
            {cta[0]}
            <br />
            <em>{cta[1]}</em>
            <br />
            {cta[2]}
          </>
        }
        lead={t('site.company.industries.ctaLead')}
        actions={
          <>
            <Pill to="/contact" variant="light">
              {t('public.industriesCta')}
            </Pill>
            <Pill to="/case-studies" variant="ghost">
              {t('nav.caseStudies')}
            </Pill>
          </>
        }
      />
    </>
  );
}
