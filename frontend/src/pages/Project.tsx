import { Link, useParams } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { api, type Project } from '@/lib/api';
import { useState, useEffect } from 'react';

export function Project() {
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useI18n();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .getProject(id, locale)
      .then(setProject)
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [id, locale]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-[var(--color-muted-foreground)]">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-2xl font-semibold">{t('public.notFoundProject')}</div>
          <Link to="/projects" className="text-[var(--color-primary)] hover:underline">
            {t('nav.projects')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="py-16">
        <div className="mx-auto max-w-[var(--container-width)] px-5">
          <div className="mb-4 text-sm text-[var(--color-muted-foreground)]">
            <Link to="/" className="hover:underline">
              {t('nav.home')}
            </Link>{' '}
            /{' '}
            <Link to="/projects" className="hover:underline">
              {t('nav.projects')}
            </Link>
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight">{project.title}</h1>
          {project.industry && (
            <div className="mb-4 text-lg text-[var(--color-muted-foreground)]">
              {t('public.industry')}: {project.industry}
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="container px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <h2 className="mb-4 text-2xl font-semibold">{t('public.projectDetails')}</h2>
                <p className="mb-6 leading-relaxed text-[var(--color-muted-foreground)]">{project.summary}</p>
                {project.tags && project.tags.length > 0 && (
                  <div className="mb-6">
                    <div className="mb-2 text-sm font-medium">{t('public.tags')}</div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1.5 text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block rounded-lg bg-[var(--color-primary)] px-6 py-3 font-medium text-[var(--color-primary-foreground)] transition-colors hover:opacity-90"
                  >
                    {t('public.openLink')}
                  </a>
                )}
              </div>
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                <h3 className="mb-4 text-xl font-semibold">{t('public.nextStep')}</h3>
                <p className="mb-6 text-sm text-[var(--color-muted-foreground)]">{t('public.projectNextCopy')}</p>
              <Link
                to="/contact"
                className="block rounded-lg bg-[var(--color-primary)] px-4 py-3 text-center text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:opacity-90"
              >
                {t('nav.cta')}
              </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

