import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';
import AboutHeader from '@/components/ui/About/AboutHeader';
import WhoWeAre from '@/components/ui/About/WhoWeAre';
import WeDeliver from '@/components/ui/About/WeDeliver';
import OurApproach from '@/components/ui/About/OurApproach';
import { CtaWalk, Pill, Ticker } from '@/components/site/blocks';
import { Seo } from '@/components/Seo';
import '@/components/site/company/company.css';

export function About() {
  const { t, tRaw } = useI18n();
  const { loading } = useContent();
  const cta = tRaw<string[]>('site.company.about.ctaTitle', []) || [];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="as-mono text-[var(--as-fg-soft)]">{t('public.loading', 'Loading...')}</div>
      </div>
    );
  }

  return (
    <div>
      <Seo page="about" breadcrumbs={[{ name: t('nav.about'), path: '/about' }]} />
      <AboutHeader />
      <WhoWeAre />
      <Ticker
        items={[
          t('public.about.who.values.responsibility'),
          t('public.about.who.values.transparency'),
          t('public.about.who.values.premiumQuality'),
          t('public.about.who.values.securityReliability'),
          t('public.about.who.values.longTermPartnership'),
        ]}
        duration={34}
      />
      <WeDeliver />
      <OurApproach />
      <CtaWalk
        tone="burnt"
        eyebrow={t('site.company.about.ctaEyebrow')}
        title={
          <>
            {cta[0]}
            <br />
            <em>{cta[1]}</em>
            <br />
            {cta[2]}
          </>
        }
        lead={t('site.company.about.ctaLead')}
        actions={
          <>
            <Pill to="/contact" variant="light">
              {t('nav.cta')}
            </Pill>
            <Pill to="/services" variant="ghost">
              {t('nav.services')}
            </Pill>
          </>
        }
      />
    </div>
  );
}
