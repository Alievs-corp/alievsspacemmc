import type { CSSProperties } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { api, toCmsLocale, type Marketing as MarketingData, type MarketingMedia } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';
import { Seo } from '@/components/Seo';
import { CtaWalk, PageHero, Pill, SectionHead, useReveal } from '@/components/site/blocks';
import { videoSource } from '@/components/site/marketing/media';
import '@/components/site/marketing/marketing.css';

/** One partner: just the logo (or its name when there is no logo), no frame or background. */
function PartnerMark({ p }: { p: MarketingData['partners'][number] }) {
  const inner = p.logo ? <img src={p.logo} alt={p.name} loading="lazy" decoding="async" draggable={false} /> : <span className="mk-mark__name">{p.name}</span>;
  return p.link ? (
    <a className="mk-mark" href={p.link} target="_blank" rel="noopener noreferrer" title={p.name}>
      {inner}
    </a>
  ) : (
    <div className="mk-mark" title={p.name}>
      {inner}
    </div>
  );
}

/** Partners glide along a single line, endlessly; hover pauses, reduced motion stops it. */
function PartnersMarquee({ partners }: { partners: MarketingData['partners'] }) {
  // Repeat short lists so one group is always wider than the screen, then
  // render that group twice: the track slides by exactly one group and loops.
  const repeat = Math.max(1, Math.ceil(8 / partners.length));
  const group = Array.from({ length: repeat }, () => partners).flat();
  const duration = Math.max(20, group.length * 5);
  return (
    <div className="mk-marquee mt-10 md:mt-14" style={{ '--mk-dur': `${duration}s` } as CSSProperties}>
      <div className="mk-marquee__track">
        {[0, 1].map((copy) => (
          <div key={copy} className="mk-marquee__group" aria-hidden={copy === 1 || undefined}>
            {group.map((p, i) => (
              <PartnerMark key={`${p.name}-${i}`} p={p} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const EMPTY: MarketingData = { headline: '', intro: '', partners: [], gallery: [] };

/** Full-screen viewer for one gallery item, with keyboard and arrow navigation. */
function Viewer({ items, index, onIndex, onClose }: { items: MarketingMedia[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const { t } = useI18n();
  const item = items[index];
  const go = useCallback((d: number) => onIndex((index + d + items.length) % items.length), [index, items.length, onIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);

  const video = item.kind === 'video' ? videoSource(item.url) : null;

  return (
    <div className="mk-viewer" role="dialog" aria-modal="true" aria-label={item.caption || t('site.marketing.galleryTitle')} onClick={onClose}>
      <button type="button" className="mk-viewer__btn mk-viewer__btn--close" onClick={onClose} aria-label={t('site.marketing.close')}>
        ✕
      </button>
      {items.length > 1 && (
        <>
          <button type="button" className="mk-viewer__btn mk-viewer__btn--prev" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="←">
            ←
          </button>
          <button type="button" className="mk-viewer__btn mk-viewer__btn--next" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="→">
            →
          </button>
        </>
      )}
      <div className="mk-viewer__stage" onClick={(e) => e.stopPropagation()}>
        <div className={video?.kind === 'embed' ? 'mk-viewer__media mk-viewer__media--embed' : 'mk-viewer__media'}>
          {video ? (
            video.kind === 'embed' ? (
              <iframe
                src={video.src}
                title={item.caption || t('site.marketing.play')}
                style={{ aspectRatio: video.portrait ? '9 / 16' : '16 / 9' }}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <video key={video.src} src={video.src} poster={item.poster || undefined} controls autoPlay playsInline />
            )
          ) : (
            <img src={item.url} alt={item.caption} />
          )}
        </div>
        {item.caption && <p className="mk-viewer__cap">{item.caption}</p>}
      </div>
    </div>
  );
}

function Tile({ item, delay, onOpen }: { item: MarketingMedia; delay: number; onOpen: () => void }) {
  const { t } = useI18n();
  const video = item.kind === 'video' ? videoSource(item.url) : null;
  const thumb = item.poster || video?.thumb;
  const [ratio, setRatio] = useState<number | null>(null);
  const fit = (w: number, h: number) => w > 0 && h > 0 && setRatio(Math.min(2, Math.max(0.5, w / h)));
  const label = item.caption || (video ? t('site.marketing.play') : t('site.marketing.galleryTitle'));

  return (
    <button
      type="button"
      className={video ? 'mk-tile mk-tile--video' : 'mk-tile'}
      onClick={onOpen}
      aria-label={label}
      data-reveal
      style={{ '--d': `${delay}ms`, ...(video && (ratio || video.portrait) ? { aspectRatio: String(ratio ?? 9 / 16) } : {}) } as CSSProperties}
    >
      {video ? (
        <>
          {thumb ? (
            <img src={thumb} alt="" loading="lazy" decoding="async" onLoad={video.kind === 'file' || item.poster ? (e) => fit(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight) : undefined} />
          ) : video.kind === 'file' ? (
            <video src={`${video.src}#t=0.5`} preload="metadata" muted playsInline onLoadedMetadata={(e) => fit(e.currentTarget.videoWidth, e.currentTarget.videoHeight)} />
          ) : null}
          <span className="mk-play" aria-hidden>
            <span>▶</span>
          </span>
        </>
      ) : (
        <img src={item.url} alt={item.caption} loading="lazy" decoding="async" />
      )}
      {item.caption && <span className="mk-cap">{item.caption}</span>}
    </button>
  );
}

export function Marketing() {
  const { t, locale } = useI18n();
  const [data, setData] = useState<MarketingData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<number | null>(null);
  const galleryRef = useReveal();

  useEffect(() => {
    let live = true;
    api
      .getMarketing(toCmsLocale(locale))
      .then((d) => live && setData({ ...EMPTY, ...d, partners: d.partners || [], gallery: d.gallery || [] }))
      .catch(() => live && setData(EMPTY))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [locale]);

  const gallery = data.gallery.filter((g) => g.url);
  const partners = data.partners.filter((p) => p.name);
  const title = data.headline || t('site.marketing.title');
  const lead = data.intro || t('site.marketing.lead');

  return (
    <>
      <Seo page="marketing" breadcrumbs={[{ name: t('nav.marketing'), path: '/marketing' }]} />

      <PageHero
        word={t('site.marketing.word')}
        num="M"
        tone="mustard"
        eyebrow={t('site.marketing.eyebrow')}
        title={title}
        accent={title.split(/\s+/).slice(-1)}
        lead={lead}
        crumbs={[{ label: t('nav.home'), to: '/' }, { label: t('nav.marketing') }]}
        actions={
          <>
            {partners.length > 0 && (
              <Pill href="#mk-partners" variant="light">
                {t('site.marketing.partnersEyebrow')}
              </Pill>
            )}
            {gallery.length > 0 && (
              <Pill href="#mk-gallery" variant="ghost">
                {t('site.marketing.galleryEyebrow')}
              </Pill>
            )}
          </>
        }
      />

      {partners.length > 0 && (
        <section id="mk-partners" className="as-section" aria-labelledby="mk-partners-title">
          <div className="as-wrap">
            <SectionHead id="mk-partners-title" eyebrow={t('site.marketing.partnersEyebrow')} title={t('site.marketing.partnersTitle')} size="md" />
          </div>
          <PartnersMarquee partners={partners} />
        </section>
      )}

      <section id="mk-gallery" className={partners.length > 0 ? 'as-section as-bg-cream' : 'as-section'} aria-labelledby="mk-gallery-title">
        <div className="as-wrap">
          <SectionHead id="mk-gallery-title" eyebrow={t('site.marketing.galleryEyebrow')} title={t('site.marketing.galleryTitle')} size="md" />
          {gallery.length > 0 ? (
            <div ref={galleryRef} className="mk-gallery mt-12 md:mt-16">
              {gallery.map((item, i) => (
                <Tile key={`${item.url}-${i}`} item={item} delay={(i % 3) * 90} onOpen={() => setOpen(i)} />
              ))}
            </div>
          ) : (
            !loading && <p className="mt-10 text-[var(--as-fg-soft)]">{t('site.marketing.empty')}</p>
          )}
        </div>
      </section>

      <CtaWalk
        tone="burnt"
        eyebrow={t('site.marketing.ctaEyebrow')}
        title={t('site.marketing.ctaTitle')}
        lead={t('site.marketing.ctaLead')}
        actions={
          <Pill to="/contact" variant="light">
            {t('nav.cta')}
          </Pill>
        }
      />

      {open !== null && gallery[open] && <Viewer items={gallery} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
}

export default Marketing;
