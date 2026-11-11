import type { CSSProperties, ReactNode } from 'react';
import { useRef } from 'react';
import { WALL, type WallTone } from '@/components/site/blocks';
import { prefersReducedMotion, useScrollFrame } from '@/components/site/scroll';
import { useI18n } from '@/contexts/I18nContext';
import './account.css';

/**
 * Full-height plaster wall for the sign-in and sign-up pages: a vertical word
 * and a parallax numeral on the wall, the form on a sheet of paper pinned to
 * it. The whole band is `data-hero`, so the header floats over it.
 */
export function AuthShell({
  word,
  num,
  tone,
  tagline,
  children,
}: {
  word: string;
  num: string;
  tone: WallTone;
  tagline: string;
  children: ReactNode;
}) {
  const { t } = useI18n();
  const numRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const wall = WALL[tone];

  useScrollFrame((y) => {
    if (prefersReducedMotion()) return;
    const k = Math.min(y, 900);
    if (numRef.current) numRef.current.style.transform = `translate3d(0, ${(k * 0.24).toFixed(1)}px, 0)`;
    if (wordRef.current) wordRef.current.style.transform = `rotate(180deg) translate3d(0, ${(k * 0.12).toFixed(1)}px, 0)`;
  });

  return (
    <section className="acc-auth as-stucco" style={{ '--c': wall.c, '--c-num': wall.num, '--acc-em': tone === 'mustard' ? 'var(--as-rust)' : 'var(--as-mustard-hi)' } as CSSProperties} data-hero>
      <span ref={numRef} className="acc-auth__num" aria-hidden>
        {num}
      </span>
      <span ref={wordRef} className="as-hero__word hidden lg:block" aria-hidden>
        {word}
      </span>
      <div className="as-hero__light" aria-hidden />
      <div className="as-hero__floor as-concrete" aria-hidden />

      <div className="acc-auth__grid">
        <div className="acc-auth__wall as-on-color">
          <p className="as-eyebrow as-eyebrow--on-color as-page-enter">{t('site.account.auth.eyebrow')}</p>
          <p className="acc-auth__brand as-page-enter" style={{ animationDelay: '.08s' }}>
            Alievs <em>Space</em>
          </p>
          <p className="as-lead as-page-enter text-[15px] lg:text-[19px]" style={{ animationDelay: '.16s' }}>
            {tagline}
          </p>
        </div>

        <div className="acc-auth__card as-page-enter" style={{ animationDelay: '.22s' }}>
          {children}
        </div>
      </div>
    </section>
  );
}
