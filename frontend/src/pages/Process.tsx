import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { Seo } from '@/components/Seo';
import Container from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';

interface Step {
  title: string;
  text: string;
  deliverable: string;
  duration: string;
}

export function Process() {
  const { t, tRaw } = useI18n();
  const steps = tRaw<Step[]>('process.steps', []) || [];

  // HowTo markup describes an ordered procedure — a good fit for a delivery process.
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t('process.title'),
    description: t('process.subtitle'),
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.title,
      text: step.text,
    })),
  };

  return (
    <>
      <Seo
        page="process"
        schema={howToSchema}
        breadcrumbs={[{ name: t('nav.process'), path: '/process' }]}
      />

      <div className="glow-bg">
        <Container className="pb-4 pt-16 md:pt-24">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">{t('nav.process')}</span>
            <h1 className="mt-5 font-display text-[32px] font-bold leading-tight text-white md:text-[48px]">
              {t('process.title')}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[14px] leading-relaxed text-text-muted md:text-[17px]">
              {t('process.subtitle')}
            </p>
          </Reveal>
        </Container>
      </div>

      <Section tight>
        <ol className="relative mx-auto max-w-3xl">
          {/* Vertical rail connecting the steps; hidden from assistive tech. */}
          <span aria-hidden className="absolute left-[19px] top-3 hidden h-[calc(100%-3rem)] w-px bg-gradient-to-b from-primary via-border to-transparent sm:block" />

          {steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 70} className="relative flex gap-5 pb-10 last:pb-0 sm:gap-7">
              <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/50 bg-ink-950 font-mono text-[13px] font-bold text-primary">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 rounded-2xl border border-border bg-surface/50 p-5 transition-colors hover:border-border-strong md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-display text-[18px] font-semibold text-white md:text-[21px]">
                    {step.title}
                  </h2>
                  <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-text-subtle">
                    {step.duration}
                  </span>
                </div>
                <p className="mt-3 text-[14px] leading-relaxed text-text-muted md:text-[15.5px]">
                  {step.text}
                </p>
                <p className="mt-4 flex items-center gap-2 text-[12.5px] text-primary">
                  <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {step.deliverable}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section tight className="glow-bg bg-ink-950">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-[26px] font-bold text-white md:text-[34px]">
            {t('process.ctaTitle')}
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="rounded-lg bg-primary px-7 py-3.5 text-[15px] font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              {t('process.ctaButton')}
            </Link>
            <Link
              to="/packages"
              className="rounded-lg border border-border-strong px-7 py-3.5 text-[15px] font-medium text-text transition-colors hover:bg-surface-3"
            >
              {t('home.packagesCta')}
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

export default Process;
