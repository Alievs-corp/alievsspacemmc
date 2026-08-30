import { useI18n } from '@/contexts/I18nContext';
import { Seo } from '@/components/Seo';
import HomeHero from '@/components/ui/Home/HomeHero';
import StatsBand from '@/components/ui/Home/StatsBand';
import WeBuild from '@/components/ui/Home/WeBuild';
import ValueProps from '@/components/ui/Home/ValueProps';
import PackagesTeaser from '@/components/ui/Home/PackagesTeaser';
import PremiumProcess from '@/components/ui/Home/PremiumProcess';
import Testimonials from '@/components/ui/Home/Testimonials';
import FaqTeaser from '@/components/ui/Home/FaqTeaser';
import FinalCta from '@/components/ui/Home/FinalCta';

export function Home() {
  const { tRaw } = useI18n();

  // Home carries the FAQ markup too — it is where most search traffic lands.
  const faqItems = (tRaw<Array<{ q: string; a: string }>>('faq.items', []) || []).slice(0, 6);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <>
      <Seo page="home" path="/" schema={faqSchema} />
      {/* h1 lives in the hero; the rest of the page is a flat list of sections. */}
      <HomeHero />
      <StatsBand />
      <WeBuild />
      <ValueProps />
      <PackagesTeaser />
      <PremiumProcess />
      <Testimonials />
      <FaqTeaser />
      <FinalCta />
    </>
  );
}
