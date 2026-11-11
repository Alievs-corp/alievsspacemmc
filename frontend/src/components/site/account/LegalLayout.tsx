import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { PageHero, useReveal, type WallTone } from '@/components/site/blocks';
import { scrollToTarget } from '@/components/site/scroll';
import { useI18n } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';
import './account.css';

export interface LegalSection {
  id: string;
  /** Full heading as written in the document, e.g. "1. Information We Collect". */
  title: string;
  body: ReactNode;
}

const POLICIES = [
  { to: '/privacy-policy', key: 'nav.privacyPolicy' },
  { to: '/terms-of-service', key: 'nav.termsOfService' },
  { to: '/refund-policy', key: 'nav.refundPolicy' },
  { to: '/cookie-policy', key: 'nav.cookiePolicy' },
];

/** "1. Information We Collect" → ["1.", "Information We Collect"]. */
function splitNumber(title: string): [string, string] {
  const m = /^(\d+\.)\s*(.*)$/.exec(title);
  return m ? [m[1], m[2]] : ['', title];
}

/** Bulleted list used inside legal sections. */
export function LegalList({ items }: { items: readonly string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/** Company address card that closes every legal document. */
export function LegalContactCard({ companyName, emailLabel, websiteLabel }: { companyName: string; emailLabel: string; websiteLabel: string }) {
  return (
    <div className="as-box acc-legal__card">
      <p className="!m-0 font-semibold text-[var(--as-fg)]">{companyName}</p>
      <p className="!m-0">
        {emailLabel}{' '}
        <a href="mailto:info@alievsspace.com" className="as-link !text-[var(--as-fg)]">
          info@alievsspace.com
        </a>
      </p>
      <p className="!m-0">
        {websiteLabel}{' '}
        <a href="https://alievsspace.com" className="as-link !text-[var(--as-accent)]" target="_blank" rel="noopener noreferrer">
          https://alievsspace.com
        </a>
      </p>
    </div>
  );
}

/**
 * Shared frame for the four legal documents: a short plaster hero, a sticky
 * table of contents that follows the reader, and the document set in prose.
 */
export function LegalLayout({
  meta,
  title,
  companyName,
  lastUpdated,
  word,
  num,
  tone,
  intro,
  callout,
  sections,
}: {
  meta: { title: string; description: string };
  title: string;
  companyName: string;
  lastUpdated: string;
  word: string;
  num: string;
  tone: WallTone;
  intro?: ReactNode;
  callout?: ReactNode;
  sections: LegalSection[];
}) {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const [active, setActive] = useState(sections[0]?.id ?? '');
  const docRef = useReveal<HTMLDivElement>();
  const mobileToc = useRef<HTMLDetailsElement>(null);
  const ids = sections.map((s) => s.id).join('|');

  // Highlight the section that sits in the upper part of the viewport.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const els = ids
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        const first = els.find((el) => visible.has(el.id));
        if (first) setActive(first.id);
      },
      { rootMargin: '-28% 0px -62% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  const jump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    if (mobileToc.current) mobileToc.current.open = false;
    setActive(id);
    scrollToTarget(el);
    history.replaceState(null, '', `#${id}`);
  };

  const tocList = (
    <ol>
      {sections.map((s) => {
        const [n, rest] = splitNumber(s.title);
        return (
          <li key={s.id}>
            <a href={`#${s.id}`} onClick={(e) => jump(e, s.id)} className={cn(active === s.id && 'is-active')} aria-current={active === s.id ? 'location' : undefined}>
              <span>{n || '·'}</span>
              <span>{rest}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      <Helmet>
        <title>{`${meta.title} | ${companyName}`}</title>
        <meta name="description" content={meta.description} />
        <meta property="og:title" content={`${meta.title} | ${companyName}`} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="website" />
      </Helmet>

      <PageHero short tone={tone} word={word} num={num} eyebrow={companyName} title={title} lead={<span className="as-mono !text-[12px]">{lastUpdated}</span>} />

      <section className="as-section--tight">
        <div className="as-wrap acc-legal">
          <aside className="hidden lg:block acc-toc" aria-label={t('site.account.legal.toc')} data-lenis-prevent>
            <p className="as-eyebrow mb-5">{t('site.account.legal.toc')}</p>
            <nav aria-label={t('site.account.legal.toc')}>{tocList}</nav>
            <p className="as-mono mt-8 text-[var(--as-fg-soft)]">{lastUpdated}</p>
          </aside>

          <div ref={docRef} className="min-w-0">
            <details ref={mobileToc} className="acc-toc-mobile as-box mb-10 !p-5 lg:hidden">
              <summary className="as-eyebrow as-eyebrow--bare">{t('site.account.legal.toc')}</summary>
              <nav className="acc-toc mt-4 !static !max-h-none" aria-label={t('site.account.legal.toc')}>
                {tocList}
              </nav>
            </details>

            {(intro || callout) && (
              <div className="mb-12 grid gap-6">
                {intro && <p className="acc-legal__intro">{intro}</p>}
                {callout && <p className="acc-legal__callout">{callout}</p>}
              </div>
            )}

            <div>
              {sections.map((s, i) => {
                const [n, rest] = splitNumber(s.title);
                return (
                  <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="acc-legal__sec" data-reveal style={{ '--d': `${Math.min(i, 2) * 60}ms` } as CSSProperties}>
                    <h2 id={`${s.id}-h`} className="as-h3 acc-legal__h">
                      {n && <span className="acc-legal__n">{n}</span>}
                      <span className="min-w-0">{rest}</span>
                    </h2>
                    <div className="as-prose mt-5">{s.body}</div>
                  </section>
                );
              })}
            </div>

            <nav aria-label={t('site.account.legal.more')} className="mt-16" data-reveal>
              <p className="as-eyebrow mb-5">{t('site.account.legal.more')}</p>
              <ul className="acc-rows">
                {POLICIES.filter((p) => p.to !== pathname).map((p) => (
                  <li key={p.to}>
                    <Link to={p.to} className="acc-row !grid-cols-[minmax(0,1fr)_auto]">
                      <span className="acc-row__value">{t(p.key)}</span>
                      <span className="acc-row__arrow" aria-hidden>
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </>
  );
}
