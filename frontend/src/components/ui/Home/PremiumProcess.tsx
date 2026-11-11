import { useI18n } from '@/contexts/I18nContext';
import { Pill, SectionHead, Steps } from '@/components/site/blocks';

const PHASES = ['discovery', 'uxui', 'development', 'qa', 'launch', 'support'] as const;

/** Six delivery phases as the ruled, numbered list; the heading holds still beside it on wide screens. */
const PremiumProcess = () => {
  const { t } = useI18n();
  const steps = PHASES.map((p) => ({
    title: t(`public.home.process.phases.${p}.title`),
    text: t(`public.home.process.phases.${p}.desc`),
  }));

  return (
    <section id="process" className="as-section">
      <div className="as-wrap grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-[calc(var(--as-header-h)+40px)] lg:self-start">
          <SectionHead eyebrow={t('nav.process')} title={t('public.premiumProcess')} lead={t('public.processDesc')} size="md">
            <Pill to="/process" variant="ghost" size="sm" className="mt-3">
              {t('site.home.processCta')}
            </Pill>
          </SectionHead>
        </div>
        <Steps items={steps} />
      </div>
    </section>
  );
};

export default PremiumProcess;
