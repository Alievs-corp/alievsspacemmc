import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';
import { CountUp, CtaWalk, PageHero, Pill, SectionHead, Steps, useReveal } from '../blocks';
import { CASES, splitFact, type CaseEntry } from './cases';
import { accentLast } from './text';
import './work.css';

const CONTEXT_KEYS = ['industry', 'projectType', 'scope', 'focus'] as const;

/** One numbered chapter: sticky outline numeral + h2 on the left, body on the right. */
function Chapter({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="wk-chapter">
      <div className="wk-chapter__side grid content-start gap-4">
        <span className="wk-num-line wk-chapter__n" aria-hidden data-reveal="left">
          {String(n).padStart(2, '0')}
        </span>
        <h2 className="as-title as-title--sm max-w-[14ch]" data-reveal style={{ '--d': '80ms' } as CSSProperties}>
          {title}
        </h2>
      </div>
      <div className="grid content-start gap-8 md:pt-4" data-reveal style={{ '--d': '160ms' } as CSSProperties}>
        {children}
      </div>
    </section>
  );
}

/**
 * Shared template of the case-study detail pages. Each page passes its copy
 * namespace (`public.<ns>.*`) and the keys of its delivered items.
 */
export function CaseStudyLayout({ ns, delivered }: { ns: CaseEntry['ns']; delivered: string[] }) {
  const { t, tRaw } = useI18n();
  const { loading } = useContent();
  const factsRef = useReveal();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="as-mono text-[var(--as-fg-soft)]">{t('public.loading')}</p>
      </div>
    );
  }

  const index = Math.max(
    0,
    CASES.findIndex((c) => c.ns === ns),
  );
  const entry = CASES[index];
  const next = CASES[(index + 1) % CASES.length];
  const k = (key: string) => t(`public.${ns}.${key}`);
  const title = k('title');
  const focus = tRaw<string[]>(`public.caseStudies.items.${entry.key}.focus`, []) || [];
  const facts = CONTEXT_KEYS.map((key) => splitFact(k(`contextItems.${key}`)));

  return (
    <>
      <Helmet>
        <title>{`${title} | Alievs Space MMC`}</title>
        <meta name="description" content={k('intro')} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={k('intro')} />
        <meta property="og:type" content="website" />
      </Helmet>

      <PageHero
        word={t(`site.work.cases.words.${entry.key}`)}
        num={String(index + 1).padStart(2, '0')}
        tone={entry.tone}
        eyebrow={k('badge')}
        title={title}
        // The mustard accent would vanish on a mustard wall.
        accent={entry.tone === 'mustard' ? [] : title.split(/\s+/).slice(-1)}
        lead={k('intro')}
        crumbs={[{ label: t('nav.caseStudies'), to: '/case-studies' }, { label: title }]}
        actions={
          <>
            <Pill to="/contact" variant="light">
              {k('ctaButton')}
            </Pill>
            <Pill to="/case-studies" variant="ghost" arrow={false}>
              {k('back')}
            </Pill>
          </>
        }
      />

      {/* Project context: two counted figures and the four facts. */}
      <section className="as-section--tight as-bg-ink">
        <div ref={factsRef} className="as-wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="grid content-start gap-10 lg:col-span-5">
            <SectionHead eyebrow={`${t('site.work.cases.caseLabel')} ${String(index + 1).padStart(2, '0')}`} title={k('contextTitle')} size="sm" />
            <div className="grid grid-cols-2 gap-6" data-reveal style={{ '--d': '120ms' } as CSSProperties}>
              <div className="grid content-start gap-3">
                <CountUp value={String(delivered.length)} className="wk-stat-n" />
                <span className="as-mono text-[var(--as-fg-soft)]">{t('site.work.cases.statModules')}</span>
              </div>
              {focus.length > 0 && (
                <div className="grid content-start gap-3">
                  <CountUp value={String(focus.length)} className="wk-stat-n" />
                  <span className="as-mono text-[var(--as-fg-soft)]">{t('site.work.cases.statFocus')}</span>
                </div>
              )}
            </div>
          </div>
          <dl className="wk-facts self-end lg:col-span-7">
            {facts.map((f, i) => (
              <div key={i} data-reveal style={{ '--d': `${i * 80}ms` } as CSSProperties}>
                {f.label && <dt>{f.label}</dt>}
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="as-wrap pt-6 md:pt-10">
        <Chapter n={1} title={k('challengeTitle')}>
          <p className="wk-chapter__copy">{k('challengeCopy')}</p>
        </Chapter>
        <Chapter n={2} title={k('solutionTitle')}>
          <p className="wk-chapter__copy">{k('solutionCopy')}</p>
        </Chapter>
        <Chapter n={3} title={k('deliveredTitle')}>
          <Steps items={delivered.map((key) => ({ title: k(`deliveredItems.${key}`) }))} />
        </Chapter>
        <Chapter n={4} title={k('deliveryTitle')}>
          <p className="wk-chapter__copy">{k('deliveryCopy')}</p>
          {focus.length > 0 && (
            <div className="grid gap-3">
              <p className="as-mono text-[var(--as-fg-soft)]">{t('public.caseStudies.keyFocusLabel')}</p>
              <ul className="as-tags">
                {focus.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          )}
        </Chapter>
      </div>

      {/* Next case + the way back to the list. */}
      <section className="as-section--tight as-bg-cream">
        <div className="as-wrap grid gap-10">
          <Link to={`/case-studies/${next.slug}`} className="wk-next wk-hover">
            <div className="grid justify-items-start gap-4">
              <p className="as-eyebrow">{t('site.work.cases.next')}</p>
              <p className="as-mono text-[var(--as-fg-soft)]">{t(`public.caseStudies.items.${next.key}.category`)}</p>
              <h2 className="wk-next__title as-title as-title--md max-w-[18ch]">{t(`public.${next.ns}.title`)}</h2>
            </div>
            <span className="wk-arrow" aria-hidden>
              <span>→</span>
              <span>→</span>
            </span>
          </Link>
          <Link to="/case-studies" className="as-link justify-self-start font-semibold">
            {k('back')}
          </Link>
        </div>
      </section>

      <CtaWalk
        tone={entry.tone === 'rust' ? 'burnt' : 'rust'}
        eyebrow={k('badge')}
        title={accentLast(k('ctaTitle'))}
        actions={
          <Pill to="/contact" variant="light">
            {k('ctaButton')}
          </Pill>
        }
      />
    </>
  );
}

export default CaseStudyLayout;
