import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { ProfileMenu } from '@/components/ui/ProfileMenu';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { CurrencySwitcher } from '@/components/ui/CurrencySwitcher';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
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

  const [scrolled, setScrolled] = useState(false);

  // The header turns opaque once the hero image is behind it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'relative whitespace-nowrap rounded-md px-2 py-1.5 text-[12px] font-medium transition-colors xl:px-2.5 xl:text-[13.5px]',
      isActive ? 'text-primary' : 'text-text-muted hover:text-text',
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
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-2 px-4 sm:px-6 lg:h-20 lg:gap-3 lg:px-8">
          <Link to="/" className="flex min-w-0 shrink items-center gap-2" aria-label={t('nav.home', 'Home')}>
            <img src={alievsspace} alt={t('ui.logo')} className="brand-mark w-10 sm:w-11 lg:w-14" />
            <span className="min-w-0">
              <span className="block font-display text-[15px] leading-none text-white sm:text-[18px] lg:text-[22px]">
                ALIEVS
              </span>
              <span className="block truncate font-sans text-[9px] uppercase leading-tight tracking-[0.16em] text-text-subtle sm:text-[10px] lg:text-[11px]">
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
                    className="flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1.5 text-[12px] font-medium text-text-muted transition-colors hover:text-text xl:px-2.5 xl:text-[13.5px]"
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
            <ThemeToggle />
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

          {/* Phones: no burger — theme, currency and language only. Pages live
              on the bottom tab bar. */}
          <div className="flex shrink-0 items-center gap-1.5 lg:hidden">
            <ThemeToggle />
            <CurrencySwitcher compact />
            <LanguageSwitcher compact />
          </div>
        </div>
      </header>
    </>
  );
}
