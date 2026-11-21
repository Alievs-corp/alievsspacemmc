import { useState, useEffect, useRef } from 'react';
import { api, CMS_LOCALES, type Project, type Locale, toCmsLocale } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { LocaleTabs } from '@/components/admin/LocaleTabs';
import { ImportBuiltIn } from '@/components/admin/ImportBuiltIn';
import { ProjectCover } from '@/components/site/work/ProjectCover';
import '@/components/site/work/work.css';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

export function AdminProjects() {
  const { locale, supportedLocales: siteLocales, t } = useI18n();
  // The CMS stores en/az/ru only; the site's other languages read English.
  const supportedLocales = siteLocales.filter((l) => (CMS_LOCALES as readonly string[]).includes(l.code));
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
  const [activeLoc, setActiveLoc] = useState<Locale>('en');
  const [saved, setSaved] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);

  useEffect(() => {
    loadProjects();
  }, [locale]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getProjects(toCmsLocale(locale));
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
      const body: Partial<Record<Locale, Partial<Project>>> = {};
      for (const loc of supportedLocales.map((l) => l.code as Locale)) {
        const tags = tagsText[loc]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        const payload: Partial<Project> = {
          ...formData[loc],
          tags,
        };

        body[loc] = payload;
      }

      // One request carries every language.
      if (editingId) await api.admin.updateProject(editingId, body);
      else await api.admin.createProject(body);

      await loadProjects();
      handleNew();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.failedToSave'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-text-subtle">{t('admin.loading')}</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-text">{t('admin.projects')}</h1>
          <p className="mt-2 text-sm text-text-subtle">
            {t('admin.manageDescription')}
          </p>
        </div>
        <Button className="shrink-0 whitespace-nowrap" onClick={() => { handleNew(); scrollToForm(); }}>{t('admin.newProject')}</Button>
      </div>

      {projects.length === 0 && !error && <ImportBuiltIn kind="projects" onDone={loadProjects} />}

      {error && (
        <div className="rounded-md bg-red-900/20 border border-red-800 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Phones: one compact card per project, with Edit / Delete always in reach. */}
      <div className="space-y-2 md:hidden">
        {projects.length === 0 ? (
          <p className="rounded-lg border border-surface-3 bg-surface px-4 py-6 text-center text-sm text-text-subtle">{t('admin.noProjectsYet')}</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="flex items-center gap-3 rounded-lg border border-surface-3 bg-surface p-2.5">
              <div className="wk-cover-box h-12 w-16 shrink-0 overflow-hidden rounded">
                {project.image ? <img src={project.image} alt="" className="h-full w-full object-cover object-top" /> : <ProjectCover name={project.title} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{project.title}</p>
                {project.industry && <p className="truncate text-xs text-text-subtle">{project.industry}</p>}
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="sm" onClick={() => { handleEdit(project); scrollToForm(); }}>
                  {t('admin.edit')}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)} className="text-red-400 hover:text-red-300">
                  {t('admin.delete')}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden overflow-x-auto rounded-lg border border-surface-3 bg-surface md:block">
        <table className="w-full">
          <thead className="bg-surface-2/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-white">{t('admin.industry')}</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-white">{t('admin.title')}</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-white">{t('admin.summary')}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-white">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-3">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-text-subtle">
                  {t('admin.noProjectsYet')}
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-surface-3/30">
                  <td className="px-4 py-3 text-sm text-white">{project.industry}</td>
                  <td className="px-4 py-3 text-sm font-medium text-white">{project.title}</td>
                  <td className="px-4 py-3 text-sm text-text-subtle line-clamp-2">
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

      <div ref={formRef} className="rounded-lg border border-surface-3 bg-surface p-3 scroll-mt-20 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-text">
            {editingId ? t('admin.editProject') : t('admin.createProject')}
          </h2>
          <LocaleTabs locales={supportedLocales} active={activeLoc} onChange={(c) => setActiveLoc(c as Locale)} />
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {supportedLocales.map((loc) => {
            const locCode = loc.code as Locale;
            return (
              <div key={locCode} className={cn('space-y-4', locCode !== activeLoc && 'hidden')}>
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
                      className="w-full rounded-md border border-surface-3 bg-surface px-3 py-2 text-sm text-white placeholder-text-subtle focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">{t('admin.siteName', 'Site name')}</label>
                    <input
                      type="text"
                      value={formData[locCode].title || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [locCode]: { ...formData[locCode], title: e.target.value },
                        })
                      }
                      placeholder="luxmart.az"
                      className="w-full rounded-md border border-surface-3 bg-surface px-3 py-2 text-sm text-white placeholder-text-subtle focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
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
                      className="w-full rounded-md border border-surface-3 bg-surface px-3 py-2 text-sm text-white placeholder-text-subtle focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
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
                      className="w-full rounded-md border border-surface-3 bg-surface px-3 py-2 text-sm text-white placeholder-text-subtle focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
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
                      className="w-full rounded-md border border-surface-3 bg-surface px-3 py-2 text-sm text-white placeholder-text-subtle focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div className="md:col-span-2">
                    {!formData[locCode].image && (
                      <>
                        <div className="mb-3 w-40 overflow-hidden rounded border border-surface-3 sm:w-56" style={{ aspectRatio: '16 / 10', containerType: 'inline-size' }}>
                          <ProjectCover name={formData[locCode].title || ''} />
                        </div>
                        <p className="mb-2 text-xs text-text-subtle">{t('admin.coverHint', 'Cover photo is optional: without it the site name is shown on a coloured cover.')}</p>
                      </>
                    )}
                    <ImageUpload
                      value={formData[locCode].image}
                      onChange={(url) =>
                        setFormData({
                          ...formData,
                          [locCode]: { ...formData[locCode], image: url },
                        })
                      }
                      folder="projects"
                      label={t('admin.coverPhoto', 'Cover photo (optional)')}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? t('admin.saving') : t('admin.save')}
            </Button>
            <Button type="button" variant="outline" onClick={handleNew}>
              {t('admin.cancel')}
            </Button>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-sm text-success">
                <CheckCircle2 className="h-4 w-4" /> {t('admin.saved', 'Saved')}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

