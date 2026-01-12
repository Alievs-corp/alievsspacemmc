import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';
import HomeHeader from '../components/ui/Home/HomeHeader';
import Advanteges from '@/components/ui/Home/Advanteges';
import WeBuild from '@/components/ui/Home/WeBuild';
import PremiumProcess from '@/components/ui/Home/PremiumProcess';
import OurProjects from '@/components/ui/Home/OurProjects';

export function Home() {
  const { t } = useI18n();
  const { content, loading } = useContent();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-white">{t('public.loading')}</div>
      </div>
    );
  }

  return (
    <div>
      <HomeHeader />
      <Advanteges />
      <WeBuild/>
      <PremiumProcess />
      <OurProjects />
    </div>
  );
}
