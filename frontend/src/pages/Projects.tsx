import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';
import { api, type Project } from '@/lib/api';
import { useState, useEffect } from 'react';

export function Projects() {
  const { t, locale } = useI18n();
  const { content, loading: contentLoading } = useContent();
  const [projects, setProjects] = useState<Project[]>(content?.projects || []);
  const [loading, setLoading] = useState(contentLoading);

  useEffect(() => {
    if (!content?.projects || content.projects.length === 0) {
      setLoading(true);
      api.getProjects(locale).then(setProjects).finally(() => setLoading(false));
    } else {
      setProjects(content.projects);
    }
  }, [locale, content]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-[var(--color-muted-foreground)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-[var(--color-background)] to-[var(--color-muted)]/20 py-16">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 text-sm text-[var(--color-muted-foreground)]">
              {t('nav.home')} / {t('nav.projects')}
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t('nav.projects')}
            </h1>
            <p className="mt-6 text-lg leading-8 text-[var(--color-muted-foreground)]">
              {t('public.projectsIntro')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="group flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <h3 className="mb-2 text-xl font-semibold group-hover:text-[var(--color-primary)]">
                    {project.title}
                  </h3>
                  {project.industry && (
                    <div className="mb-2 text-sm text-[var(--color-muted-foreground)]">
                      {t('public.industry')}: {project.industry}
                    </div>
                  )}
                  <p className="mb-4 flex-1 text-sm text-[var(--color-muted-foreground)] line-clamp-3">
                    {project.summary}
                  </p>
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

