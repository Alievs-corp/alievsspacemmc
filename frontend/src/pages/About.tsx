import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';
import AboutHeader from "./../components/ui/About/AboutHeader";
import WhoWeAre from './../components/ui/About/WhoWeAre';
import WeDeliver from './../components/ui/About/WeDeliver';
import OurApproach from './../components/ui/About/OurApproach';
import { Helmet } from 'react-helmet-async';

export function About() {
  const { t } = useI18n();
  const { loading } = useContent();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-[var(--color-muted-foreground)]">Loading...</div>
      </div>
    );
  }


  return (
    <div>
      <Helmet>
        <title>{`${t('nav.about', 'About')} | Alievs Space MMC`}</title>
        <meta name="description" content={t('about.headerCopy')} />
        <meta property="og:title" content={`${t('nav.about', 'About')}`} />
        <meta property="og:description" content={t('about.headerCopy')} />
        <meta property="og:type" content="website" />
      </Helmet>
      <AboutHeader />
      <WhoWeAre />
      <WeDeliver />
      <OurApproach />
    </div>
  );
}

