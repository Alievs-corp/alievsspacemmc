import { useState, useEffect } from 'react';
import { api, type Home } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';

export function AdminHome() {
  const { locale, t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Partial<Home>>({
    heroTitle: '',
    heroSubtitle: '',
    highlights: [],
    proof: [],
  });
  const [highlightTitles, setHighlightTitles] = useState<string[]>(['', '', '']);
  const [highlightDescs, setHighlightDescs] = useState<string[]>(['', '', '']);
  const [highlightImages, setHighlightImages] = useState<string[]>(['', '', '']);
  const [proofKPIs, setProofKPIs] = useState<string[]>(['', '', '', '']);
  const [proofLabels, setProofLabels] = useState<string[]>(['', '', '', '']);

  useEffect(() => {
    loadHome();
  }, [locale]);

  const loadHome = async () => {
    try {
      setLoading(true);
      const data = await api.getHome(locale);
      setFormData({
        heroTitle: data.heroTitle || '',
        heroSubtitle: data.heroSubtitle || '',
        heroImage: data.heroImage || '',
        highlights: data.highlights || [],
        proof: data.proof || [],
      });

      if (data.highlights && data.highlights.length > 0) {
        setHighlightTitles(data.highlights.map((h) => h.title || ''));
        setHighlightDescs(data.highlights.map((h) => h.desc || ''));
        setHighlightImages(data.highlights.map((h) => h.image || ''));
      } else {
        setHighlightImages(['', '', '']);
      }

      if (data.proof && data.proof.length > 0) {
        setProofKPIs(data.proof.map((p) => p.kpi || ''));
        setProofLabels(data.proof.map((p) => p.label || ''));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load home content');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const highlights = highlightTitles
        .map((title, i) => ({
          title: title.trim(),
          desc: highlightDescs[i]?.trim() || '',
        }))
        .filter((h) => h.title);

      const proof = proofKPIs
        .map((kpi, i) => ({
          kpi: kpi.trim(),
          label: proofLabels[i]?.trim() || '',
        }))
        .filter((p) => p.kpi);

      const payload: Partial<Home> = {
        ...formData,
        highlights,
        proof,
      };

      await api.admin.updateHome(locale, payload);
      await loadHome();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save home content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-[#808087]">{t('admin.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
          <h1 className="text-3xl font-bold text-white">Home</h1>
        <p className="mt-2 text-sm text-[#808087]">
          Edit home page content.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-900/20 border border-red-800 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-[#546691] bg-[#13132F] p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Hero Section</h2>
          <div className="space-y-4">
            <div>
                    <label className="block text-sm font-medium mb-1 text-white">Hero Title</label>
              <input
                type="text"
                value={formData.heroTitle || ''}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                placeholder="Build premium digital products that scale."
                className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6] px-3 py-2 text-sm"
              />
            </div>
            <div>
                    <label className="block text-sm font-medium mb-1 text-white">Hero Subtitle</label>
              <textarea
                value={formData.heroSubtitle || ''}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                placeholder="Subtitle text"
                rows={3}
                className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <ImageUpload
                value={formData.heroImage}
                onChange={(url) => setFormData({ ...formData, heroImage: url })}
                folder="home"
                label="Hero Image"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#546691] bg-[#13132F] p-6">
          <h2 className="text-xl font-semibold mb-4">Highlights</h2>
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-4 border border-[#546691] rounded-lg p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                      <label className="block text-sm font-medium mb-1 text-white">Title {i + 1}</label>
                    <input
                      type="text"
                      value={highlightTitles[i] || ''}
                      onChange={(e) => {
                        const newTitles = [...highlightTitles];
                        newTitles[i] = e.target.value;
                        setHighlightTitles(newTitles);
                      }}
                      placeholder="Highlight title"
                      className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6] px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                      <label className="block text-sm font-medium mb-1 text-white">Description {i + 1}</label>
                    <input
                      type="text"
                      value={highlightDescs[i] || ''}
                      onChange={(e) => {
                        const newDescs = [...highlightDescs];
                        newDescs[i] = e.target.value;
                        setHighlightDescs(newDescs);
                      }}
                      placeholder="Highlight description"
                      className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6] px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <ImageUpload
                    value={highlightImages[i]}
                    onChange={(url) => {
                      const newImages = [...highlightImages];
                      newImages[i] = url;
                      setHighlightImages(newImages);
                    }}
                    folder="home/highlights"
                    label={`Image ${i + 1}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#546691] bg-[#13132F] p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Proof/Stats</h2>
          <div className="space-y-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium mb-1 text-white">KPI {i + 1}</label>
                  <input
                    type="text"
                    value={proofKPIs[i] || ''}
                    onChange={(e) => {
                      const newKPIs = [...proofKPIs];
                      newKPIs[i] = e.target.value;
                      setProofKPIs(newKPIs);
                    }}
                    placeholder="100+"
                    className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-white">Label {i + 1}</label>
                  <input
                    type="text"
                    value={proofLabels[i] || ''}
                    onChange={(e) => {
                      const newLabels = [...proofLabels];
                      newLabels[i] = e.target.value;
                      setProofLabels(newLabels);
                    }}
                    placeholder="Projects Delivered"
                    className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6] px-3 py-2 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
              {saving ? t('admin.saving') : t('admin.save')}
          </Button>
        </div>
      </form>
    </div>
  );
}

