import { useState, useEffect } from 'react';
import { api, type About } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';

export function AdminAbout() {
  const { locale } = useI18n();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Partial<About>>({
    headline: '',
    paragraphs: [],
    values: [],
    process: [],
  });
  const [paragraphsText, setParagraphsText] = useState<string>('');
  const [valuesText, setValuesText] = useState<string>('');
  const [processText, setProcessText] = useState<string>('');

  useEffect(() => {
    loadAbout();
  }, [locale]);

  const loadAbout = async () => {
    try {
      setLoading(true);
      const data = await api.getAbout(locale);
      setFormData({
        headline: data.headline || '',
        paragraphs: data.paragraphs || [],
        values: data.values || [],
        process: data.process || [],
      });
      setParagraphsText((data.paragraphs || []).join('\n\n'));
      setValuesText((data.values || []).join(', '));
      setProcessText((data.process || []).join('\n'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load about content');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const paragraphs = paragraphsText
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean);
      const values = valuesText
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
      const process = processText
        .split('\n')
        .map((p) => p.trim())
        .filter(Boolean);

      const payload: Partial<About> = {
        ...formData,
        paragraphs,
        values,
        process,
      };

      await api.admin.updateAbout(locale, payload);
      await loadAbout();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save about content');
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
        <h1 className="text-3xl font-bold">About</h1>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          Edit about page content.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-[var(--color-destructive)]/10 p-3 text-sm text-[var(--color-destructive)]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="text-xl font-semibold mb-4">About Content</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Headline</label>
              <input
                type="text"
                value={formData.headline || ''}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                placeholder="A premium team for ambitious businesses."
                className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Paragraphs (separate with double line break)
              </label>
              <textarea
                value={paragraphsText}
                onChange={(e) => setParagraphsText(e.target.value)}
                placeholder="First paragraph...&#10;&#10;Second paragraph..."
                rows={6}
                className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Values (comma-separated)
              </label>
              <input
                type="text"
                value={valuesText}
                onChange={(e) => setValuesText(e.target.value)}
                placeholder="Quality, Innovation, Trust"
                className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Process Steps (one per line)
              </label>
              <textarea
                value={processText}
                onChange={(e) => setProcessText(e.target.value)}
                placeholder="Step 1&#10;Step 2&#10;Step 3"
                rows={6}
                className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
              />
            </div>
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

