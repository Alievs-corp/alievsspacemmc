import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, Film, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { api, CMS_LOCALES, type Locale, type Marketing, type MarketingMedia, type MarketingPartner, toCmsLocale } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';
import { LocaleTabs } from '@/components/admin/LocaleTabs';
import { MediaUpload } from '@/components/admin/MediaUpload';
import { videoSource } from '@/components/site/marketing/media';
import { cn } from '@/lib/utils';

type Docs = Record<Locale, Marketing>;

const emptyPartner = (): MarketingPartner => ({ name: '', logo: '', link: '', desc: '' });
const blank = (): Marketing => ({ headline: '', intro: '', partners: [], gallery: [] });

const inputCls =
  'w-full rounded-md border border-surface-3 bg-surface px-3 py-2 text-sm text-white placeholder-text-subtle focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary';

const inputSm =
  'w-full rounded border border-surface-3 bg-surface px-2 py-1 text-xs text-white placeholder-text-subtle focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary';

/**
 * Lists (partners, gallery) share structure across languages: the same item
 * sits at the same index in every language, so adding, removing and moving
 * apply everywhere while text fields stay per language.
 */
function align(docs: Docs): Docs {
  const base = docs.en;
  const out = {} as Docs;
  for (const loc of CMS_LOCALES) {
    const d = docs[loc];
    out[loc] = {
      headline: d.headline || '',
      intro: d.intro || '',
      partners: base.partners.map((p, i) => ({ ...emptyPartner(), ...p, desc: d.partners[i]?.desc ?? '' })),
      gallery: base.gallery.map((g, i) => ({ ...g, caption: d.gallery[i]?.caption ?? '' })),
    };
  }
  return out;
}

export function AdminMarketing() {
  const { locale, supportedLocales: siteLocales, t } = useI18n();
  const supportedLocales = siteLocales.filter((l) => (CMS_LOCALES as readonly string[]).includes(l.code));
  const [docs, setDocs] = useState<Docs>({ en: blank(), az: blank(), ru: blank() });
  const [loc, setLoc] = useState<Locale>(toCmsLocale(locale));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const got = await Promise.all(CMS_LOCALES.map((l) => api.getMarketing(l)));
      const next = {} as Docs;
      CMS_LOCALES.forEach((l, i) => {
        next[l] = { ...blank(), ...got[i], partners: got[i].partners || [], gallery: got[i].gallery || [] };
      });
      setDocs(align(next));
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.failedToLoad'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const doc = docs[loc];

  const touch = (fn: (d: Docs) => Docs) => {
    setDocs((d) => fn(d));
    setDirty(true);
    setSaved(false);
  };

  /** Update fields of the active language only. */
  const setText = (patch: Partial<Marketing>) => touch((d) => ({ ...d, [loc]: { ...d[loc], ...patch } }));

  /** Apply a change to one list item in every language (shared fields). */
  const mapAll = <K extends 'partners' | 'gallery'>(key: K, fn: (list: Marketing[K]) => Marketing[K]) =>
    touch((d) => {
      const out = {} as Docs;
      for (const l of CMS_LOCALES) out[l] = { ...d[l], [key]: fn(d[l][key]) };
      return out;
    });

  const patchShared = <K extends 'partners' | 'gallery'>(key: K, i: number, patch: Partial<Marketing[K][number]>) =>
    mapAll(key, (list) => list.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) as Marketing[K]);

  /** Update a per-language text field of one list item. */
  const patchText = <K extends 'partners' | 'gallery'>(key: K, i: number, patch: Partial<Marketing[K][number]>) =>
    touch((d) => ({
      ...d,
      [loc]: { ...d[loc], [key]: d[loc][key].map((it, idx) => (idx === i ? { ...it, ...patch } : it)) },
    }));

  const removeAt = (key: 'partners' | 'gallery', i: number) => {
    if (!confirm(t('panel.marketing.confirmRemove'))) return;
    mapAll(key, (list) => list.filter((_, idx) => idx !== i) as never);
  };

  const move = (key: 'partners' | 'gallery', i: number, d: -1 | 1) =>
    mapAll(key, (list) => {
      const j = i + d;
      if (j < 0 || j >= list.length) return list;
      const copy = [...list];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy as never;
    });

  const addPartner = () => mapAll('partners', (l) => [emptyPartner(), ...l]);
  const addMedia = (kind: MarketingMedia['kind']) =>
    mapAll('gallery', (l) => [{ kind, url: '', poster: '', caption: '' }, ...l]);

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      // Rows left completely empty are not stored.
      const clean = (d: Marketing): Marketing => ({
        ...d,
        partners: d.partners.filter((p) => p.name.trim()),
        gallery: d.gallery.filter((g) => g.url.trim()),
      });
      await Promise.all(CMS_LOCALES.map((l) => api.admin.updateMarketing(l, clean(docs[l]))));
      await load();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.failedToSave'));
    } finally {
      setSaving(false);
    }
  };

  const counts = useMemo(() => ({ partners: doc.partners.length, gallery: doc.gallery.length }), [doc]);

  if (loading) return <div className="text-text-subtle">{t('admin.loading')}</div>;

  return (
    <div className="space-y-4 pb-20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-text sm:text-3xl">{t('panel.marketing.title')}</h1>
          <p className="mt-1 max-w-2xl text-sm text-text-subtle">{t('panel.marketing.subtitle')}</p>
        </div>
        <LocaleTabs locales={supportedLocales} active={loc} onChange={(c) => setLoc(c as Locale)} />
      </div>

      {error && <div className="rounded-md border border-red-800 bg-red-900/20 p-3 text-sm text-red-400">{error}</div>}

      <p className="rounded-md border border-surface-3 bg-surface-2/40 px-3 py-2 text-xs text-text-subtle">{t('panel.marketing.shared')}</p>

      {/* Page text */}
      <section className="space-y-3 rounded-lg border border-surface-3 bg-surface p-3 sm:p-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-white">{t('panel.marketing.headline')}</label>
          <input className={inputCls} value={doc.headline} onChange={(e) => setText({ headline: e.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-white">{t('panel.marketing.intro')}</label>
          <textarea rows={3} className={inputCls} value={doc.intro} onChange={(e) => setText({ intro: e.target.value })} />
        </div>
      </section>

      {/* Partners */}
      <section className="space-y-3 rounded-lg border border-surface-3 bg-surface p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-text">
            {t('panel.marketing.partners')} <span className="ml-1 text-sm font-normal text-text-subtle">{counts.partners}</span>
          </h2>
          <Button type="button" onClick={addPartner}>
            <Plus className="mr-1.5 h-4 w-4" />
            {t('panel.marketing.addPartner')}
          </Button>
        </div>

        {doc.partners.length === 0 && <p className="py-6 text-center text-sm text-text-subtle">{t('panel.marketing.noPartners')}</p>}

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {doc.partners.map((p, i) => (
            <div key={i} className="space-y-1.5 rounded-md border border-surface-3 bg-surface-2/30 p-2">
              <div className="flex items-start gap-2">
                <div className="grid h-12 w-16 shrink-0 place-items-center overflow-hidden rounded border border-surface-3 bg-surface p-1">
                  {p.logo ? <img src={p.logo} alt="" className="h-full w-full object-contain" /> : <ImageIcon className="h-5 w-5 text-text-subtle" />}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <input className={inputSm} placeholder={t('panel.marketing.partnerName')} value={p.name} onChange={(e) => patchShared('partners', i, { name: e.target.value })} />
                  <input className={inputSm} placeholder={`${t('panel.marketing.partnerLink')} https://…`} value={p.link} onChange={(e) => patchShared('partners', i, { link: e.target.value })} />
                </div>
              </div>
              <input className={inputSm} placeholder={t('panel.marketing.partnerDesc')} value={p.desc} onChange={(e) => patchText('partners', i, { desc: e.target.value })} />
              <div className="flex items-center justify-between gap-2">
                <MediaUpload accept="image" label={t('panel.marketing.logo')} folder="marketing/partners" onUploaded={(url) => patchShared('partners', i, { logo: url })} />
                <RowActions
                  onUp={() => move('partners', i, -1)}
                  onDown={() => move('partners', i, 1)}
                  onRemove={() => removeAt('partners', i)}
                  first={i === 0}
                  last={i === doc.partners.length - 1}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="space-y-3 rounded-lg border border-surface-3 bg-surface p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-text">
            {t('panel.marketing.gallery')} <span className="ml-1 text-sm font-normal text-text-subtle">{counts.gallery}</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => addMedia('image')}>
              <ImageIcon className="mr-1.5 h-4 w-4" />
              {t('panel.marketing.addImage')}
            </Button>
            <Button type="button" onClick={() => addMedia('video')}>
              <Film className="mr-1.5 h-4 w-4" />
              {t('panel.marketing.addVideo')}
            </Button>
          </div>
        </div>

        {doc.gallery.length === 0 && <p className="py-6 text-center text-sm text-text-subtle">{t('panel.marketing.noGallery')}</p>}

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {doc.gallery.map((g, i) => {
            const isVideo = g.kind === 'video';
            const thumb = isVideo ? g.poster || (g.url ? videoSource(g.url).thumb : '') : g.url;
            return (
              <div key={i} className="rounded-md border border-surface-3 bg-surface-2/30 p-3">
                <div className="flex gap-3">
                  <div className="relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded border border-surface-3 bg-surface sm:h-28 sm:w-28">
                    {thumb ? (
                      <img src={thumb} alt="" className="h-full w-full object-cover" />
                    ) : isVideo && g.url && videoSource(g.url).kind === 'file' ? (
                      <video src={`${g.url}#t=0.5`} preload="metadata" muted className="h-full w-full object-cover" />
                    ) : isVideo ? (
                      <Film className="h-8 w-8 text-text-subtle" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-text-subtle" />
                    )}
                    <span className={cn('absolute left-1 top-1 rounded px-1.5 py-0.5 text-[10px] font-medium', isVideo ? 'bg-primary text-on-primary' : 'bg-black/60 text-white')}>
                      {isVideo ? t('panel.marketing.video') : t('panel.marketing.photo')}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    {isVideo && (
                      <input className={inputCls} placeholder={t('panel.marketing.videoUrl')} value={g.url} onChange={(e) => patchShared('gallery', i, { url: e.target.value })} />
                    )}
                    <input className={inputCls} placeholder={t('panel.marketing.caption')} value={g.caption} onChange={(e) => patchText('gallery', i, { caption: e.target.value })} />

                    <div className="flex flex-wrap items-center gap-2">
                      <MediaUpload
                        accept={isVideo ? 'video' : 'image'}
                        label={isVideo ? t('panel.marketing.uploadVideo') : t('panel.marketing.uploadPhoto')}
                        folder="marketing/gallery"
                        onUploaded={(url) => patchShared('gallery', i, { url })}
                      />
                      {isVideo && (
                        <MediaUpload accept="image" label={t('panel.marketing.poster')} folder="marketing/gallery" onUploaded={(url) => patchShared('gallery', i, { poster: url })} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <RowActions
                    onUp={() => move('gallery', i, -1)}
                    onDown={() => move('gallery', i, 1)}
                    onRemove={() => removeAt('gallery', i)}
                    first={i === 0}
                    last={i === doc.gallery.length - 1}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sticky save bar */}
      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-lg border border-surface-3 bg-surface/95 p-3 shadow-lg backdrop-blur">
        <Button type="button" onClick={save} disabled={saving || !dirty}>
          {saving ? t('admin.saving') : t('panel.marketing.save')}
        </Button>
        {dirty && !saving && <span className="text-sm text-text-subtle">{t('panel.marketing.unsaved')}</span>}
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm text-success">
            <CheckCircle2 className="h-4 w-4" /> {t('panel.marketing.saved')}
          </span>
        )}
      </div>
    </div>
  );
}

function RowActions({ onUp, onDown, onRemove, first, last }: { onUp: () => void; onDown: () => void; onRemove: () => void; first: boolean; last: boolean }) {
  const { t } = useI18n();
  const btn = 'grid h-7 w-7 place-items-center rounded-md border border-surface-3 text-text-subtle transition-colors hover:text-text disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus';
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" className={btn} onClick={onUp} disabled={first} aria-label={t('panel.marketing.moveUp')} title={t('panel.marketing.moveUp')}>
        <ArrowUp className="h-4 w-4" />
      </button>
      <button type="button" className={btn} onClick={onDown} disabled={last} aria-label={t('panel.marketing.moveDown')} title={t('panel.marketing.moveDown')}>
        <ArrowDown className="h-4 w-4" />
      </button>
      <button type="button" className={cn(btn, 'hover:border-red-800 hover:text-red-400')} onClick={onRemove} aria-label={t('panel.marketing.remove')} title={t('panel.marketing.remove')}>
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
