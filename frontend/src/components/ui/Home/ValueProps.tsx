import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { useI18n } from '@/contexts/I18nContext';

interface Value {
  title: string;
  text: string;
}

/** Icons are decorative; the paths mirror the order of `home.values`. */
const ICON_PATHS = [
  'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
  'M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414',
];

const ValueProps = () => {
  const { t, tRaw } = useI18n();
  const values = tRaw<Value[]>('home.values', []) || [];

  return (
    <Section id="why-us" className="bg-ink-950">
      <SectionHeading
        eyebrow={t('nav.company')}
        title={t('home.valueTitle')}
        subtitle={t('home.valueSubtitle')}
        className="mb-12 md:mb-16"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {values.map((value, i) => (
          <Reveal
            as="article"
            key={value.title}
            delay={i * 60}
            className="group rounded-2xl border border-border bg-surface/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface-2 text-primary transition-colors group-hover:border-primary/50">
              <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[i % ICON_PATHS.length]} />
              </svg>
            </span>
            <h3 className="mt-5 font-display text-[18px] font-semibold text-white md:text-[20px]">
              {value.title}
            </h3>
            <p className="mt-3 text-[13.5px] leading-relaxed text-text-muted md:text-[15px]">
              {value.text}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
};

export default ValueProps;
