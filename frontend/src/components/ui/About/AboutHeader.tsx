import { useI18n } from '@/contexts/I18nContext';
import { PageHero, Pill } from '@/components/site/blocks';

/** About opener: a rust plaster wall with the studio word and the page h1. */
const AboutHeader = () => {
  const { t, tRaw } = useI18n();
  return (
    <PageHero
      tone="rust"
      word={t('site.company.about.word')}
      num="A"
      eyebrow={t('site.company.about.eyebrow')}
      title={t('public.about.headerTitle')}
      accent={tRaw<string[]>('site.company.about.heroAccent', []) || []}
      lead={t('public.about.headerCopy')}
      crumbs={[{ label: t('nav.home'), to: '/' }, { label: t('nav.about') }]}
      actions={
        <>
          <Pill to="/contact" variant="light">
            {t('nav.cta')}
          </Pill>
          <Pill to="/case-studies" variant="ghost">
            {t('nav.caseStudies')}
          </Pill>
        </>
      }
    />
  );
};

export default AboutHeader;
