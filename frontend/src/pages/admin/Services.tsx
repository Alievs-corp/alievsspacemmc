import { useState, useEffect } from 'react';
import { api, type Service, type Locale } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';

export function AdminServices() {
  const { locale, supportedLocales } = useI18n();
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
      setError(err instanceof Error ? err.message : 'Failed to load services');
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
    if (!confirm('Are you sure you want to delete this service?')) return;
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
      const payload: Record<Locale, Partial<Service>> = { en: {}, az: {}, ru: {} };
      for (const loc of supportedLocales.map((l) => l.code as Locale)) {
        const bullets = bulletsText[loc]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        payload[loc] = {
          ...formData[loc],
          bullets,
        };
      }

      if (editingId) {
        await api.admin.updateService(editingId, payload);
      } else {
        await api.admin.createService(payload);
      }

      await loadServices();
      handleNew();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-[var(--color-muted-foreground)]">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
            Add, edit, and delete services shown on the public website.
          </p>
        </div>
        <Button onClick={handleNew}>New service</Button>
      </div>

      {error && (
        <div className="rounded-md bg-[var(--color-destructive)]/10 p-3 text-sm text-[var(--color-destructive)]">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[var(--color-muted)]/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {services.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-[var(--color-muted-foreground)]">
                  No services yet. Click "New service" to create one.
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="hover:bg-[var(--color-accent)]/50">
                  <td className="px-4 py-3 text-sm">{service.category}</td>
                  <td className="px-4 py-3 text-sm font-medium">{service.title}</td>
                  <td className="px-4 py-3 text-sm text-[var(--color-muted-foreground)] line-clamp-2">
                    {service.desc}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
                        className="text-[var(--color-destructive)]"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit service' : 'Create service'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {supportedLocales.map((loc) => {
            const locCode = loc.code as Locale;
            return (
              <div key={locCode} className="space-y-4 p-4 border border-[var(--color-border)] rounded-lg">
                <h3 className="font-medium">{loc.label}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
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
                      className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
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
                      className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
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
                      className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Bullets (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={bulletsText[locCode]}
                      onChange={(e) =>
                        setBulletsText({ ...bulletsText, [locCode]: e.target.value })
                      }
                      placeholder="Premium UI, Performance, ..."
                      className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button type="button" variant="outline" onClick={handleNew}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

