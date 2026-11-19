import type { CSSProperties } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { api, toCmsLocale, type Marketing as MarketingData, type MarketingMedia } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';
import { Seo } from '@/components/Seo';
import { CtaWalk, PageHero, Pill, SectionHead, Ticker, useReveal } from '@/components/site/blocks';
import { videoSource } from '@/components/site/marketing/media';
import '@/components/site/marketing/marketing.css';

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
        {video ? (
          video.kind === 'embed' ? (
            <iframe src={video.src} title={item.caption || t('site.marketing.play')} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
          ) : (
            <video src={video.src} poster={item.poster || undefined} controls autoPlay playsInline />
          )
        ) : (
          <img src={item.url} alt={item.caption} />
        )}
        {item.caption && <p className="mk-viewer__cap">{item.caption}</p>}
      </div>
    </div>
  );
}

function Tile({ item, delay, onOpen }: { item: MarketingMedia; delay: number; onOpen: () => void }) {
  const { t } = useI18n();
  const video = item.kind === 'video' ? videoSource(item.url) : null;
  const thumb = item.poster || video?.thumb;
  const label = item.caption || (video ? t('site.marketing.play') : t('site.marketing.galleryTitle'));

  return (
    <button
      type="button"
      className={video ? 'mk-tile mk-tile--video' : 'mk-tile'}
      onClick={onOpen}
      aria-label={label}
      data-reveal
      style={{ '--d': `${delay}ms` } as CSSProperties}
    >
      {video ? (
        <>
          {thumb ? (
            <img src={thumb} alt="" loading="lazy" decoding="async" />
          ) : video.kind === 'file' ? (
            <video src={`${video.src}#t=0.5`} preload="metadata" muted playsInline />
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
  const partnersRef = useReveal();
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

      {partners.length > 1 && <Ticker items={partners.map((p) => p.name)} duration={36} />}

      {partners.length > 0 && (
        <section id="mk-partners" className="as-section" aria-labelledby="mk-partners-title">
          <div className="as-wrap">
            <SectionHead id="mk-partners-title" eyebrow={t('site.marketing.partnersEyebrow')} title={t('site.marketing.partnersTitle')} size="md" />
            <div ref={partnersRef} className="mk-partners mt-12 md:mt-16">
              {partners.map((p, i) => {
                const inner = (
                  <>
                    <div className="mk-partner__logo">
                      {p.logo ? <img src={p.logo} alt={p.name} loading="lazy" decoding="async" /> : <span className="mk-partner__initial">{p.name.charAt(0).toUpperCase()}</span>}
                    </div>
                    <h3 className="mk-partner__name">{p.name}</h3>
                    {p.desc && <p className="mk-partner__desc">{p.desc}</p>}
                    {p.link && (
                      <span className="as-mono text-[var(--as-accent)]">
                        {t('site.marketing.visit')} <span aria-hidden>↗</span>
                      </span>
                    )}
                  </>
                );
                const style = { '--d': `${(i % 4) * 80}ms` } as CSSProperties;
                return p.link ? (
                  <a key={`${p.name}-${i}`} className="mk-partner" href={p.link} target="_blank" rel="noopener noreferrer" data-reveal style={style}>
                    {inner}
                  </a>
                ) : (
                  <div key={`${p.name}-${i}`} className="mk-partner" data-reveal style={style}>
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
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
