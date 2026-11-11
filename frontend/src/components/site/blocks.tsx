/* eslint-disable react-refresh/only-export-components -- one module for the site's building blocks and their hooks/tones */
import type { CSSProperties, ElementType, ReactNode } from 'react';
import { Children, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { prefersReducedMotion, useScrollFrame } from './scroll';
import { loadAllFrames, loadFirstFrame, onFramesChange, Walker } from './walker';

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export const WALL = {
  mustard: { c: 'var(--as-mustard)', num: 'var(--as-mustard-hi)' },
  burnt: { c: 'var(--as-burnt)', num: 'var(--as-burnt-lo)' },
  amber: { c: 'var(--as-amber)', num: 'var(--as-amber-hi)' },
  rust: { c: 'var(--as-rust)', num: 'var(--as-rust-lo)' },
} as const;
export type WallTone = keyof typeof WALL;

/* ------------------------------------------------------------------ */
/* Reveal on scroll                                                    */
/* ------------------------------------------------------------------ */

/**
 * Adds `is-in` to every `[data-reveal]` element inside the returned ref once
 * it enters the viewport. Elements can set `style={{'--d': '120ms'}}` for a
 * stagger and `data-reveal="left|right|scale|clip"` for the direction.
 * Reduced motion (and print, via CSS) shows everything at once.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = [
      ...(root.matches('[data-reveal]') ? [root] : []),
      ...root.querySelectorAll<HTMLElement>('[data-reveal]'),
    ].filter((el) => !el.classList.contains('is-in'));
    if (!items.length) return;
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      items.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
  return ref;
}

/** Wrapper form of `useReveal` for sections that do not need their own ref. */
export function RevealGroup({
  as: Tag = 'div',
  className,
  children,
  ...rest
}: { as?: ElementType; className?: string; children: ReactNode } & Record<string, unknown>) {
  const ref = useReveal<HTMLElement>();
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Text                                                                */
/* ------------------------------------------------------------------ */

/**
 * Splits a heading into words that rise into place one after another.
 * The text stays a single readable string for crawlers and screen readers.
 */
export function RiseText({ text, delay = 120 }: { text: string; delay?: number }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <span className="as-rise" style={{ '--rise-delay': `${delay}ms` } as CSSProperties}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={i}>
            <span className="as-rise-w">
              <span style={{ '--i': i } as CSSProperties}>{w}</span>
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </span>
  );
}

export function Eyebrow({ children, onColor, className }: { children: ReactNode; onColor?: boolean; className?: string }) {
  return <p className={cn('as-eyebrow', onColor && 'as-eyebrow--on-color', className)}>{children}</p>;
}

/** Eyebrow + big uppercase title (+ optional lead), revealed on scroll. */
export function SectionHead({
  eyebrow,
  title,
  lead,
  id,
  size = 'lg',
  as: Tag = 'h2',
  className,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  size?: 'lg' | 'md' | 'sm';
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  children?: ReactNode;
}) {
  const ref = useReveal();
  return (
    <div ref={ref} className={cn('grid justify-items-start gap-4', className)}>
      {eyebrow && (
        <p className="as-eyebrow" data-reveal>
          {eyebrow}
        </p>
      )}
      <Tag id={id} className={cn('as-title', size === 'md' && 'as-title--md', size === 'sm' && 'as-title--sm')} data-reveal style={{ '--d': '80ms' } as CSSProperties}>
        {title}
      </Tag>
      {lead && (
        <p className="as-lead" data-reveal style={{ '--d': '160ms' } as CSSProperties}>
          {lead}
        </p>
      )}
      {children}
    </div>
  );
}

/**
 * Statement paragraph whose words light up one by one as it scrolls through
 * the viewport. `highlight` words (matched case-insensitively, punctuation
 * ignored) take the accent colour.
 */
export function WordsReveal({
  text,
  highlight = [],
  className,
  as: Tag = 'p',
}: {
  text: string;
  highlight?: string[];
  className?: string;
  as?: 'p' | 'h2' | 'h1';
}) {
  const ref = useRef<HTMLElement>(null);
  const norm = (s: string) => s.toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  const hl = new Set(highlight.map(norm));
  const words = text.split(/\s+/).filter(Boolean);
  const lit = useRef(-1);

  useScrollFrame((y) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const top = r.top + y;
    const H = window.innerHeight;
    const sp = prefersReducedMotion() ? 1 : clamp((y + H * 0.82 - top) / (r.height + H * 0.25), 0, 1);
    const n = Math.round(sp * words.length);
    if (n === lit.current) return;
    lit.current = n;
    el.querySelectorAll<HTMLElement>('.w').forEach((s, i) => {
      s.style.opacity = i < n ? '1' : '';
    });
  });

  return (
    <Tag ref={ref as never} className={cn('as-display as-words', className)}>
      {/* Readers get the sentence once; the dimmed, word-by-word copy is visual only. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={i}>
            <span className={cn('w', hl.has(norm(w)) && 'hl')}>{w}</span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Stacked cards                                                       */
/* ------------------------------------------------------------------ */

export interface StackItem {
  word: string;
  title: ReactNode;
  text?: ReactNode;
  tags?: string[];
  tone?: WallTone;
  index?: string;
  to?: string;
  extra?: ReactNode;
}

const TONES: WallTone[] = ['mustard', 'burnt', 'rust', 'amber'];

/**
 * Sticky cards that pile up as you scroll; each one shrinks a little as the
 * next slides over it.
 */
export function StackCards({ items, headingLevel = 'h3' }: { items: StackItem[]; headingLevel?: 'h2' | 'h3' }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const H = headingLevel;
  const geo = useRef<Array<{ stuck: number; span: number }>>([]);

  // Natural (unstuck) positions, measured from layout sizes so the scale we
  // apply never feeds back into the measurement.
  const measure = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const cards = [...wrap.children] as HTMLElement[];
    const gap = parseFloat(getComputedStyle(wrap).rowGap) || 0;
    let natural = wrap.getBoundingClientRect().top + window.scrollY;
    geo.current = cards.map((c) => {
      const stickTop = parseFloat(getComputedStyle(c).top) || 0;
      const span = c.offsetHeight + gap;
      const g = { stuck: natural - stickTop, span };
      natural += span;
      return g;
    });
  };

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(document.body);
    measure();
    return () => ro.disconnect();
  }, [items.length]);

  useScrollFrame((y) => {
    const wrap = wrapRef.current;
    if (!wrap || prefersReducedMotion()) return;
    if (!geo.current.length) measure();
    const cards = [...wrap.children] as HTMLElement[];
    for (let i = 0; i < cards.length - 1; i++) {
      const g = geo.current[i];
      if (!g) continue;
      const d = clamp((y - g.stuck) / g.span, 0, cards.length - 1 - i);
      cards[i].style.transform = d > 0 ? `scale(${(1 - d * 0.045).toFixed(4)})` : '';
    }
  });

  return (
    <div ref={wrapRef} className="as-stack">
      {items.map((item, i) => {
        const tone = WALL[item.tone || TONES[i % TONES.length]];
        const style = { '--c': tone.c, '--i': i } as CSSProperties;
        const body = (
          <>
            <span className="as-scard__word" aria-hidden>
              {item.word}
            </span>
            <div className="as-scard__body">
              <span className="as-scard__index">{item.index ?? String(i + 1).padStart(2, '0')}</span>
              <H>{item.title}</H>
              {item.text && <p>{item.text}</p>}
              {item.tags && item.tags.length > 0 && (
                <ul className="as-tags">
                  {item.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
              {item.extra}
            </div>
          </>
        );
        return item.to ? (
          <Link key={i} to={item.to} className="as-scard as-stucco" style={style}>
            {body}
          </Link>
        ) : (
          <article key={i} className="as-scard as-stucco" style={style}>
            {body}
          </article>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ticker                                                              */
/* ------------------------------------------------------------------ */

export function Ticker({ items, reverse, duration }: { items: string[]; reverse?: boolean; duration?: number }) {
  const row = [...items, ...items];
  return (
    <div className={cn('as-ticker', reverse && 'as-ticker--reverse')} aria-hidden>
      <div className="as-ticker-track" style={duration ? ({ '--ticker-dur': `${duration}s` } as CSSProperties) : undefined}>
        {row.map((t, i) => (
          <span key={i} className="contents">
            <span>{t}</span>
            <i />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ruled steps                                                         */
/* ------------------------------------------------------------------ */

export function Steps({ items }: { items: Array<{ title: ReactNode; text?: ReactNode; n?: string }> }) {
  const ref = useReveal<HTMLOListElement>();
  return (
    <ol ref={ref} className="as-steps">
      {items.map((s, i) => (
        <li key={i} data-reveal style={{ '--d': `${Math.min(i, 5) * 70}ms` } as CSSProperties}>
          <span className="as-step-n">{s.n ?? String(i + 1).padStart(2, '0')}</span>
          <div>
            <h3 className="as-h3">{s.title}</h3>
            {s.text && <p>{s.text}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Inner-page hero                                                     */
/* ------------------------------------------------------------------ */

export interface PageHeroProps {
  /** Vertical wall word (one short uppercase word, e.g. "SERVICES"). */
  word: string;
  /** Big background numeral/letter, parallaxed. */
  num?: string;
  tone?: WallTone;
  eyebrow?: ReactNode;
  title: string;
  /** Words of `title` to paint in the accent colour. */
  accent?: string[];
  lead?: ReactNode;
  actions?: ReactNode;
  crumbs?: Array<{ label: string; to?: string }>;
  short?: boolean;
  children?: ReactNode;
}

/**
 * Opening band of every inner page: one plaster wall panel with a vertical
 * word, a parallax numeral, a concrete floor and the page h1.
 */
export function PageHero({ word, num, tone = 'burnt', eyebrow, title, accent = [], lead, actions, crumbs, short, children }: PageHeroProps) {
  const numRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const t = WALL[tone];

  useScrollFrame((y) => {
    if (prefersReducedMotion()) return;
    const k = Math.min(y, 1200);
    if (numRef.current) numRef.current.style.transform = `translate3d(0, ${(k * 0.22).toFixed(1)}px, 0)`;
    if (wordRef.current) wordRef.current.style.transform = `rotate(180deg) translate3d(0, ${(k * 0.12).toFixed(1)}px, 0)`;
  });

  // Shrink the wall word until it fits its column (long words, short heroes).
  useEffect(() => {
    const el = wordRef.current;
    if (!el) return;
    const fit = () => {
      el.style.fontSize = '';
      const avail = el.clientHeight;
      const need = el.scrollHeight;
      if (need > avail + 1) {
        const fs = parseFloat(getComputedStyle(el).fontSize);
        el.style.fontSize = `${Math.floor((fs * avail) / need)}px`;
      }
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [word]);

  const accentSet = new Set(accent.map((a) => a.toLocaleLowerCase()));
  const words = title.split(/\s+/).filter(Boolean);

  return (
    <section
      className={cn('as-hero as-stucco as-on-color', short && 'as-hero--short', tone === 'mustard' && 'as-hero--mustard')}
      style={{ '--c': t.c, '--c-num': t.num } as CSSProperties}
      data-hero
    >
      {num && (
        <span ref={numRef} className="as-hero__num" aria-hidden>
          {num}
        </span>
      )}
      <span ref={wordRef} className="as-hero__word" aria-hidden>
        {word}
      </span>
      <div className="as-hero__light" aria-hidden />
      <div className="as-hero__floor as-concrete" aria-hidden />
      <div className="as-hero__body">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="as-page-enter">
            <ol className="as-crumbs">
              {crumbs.map((c, i) => (
                <li key={i}>{c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="as-eyebrow as-eyebrow--on-color as-page-enter">{eyebrow}</p>}
        <h1 className="as-hero__title">
          <span className="sr-only">{title}</span>
          <span className="as-rise" aria-hidden>
            {words.map((w, i) => (
              <span key={i}>
                <span className="as-rise-w">
                  <span style={{ '--i': i } as CSSProperties}>{accentSet.has(w.toLocaleLowerCase()) ? <em>{w}</em> : w}</span>
                </span>
                {i < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>
        </h1>
        {lead && (
          <p className="as-lead as-page-enter" style={{ animationDelay: '.25s' }}>
            {lead}
          </p>
        )}
        {actions && (
          <div className="as-hero__actions as-page-enter" style={{ animationDelay: '.35s' }}>
            {actions}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Final call to action with a walker                                  */
/* ------------------------------------------------------------------ */

export interface CtaWalkProps {
  eyebrow?: ReactNode;
  /** Title lines; wrap the middle line in <em> for the mustard accent. */
  title: ReactNode;
  lead?: ReactNode;
  actions: ReactNode;
  tone?: WallTone;
  id?: string;
}

/**
 * Closing band of every page: plaster wall, big uppercase invitation, and the
 * figure walking across the floor as the band scrolls past. Frames load only
 * when the band approaches the viewport.
 */
export function CtaWalk({ eyebrow, title, lead, actions, tone = 'rust', id }: CtaWalkProps) {
  const bandRef = useRef<HTMLDivElement>(null);
  const walkerRef = useRef<HTMLDivElement>(null);
  const walker = useRef<Walker | null>(null);
  const geo = useRef<{ top: number; h: number; feet: number; W: number; H: number } | null>(null);
  const ref = useReveal<HTMLElement>();
  const t = WALL[tone];

  const update = (y: number) => {
    const g = geo.current;
    const w = walker.current;
    if (!g || !w) return;
    const q = clamp((y + g.H - g.top) / (g.H + g.h * 0.2), 0, 1);
    const x0 = -w.cw;
    const x1 = g.W + w.cw * 0.6;
    const d = (x1 - x0) * q;
    const f = w.frameAt(d);
    w.draw(f.idx);
    w.place(x0 + f.q, g.feet);
  };

  const measure = () => {
    const band = bandRef.current;
    if (!band || !walker.current) return;
    const r = band.getBoundingClientRect();
    walker.current.size(r.height * 0.86);
    geo.current = { top: r.top + window.scrollY, h: r.height, feet: r.height - 26, W: band.clientWidth, H: window.innerHeight };
    update(window.scrollY);
  };

  useEffect(() => {
    const band = bandRef.current;
    if (!band || !walkerRef.current) return;
    walker.current = new Walker(walkerRef.current);
    measure();
    let rt = 0;
    const onResize = () => {
      clearTimeout(rt);
      rt = window.setTimeout(measure, 120);
    };
    window.addEventListener('resize', onResize);
    const redraw = () => {
      if (walker.current) walker.current.drawn = null;
      update(window.scrollY);
    };
    const off = onFramesChange(redraw);
    // Page height can change after mount (images, fonts, lazy content).
    const ro = new ResizeObserver(() => measure());
    ro.observe(document.body);
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          loadFirstFrame().then(() => loadAllFrames());
          io.disconnect();
        }
      },
      { rootMargin: '100% 0px' },
    );
    io.observe(band);
    return () => {
      off();
      ro.disconnect();
      io.disconnect();
      clearTimeout(rt);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useScrollFrame(update);

  return (
    <section ref={ref} id={id} className={cn('as-cta as-stucco as-on-color', tone === 'mustard' && 'as-cta--mustard')} style={{ '--c': t.c } as CSSProperties}>
      {eyebrow && (
        <p className="as-eyebrow as-eyebrow--on-color" data-reveal>
          {eyebrow}
        </p>
      )}
      <h2 className="as-cta-title" data-reveal style={{ '--d': '80ms' } as CSSProperties}>
        {title}
      </h2>
      {lead && (
        <p className="as-lead" data-reveal style={{ '--d': '140ms' } as CSSProperties}>
          {lead}
        </p>
      )}
      <div className="flex flex-wrap gap-3" data-reveal style={{ '--d': '200ms' } as CSSProperties}>
        {actions}
      </div>
      <div ref={bandRef} className="as-cta-walk" aria-hidden>
        <div ref={walkerRef} className="as-walker">
          <div className="as-walker-shadow" />
          <canvas />
        </div>
        <div className="as-cta-walk__floor as-concrete" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Misc                                                                */
/* ------------------------------------------------------------------ */

/** Pill button rendered as a router link, an external link or a <button>. */
export function Pill({
  to,
  href,
  variant,
  size,
  arrow = true,
  className,
  children,
  ...rest
}: {
  to?: string;
  href?: string;
  variant?: 'ink' | 'light' | 'accent' | 'ghost';
  size?: 'sm' | 'md';
  arrow?: boolean;
  className?: string;
  children: ReactNode;
} & Record<string, unknown>) {
  const cls = cn(
    'as-btn',
    variant === 'light' && 'as-btn--light',
    variant === 'accent' && 'as-btn--accent',
    variant === 'ghost' && 'as-btn--ghost',
    size === 'sm' && 'as-btn--sm',
    className,
  );
  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <span className="as-arrow" aria-hidden>
          →
        </span>
      )}
    </>
  );
  if (to)
    return (
      <Link to={to} className={cls} {...rest}>
        {inner}
      </Link>
    );
  if (href)
    return (
      <a href={href} className={cls} {...rest}>
        {inner}
      </a>
    );
  return (
    <button type="button" className={cls} {...rest}>
      {inner}
    </button>
  );
}

/** Counts a number up when it scrolls into view ("120+", "98%", "24h"). */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    const m = /^(\D*)(\d+(?:[.,]\d+)?)(.*)$/.exec(value);
    if (!el || !m || prefersReducedMotion()) return;
    const [, pre, num, post] = m;
    const target = parseFloat(num.replace(',', '.'));
    const decimals = (num.split(/[.,]/)[1] || '').length;
    let raf = 0;
    const io = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = clamp((t - t0) / 1400, 0, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = `${pre}${(target * e).toFixed(decimals)}${post}`;
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

/** Splits children into a responsive grid whose items reveal with a stagger. */
export function RevealGrid({ className, children, step = 70 }: { className?: string; children: ReactNode; step?: number }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={className}>
      {Children.toArray(children).map((child, i) => (
        <div key={i} data-reveal style={{ '--d': `${Math.min(i, 6) * step}ms` } as CSSProperties} className="min-w-0">
          {child}
        </div>
      ))}
    </div>
  );
}
