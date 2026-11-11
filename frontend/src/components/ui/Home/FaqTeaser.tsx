import { useI18n } from '@/contexts/I18nContext';
import { Pill, SectionHead } from '@/components/site/blocks';
import { FaqList, type FaqItem } from '@/components/site/home/FaqList';

/** The six questions that most often block a decision (also in the page's FAQPage schema). */
const FaqTeaser = () => {
  const { t, tRaw } = useI18n();
  const items = (tRaw<FaqItem[]>('faq.items', []) || []).slice(0, 6);

  return (
    <section id="faq" className="as-section">
      <div className="as-wrap grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div className="lg:sticky lg:top-[calc(var(--as-header-h)+40px)] lg:self-start">
          <SectionHead eyebrow={t('nav.faq')} title={t('home.faqTitle')} lead={t('home.faqSubtitle')} size="sm">
            <Pill to="/faq" variant="ghost" size="sm" className="mt-3">
              {t('home.faqCta')}
            </Pill>
          </SectionHead>
        </div>
        <FaqList items={items} />
      </div>
    </section>
  );
};

export default FaqTeaser;
