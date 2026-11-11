import { useI18n } from '@/contexts/I18nContext';
import { CtaWalk, Pill } from '@/components/site/blocks';
import { phoneForLocale, whatsappHref } from '@/lib/site';

/** Closing band of the homepage: plaster wall, the invitation and the figure walking off to launch. */
const FinalCta = () => {
  const { t, tRaw, locale } = useI18n();
  const lines = tRaw<string[]>('site.home.ctaLines', []) || [];

  return (
    <CtaWalk
      tone="burnt"
      eyebrow={t('site.home.ctaEyebrow')}
      title={
        lines.length === 3 ? (
          <>
            {lines[0]}
            <br />
            <em>{lines[1]}</em>
            <br />
            {lines[2]}
          </>
        ) : (
          t('home.finalTitle')
        )
      }
      lead={t('home.finalCopy')}
      actions={
        <>
          <Pill to="/contact" variant="light">
            {t('home.finalCta')}
          </Pill>
          <Pill href={whatsappHref(phoneForLocale(locale))} target="_blank" rel="noopener noreferrer" variant="ghost" arrow={false}>
            {t('home.finalSecondary')}
          </Pill>
          <p className="basis-full pt-1 text-[13px] text-[rgba(255,248,238,.82)]">{t('home.finalNote')}</p>
        </>
      }
    />
  );
};

export default FinalCta;
