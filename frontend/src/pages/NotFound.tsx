import type { CSSProperties } from 'react';
import { useRef } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { Seo } from '@/components/Seo';
import { Pill, WALL } from '@/components/site/blocks';
import { prefersReducedMotion, useScrollFrame } from '@/components/site/scroll';
import '@/components/site/company/company.css';

/**
 * 404: one burnt plaster wall. The digits drop onto the floor one by one and
 * the zero keeps wobbling; the vertical wall word says where you ended up.
 */
export function NotFound() {
  const { t } = useI18n();
  const wordRef = useRef<HTMLSpanElement>(null);
  const code = t('notFound.code', '404');
  const tone = WALL.burnt;

  useScrollFrame((y) => {
    if (prefersReducedMotion() || !wordRef.current) return;
    wordRef.current.style.transform = `rotate(180deg) translate3d(0, ${(Math.min(y, 900) * 0.12).toFixed(1)}px, 0)`;
  });

  return (
    <>
      <Seo page="notFound" noindex />
      <section
        className="as-hero cmp-404 as-stucco as-on-color"
        style={{ '--c': tone.c, '--c-num': tone.num } as CSSProperties}
        data-hero
      >
        <span className="cmp-404__num" aria-hidden>
          {[...code].map((ch, i) => (
            <span key={i} style={{ '--i': i } as CSSProperties}>
              {ch}
            </span>
          ))}
        </span>
        <span ref={wordRef} className="as-hero__word" aria-hidden>
          {t('site.company.notFound.word')}
        </span>
        <div className="as-hero__light" aria-hidden />
        <div className="as-hero__floor as-concrete" aria-hidden />
        <div className="as-hero__body">
          <p className="as-eyebrow as-eyebrow--on-color as-page-enter">{t('site.company.notFound.eyebrow')}</p>
          <h1 className="as-hero__title as-page-enter" style={{ animationDelay: '.15s' }}>
            {t('notFound.title')}
          </h1>
          <p className="as-lead as-page-enter" style={{ animationDelay: '.25s' }}>
            {t('notFound.copy')}
          </p>
          <div className="as-hero__actions as-page-enter" style={{ animationDelay: '.35s' }}>
            <Pill to="/" variant="light">
              {t('notFound.home')}
            </Pill>
            <Pill to="/packages" variant="ghost">
              {t('notFound.packages')}
            </Pill>
            <Pill to="/contact" variant="ghost">
              {t('notFound.contact')}
            </Pill>
          </div>
        </div>
      </section>
    </>
  );
}

export default NotFound;
