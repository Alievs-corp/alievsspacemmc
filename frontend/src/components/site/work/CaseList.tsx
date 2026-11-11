import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';
import { SectionHead, useReveal, WALL } from '../blocks';
import { CASES } from './cases';
import './work.css';

/** A plaster wall standing in for a case's "cover": numeral, vertical word, floor. */
export function CaseWall({ index, word, tone, tag }: { index: number; word: string; tone: keyof typeof WALL; tag?: string }) {
  const w = WALL[tone];
  return (
    <div className="wk-wipe" data-reveal aria-hidden>
      <div className="wk-case__visual wk-wipe__in" style={{ '--c': w.c, '--c-num': w.num } as CSSProperties}>
        <div className="wk-case__wall">
          <div className="wk-zoom as-stucco" />
        </div>
        <span className="wk-case__num">{String(index + 1).padStart(2, '0')}</span>
        <span className="wk-case__word" style={{ '--len': Math.max(4, [...word].length) } as CSSProperties}>
          {word}
        </span>
        <div className="as-hero__light" />
        <div className="wk-case__floor as-concrete" />
        {tag && <span className="wk-case__tag">{tag}</span>}
      </div>
    </div>
  );
}

/** The three delivered case studies as alternating wall + copy rows. */
export function CaseList() {
  const { t, tRaw } = useI18n();
  const ref = useReveal();

  return (
    <section className="as-section" aria-labelledby="work-cases-title">
      <div className="as-wrap">
        <SectionHead id="work-cases-title" eyebrow={t('site.work.cases.listEyebrow')} title={t('site.work.cases.listTitle')} size="md" />
        <div ref={ref} className="mt-14 grid gap-20 md:mt-20 md:gap-28">
          {CASES.map((c, i) => {
            const focus = tRaw<string[]>(`public.caseStudies.items.${c.key}.focus`, []) || [];
            const title = t(`public.caseStudies.items.${c.key}.title`);
            return (
              <article key={c.slug} className={cn('wk-case wk-hover', i % 2 === 1 && 'wk-case--flip')}>
                <CaseWall
                  index={i}
                  word={t(`site.work.cases.words.${c.key}`)}
                  tone={c.tone}
                  tag={`${t('site.work.cases.caseLabel')} ${String(i + 1).padStart(2, '0')}`}
                />
                <div className="grid justify-items-start gap-5" data-reveal style={{ '--d': '120ms' } as CSSProperties}>
                  <p className="as-eyebrow">{t(`public.caseStudies.items.${c.key}.category`)}</p>
                  <h3 className="wk-case__title as-title as-title--sm">
                    {/* The stretched link makes the whole row (wall included) clickable. */}
                    <Link to={`/case-studies/${c.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                      {title}
                    </Link>
                  </h3>
                  <p className="line-clamp-5 text-[16px] leading-relaxed text-[var(--as-fg-soft)] md:text-[17px]">
                    {t(`public.caseStudies.items.${c.key}.description`)}
                  </p>
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
                  <span className="mt-2 inline-flex items-center gap-4 font-semibold" aria-hidden>
                    <span className="wk-arrow">
                      <span>→</span>
                      <span>→</span>
                    </span>
                    {t('public.caseStudies.viewCta')}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CaseList;
