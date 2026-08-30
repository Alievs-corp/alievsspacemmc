import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { Seo } from '@/components/Seo';
import Container from '@/components/ui/Container';

export function NotFound() {
  const { t } = useI18n();

  return (
    <>
      <Seo page="notFound" noindex />
      <Container className="glow-bg flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="font-display text-[72px] font-bold leading-none text-primary md:text-[110px]">
          {t('notFound.code', '404')}
        </p>
        <h1 className="mt-4 font-display text-[24px] font-bold text-white md:text-[34px]">
          {t('notFound.title')}
        </h1>
        <p className="mt-4 max-w-md text-[14px] leading-relaxed text-text-muted md:text-[16px]">
          {t('notFound.copy')}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-lg bg-primary px-6 py-3 text-[14px] font-semibold text-on-primary transition-colors hover:bg-primary-hover"
          >
            {t('notFound.home')}
          </Link>
          <Link
            to="/packages"
            className="rounded-lg border border-border-strong px-6 py-3 text-[14px] font-medium text-text transition-colors hover:bg-surface-3"
          >
            {t('notFound.packages')}
          </Link>
          <Link
            to="/contact"
            className="rounded-lg border border-border-strong px-6 py-3 text-[14px] font-medium text-text transition-colors hover:bg-surface-3"
          >
            {t('notFound.contact')}
          </Link>
        </div>
      </Container>
    </>
  );
}

export default NotFound;
