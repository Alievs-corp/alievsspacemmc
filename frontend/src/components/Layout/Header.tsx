import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { ProfileMenu } from '@/components/ui/ProfileMenu';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { CurrencySwitcher } from '@/components/ui/CurrencySwitcher';
import { cn } from '@/lib/utils';

import alievsspace from '../../assets/images/logo-dark.png';

interface NavItem {
  path: string;
  key: string;
  external?: boolean;
}

/** Ordered by what a buying visitor looks for first. */
const NAV_LINKS: NavItem[] = [
  { path: '/services', key: 'services' },
  { path: '/packages', key: 'packages' },
  { path: '/process', key: 'process' },
  { path: '/case-studies', key: 'caseStudies' },
  { path: '/industries', key: 'industries' },
  { path: '/about', key: 'about' },
  { path: '/faq', key: 'faq' },
];

const EXTERNAL_LINKS: NavItem[] = [
  { path: 'https://academy.alievsspace.com/vacancies', key: 'careers', external: true },
  { path: 'https://academy.alievsspace.com', key: 'academy', external: true },
];

export function Header() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // The header turns opaque once the hero image is behind it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent the page behind the drawer from scrolling.
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'relative whitespace-nowrap rounded-md px-2 py-1.5 text-[12px] font-medium transition-colors xl:px-2.5 xl:text-[13.5px]',
      isActive ? 'text-primary' : 'text-text-muted hover:text-white',
    );

  return (
    <>
      <a href="#main" className="skip-link">
        {t('ui.skipToContent', 'Skip to content')}
      </a>

      <header
        className={cn(
          'sticky top-0 z-40 w-full border-b transition-colors duration-300',
          scrolled
            ? 'border-border bg-ink-950/85 backdrop-blur-xl'
            : 'border-transparent bg-ink-950/60 backdrop-blur-md',
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6 lg:h-20 lg:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-2" aria-label={t('nav.home', 'Home')}>
            <img src={alievsspace} alt={t('ui.logo')} className="w-11 lg:w-14" />
            <span>
              <span className="block font-display text-[16px] leading-none text-white sm:text-[18px] lg:text-[22px]">
                ALIEVS
              </span>
              <span className="block font-sans text-[9.5px] uppercase leading-tight tracking-[0.18em] text-text-subtle sm:text-[10px] lg:text-[11px]">
                Space {t('ui.companyDescription')}
              </span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden flex-1 justify-center lg:flex">
            <ul className="flex items-center gap-0.5 xl:gap-1.5">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <NavLink to={link.path} className={navLinkClass}>
                    {t(`nav.${link.key}`)}
                  </NavLink>
                </li>
              ))}
              {EXTERNAL_LINKS.slice(0, 1).map((link) => (
                <li key={link.path}>
                  <a
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1.5 text-[12px] font-medium text-text-muted transition-colors hover:text-white xl:px-2.5 xl:text-[13.5px]"
                  >
                    {t(`nav.${link.key}`)}
                    <svg aria-hidden className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <CurrencySwitcher />
            <LanguageSwitcher />
            <Button
              size="sm"
              className="whitespace-nowrap bg-primary px-3 text-[12.5px] font-semibold text-on-primary shadow-[var(--shadow-glow-primary)] hover:bg-primary-hover xl:px-4 xl:text-[13.5px]"
              onClick={() => navigate('/contact')}
            >
              {t('nav.getQuote')}
            </Button>
            {user && <ProfileMenu variant="lg" />}
          </div>

          <button
            type="button"
            className="-mr-1 rounded-md p-2 text-white transition-colors hover:bg-surface-3 lg:hidden"
            aria-label={t('ui.menu')}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeMenu} />

          <div className="absolute right-0 top-0 flex h-full w-full max-w-sm animate-slide-up flex-col bg-ink-950">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
                <img src={alievsspace} alt={t('ui.logo')} className="w-10" />
                <span>
                  <span className="block font-display text-[17px] leading-none text-white">ALIEVS</span>
                  <span className="block font-sans text-[10px] uppercase tracking-[0.18em] text-text-subtle">
                    Space {t('ui.companyDescription')}
                  </span>
                </span>
              </Link>
              <button
                type="button"
                onClick={closeMenu}
                aria-label={t('ui.close')}
                className="rounded-md p-2 text-white transition-colors hover:bg-surface-3"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <div className="mb-6 flex items-center gap-2">
                <LanguageSwitcher className="flex-1 [&>button]:w-full [&>button]:justify-between" />
                <CurrencySwitcher className="flex-1 [&>button]:w-full [&>button]:justify-between" />
              </div>

              <nav aria-label="Mobile">
                <ul className="space-y-1.5">
                  {NAV_LINKS.map((link) => (
                    <li key={link.path}>
                      <NavLink
                        to={link.path}
                        onClick={closeMenu}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium transition-colors',
                            isActive ? 'bg-surface-2 text-primary' : 'text-text-muted hover:bg-surface-2 hover:text-white',
                          )
                        }
                      >
                        {t(`nav.${link.key}`)}
                        <svg aria-hidden className="h-4 w-4 text-text-subtle" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </NavLink>
                    </li>
                  ))}
                  {EXTERNAL_LINKS.map((link) => (
                    <li key={link.path}>
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closeMenu}
                        className="flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium text-text-muted transition-colors hover:bg-surface-2 hover:text-white"
                      >
                        {t(`nav.${link.key}`)}
                        <svg aria-hidden className="h-3.5 w-3.5 text-text-subtle" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-8 space-y-3">
                <Button
                  className="w-full bg-primary py-3.5 text-base font-semibold text-on-primary hover:bg-primary-hover"
                  onClick={() => {
                    navigate('/contact');
                    closeMenu();
                  }}
                >
                  {t('nav.getQuote')}
                </Button>
                <Button
                  variant="outline"
                  className="w-full py-3.5 text-base"
                  onClick={() => {
                    navigate('/packages');
                    closeMenu();
                  }}
                >
                  {t('nav.pricing')}
                </Button>
              </div>

              <div className="mt-8 border-t border-border pt-5">
                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      localStorage.removeItem('auth_token');
                      navigate('/login');
                      window.location.reload();
                    }}
                    className="w-full cursor-pointer text-left text-[13px] text-text-subtle transition-colors hover:text-white"
                  >
                    {t('nav.logout', 'Logout')}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="text-[13px] text-text-subtle transition-colors hover:text-white"
                  >
                    {t('nav.login')}
                  </Link>
                )}
                <p className="mt-4 text-[12px] text-text-subtle">
                  © {new Date().getFullYear()} Alievs Space {t('ui.companyDescription')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
