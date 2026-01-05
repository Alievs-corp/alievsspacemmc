import { useState, useEffect } from 'react';
import { api, type Settings } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';

export function AdminSettings() {
  const { locale } = useI18n();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Partial<Settings>>({
    brandName: '',
    tagline: '',
    email: '',
    phone: '',
    address: '',
    social: {
      instagram: '',
      linkedin: '',
      youtube: '',
    },
    cta: {
      primaryText: '',
      primaryHref: '',
    },
  });

  useEffect(() => {
    loadSettings();
  }, [locale]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await api.getSettings(locale);
      setFormData({
        brandName: data.brandName || '',
        tagline: data.tagline || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        social: {
          instagram: data.social?.instagram || '',
          linkedin: data.social?.linkedin || '',
          youtube: data.social?.youtube || '',
        },
        cta: {
          primaryText: data.cta?.primaryText || '',
          primaryHref: data.cta?.primaryHref || '',
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await api.admin.updateSettings(locale, formData);
      await loadSettings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const social = formData.social ?? { instagram: '', linkedin: '', youtube: '' };
  const cta = formData.cta ?? { primaryText: '', primaryHref: '' };

  const handleExport = async () => {
    try {
      const [settings, home, about, services, projects, blog, careers, employees, inquiries] =
        await Promise.all([
          api.getSettings(locale).catch(() => null),
          api.getHome(locale).catch(() => null),
          api.getAbout(locale).catch(() => null),
          api.getServices(locale).catch(() => []),
          api.getProjects(locale).catch(() => []),
          api.getBlogPosts(locale).catch(() => []),
          api.getCareers(locale).catch(() => []),
          api.getEmployees(locale).catch(() => []),
          api.admin.getInquiries().catch(() => []),
        ]);

      const exportData = {
        settings,
        home,
        about,
        services,
        projects,
        blog,
        careers,
        employees,
        inquiries,
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `alievs-space-content-${locale}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export');
    }
  };

  if (loading) {
    return <div className="text-[var(--color-muted-foreground)]">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          Brand settings, contact details, export/import, and reset.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-[var(--color-destructive)]/10 p-3 text-sm text-[var(--color-destructive)]">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="text-xl font-semibold mb-4">Brand</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Brand name</label>
              <input
                type="text"
                value={formData.brandName || ''}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                placeholder="Alievs Space MMC"
                className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Premium Digital & Commerce Ecosystem"
                className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="hello@..."
                className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+994 ..."
                className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Azerbaijan"
                className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instagram URL</label>
              <input
                type="url"
                value={social.instagram}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    social: { ...social, instagram: e.target.value },
                  })
                }
                placeholder="https://instagram.com/..."
                className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={social.linkedin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    social: { ...social, linkedin: e.target.value },
                  })
                }
                placeholder="https://linkedin.com/..."
                className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">YouTube URL</label>
              <input
                type="url"
                value={social.youtube}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    social: { ...social, youtube: e.target.value },
                  })
                }
                placeholder="https://youtube.com/..."
                className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CTA Primary Text</label>
              <input
                type="text"
                value={cta.primaryText}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cta: { ...cta, primaryText: e.target.value },
                  })
                }
                placeholder="Get Started"
                className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CTA Primary Href</label>
              <input
                type="text"
                value={cta.primaryHref}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cta: { ...cta, primaryHref: e.target.value },
                  })
                }
                placeholder="/contact"
                className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save settings'}
            </Button>
          </form>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="text-xl font-semibold mb-4">Maintenance</h2>
          <div className="space-y-4">
            <Button variant="outline" onClick={handleExport} className="w-full">
              Export site JSON
            </Button>
            <div>
              <label className="block text-sm font-medium mb-1">Import site JSON</label>
              <input
                type="file"
                accept="application/json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    try {
                      JSON.parse(reader.result as string);
                      setError('Import functionality requires API support');
                    } catch {
                      setError('Invalid JSON file');
                    }
                  };
                  reader.readAsText(file);
                }}
                className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
              />
            </div>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              Tip: Use Export to save a backup before making changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

