import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';

export function Industries() {
  const { t } = useI18n();

  const industries = [
    {
      title: 'E-commerce & Marketplaces',
      desc: 'Multi-vendor platforms, payment processing, inventory management, and seller dashboards.',
    },
    {
      title: 'Banking & Fintech',
      desc: 'Secure dashboards, transaction processing, compliance reporting, and role-based access control.',
    },
    {
      title: 'Operational Systems',
      desc: 'Internal tools, analytics platforms, and management systems with premium UX.',
    },
  ];

  return (
    <>
      <section className="py-16">
        <div className="mx-auto max-w-[var(--container-width)] px-5">
          <div className="mb-4 text-sm text-[var(--color-muted-foreground)]">
            {t('nav.home')} / {t('nav.industries')}
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight">{t('nav.industries')}</h1>
          <p className="mb-12 text-lg leading-relaxed text-[var(--color-muted-foreground)]">
            {t('public.industriesIntro')}
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry, i) => (
              <div
                key={i}
                className="rounded-lg border border-[var(--color-line)] bg-[var(--color-card)] p-6"
              >
                <h3 className="mb-3 text-xl font-semibold">{industry.title}</h3>
                <p className="mb-6 text-sm text-[var(--color-muted-foreground)]">{industry.desc}</p>
                <Link
                  to="/contact"
                  className="inline-block text-sm font-medium text-[var(--color-accent-2)] transition-colors hover:text-[var(--color-accent)]"
                >
                  {t('public.industriesCta')}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

