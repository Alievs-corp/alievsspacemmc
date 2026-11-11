import type { CSSProperties, MouseEvent } from 'react';
import { useRef } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { Seo } from '@/components/Seo';
import { Accordion, type AccordionItem } from '@/components/ui/Accordion';
import { CtaWalk, PageHero, Pill, useReveal } from '@/components/site/blocks';
import { scrollToTarget, useScrollFrame } from '@/components/site/scroll';
import '@/components/site/company/company.css';

/**
 * Questions are grouped into topics by their position in `faq.items` (the
 * list has the same order in every language). Anything not listed here lands
 * in the last topic, so a longer list never loses a question.
 */
const TOPICS: number[][] = [
  [0, 1, 7],
  [11, 2, 10],
  [6, 4, 5, 3],
  [8, 9],
];

export function Faq() {
  const { t, tRaw } = useI18n();
  const items = tRaw<AccordionItem[]>('faq.items', []) || [];
  const names = tRaw<string[]>('site.company.faq.groups', []) || [];
  const navRef = useRef<HTMLElement>(null);
  const bodyRef = useReveal<HTMLDivElement>();

  // FAQPage markup is what earns the expandable Q&A block in search results.
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  const used = new Set(TOPICS.flat());
  const groups = TOPICS.map((idx, g) => {
    const extra = g === TOPICS.length - 1 ? items.map((_, i) => i).filter((i) => !used.has(i)) : [];
    return {
      id: `faq-topic-${g + 1}`,
      name: names[g] || '',
      items: [...idx, ...extra].map((i) => items[i]).filter(Boolean),
    };
  }).filter((g) => g.items.length > 0);

  // Highlight the topic currently in view (class toggles only, no re-render).
  useScrollFrame(() => {
    const nav = navRef.current;
    if (!nav) return;
    const line = window.innerHeight * 0.4;
    let current = 0;
    groups.forEach((g, i) => {
      const el = document.getElementById(g.id);
      if (el && el.getBoundingClientRect().top < line) current = i;
    });
    nav.querySelectorAll('a').forEach((a, i) => a.classList.toggle('is-on', i === current));
  });

  const jump = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    scrollToTarget(el);
  };

  return (
    <>
      <Seo page="faq" schema={faqSchema} breadcrumbs={[{ name: t('nav.faq'), path: '/faq' }]} />

      <PageHero
        short
        tone="mustard"
        word={t('site.company.faq.word')}
        num="?"
        eyebrow={t('nav.faq')}
        title={t('faq.title')}
        lead={t('faq.subtitle')}
        crumbs={[{ label: t('nav.home'), to: '/' }, { label: t('nav.faq') }]}
      />

      <section className="as-section">
        <div ref={bodyRef} className="as-wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
          <aside className="lg:col-span-4">
            <nav
              ref={navRef}
              aria-label={t('site.company.faq.topics')}
              className="lg:sticky lg:top-[calc(var(--as-header-h)+32px)]"
              data-reveal
            >
              <p className="as-eyebrow mb-5">{t('site.company.faq.topics')}</p>
              <ul className="cmp-topics">
                {groups.map((g) => (
                  <li key={g.id}>
                    <a href={`#${g.id}`} onClick={(e) => jump(e, g.id)}>
                      <span>{g.name}</span>
                      <span className="as-mono">{String(g.items.length).padStart(2, '0')}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="grid gap-16 md:gap-24 lg:col-span-8">
            {groups.map((g, gi) => (
              <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="scroll-mt-[calc(var(--as-header-h)+24px)]">
                <div className="mb-6 flex items-end justify-between gap-4 md:mb-8" data-reveal style={{ '--d': '60ms' } as CSSProperties}>
                  <h2 id={`${g.id}-title`} className="as-title as-title--sm">
                    {g.name}
                  </h2>
                  <span className="as-mono shrink-0 pb-1 text-[var(--as-fg-soft)]">
                    {String(gi + 1).padStart(2, '0')} / {String(groups.length).padStart(2, '0')}
                  </span>
                </div>
                <div data-reveal style={{ '--d': '120ms' } as CSSProperties}>
                  <Accordion items={g.items} defaultOpen={gi === 0 ? 0 : null} />
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <CtaWalk
        tone="burnt"
        eyebrow={t('site.company.faq.ctaEyebrow')}
        title={t('faq.ctaTitle')}
        lead={t('faq.ctaCopy')}
        actions={
          <>
            <Pill to="/contact" variant="light">
              {t('faq.ctaButton')}
            </Pill>
            <Pill to="/packages" variant="ghost">
              {t('nav.pricing')}
            </Pill>
          </>
        }
      />
    </>
  );
}

export default Faq;
