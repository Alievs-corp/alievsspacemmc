import { Link } from 'react-router-dom';
import { ArrowRight, Boxes, ShieldCheck, Store } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import OurProjects from '@/components/ui/OurProjects';
import { Seo } from '@/components/Seo';

/** One entry per delivered project; copy lives in the locale bundles. */
const CASES: Array<{ id: string; key: string; Icon: LucideIcon }> = [
  { id: 'marketplace-mvp', key: 'marketplace', Icon: Store },
  { id: 'fintech-reporting-dashboard', key: 'fintech', Icon: ShieldCheck },
  { id: 'operations-inventory-system', key: 'operations', Icon: Boxes },
];

const CaseStudies = () => {
  const { t, tRaw } = useI18n();
  const { loading } = useContent();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-text">{t('admin.loading')}</div>
      </div>
    );
  }

  return (
    <>
      <Seo page="caseStudies" breadcrumbs={[{ name: t('nav.caseStudies'), path: '/case-studies' }]} />

      <Section tight className="glow-bg">
        <SectionHeading
          eyebrow={t('public.caseStudies.eyebrow', 'Selected work')}
          title={t('public.caseStudies.heading', t('nav.caseStudies'))}
          subtitle={t('public.caseStudiesIntro')}
        />
      </Section>

      <Section tight className="pt-0">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CASES.map(({ id, key, Icon }, i) => {
            const focus = tRaw<string[]>(`public.caseStudies.items.${key}.focus`, []) || [];

            return (
              <Reveal
                as="article"
                key={id}
                delay={i * 80}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-[var(--shadow-2)] focus-within:border-border-strong"
              >
                {/* Warm bloom that answers the hover, kept behind the content. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-primary/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                />

                <div className="relative flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface-2 text-primary">
                    <Icon aria-hidden className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.16em] text-text-subtle">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <p className="relative mt-5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-primary">
                  {t(`public.caseStudies.items.${key}.category`)}
                </p>

                <h3 className="relative mt-2 font-display text-[20px] font-semibold leading-snug text-white md:text-[22px]">
                  {t(`public.caseStudies.items.${key}.title`)}
                </h3>

                {/* Clamped so three cards of unequal copy still line up. */}
                <p className="relative mt-3 line-clamp-4 text-[13.5px] leading-relaxed text-text-muted">
                  {t(`public.caseStudies.items.${key}.description`)}
                </p>

                <div className="relative mt-6">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-text-subtle">
                    {t('public.caseStudies.keyFocusLabel')}
                  </p>
                  <ul className="mt-2.5 flex flex-wrap gap-1.5">
                    {focus.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-border bg-surface-2/70 px-2.5 py-1 text-[11.5px] text-text-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* `after` stretches the hit area over the whole card. */}
                <Link
                  to={`/case-studies/${id}`}
                  className="relative mt-auto inline-flex items-center gap-1.5 pt-6 text-[13.5px] font-semibold text-primary after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  {t('public.caseStudies.viewCta')}
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section tight className="pt-0">
        <Reveal className="glow-bg relative overflow-hidden rounded-2xl border border-border bg-surface/60 px-6 py-12 text-center md:px-12 md:py-14">
          <h2 className="font-display text-[24px] font-bold leading-tight text-white md:text-[32px]">
            {t('public.caseStudies.requestTitle')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[13.5px] leading-relaxed text-text-muted md:text-[16px]">
            {t('public.caseStudies.requestCopy')}
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex rounded-lg bg-primary px-7 py-3.5 text-[14px] font-semibold text-on-primary shadow-[var(--shadow-glow-primary)] transition-colors hover:bg-primary-hover md:text-[15px]"
          >
            {t('nav.getQuote')}
          </Link>
        </Reveal>
      </Section>

      <OurProjects />
    </>
  );
};

export default CaseStudies;
