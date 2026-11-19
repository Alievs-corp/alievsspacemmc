import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';
import { PageHero, Pill } from '@/components/site/blocks';

/** About opener: a rust plaster wall with the studio word and the page h1. */
const AboutHeader = () => {
  const { t, tRaw } = useI18n();
  const { content } = useContent();
  // A headline edited in the admin panel replaces the built-in one (and its accent words).
  const builtIn = t('public.about.headerTitle');
  const headline = content?.about?.headline?.trim() || builtIn;
  return (
    <PageHero
      tone="rust"
      word={t('site.company.about.word')}
      num="A"
      eyebrow={t('site.company.about.eyebrow')}
      title={headline}
      accent={headline === builtIn ? tRaw<string[]>('site.company.about.heroAccent', []) || [] : []}
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
