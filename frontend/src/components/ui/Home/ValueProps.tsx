import { useI18n } from '@/contexts/I18nContext';
import { RevealGrid, SectionHead } from '@/components/site/blocks';

interface Value {
  title: string;
  text: string;
}

/** Six reasons as a ruled, numbered grid on the cream wall; cells reveal in a stagger. */
const ValueProps = () => {
  const { t, tRaw } = useI18n();
  const values = tRaw<Value[]>('home.values', []) || [];

  return (
    <section id="why-us" className="as-bg-cream as-section">
      <div className="as-wrap">
        <div className="grid gap-6 pb-12 md:pb-16 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-16">
          <SectionHead eyebrow={t('nav.company')} title={t('home.valueTitle')} size="md" />
          <p className="as-lead lg:pb-2">{t('home.valueSubtitle')}</p>
        </div>

        <RevealGrid className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, i) => (
            <article key={value.title} className="group h-full border-t-[1.5px] border-[var(--as-line-strong)] pb-10 pt-5 md:pb-14">
              <span className="as-mono text-[var(--as-accent)]">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="as-h3 mt-5 max-w-[16ch] text-[clamp(21px,2vw,28px)] transition-transform duration-500 ease-[var(--as-ease)] group-hover:translate-x-1.5">
                {value.title}
              </h3>
              <p className="mt-3 max-w-[40ch] text-[15px] leading-relaxed text-[var(--as-fg-soft)] md:text-[16px]">{value.text}</p>
            </article>
          ))}
        </RevealGrid>
      </div>
    </section>
  );
};

export default ValueProps;
