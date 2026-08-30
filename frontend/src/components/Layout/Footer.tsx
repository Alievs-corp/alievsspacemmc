import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { CurrencySwitcher } from '@/components/ui/CurrencySwitcher';
import { ORGANIZATION, phoneForLocale, telHref } from '@/lib/site';
import alievsspace from '../../assets/images/alievsspace-logo.png';
import instagram from '../../assets/icons/instagram.svg';
import linkedin from '../../assets/icons/linkedin.svg';

interface FooterLink {
  to: string;
  key: string;
  external?: boolean;
}

const COLUMNS: Array<{ titleKey: string; links: FooterLink[] }> = [
  {
    titleKey: 'nav.company',
    links: [
      { to: '/services', key: 'nav.services' },
      { to: '/packages', key: 'nav.packages' },
      { to: '/process', key: 'nav.process' },
      { to: '/case-studies', key: 'nav.caseStudies' },
      { to: '/industries', key: 'nav.industries' },
      { to: '/about', key: 'nav.about' },
      { to: '/faq', key: 'nav.faq' },
      { to: 'https://academy.alievsspace.com/vacancies', key: 'nav.careers', external: true },
    ],
  },
  {
    titleKey: 'nav.legal',
    links: [
      { to: '/privacy-policy', key: 'nav.privacyPolicy' },
      { to: '/terms-of-service', key: 'nav.termsOfService' },
      { to: '/refund-policy', key: 'nav.refundPolicy' },
      { to: '/cookie-policy', key: 'nav.cookiePolicy' },
    ],
  },
];

const linkClass =
  'text-[13px] text-text-muted transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm';

export function Footer() {
  const { t, locale } = useI18n();
  const currentYear = new Date().getFullYear();

  const phone = phoneForLocale(locale);

  return (
    <footer className="border-t border-border bg-ink-950">
      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <img src={alievsspace} alt={t('public.company', 'Alievs Space')} className="h-10" />
              <span>
                <span className="block font-display text-[19px] leading-none text-white">
                  ALIEVS SPACE
                </span>
                <span className="mt-1 block font-sans text-[10px] uppercase tracking-[0.16em] text-text-subtle">
                  {t('company.tagline', 'Premium Digital & Commerce Ecosystem')}
                </span>
              </span>
            </Link>

            <div className="rule-fade my-5 max-w-[13rem]" />

            <p className="max-w-sm text-[13px] leading-relaxed text-text-muted">
              {t('public.footerDesc')}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <LanguageSwitcher />
              <CurrencySwitcher />
            </div>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.titleKey} aria-label={t(column.titleKey)}>
              <h2 className="font-display text-[15px] font-semibold text-white">
                {t(column.titleKey)}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.to}>
                    {link.external ? (
                      <a href={link.to} target="_blank" rel="noopener noreferrer" className={linkClass}>
                        {t(link.key)}
                      </a>
                    ) : (
                      <Link to={link.to} className={linkClass}>
                        {t(link.key)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="font-display text-[15px] font-semibold text-white">{t('nav.contact')}</h2>
            <ul className="mt-4 space-y-3 text-[13px]">
              <li className="flex flex-wrap items-center gap-1.5">
                <span className="text-text-subtle">{t('public.contactEmail')}:</span>
                <a href={`mailto:${ORGANIZATION.email}`} className={linkClass}>
                  {ORGANIZATION.email}
                </a>
              </li>
              <li className="flex flex-wrap items-center gap-1.5">
                <span className="text-text-subtle">{t('public.contactPhone')}:</span>
                <a href={telHref(phone)} className={linkClass}>
                  {phone.display}
                </a>
              </li>
            </ul>

            <Link
              to="/contact"
              className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2.5 text-[13.5px] font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              {t('nav.getQuote')}
            </Link>

            <div className="mt-7 flex gap-4">
              <a
                href={ORGANIZATION.social[0]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="opacity-80 transition-opacity hover:opacity-100"
              >
                <img src={instagram} alt="" aria-hidden className="icon-adaptive" />
              </a>
              <a
                href={ORGANIZATION.social[1]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="opacity-80 transition-opacity hover:opacity-100"
              >
                <img src={linkedin} alt="" aria-hidden className="icon-adaptive" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 md:flex-row">
          <p className="text-[12.5px] text-text-subtle">
            © {currentYear} Alievs Space {t('ui.companyDescription')}. {t('public.copyrightSuffix')}
          </p>
          <p className="text-[12px] text-text-disabled">{t('packages.currencyNote')}</p>
        </div>
      </div>
    </footer>
  );
}
