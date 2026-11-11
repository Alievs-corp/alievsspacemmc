import { useI18n } from '@/contexts/I18nContext';
import { Pill, SectionHead, StackCards } from '@/components/site/blocks';

/** Our approach: who we work with and what we own after launch, as sticky stacking plaster cards. */
const OurApproach = () => {
  const { t, tRaw } = useI18n();
  const words = tRaw<string[]>('site.company.about.approachWords', []) || [];

  return (
    <section className="as-section" aria-labelledby="about-approach">
      <div className="as-wrap">
        <SectionHead
          className="mb-12 md:mb-16"
          eyebrow={t('site.company.about.approachEyebrow')}
          title={t('public.about.approachTitle')}
          lead={t('public.about.approachCopy')}
          id="about-approach"
          size="md"
        />
        <StackCards
          items={[
            {
              word: words[0] || '',
              tone: 'mustard',
              title: t('public.about.approachWhoTitle'),
              text: t('public.about.approachWhoCopy'),
            },
            {
              word: words[1] || '',
              tone: 'burnt',
              title: t('public.about.approachResponsibilityTitle'),
              text: t('public.about.approachResponsibilityCopy'),
              extra: (
                <div className="mt-2">
                  <Pill to="/contact" variant="light">
                    {t('public.industriesCta')}
                  </Pill>
                </div>
              ),
            },
          ]}
        />
      </div>
    </section>
  );
};

export default OurApproach;
