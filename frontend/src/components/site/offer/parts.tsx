import type { CSSProperties } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { prefersReducedMotion, scrollToTarget, useScrollFrame } from '../scroll';
import { useReveal } from '../blocks';
import './offer.css';

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const pad = (n: number) => String(n).padStart(2, '0');

/** Small round check used in feature lists and the comparison table. */
export function Check({ className }: { className?: string }) {
  return (
    <span className={cn('ofr-check', className)} aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

/**
 * Ruled FAQ list. Native buttons with aria-expanded; answers stay in the DOM
 * (only visually collapsed) so crawlers and the FAQPage schema agree.
 */
export function Disclosure({ items, defaultOpen = 0 }: { items: Array<{ q: string; a: string }>; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();
  const ref = useReveal();
  return (
    <div ref={ref} className="ofr-faq">
      {items.map((item, i) => {
        const expanded = open === i;
        return (
          <div key={item.q} data-reveal style={{ '--d': `${Math.min(i, 5) * 60}ms` } as CSSProperties}>
            <h3>
              <button
                type="button"
                id={`${baseId}-btn-${i}`}
                aria-expanded={expanded}
                aria-controls={`${baseId}-panel-${i}`}
                onClick={() => setOpen(expanded ? null : i)}
              >
                <span className="ofr-faq__q">{item.q}</span>
                <span className="ofr-faq__icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={`${baseId}-panel-${i}`}
              role="region"
              aria-labelledby={`${baseId}-btn-${i}`}
              className={cn('ofr-faq__panel', expanded && 'is-open')}
            >
              <div>
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export interface TimelineStep {
  title: string;
  text: string;
  deliverable: string;
  duration: string;
}

/**
 * Scroll-driven process timeline: an accent line fills down the rail as the
 * page scrolls, each step lights up as the line reaches it, and (on desktop)
 * a sticky counter + contents list follows along. All updates are class or
 * transform writes from cached geometry; nothing re-renders per frame.
 */
export function Timeline({
  steps,
  labels,
}: {
  steps: TimelineStep[];
  labels: { step: string; of: string; deliverable: string; nav: string };
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const tocRef = useRef<HTMLDivElement>(null);
  const geo = useRef<{ top: number; first: number; h: number; marks: number[] } | null>(null);
  const cur = useRef(-2);

  const measure = () => {
    const list = listRef.current;
    if (!list) return;
    const top = list.getBoundingClientRect().top + window.scrollY;
    const items = [...list.querySelectorAll<HTMLElement>('.ofr-tl__step')];
    const marks = items.map((el) => el.offsetTop + 14);
    const first = marks[0] ?? 0;
    const h = Math.max(1, (marks[marks.length - 1] ?? 0) - first);
    geo.current = { top, first, h, marks };
    // The rail runs from the first dot to the last one.
    for (const el of [railRef.current, fillRef.current]) {
      if (!el) continue;
      el.style.top = `${first}px`;
      el.style.height = `${h}px`;
    }
  };

  useEffect(() => {
    cur.current = -2;
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [steps.length]);

  useScrollFrame((y) => {
    const list = listRef.current;
    if (!list) return;
    if (!geo.current) measure();
    const g = geo.current;
    if (!g) return;
    const reduced = prefersReducedMotion();
    const anchor = y + window.innerHeight * 0.6 - g.top;
    const p = reduced ? 1 : clamp((anchor - g.first) / g.h, 0, 1);
    if (fillRef.current) fillRef.current.style.transform = `scaleY(${p.toFixed(4)})`;
    let idx = reduced ? g.marks.length - 1 : -1;
    if (!reduced) g.marks.forEach((m, i) => anchor >= m && (idx = i));
    if (barRef.current) barRef.current.style.transform = `scaleX(${((idx + 1) / g.marks.length).toFixed(4)})`;
    if (idx === cur.current) return;
    cur.current = idx;
    list.querySelectorAll<HTMLElement>('.ofr-tl__step').forEach((el, i) => el.classList.toggle('is-on', i <= idx));
    tocRef.current?.querySelectorAll<HTMLElement>('button').forEach((el, i) => el.classList.toggle('is-on', i === Math.max(idx, 0)));
    if (numRef.current) numRef.current.textContent = pad(Math.max(idx, 0) + 1);
  });

  const go = (i: number) => {
    const el = listRef.current?.querySelectorAll<HTMLElement>('.ofr-tl__step')[i];
    if (el) scrollToTarget(el.offsetTop + (geo.current?.top ?? 0) - window.innerHeight * 0.3);
  };

  return (
    <div className="ofr-tl">
      <aside className="ofr-tl__aside">
        <p className="as-eyebrow">{labels.step}</p>
        <div className="ofr-tl__count" aria-hidden>
          <span ref={numRef} className="ofr-tl__num">
            01
          </span>
          <span className="ofr-tl__total">
            {labels.of} {pad(steps.length)}
          </span>
        </div>
        <div className="ofr-tl__bar" aria-hidden>
          <span ref={barRef} />
        </div>
        <nav aria-label={labels.nav}>
          <div ref={tocRef} className="ofr-tl__toc">
            {steps.map((s, i) => (
              <button key={s.title} type="button" onClick={() => go(i)}>
                <span>{pad(i + 1)}</span>
                <span>{s.title}</span>
              </button>
            ))}
          </div>
        </nav>
      </aside>

      <div ref={listRef} className="ofr-tl__list">
        <span ref={railRef} className="ofr-tl__rail" aria-hidden />
        <span ref={fillRef} className="ofr-tl__fill" aria-hidden />
        <ol>
          {steps.map((step, i) => (
            <li key={step.title} className="ofr-tl__step">
              <span className="ofr-tl__dot" aria-hidden />
              <div className="ofr-tl__body">
                <div className="ofr-tl__head">
                  <span className="as-mono">
                    {labels.step} {pad(i + 1)}
                  </span>
                  <span className="as-tag">{step.duration}</span>
                </div>
                <h2 className="ofr-tl__title">{step.title}</h2>
                <p className="ofr-tl__text">{step.text}</p>
                <p className="ofr-tl__out">
                  <Check />
                  <span>
                    <small>{labels.deliverable}</small>
                    {step.deliverable}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
