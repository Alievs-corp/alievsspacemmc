import { useState, useEffect } from 'react';
import { api, type Project, type Locale } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';

export function AdminProjects() {
  const { locale, supportedLocales } = useI18n();
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
      setError(err instanceof Error ? err.message : 'Failed to load projects');
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
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.admin.deleteProject(id);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload: Record<Locale, Partial<Project>> = {};
      for (const loc of supportedLocales.map((l) => l.code as Locale)) {
        const tags = tagsText[loc]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        payload[loc] = {
          ...formData[loc],
          tags,
        };
      }

      if (editingId) {
        await api.admin.updateProject(editingId, payload);
      } else {
        await api.admin.createProject(payload);
      }

      await loadProjects();
      handleNew();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
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
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
            Manage case studies shown on the public website.
          </p>
        </div>
        <Button onClick={handleNew}>New project</Button>
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
              <th className="px-4 py-3 text-left text-sm font-medium">Industry</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Summary</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-[var(--color-muted-foreground)]">
                  No projects yet. Click "New project" to create one.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-[var(--color-accent)]/50">
                  <td className="px-4 py-3 text-sm">{project.industry}</td>
                  <td className="px-4 py-3 text-sm font-medium">{project.title}</td>
                  <td className="px-4 py-3 text-sm text-[var(--color-muted-foreground)] line-clamp-2">
                    {project.summary}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
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
          {editingId ? 'Edit project' : 'Create project'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {supportedLocales.map((loc) => {
            const locCode = loc.code as Locale;
            return (
              <div key={locCode} className="space-y-4 p-4 border border-[var(--color-border)] rounded-lg">
                <h3 className="font-medium">{loc.label}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Industry</label>
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
                      placeholder="Project title"
                      className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Summary</label>
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
                      className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={tagsText[locCode]}
                      onChange={(e) =>
                        setTagsText({ ...tagsText, [locCode]: e.target.value })
                      }
                      placeholder="Marketplace, Admin, Security"
                      className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">External link</label>
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

