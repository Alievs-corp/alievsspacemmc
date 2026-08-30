import { Link } from 'react-router-dom';
import homeBg from '@/assets/images/home-bg.jpg';
import Container from '@/components/ui/Container';
import { useI18n } from '@/contexts/I18nContext';

/**
 * Above-the-fold block. Everything a first-time visitor needs to decide:
 * what we do, proof we can be trusted, and the two next actions.
 */
/** React 18 does not map the camelCase `fetchPriority` prop to the DOM attribute. */
const HIGH_PRIORITY = { fetchpriority: 'high' } as Record<string, string>;

const HomeHero = () => {
  const { t } = useI18n();

  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={homeBg}
        alt=""
        aria-hidden
        {...HIGH_PRIORITY}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'linear-gradient(287deg, rgb(var(--scrim-rgb) / var(--scrim-hero-1)) 0%, rgb(var(--scrim-rgb) / var(--scrim-hero-2)) 100%),' +
            'radial-gradient(70% 60% at 85% 15%, rgba(253,82,4,.20), transparent 60%)',
        }}
      />

      <Container className="relative flex min-h-[620px] flex-col justify-center py-20 md:min-h-[680px] md:py-28">
        <div className="max-w-3xl">
          <span className="eyebrow animate-reveal">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success" />
            {t('home.badge')}
          </span>

          <h1 className="mt-6 animate-reveal font-display text-[34px] font-bold leading-[1.1] text-white md:text-[52px] lg:text-[62px]">
            {t('home.heroTitle')}
          </h1>

          <p className="mt-6 max-w-2xl animate-reveal text-[14px] leading-relaxed text-text-muted md:text-[18px]">
            {t('home.heroCopy')}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="rounded-lg bg-primary px-6 py-3.5 text-[14px] font-semibold text-on-primary shadow-[var(--shadow-glow-primary)] transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus md:text-[16px]"
            >
              {t('home.ctaPrimary')}
            </Link>
            <Link
              to="/packages"
              className="rounded-lg border border-border-strong bg-ink-950/40 px-6 py-3.5 text-[14px] font-medium text-text backdrop-blur transition-colors hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus md:text-[16px]"
            >
              {t('home.ctaSecondary')}
            </Link>
          </div>

          <p className="mt-6 text-[12.5px] text-text-subtle md:text-[13.5px]">{t('home.heroNote')}</p>
        </div>
      </Container>
    </section>
  );
};

export default HomeHero;
