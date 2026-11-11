import { useI18n } from '@/contexts/I18nContext';
import { WordsReveal } from '@/components/site/blocks';

/** The studio in one sentence, lit word by word as it scrolls past (first thing after the walk). */
const HomeStatement = () => {
  const { t, tRaw } = useI18n();
  const highlight = tRaw<string[]>('site.home.highlight', []) || [];

  return (
    <section className="as-wrap pt-[clamp(96px,16vw,200px)] pb-[clamp(72px,10vw,140px)]">
      <p className="as-eyebrow">{t('site.home.studio')}</p>
      <WordsReveal
        text={t('site.home.statement')}
        highlight={highlight}
        className="mt-6 max-w-[19ch] text-[clamp(28px,5.4vw,84px)] [overflow-wrap:anywhere]"
      />
    </section>
  );
};

export default HomeStatement;
