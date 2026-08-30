import { Link } from 'react-router-dom';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Accordion, type AccordionItem } from '@/components/ui/Accordion';
import { useI18n } from '@/contexts/I18nContext';

/** The six questions that most often block a decision. */
const FaqTeaser = () => {
  const { t, tRaw } = useI18n();
  const items = (tRaw<AccordionItem[]>('faq.items', []) || []).slice(0, 6);

  return (
    <Section>
      <SectionHeading
        eyebrow={t('nav.faq')}
        title={t('home.faqTitle')}
        subtitle={t('home.faqSubtitle')}
        className="mb-12"
      />
      <div className="mx-auto max-w-3xl">
        <Accordion items={items} />
        <Reveal className="mt-7 text-center">
          <Link to="/faq" className="text-[14px] font-medium text-primary hover:underline">
            {t('home.faqCta')} →
          </Link>
        </Reveal>
      </div>
    </Section>
  );
};

export default FaqTeaser;
