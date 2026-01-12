import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';
import AboutHeader from "./../components/ui/About/AboutHeader";
import WhoWeAre from './../components/ui/About/WhoWeAre';
import WeDeliver from './../components/ui/About/WeDeliver';
import OurApproach from './../components/ui/About/OurApproach';

export function About() {
  const { t } = useI18n();
  const { content, loading } = useContent();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-[var(--color-muted-foreground)]">Loading...</div>
      </div>
    );
  }


  return (
    <div>
      <AboutHeader />
      <WhoWeAre />
      <WeDeliver />
      <OurApproach />
    </div>
  );
}

