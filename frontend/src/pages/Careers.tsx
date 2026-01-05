import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';
import { api, type Career } from '@/lib/api';
import { useState, useEffect } from 'react';

export function Careers() {
  const { t, locale } = useI18n();
  const { content, loading: contentLoading } = useContent();
  const [careers, setCareers] = useState<Career[]>(content?.careers || []);
  const [loading, setLoading] = useState(contentLoading);

  useEffect(() => {
    if (!content?.careers || content.careers.length === 0) {
      setLoading(true);
      api.getCareers(locale).then(setCareers).finally(() => setLoading(false));
    } else {
      setCareers(content.careers);
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
              {t('nav.home')} / {t('nav.careers')}
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{t('nav.careers')}</h1>
            <p className="mt-6 text-lg leading-8 text-[var(--color-muted-foreground)]">
              {t('public.careersIntro')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2">
              {careers.map((career) => (
                <div
                  key={career.id}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6"
                >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">{career.title}</h3>
                    <div className="text-sm text-[var(--color-muted-foreground)]">
                      {career.type} • {career.location}
                    </div>
                  </div>
                  <span
                    className={`rounded-lg px-3 py-1 text-xs font-medium ${
                      career.status === 'Open'
                        ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]'
                        : 'bg-[var(--color-muted)]/20 text-[var(--color-muted-foreground)]'
                    }`}
                  >
                    {career.status}
                  </span>
                </div>
                <p className="mb-4 text-sm text-[var(--color-muted-foreground)]">{career.desc}</p>
                {career.requirements && career.requirements.length > 0 && (
                  <div className="mb-4">
                    <div className="mb-2 text-sm font-medium">{t('public.requirements')}</div>
                    <ul className="space-y-1 text-sm text-[var(--color-muted-foreground)]">
                      {career.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-2)]"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <Link
                  to={`/contact?topic=${encodeURIComponent(career.title)}`}
                  className="inline-block rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:opacity-90"
                >
                  {t('public.apply')}
                </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

