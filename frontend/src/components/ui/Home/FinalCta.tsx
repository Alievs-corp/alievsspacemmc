import { Link } from 'react-router-dom';
import Container from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { useI18n } from '@/contexts/I18nContext';
import { ORGANIZATION } from '@/lib/site';

/** Closing conversion block, repeated at the end of the homepage. */
const FinalCta = () => {
  const { t } = useI18n();

  return (
    <section className="glow-bg border-t border-border bg-ink-950">
      <Container className="py-20 text-center md:py-28">
        <Reveal className="mx-auto max-w-2xl">
          <h2 className="font-display text-[28px] font-bold leading-tight text-white md:text-[42px]">
            {t('home.finalTitle')}
          </h2>
          <p className="mx-auto mt-5 text-[14px] leading-relaxed text-text-muted md:text-[17px]">
            {t('home.finalCopy')}
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="rounded-lg bg-primary px-7 py-3.5 text-[15px] font-semibold text-on-primary shadow-[var(--shadow-glow-primary)] transition-colors hover:bg-primary-hover"
            >
              {t('home.finalCta')}
            </Link>
            <a
              href={`https://wa.me/${ORGANIZATION.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border-strong px-7 py-3.5 text-[15px] font-medium text-text transition-colors hover:bg-surface-3"
            >
              {t('home.finalSecondary')}
            </a>
          </div>

          <p className="mt-6 text-[12.5px] text-text-subtle">{t('home.finalNote')}</p>
        </Reveal>
      </Container>
    </section>
  );
};

export default FinalCta;
