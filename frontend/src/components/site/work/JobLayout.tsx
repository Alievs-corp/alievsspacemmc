import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '@/contexts/I18nContext';
import { CtaWalk, PageHero, Pill, RevealGrid, Steps, useReveal, type WallTone } from '../blocks';
import { accentLast } from './text';
import './work.css';

export interface JobSpec {
  /** Copy namespace under `public.*` (frontend | backend | uiux). */
  ns: 'frontend' | 'backend' | 'uiux';
  /** Query value the apply form understands. */
  position: 'frontend-developer' | 'backend-developer' | 'ui-ux-designer';
  /** Key of the role card on the careers page (`public.careers.vacancies.*`). */
  vacancy: 'frontend' | 'backend' | 'uiux';
  image: string;
  imageAlt: string;
  tone: WallTone;
  num: string;
  workOn: string[];
  /** `technicalSkillsTitle` or `coreSkillsTitle`. */
  skillsTitle: string;
  skills: string[];
  nice: string[];
  how: string[];
  get: string[];
  requirements: string[];
}

/** Ruled list with small mono numbers. */
function RuledList({ items }: { items: string[] }) {
  const ref = useReveal<HTMLOListElement>();
  return (
    <ol ref={ref} className="wk-list">
      {items.map((text, i) => (
        <li key={i} data-reveal style={{ '--d': `${Math.min(i, 6) * 60}ms` } as CSSProperties}>
          <span className="wk-list__n" aria-hidden>
            {String(i + 1).padStart(2, '0')}
          </span>
          <span>{text}</span>
        </li>
      ))}
    </ol>
  );
}

/** One titled block of the role description. */
function Block({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="grid gap-8">
      <div className="grid gap-3">
        <p className="as-eyebrow" data-reveal>
          {String(n).padStart(2, '0')}
        </p>
        <h2 className="as-title as-title--sm max-w-[18ch]" data-reveal style={{ '--d': '80ms' } as CSSProperties}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

/**
 * Shared template of the three job pages: hero, the role in one paragraph next
 * to its photo, then the role description with a sticky apply card on desktop.
 */
export function JobLayout({ spec }: { spec: JobSpec }) {
  const { t } = useI18n();
  const introRef = useReveal();
  const k = (key: string) => t(`public.${spec.ns}.${key}`);
  const title = k('heroTitle');
  const applyHref = `/apply?position=${spec.position}`;
  const back = t('public.careers.back', '← Back to Careers');

  return (
    <>
      <Helmet>
        <title>{`${title} | Alievs Space MMC`}</title>
        <meta name="description" content={k('buildCopy')} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={k('buildCopy')} />
        <meta property="og:type" content="website" />
      </Helmet>

      <PageHero
        word={t(`site.work.jobs.words.${spec.ns}`)}
        num={spec.num}
        tone={spec.tone}
        eyebrow={t('site.work.jobs.roleEyebrow')}
        title={title}
        accent={title.split(/\s+/).slice(0, 1)}
        lead={t(`public.careers.vacancies.${spec.vacancy}.description`)}
        crumbs={[{ label: t('nav.careers'), to: '/careers' }, { label: title }]}
        actions={
          <>
            <Pill to={applyHref} variant="light">
              {k('applyCta')}
            </Pill>
            <Pill to="/careers" variant="ghost" arrow={false}>
              {back}
            </Pill>
          </>
        }
      />

      {/* The role in one paragraph, next to its photo. */}
      <section className="as-section">
        <div ref={introRef} className="as-wrap grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="grid gap-6 lg:col-span-6">
            <h2 className="as-title as-title--sm" data-reveal>
              {k('buildTitle')}
            </h2>
            <p className="as-lead !max-w-[60ch]" data-reveal style={{ '--d': '100ms' } as CSSProperties}>
              {k('buildCopy')}
            </p>
          </div>
          <div className="wk-wipe lg:col-span-6" data-reveal style={{ '--d': '120ms' } as CSSProperties}>
            <div className="wk-photo wk-wipe__in">
              <img src={spec.image} alt={spec.imageAlt} loading="lazy" decoding="async" width={2880} height={1920} />
            </div>
          </div>
        </div>
      </section>

      <section className="as-section as-bg-cream">
        <div className="as-wrap wk-job">
          <div className="grid gap-20 md:gap-28">
            <Block n={1} title={k('workOnTitle')}>
              <RuledList items={spec.workOn.map((key) => k(`workOn.items.${key}`))} />
            </Block>

            <Block n={2} title={k('expectTitle')}>
              <div className="grid gap-10">
                <div className="grid gap-4">
                  <h3 className="as-h3">{k(spec.skillsTitle)}</h3>
                  <RuledList items={spec.skills.map((key) => k(`skills.items.${key}`))} />
                </div>
                <div className="grid gap-4">
                  <h3 className="as-h3">{k('niceToHaveTitle')}</h3>
                  <RuledList items={spec.nice.map((key) => k(`nice.items.${key}`))} />
                </div>
              </div>
            </Block>

            <Block n={3} title={k('howWeWorkTitle')}>
              <Steps items={spec.how.map((key) => ({ title: k(`how.items.${key}`) }))} />
            </Block>

            <Block n={4} title={k('whatYouGetTitle')}>
              <RevealGrid className="grid gap-4 sm:grid-cols-2">
                {spec.get.map((key, i) => (
                  <div key={key} className="as-tile as-tile--hover grid h-full content-between gap-8">
                    <span className="wk-num-line text-[52px]" aria-hidden>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[17px] font-semibold leading-snug">{k(`get.items.${key}`)}</p>
                  </div>
                ))}
              </RevealGrid>
            </Block>

            <Block n={5} title={k('locationTitle')}>
              <dl className="wk-facts">
                <div>
                  <dt>01</dt>
                  <dd>{k('location.items.country')}</dd>
                </div>
                <div>
                  <dt>02</dt>
                  <dd>{k('location.items.format')}</dd>
                </div>
              </dl>
            </Block>
          </div>

          {/* Sticky apply card (desktop); phones get the hero button and the closing band. */}
          <aside className="wk-job__aside hidden lg:block" aria-label={t('site.work.jobs.cardEyebrow')}>
            <div className="as-box grid gap-6 !bg-[var(--as-bg)]">
              <p className="as-eyebrow">{t('site.work.jobs.cardEyebrow')}</p>
              <p className="as-h3">{title}</p>
              <p className="as-mono text-[var(--as-fg-soft)]">{t(`public.careers.vacancies.${spec.vacancy}.location`)}</p>
              <div className="grid gap-3">
                <p className="as-mono text-[var(--as-fg-soft)]">{t('public.requirements')}</p>
                <ul className="as-tags">
                  {spec.requirements.map((key) => (
                    <li key={key}>{t(`public.careers.vacancies.${spec.vacancy}.reqs.${key}`)}</li>
                  ))}
                </ul>
              </div>
              <Pill to={applyHref} variant="accent" className="as-btn--block">
                {k('applyCta')}
              </Pill>
              <Link to="/careers" className="as-link justify-self-start text-[14px] font-semibold">
                {back}
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <CtaWalk
        tone={spec.tone === 'rust' ? 'burnt' : 'rust'}
        eyebrow={title}
        title={accentLast(k('applyTitle'))}
        lead={k('applyCopy')}
        actions={
          <Pill to={applyHref} variant="light">
            {k('applyCta')}
          </Pill>
        }
      />
    </>
  );
}

export default JobLayout;
