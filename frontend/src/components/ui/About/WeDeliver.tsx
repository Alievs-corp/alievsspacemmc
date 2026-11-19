import type { CSSProperties } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';
import { SectionHead, useReveal } from '@/components/site/blocks';
import analysis from '../../../assets/images/analysis.svg';
import uxUi from '../../../assets/images/ux-ui.svg';
import development from '../../../assets/images/development.svg';
import qualityControl from '../../../assets/images/qualityControl.svg';
import launch from '../../../assets/images/launch.svg';
import support from '../../../assets/images/support.svg';

const STAGES = [
  ['analysis', analysis],
  ['uxui', uxUi],
  ['development', development],
  ['quality', qualityControl],
  ['launch', launch],
  ['support', support],
] as const;

/**
 * How we deliver: the six stages as the reference ruled list. Each row carries
 * its photo, which comes into colour when the row is hovered (always in colour
 * on touch screens).
 */
const WeDeliver = () => {
  const { t } = useI18n();
  const { content } = useContent();
  const cms = (content?.about?.process ?? []).filter((p) => p && typeof p === 'object' && p.title);
  const steps = cms.length
    ? cms.map((p, i) => ({
        key: `cms-${i}`,
        title: p.title,
        text: p.desc,
        alt: p.title,
        img: p.image || STAGES[i % STAGES.length][1],
      }))
    : STAGES.map(([key, img]) => ({
        key,
        title: t(`public.about.deliver.items.${key}.title`),
        text: t(`public.about.deliver.items.${key}.text`),
        alt: t(`public.about.deliver.items.${key}.alt`),
        img,
      }));
  const listRef = useReveal<HTMLOListElement>();

  return (
    <section className="as-section as-bg-cream" aria-labelledby="about-deliver">
      <div className="as-wrap">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--as-header-h)+32px)]">
              <SectionHead
                eyebrow={t('site.company.about.deliverEyebrow')}
                title={t('public.about.deliverTitle')}
                lead={t('public.about.deliverIntro')}
                id="about-deliver"
                size="sm"
              />
            </div>
          </div>
          <ol ref={listRef} className="as-steps cmp-deliver lg:col-span-8">
            {steps.map(({ key, img, title, text, alt }, i) => (
              <li
                key={key}
                data-reveal
                style={{ '--d': `${Math.min(i, 5) * 70}ms` } as CSSProperties}
                className="md:grid-cols-[74px_1fr_minmax(150px,220px)] md:gap-6"
              >
                <span className="as-step-n">{String(i + 1).padStart(2, '0')}</span>
                <div className="min-w-0">
                  <h3 className="as-h3">{title}</h3>
                  <p>{text}</p>
                </div>
                <div className="cmp-deliver__img col-start-2 mt-2 md:col-start-3 md:row-start-1 md:mt-0">
                  <img
                    src={img}
                    alt={alt}
                    width={245}
                    height={146}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default WeDeliver;
