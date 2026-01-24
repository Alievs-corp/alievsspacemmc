import { useState, useEffect } from 'react';
import { api, type About } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';

export function AdminAbout() {
  const { locale, t } = useI18n();
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
  const [processItems, setProcessItems] = useState<Array<{ title: string; desc: string; image: string }>>([]);

  useEffect(() => {
    loadAbout();
  }, [locale]);

  const loadAbout = async () => {
    try {
      setLoading(true);
      const data = await api.getAbout(locale);
      setFormData({
        headline: data.headline || '',
        headlineImage: data.headlineImage || '',
        paragraphs: data.paragraphs || [],
        values: data.values || [],
        process: data.process || [],
      });
      setParagraphsText((data.paragraphs || []).join('\n\n'));
      setValuesText((data.values || []).join(', '));
      // Handle both old format (string[]) and new format (object[])
      if (data.process && data.process.length > 0) {
        if (typeof data.process[0] === 'string') {
          // Old format - convert to new format
          setProcessItems((data.process as unknown as string[]).map((p) => {
            const parts = p.split(':').map(s => s.trim());
            return {
              title: parts[0] || p,
              desc: parts[1] || '',
              image: '',
            };
          }));
        } else {
          // New format
          setProcessItems(data.process as Array<{ title: string; desc: string; image: string }>);
        }
      } else {
        setProcessItems([]);
      }
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
      const process = processItems
        .filter((p) => p.title.trim())
        .map((p) => ({
          title: p.title.trim(),
          desc: p.desc.trim(),
          image: p.image.trim(),
        }));

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
    return <div className="text-[#808087]">{t('admin.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
          <h1 className="text-3xl font-bold text-white">About</h1>
        <p className="mt-2 text-sm text-[#808087]">
          Edit about page content.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-900/20 border border-red-800 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-[#546691] bg-[#13132F] p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">About Content</h2>
          <div className="space-y-4">
            <div>
                    <label className="block text-sm font-medium mb-1 text-white">Headline</label>
              <input
                type="text"
                value={formData.headline || ''}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                placeholder="A premium team for ambitious businesses."
                className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <ImageUpload
                value={formData.headlineImage}
                onChange={(url) => setFormData({ ...formData, headlineImage: url })}
                folder="about"
                label="Headline Image"
              />
            </div>
            <div>
                    <label className="block text-sm font-medium mb-1 text-white">
                Paragraphs (separate with double line break)
              </label>
              <textarea
                value={paragraphsText}
                onChange={(e) => setParagraphsText(e.target.value)}
                placeholder="First paragraph...&#10;&#10;Second paragraph..."
                rows={6}
                className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6] px-3 py-2 text-sm"
              />
            </div>
            <div>
                    <label className="block text-sm font-medium mb-1 text-white">
                Values (comma-separated)
              </label>
              <input
                type="text"
                value={valuesText}
                onChange={(e) => setValuesText(e.target.value)}
                placeholder="Quality, Innovation, Trust"
                className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Process Steps</label>
              <div className="space-y-4">
                {processItems.map((item, idx) => (
                  <div key={idx} className="border border-[#546691] rounded-lg p-4 space-y-3">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-white">Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const newItems = [...processItems];
                            newItems[idx].title = e.target.value;
                            setProcessItems(newItems);
                          }}
                          placeholder="Step title"
                          className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6] px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-white">Description</label>
                        <input
                          type="text"
                          value={item.desc}
                          onChange={(e) => {
                            const newItems = [...processItems];
                            newItems[idx].desc = e.target.value;
                            setProcessItems(newItems);
                          }}
                          placeholder="Step description"
                          className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6] px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                    <ImageUpload
                      value={item.image}
                      onChange={(url) => {
                        const newItems = [...processItems];
                        newItems[idx].image = url;
                        setProcessItems(newItems);
                      }}
                      folder="about/process"
                      label="Image"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        setProcessItems(processItems.filter((_, i) => i !== idx));
                      }}
                    >
                      Remove Step
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setProcessItems([...processItems, { title: '', desc: '', image: '' }]);
                  }}
                >
                  Add Process Step
                </Button>
              </div>
            </div>
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

