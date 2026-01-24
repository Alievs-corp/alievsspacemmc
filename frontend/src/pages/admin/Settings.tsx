import { useState, useEffect } from 'react';
import { api, type Settings } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';

export function AdminSettings() {
  const { locale, t } = useI18n();
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
      setError(err instanceof Error ? err.message : t('admin.failedToSave'));
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
    return <div className="text-[#808087]">{t('admin.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">{t('admin.settings')}</h1>
        <p className="mt-2 text-sm text-[#808087]">
          {t('admin.manageDescription')}
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-900/20 border border-red-800 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-[#546691] bg-[#13132F] p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">{t('admin.brand')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                    <label className="block text-sm font-medium mb-1 text-white">{t('admin.brandName')}</label>
              <input
                type="text"
                value={formData.brandName || ''}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                placeholder={t('company.name')}
                className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6] px-3 py-2 text-sm"
              />
            </div>
            <div>
                    <label className="block text-sm font-medium mb-1 text-white">{t('admin.tagline')}</label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder={t('company.tagline')}
                className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6] px-3 py-2 text-sm"
              />
            </div>
            <div>
                    <label className="block text-sm font-medium mb-1 text-white">Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="hello@..."
                className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6] px-3 py-2 text-sm"
              />
            </div>
            <div>
                    <label className="block text-sm font-medium mb-1 text-white">{t('admin.phone')}</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={t('auth.register.placeholders.phone')}
                className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6] px-3 py-2 text-sm"
              />
            </div>
            <div>
                    <label className="block text-sm font-medium mb-1 text-white">{t('admin.address')}</label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder={t('admin.address')}
                className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6] px-3 py-2 text-sm"
              />
            </div>
            <div>
                    <label className="block text-sm font-medium mb-1 text-white">Instagram URL</label>
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
                className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6] px-3 py-2 text-sm"
              />
            </div>
            <div>
                    <label className="block text-sm font-medium mb-1 text-white">{t('admin.linkedinUrl')}</label>
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
                className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6] px-3 py-2 text-sm"
              />
            </div>
            <div>
                    <label className="block text-sm font-medium mb-1 text-white">{t('admin.youtubeUrl')}</label>
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
                className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6] px-3 py-2 text-sm"
              />
            </div>
            <div>
                    <label className="block text-sm font-medium mb-1 text-white">{t('admin.ctaPrimaryText')}</label>
              <input
                type="text"
                value={cta.primaryText}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cta: { ...cta, primaryText: e.target.value },
                  })
                }
                placeholder={t('admin.ctaPrimaryText')}
                className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6] px-3 py-2 text-sm"
              />
            </div>
            <div>
                    <label className="block text-sm font-medium mb-1 text-white">{t('admin.ctaPrimaryHref')}</label>
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
                className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6] px-3 py-2 text-sm"
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? t('admin.saving') : t('admin.save') + ' ' + t('admin.settings').toLowerCase()}
            </Button>
          </form>
        </div>

        <div className="rounded-lg border border-[#546691] bg-[#13132F] p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">{t('admin.export')}</h2>
          <div className="space-y-4">
            <Button variant="outline" onClick={handleExport} className="w-full">
              {t('admin.export')}
            </Button>
            <div>
                    <label className="block text-sm font-medium mb-1 text-white">{t('admin.import')}</label>
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
                className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6] px-3 py-2 text-sm"
              />
            </div>
            <p className="text-xs text-[#808087]">
              {t('admin.tip')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

