import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { ORGANIZATION, phoneForLocale, telHref } from '@/lib/site';
import { prefersReducedMotion, useScrollFrame } from '@/components/site/scroll';

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

/** Ink footer: link columns, contact, and the giant two-tone wordmark. */
export function Footer() {
  const { t, locale } = useI18n();
  const phone = phoneForLocale(locale);
  const wordRef = useRef<HTMLParagraphElement>(null);
  const docH = useRef(0);

  // Page height, read when it changes rather than on every scroll frame.
  useEffect(() => {
    const read = () => (docH.current = document.documentElement.scrollHeight);
    const ro = new ResizeObserver(read);
    ro.observe(document.body);
    read();
    return () => ro.disconnect();
  }, []);

  // The wordmark lines slide together as the footer comes into view.
  useScrollFrame(() => {
    const el = wordRef.current;
    if (!el || prefersReducedMotion()) return;
    // 0 when the footer is a screen away from the page end, 1 at the very bottom.
    const remaining = docH.current - (window.scrollY + window.innerHeight);
    const p = Math.min(1, Math.max(0, 1 - remaining / (window.innerHeight * 0.9)));
    const off = ((1 - p) * 18).toFixed(2);
    const spans = el.children as HTMLCollectionOf<HTMLElement>;
    if (spans[0]) spans[0].style.transform = `translateX(-${off}%)`;
    if (spans[1]) spans[1].style.transform = `translateX(${off}%)`;
  });

  return (
    <footer className="as-footer">
      <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div className="grid content-start gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="as-brand-mark" aria-hidden />
            <span className="as-brand-name">
              Alievs<b>Space</b>
            </span>
          </Link>
          <p className="max-w-sm text-[13.5px] leading-relaxed text-[rgba(242,235,223,.7)]">{t('public.footerDesc')}</p>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.titleKey} aria-label={t(column.titleKey)}>
            <h2 className="as-footer-label">{t(column.titleKey)}</h2>
            <ul>
              {column.links.map((link) => (
                <li key={link.to}>
                  {link.external ? (
                    <a href={link.to} target="_blank" rel="noopener noreferrer">
                      {t(link.key)}
                    </a>
                  ) : (
                    <Link to={link.to}>{t(link.key)}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="as-footer-label">{t('site.shell.sayHello', 'Say hello')}</h2>
          <ul>
            <li>
              <a href={`mailto:${ORGANIZATION.email}`}>{ORGANIZATION.email}</a>
            </li>
            <li>
              <a href={telHref(phone)}>{phone.display}</a>
            </li>
            <li>
              <a href={ORGANIZATION.social[0]} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href={ORGANIZATION.social[1]} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
          </ul>
          <Link to="/contact" className="as-btn as-btn--light as-btn--sm mt-6">
            <span>{t('nav.getQuote')}</span>
            <span className="as-arrow" aria-hidden>
              →
            </span>
          </Link>
        </div>
      </div>

      {/* Decorative wordmark; the brand name is already in the footer above. */}
      <p ref={wordRef} className="as-footer-word" aria-hidden>
        <span>ALIEVS</span>
        <span>SPACE</span>
      </p>

      <div className="as-footer-base">
        <span>
          © {new Date().getFullYear()} Alievs Space {t('ui.companyDescription')}. {t('public.copyrightSuffix')}
        </span>
        <span>{t('site.shell.tagline', 'Ideas into digital products')}</span>
      </div>
    </footer>
  );
}
