import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { Seo } from '@/components/Seo';
import Container from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Accordion, type AccordionItem } from '@/components/ui/Accordion';

export function Faq() {
  const { t, tRaw } = useI18n();
  const items = tRaw<AccordionItem[]>('faq.items', []) || [];

  // FAQPage markup is what earns the expandable Q&A block in search results.
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <>
      <Seo page="faq" schema={faqSchema} breadcrumbs={[{ name: t('nav.faq'), path: '/faq' }]} />

      <div className="glow-bg">
        <Container className="pb-4 pt-16 md:pt-24">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">{t('nav.faq')}</span>
            <h1 className="mt-5 font-display text-[32px] font-bold leading-tight text-white md:text-[48px]">
              {t('faq.title')}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[14px] leading-relaxed text-text-muted md:text-[17px]">
              {t('faq.subtitle')}
            </p>
          </Reveal>
        </Container>
      </div>

      <Section tight>
        <div className="mx-auto max-w-3xl">
          <Accordion items={items} />
        </div>
      </Section>

      <Section tight className="glow-bg bg-ink-950">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-[26px] font-bold text-white md:text-[34px]">
            {t('faq.ctaTitle')}
          </h2>
          <p className="mx-auto mt-4 text-[14px] leading-relaxed text-text-muted md:text-[16px]">
            {t('faq.ctaCopy')}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="rounded-lg bg-primary px-7 py-3.5 text-[15px] font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              {t('faq.ctaButton')}
            </Link>
            <Link
              to="/packages"
              className="rounded-lg border border-border-strong px-7 py-3.5 text-[15px] font-medium text-text transition-colors hover:bg-surface-3"
            >
              {t('nav.pricing')}
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

export default Faq;
