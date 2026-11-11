import eCommerce from '../../../assets/images/eCommerce.svg';
import software from '../../../assets/images/software.svg';
import banking from '../../../assets/images/banking.svg';
import { useI18n } from '@/contexts/I18nContext';
import { Pill, SectionHead, StackCards, type StackItem } from '@/components/site/blocks';

const ITEMS = [
  { key: 'ecommerce', img: eCommerce, tone: 'mustard' },
  { key: 'software', img: software, tone: 'burnt' },
  { key: 'banking', img: banking, tone: 'rust' },
] as const;

/** The three service lines as sticky plaster cards that pile up while scrolling. */
const WeBuild = () => {
  const { t, tRaw } = useI18n();
  const lines = tRaw<string[]>('site.home.servicesTitle', []) || [];
  const words = tRaw<string[]>('site.home.serviceWords', []) || [];

  const items: StackItem[] = ITEMS.map((it, i) => ({
    word: words[i] || '',
    tone: it.tone,
    to: '/services',
    title: t(`public.home.build.items.${it.key}.title`),
    text: t(`public.home.build.items.${it.key}.text`),
    tags: tRaw<string[]>(`site.home.serviceTags.${it.key}`, []) || [],
    extra: (
      <img
        src={it.img}
        alt={t(`public.home.build.items.${it.key}.alt`)}
        width={300}
        height={172}
        loading="lazy"
        decoding="async"
        className="absolute right-[clamp(18px,2.6vw,32px)] top-[clamp(18px,2.6vw,32px)] h-auto w-[clamp(120px,22vw,300px)] rounded-[14px] border border-[rgba(255,244,225,.35)] object-cover shadow-[0_18px_40px_rgba(40,18,4,.28)]"
      />
    ),
  }));

  return (
    <section id="services" aria-labelledby="home-services-title" className="as-wrap pb-[clamp(72px,12svh,140px)]">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 pb-9">
        <SectionHead
          id="home-services-title"
          eyebrow={t('public.buildWhat')}
          title={
            <>
              {lines[0]}
              <br />
              <em>{lines[1]}</em>
            </>
          }
          lead={t('public.buildDesc')}
        />
        <Pill to="/services" variant="ghost" size="sm">
          {t('public.home.ctas.services')}
        </Pill>
      </div>
      <StackCards items={items} />
    </section>
  );
};

export default WeBuild;
