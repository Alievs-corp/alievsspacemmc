import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';
import { api } from '@/lib/api';
import { useState, useEffect } from 'react';

export function Services() {
  const { t, locale } = useI18n();
  const { content, loading: contentLoading } = useContent();
  const [services, setServices] = useState(content?.services || []);
  const [loading, setLoading] = useState(contentLoading);

  useEffect(() => {
    if (!content?.services || content.services.length === 0) {
      setLoading(true);
      api.getServices(locale).then(setServices).finally(() => setLoading(false));
    } else {
      setServices(content.services);
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
              {t('nav.home')} / {t('nav.services')}
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t('nav.services')}
            </h1>
            <p className="mt-6 text-lg leading-8 text-[var(--color-muted-foreground)]">
              {t('public.servicesIntro')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[var(--color-primary)]"></div>
                    <span className="text-sm font-medium text-[var(--color-muted-foreground)]">
                      {service.category || t('public.serviceFallback')}
                    </span>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{service.title}</h3>
                  <p className="mb-4 flex-1 text-sm text-[var(--color-muted-foreground)]">{service.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {(service.bullets || []).slice(0, 4).map((bullet, i) => (
                      <span
                        key={i}
                        className="rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1 text-xs"
                      >
                        {bullet}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8">
              <h2 className="text-2xl font-bold">{t('public.deliveryTitle')}</h2>
              <p className="mt-4 text-[var(--color-muted-foreground)]">{t('public.deliveryCopy')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

