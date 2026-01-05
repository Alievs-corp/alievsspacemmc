import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';
import { Button } from '@/components/ui/Button';

export function Home() {
  const { t } = useI18n();
  const { content, loading } = useContent();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-[var(--color-muted-foreground)]">Loading...</div>
      </div>
    );
  }

  const home = content?.home;
  const settings = content?.settings;

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-b from-[var(--color-background)] to-[var(--color-muted)]/20 py-24 sm:py-32">
        <div className="container relative z-10 px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              {home?.heroTitle || 'Build premium digital products that scale.'}
            </h1>
            <p className="mt-6 text-lg leading-8 text-[var(--color-muted-foreground)] sm:text-xl">
              {home?.heroSubtitle || ''}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link to="/contact">
                  {settings?.cta?.primaryText || t('nav.cta')}
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/projects">{t('nav.projects')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {home?.proof && home.proof.length > 0 && (
        <section className="border-y border-[var(--color-border)] bg-[var(--color-muted)]/50 py-16">
          <div className="container px-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {home.proof.map((p, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">{p.kpi}</div>
                  <div className="mt-2 text-sm text-[var(--color-muted-foreground)]">{p.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {home?.highlights && home.highlights.length > 0 && (
        <section className="py-24 sm:py-32">
          <div className="container px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t('public.buildWhat')}
              </h2>
              <p className="mt-4 text-lg text-[var(--color-muted-foreground)]">{t('public.buildDesc')}</p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {home.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow-sm"
                >
                  <h3 className="text-xl font-semibold">{h.title}</h3>
                  <p className="mt-4 flex-1 text-[var(--color-muted-foreground)]">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[var(--color-muted)]/50 py-24 sm:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8">
                <h2 className="text-2xl font-bold">{t('public.premiumProcess')}</h2>
                <p className="mt-4 text-[var(--color-muted-foreground)]">{t('public.processDesc')}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['Discovery', 'UI/UX', 'Development', 'QA', 'Launch', 'Support'].map(
                    (step) => (
                      <span
                        key={step}
                        className="rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1 text-sm"
                      >
                        {step}
                      </span>
                    )
                  )}
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8">
                <h2 className="text-2xl font-bold">{t('public.focusIndustries')}</h2>
                <p className="mt-4 text-[var(--color-muted-foreground)]">{t('public.focusDesc')}</p>
                <div className="mt-6">
                  <Button variant="outline" asChild>
                    <Link to="/industries">{t('nav.industries')}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
