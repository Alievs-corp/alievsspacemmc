import type { CSSProperties } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { SectionHead, useReveal } from '@/components/site/blocks';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

/**
 * Client quotes on the ink wall. They are attributed by sector and role rather
 * than by company name, matching what the clients agreed to have published.
 */
const Testimonials = () => {
  const { t, tRaw } = useI18n();
  const items = tRaw<Testimonial[]>('home.testimonials', []) || [];
  const ref = useReveal();

  return (
    <section className="as-bg-ink as-section">
      <div className="as-wrap">
        <div className="grid gap-6 pb-12 md:pb-20 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-16">
          <SectionHead eyebrow={t('site.home.testimonialsEyebrow')} title={t('home.testimonialsTitle')} size="md" />
          <p className="as-lead lg:pb-2">{t('home.testimonialsSubtitle')}</p>
        </div>

        <div ref={ref} className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
          {items.map((item, i) => (
            <figure
              key={item.quote}
              data-reveal
              style={{ '--d': `${i * 110}ms` } as CSSProperties}
              className="flex min-w-0 flex-col border-t-[1.5px] border-[var(--as-line)] pt-6"
            >
              <span
                aria-hidden
                className="font-[family-name:var(--as-display)] text-[84px] font-extrabold leading-[.6] text-[var(--as-mustard)] [font-stretch:125%]"
              >
                “
              </span>
              <blockquote className="mt-4 flex-1 font-[family-name:var(--as-display)] text-[clamp(19px,1.7vw,24px)] font-medium leading-[1.3] tracking-[-.01em]">
                {item.quote}
              </blockquote>
              <figcaption className="mt-8">
                <p className="text-[15px] font-semibold">{item.name}</p>
                <p className="as-mono mt-1.5 text-[var(--as-fg-soft)]">{item.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
