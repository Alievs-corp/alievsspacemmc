import { useI18n } from '@/contexts/I18nContext';
import { WalkHero } from '@/components/site/WalkHero';
import { Pill } from '@/components/site/blocks';
import { SITE_URL } from '@/lib/site';

/**
 * Above the fold: the h1, the pitch and the two next actions sit on the first
 * wall panel; scrolling walks the figure through the six stages of a project.
 */
const HomeHero = () => {
  const { t, tRaw } = useI18n();
  const words = tRaw<string[]>('site.walk.words', []);
  const notes = tRaw<Array<{ title: string; body: string }>>('site.walk.notes', []);

  return (
    <WalkHero
      label={t('site.walk.label')}
      cue={t('site.walk.cue')}
      words={words}
      notes={notes}
      footLeft="@alievsspace"
      footRight={SITE_URL.replace(/^https?:\/\//, '')}
      intro={
        <>
          <p className="as-eyebrow as-eyebrow--on-color as-page-enter">{t('home.badge')}</p>
          <h1>{t('home.heroTitle')}</h1>
          <p className="as-intro-copy as-page-enter" style={{ animationDelay: '.16s' }}>
            {t('home.heroCopy')}
          </p>
          <div className="flex flex-wrap gap-2.5 as-page-enter" style={{ animationDelay: '.24s' }}>
            <Pill to="/contact" variant="light">
              {t('home.ctaPrimary')}
            </Pill>
            <Pill to="/packages" variant="ghost" arrow={false} className="max-sm:hidden">
              {t('home.ctaSecondary')}
            </Pill>
          </div>
        </>
      }
    />
  );
};

export default HomeHero;
