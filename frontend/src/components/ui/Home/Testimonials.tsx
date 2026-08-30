import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { useI18n } from '@/contexts/I18nContext';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

/**
 * Client quotes are attributed by sector and role rather than by company name,
 * matching what the clients agreed to have published.
 */
const Testimonials = () => {
  const { t, tRaw } = useI18n();
  const items = tRaw<Testimonial[]>('home.testimonials', []) || [];

  return (
    <Section className="bg-ink-950">
      <SectionHeading
        title={t('home.testimonialsTitle')}
        subtitle={t('home.testimonialsSubtitle')}
        className="mb-12 md:mb-16"
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {items.map((item, i) => (
          <Reveal
            as="article"
            key={item.quote}
            delay={i * 80}
            className="flex flex-col rounded-2xl border border-border bg-surface/50 p-6 transition-colors hover:border-border-strong"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7 text-primary/60" fill="currentColor">
              <path d="M7.5 6C5 6 3 8 3 10.5S5 15 7.5 15c.3 0 .6 0 .9-.1C7.8 16.7 6.2 18 4 18v2c4.4 0 8-3.6 8-8v-1.5C12 8 10 6 7.5 6zm9 0C14 6 12 8 12 10.5S14 15 16.5 15c.3 0 .6 0 .9-.1-.6 1.8-2.2 3.1-4.4 3.1v2c4.4 0 8-3.6 8-8v-1.5C21 8 19 6 16.5 6z" />
            </svg>
            <blockquote className="mt-4 flex-1 text-[14px] leading-relaxed text-text-muted md:text-[15px]">
              {item.quote}
            </blockquote>
            <footer className="mt-6 border-t border-border pt-4">
              <p className="font-display text-[14.5px] font-semibold text-white">{item.name}</p>
              <p className="mt-0.5 text-[12.5px] text-text-subtle">{item.role}</p>
            </footer>
          </Reveal>
        ))}
      </div>
    </Section>
  );
};

export default Testimonials;
