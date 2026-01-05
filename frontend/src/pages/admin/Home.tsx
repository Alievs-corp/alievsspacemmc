import { useState, useEffect } from 'react';
import { api, type Home, type Locale } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';

export function AdminHome() {
  const { locale } = useI18n();
  const [home, setHome] = useState<Home | null>(null);
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
  const [proofKPIs, setProofKPIs] = useState<string[]>(['', '', '', '']);
  const [proofLabels, setProofLabels] = useState<string[]>(['', '', '', '']);

  useEffect(() => {
    loadHome();
  }, [locale]);

  const loadHome = async () => {
    try {
      setLoading(true);
      const data = await api.getHome(locale);
      setHome(data);
      setFormData({
        heroTitle: data.heroTitle || '',
        heroSubtitle: data.heroSubtitle || '',
        highlights: data.highlights || [],
        proof: data.proof || [],
      });

      if (data.highlights && data.highlights.length > 0) {
        setHighlightTitles(data.highlights.map((h) => h.title || ''));
        setHighlightDescs(data.highlights.map((h) => h.desc || ''));
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
    return <div className="text-[var(--color-muted-foreground)]">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Home</h1>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          Edit home page content.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-[var(--color-destructive)]/10 p-3 text-sm text-[var(--color-destructive)]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hero Title</label>
              <input
                type="text"
                value={formData.heroTitle || ''}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                placeholder="Build premium digital products that scale."
                className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hero Subtitle</label>
              <textarea
                value={formData.heroSubtitle || ''}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                placeholder="Subtitle text"
                rows={3}
                className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="text-xl font-semibold mb-4">Highlights</h2>
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Title {i + 1}</label>
                  <input
                    type="text"
                    value={highlightTitles[i] || ''}
                    onChange={(e) => {
                      const newTitles = [...highlightTitles];
                      newTitles[i] = e.target.value;
                      setHighlightTitles(newTitles);
                    }}
                    placeholder="Highlight title"
                    className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description {i + 1}</label>
                  <input
                    type="text"
                    value={highlightDescs[i] || ''}
                    onChange={(e) => {
                      const newDescs = [...highlightDescs];
                      newDescs[i] = e.target.value;
                      setHighlightDescs(newDescs);
                    }}
                    placeholder="Highlight description"
                    className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="text-xl font-semibold mb-4">Proof/Stats</h2>
          <div className="space-y-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">KPI {i + 1}</label>
                  <input
                    type="text"
                    value={proofKPIs[i] || ''}
                    onChange={(e) => {
                      const newKPIs = [...proofKPIs];
                      newKPIs[i] = e.target.value;
                      setProofKPIs(newKPIs);
                    }}
                    placeholder="100+"
                    className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Label {i + 1}</label>
                  <input
                    type="text"
                    value={proofLabels[i] || ''}
                    onChange={(e) => {
                      const newLabels = [...proofLabels];
                      newLabels[i] = e.target.value;
                      setProofLabels(newLabels);
                    }}
                    placeholder="Projects Delivered"
                    className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
}

