import { useI18n } from '@/contexts/I18nContext';
import { Seo } from '@/components/Seo';
import { CtaWalk, PageHero, Pill, Ticker, WordsReveal } from '@/components/site/blocks';
import { Timeline, type TimelineStep } from '@/components/site/offer/parts';

export function Process() {
  const { t, tRaw } = useI18n();
  const steps = tRaw<TimelineStep[]>('process.steps', []) || [];
  const highlight = tRaw<string[]>('site.offer.process.highlight', []) || [];

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
      <Seo page="process" schema={howToSchema} breadcrumbs={[{ name: t('nav.process'), path: '/process' }]} />

      <PageHero
        word={t('site.offer.process.word')}
        num={String(steps.length || 6)}
        tone="amber"
        eyebrow={t('nav.process')}
        title={t('process.title')}
        lead={t('process.subtitle')}
        crumbs={[{ label: t('nav.home'), to: '/' }, { label: t('nav.process') }]}
        actions={
          <>
            <Pill to="/contact" variant="light">
              {t('process.ctaButton')}
            </Pill>
            <Pill to="/packages" variant="ghost">
              {t('home.packagesCta')}
            </Pill>
          </>
        }
      />

      <section className="as-section--tight">
        <div className="as-wrap">
          <WordsReveal text={t('site.offer.process.statement')} highlight={highlight} className="max-w-[22ch]" />
        </div>
      </section>

      <section className="as-section pt-0" aria-label={t('site.offer.process.stepsLabel')}>
        <div className="as-wrap">
          <Timeline
            steps={steps}
            labels={{
              step: t('site.offer.process.step'),
              of: t('site.offer.process.of'),
              deliverable: t('site.offer.process.deliverable'),
              nav: t('site.offer.process.stepsLabel'),
            }}
          />
        </div>
      </section>

      <Ticker items={steps.map((s) => s.title)} duration={34} />

      <CtaWalk
        tone="rust"
        eyebrow={t('site.offer.process.ctaEyebrow')}
        title={t('process.ctaTitle')}
        actions={
          <>
            <Pill to="/contact" variant="light">
              {t('process.ctaButton')}
            </Pill>
            <Pill to="/packages" variant="ghost">
              {t('home.packagesCta')}
            </Pill>
          </>
        }
      />
    </>
  );
}

export default Process;
