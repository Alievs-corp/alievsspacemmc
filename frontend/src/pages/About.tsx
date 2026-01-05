import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';

export function About() {
  const { t } = useI18n();
  const { content, loading } = useContent();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-[var(--color-muted-foreground)]">Loading...</div>
      </div>
    );
  }

  const about = content?.about;

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-[var(--color-background)] to-[var(--color-muted)]/20 py-16">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 text-sm text-[var(--color-muted-foreground)]">
              {t('nav.home')} / {t('nav.about')}
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {about?.headline || 'A premium team for ambitious businesses.'}
            </h1>
            <p className="mt-6 text-lg leading-8 text-[var(--color-muted-foreground)]">
              We design and build scalable systems across software, commerce, and banking-focused dashboards — with premium UI and operational clarity.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8">
                <h2 className="text-2xl font-bold">{t('public.aboutWho')}</h2>
                <div className="mt-6 space-y-4">
                  {(about?.paragraphs || []).map((para, i) => (
                    <p key={i} className="leading-7 text-[var(--color-muted-foreground)]">
                      {para}
                    </p>
                  ))}
                </div>
                <div className="my-8 border-t border-[var(--color-border)]"></div>
                <h3 className="text-xl font-semibold">{t('public.aboutValues')}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(about?.values || []).map((value, i) => (
                    <span
                      key={i}
                      className="rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1.5 text-sm"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8">
                <h2 className="text-2xl font-bold">{t('public.aboutHow')}</h2>
                <p className="mt-4 text-[var(--color-muted-foreground)]">{t('public.aboutDelivery')}</p>
                <div className="mt-8 space-y-4">
                  {(about?.process || []).map((step, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] text-sm font-semibold text-[var(--color-primary-foreground)]">
                        {i + 1}
                      </div>
                      <div className="pt-2">
                        <div className="font-medium">{step}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

