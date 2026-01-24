import { useState, useEffect } from 'react';
import { api, type Project, type Locale } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';

export function AdminProjects() {
  const { locale, supportedLocales, t } = useI18n();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<Locale, Partial<Project>>>({
    en: { title: '', industry: '', summary: '', tags: [], link: '' },
    az: { title: '', industry: '', summary: '', tags: [], link: '' },
    ru: { title: '', industry: '', summary: '', tags: [], link: '' },
  });
  const [tagsText, setTagsText] = useState<Record<Locale, string>>({
    en: '',
    az: '',
    ru: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProjects();
  }, [locale]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getProjects(locale);
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    const loadAllLocales = async () => {
      const locales: Locale[] = ['en', 'az', 'ru'];
      const data: Record<Locale, Partial<Project>> = {
        en: {},
        az: {},
        ru: {},
      };
      const tags: Record<Locale, string> = { en: '', az: '', ru: '' };

      for (const loc of locales) {
        try {
          const p = await api.getProject(project.id, loc);
          if (p) {
            data[loc] = p;
            tags[loc] = (p.tags || []).join(', ');
          }
        } catch {
          data[loc] = { title: '', industry: '', summary: '', tags: [], link: '' };
        }
      }

      setFormData(data);
      setTagsText(tags);
    };
    loadAllLocales();
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData({
      en: { title: '', industry: '', summary: '', tags: [], link: '' },
      az: { title: '', industry: '', summary: '', tags: [], link: '' },
      ru: { title: '', industry: '', summary: '', tags: [], link: '' },
    });
    setTagsText({ en: '', az: '', ru: '' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    try {
      await api.admin.deleteProject(id);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.failedToDelete'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Save per-locale using API signatures
      for (const loc of supportedLocales.map((l) => l.code as Locale)) {
        const tags = tagsText[loc]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        const payload: Partial<Project> = {
          ...formData[loc],
          tags,
        };

        if (editingId) {
          await api.admin.updateProject(editingId, loc, payload);
        } else {
          await api.admin.createProject(loc, payload);
        }
      }

      await loadProjects();
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
          <h1 className="text-3xl font-bold text-white">{t('admin.projects')}</h1>
          <p className="mt-2 text-sm text-[#808087]">
            {t('admin.manageDescription')}
          </p>
        </div>
        <Button onClick={handleNew}>{t('admin.newProject')}</Button>
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
              <th className="px-4 py-3 text-left text-sm font-medium text-white">{t('admin.industry')}</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-white">{t('admin.title')}</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-white">{t('admin.summary')}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-white">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#546691]">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-[#808087]">
                  {t('admin.noProjectsYet')}
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-[#546691]/30">
                  <td className="px-4 py-3 text-sm text-white">{project.industry}</td>
                  <td className="px-4 py-3 text-sm font-medium text-white">{project.title}</td>
                  <td className="px-4 py-3 text-sm text-[#808087] line-clamp-2">
                    {project.summary}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                        {t('admin.edit')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
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
          {editingId ? t('admin.editProject') : t('admin.createProject')}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {supportedLocales.map((loc) => {
            const locCode = loc.code as Locale;
            return (
              <div key={locCode} className="space-y-4 p-4 border border-[#546691] rounded-lg bg-[#0A0A1E]/30">
                <h3 className="font-medium text-white">{loc.label}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">{t('admin.industry')}</label>
                    <input
                      type="text"
                      value={formData[locCode].industry || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [locCode]: { ...formData[locCode], industry: e.target.value },
                        })
                      }
                      placeholder="E-commerce / Banking"
                      className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] px-3 py-2 text-sm text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">Title</label>
                    <input
                      type="text"
                      value={formData[locCode].title || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [locCode]: { ...formData[locCode], title: e.target.value },
                        })
                      }
                      placeholder="Project title"
                      className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] px-3 py-2 text-sm text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-white">{t('admin.summary')}</label>
                    <textarea
                      value={formData[locCode].summary || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [locCode]: { ...formData[locCode], summary: e.target.value },
                        })
                      }
                      placeholder="One-paragraph summary"
                      rows={3}
                      className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] px-3 py-2 text-sm text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">
                      {t('admin.tags')} ({t('admin.tagsPlaceholder')})
                    </label>
                    <input
                      type="text"
                      value={tagsText[locCode]}
                      onChange={(e) =>
                        setTagsText({ ...tagsText, [locCode]: e.target.value })
                      }
                      placeholder="Marketplace, Admin, Security"
                      className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] px-3 py-2 text-sm text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">External link</label>
                    <input
                      type="url"
                      value={formData[locCode].link || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [locCode]: { ...formData[locCode], link: e.target.value },
                        })
                      }
                      placeholder="https://..."
                      className="w-full rounded-md border border-[#546691] bg-[#0A0A1E] px-3 py-2 text-sm text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <ImageUpload
                      value={formData[locCode].image}
                      onChange={(url) =>
                        setFormData({
                          ...formData,
                          [locCode]: { ...formData[locCode], image: url },
                        })
                      }
                      folder="projects"
                      label={t('admin.image') || 'Image'}
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

