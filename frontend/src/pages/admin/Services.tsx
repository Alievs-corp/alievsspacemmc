import { useState, useEffect } from 'react';
import { api, type Service, type Locale } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';

export function AdminServices() {
  const { locale, supportedLocales, t } = useI18n();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<Locale, Partial<Service>>>({
    en: { category: '', title: '', desc: '', bullets: [] },
    az: { category: '', title: '', desc: '', bullets: [] },
    ru: { category: '', title: '', desc: '', bullets: [] },
  });
  const [bulletsText, setBulletsText] = useState<Record<Locale, string>>({
    en: '',
    az: '',
    ru: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadServices();
  }, [locale]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await api.getServices(locale);
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    const loadAllLocales = async () => {
      const locales: Locale[] = ['en', 'az', 'ru'];
      const data: Record<Locale, Partial<Service>> = {
        en: {},
        az: {},
        ru: {},
      };
      const bullets: Record<Locale, string> = { en: '', az: '', ru: '' };

      for (const loc of locales) {
        try {
          const s = await api.getService(service.id, loc);
          if (s) {
            data[loc] = s;
            bullets[loc] = (s.bullets || []).join(', ');
          }
        } catch {
          data[loc] = { category: '', title: '', desc: '', bullets: [] };
        }
      }

      setFormData(data);
      setBulletsText(bullets);
    };
    loadAllLocales();
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData({
      en: { category: '', title: '', desc: '', bullets: [] },
      az: { category: '', title: '', desc: '', bullets: [] },
      ru: { category: '', title: '', desc: '', bullets: [] },
    });
    setBulletsText({ en: '', az: '', ru: '' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    try {
      await api.admin.deleteService(id);
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete service');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Save per-locale using API signatures
      for (const loc of supportedLocales.map((l) => l.code as Locale)) {
        const bullets = bulletsText[loc]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        const payload: Partial<Service> = {
          ...formData[loc],
          bullets,
        };

        if (editingId) {
          await api.admin.updateService(editingId, loc, payload);
        } else {
          await api.admin.createService(loc, payload);
        }
      }

      await loadServices();
      handleNew();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.failedToSave'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-[#808087]">{t('admin.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('admin.services')}</h1>
          <p className="mt-2 text-sm text-[#808087]">
            {t('admin.manageDescription')}
          </p>
        </div>
        <Button onClick={handleNew}>{t('admin.newService')}</Button>
      </div>

      {error && (
        <div className="rounded-md bg-red-900/20 border border-red-800 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-[#546691] bg-[#13132F] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1A1A2E]/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-white">{t('admin.category')}</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-white">{t('admin.title')}</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-white">{t('admin.description')}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-white">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#546691]">
            {services.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-[#808087]">
                  {t('admin.noServicesYet')}
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="hover:bg-[#546691]/30">
                  <td className="px-4 py-3 text-sm text-white">{service.category}</td>
                  <td className="px-4 py-3 text-sm font-medium text-white">{service.title}</td>
                  <td className="px-4 py-3 text-sm text-[#808087] line-clamp-2">
                    {service.desc}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                        {t('admin.edit')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        {t('admin.delete')}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-[#546691] bg-[#13132F] p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">
          {editingId ? t('admin.editService') : t('admin.createService')}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {supportedLocales.map((loc) => {
            const locCode = loc.code as Locale;
            return (
              <div key={locCode} className="space-y-4 p-4 border border-[#546691] rounded-lg bg-[#0A0A1E]/30">
                <h3 className="font-medium text-white">{loc.label}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">{t('admin.category')}</label>
                    <input
                      type="text"
                      value={formData[locCode].category || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [locCode]: { ...formData[locCode], category: e.target.value },
                        })
                      }
                      placeholder="Software / Commerce / Banking"
                      className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] px-3 py-2 text-sm text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">{t('admin.title')}</label>
                    <input
                      type="text"
                      value={formData[locCode].title || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [locCode]: { ...formData[locCode], title: e.target.value },
                        })
                      }
                      placeholder="Web & Mobile Development"
                      className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] px-3 py-2 text-sm text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-white">{t('admin.description')}</label>
                    <textarea
                      value={formData[locCode].desc || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [locCode]: { ...formData[locCode], desc: e.target.value },
                        })
                      }
                      placeholder="Short premium description"
                      rows={3}
                      className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] px-3 py-2 text-sm text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-white">
                      {t('admin.bullets')} ({t('admin.tagsPlaceholder')})
                    </label>
                    <input
                      type="text"
                      value={bulletsText[locCode]}
                      onChange={(e) =>
                        setBulletsText({ ...bulletsText, [locCode]: e.target.value })
                      }
                      placeholder="Premium UI, Performance, ..."
                      className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] px-3 py-2 text-sm text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6]"
                    />
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? t('admin.saving') : t('admin.save')}
            </Button>
            <Button type="button" variant="outline" onClick={handleNew}>
              {t('admin.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

