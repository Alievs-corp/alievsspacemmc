import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Building,
  CircleHelp,
  Cookie,
  Ellipsis,
  FileText,
  GraduationCap,
  House,
  LayoutGrid,
  LogIn,
  LogOut,
  Mail,
  Package,
  Receipt,
  Shield,
  Users,
  Workflow,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface TabItem {
  path: string;
  key: string;
  Icon: LucideIcon;
  external?: boolean;
}

/** The four destinations a phone visitor reaches for; the rest live in "More". */
const PRIMARY_TABS: TabItem[] = [
  { path: '/', key: 'home', Icon: House },
  { path: '/services', key: 'services', Icon: LayoutGrid },
  { path: '/packages', key: 'packages', Icon: Package },
  { path: '/contact', key: 'contact', Icon: Mail },
];

const MORE_PAGES: TabItem[] = [
  { path: '/process', key: 'process', Icon: Workflow },
  { path: '/case-studies', key: 'caseStudies', Icon: Briefcase },
  { path: '/industries', key: 'industries', Icon: Building },
  { path: '/about', key: 'about', Icon: Users },
  { path: '/faq', key: 'faq', Icon: CircleHelp },
];

const MORE_EXTERNAL: TabItem[] = [
  { path: 'https://academy.alievsspace.com/vacancies', key: 'careers', Icon: Briefcase, external: true },
  { path: 'https://academy.alievsspace.com', key: 'academy', Icon: GraduationCap, external: true },
];

const LEGAL_LINKS: TabItem[] = [
  { path: '/privacy-policy', key: 'privacyPolicy', Icon: Shield },
  { path: '/terms-of-service', key: 'termsOfService', Icon: FileText },
  { path: '/refund-policy', key: 'refundPolicy', Icon: Receipt },
  { path: '/cookie-policy', key: 'cookiePolicy', Icon: Cookie },
];

/** Paths that light up the "More" tab instead of one of the primary four. */
const MORE_PATHS = [...MORE_PAGES, ...LEGAL_LINKS].map((item) => item.path);

const tabClass = (active: boolean) =>
  cn(
    'flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg px-1 py-1.5 text-[10.5px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
    active ? 'text-primary' : 'text-text-subtle hover:text-text',
  );

/**
 * Phone navigation. Replaces the burger drawer: the main pages sit on a fixed
 * bottom bar within thumb reach, and everything that does not fit opens in a
 * sheet behind the "More" button.
 */
export function MobileTabBar() {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sheetOpen, setSheetOpen] = useState(false);

  // Prevent the page behind the sheet from scrolling.
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sheetOpen]);

  useEffect(() => {
    if (!sheetOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSheetOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [sheetOpen]);

  const closeSheet = () => setSheetOpen(false);
  const moreActive = sheetOpen || MORE_PATHS.some((p) => pathname.startsWith(p));

  const sheetLinkClass =
    'flex items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-3 text-[13.5px] font-medium text-text-muted transition-colors hover:border-border-strong hover:text-text';

  return (
    <>
      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-ink-950/95 backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <ul className="mx-auto flex max-w-lg items-stretch gap-0.5 px-2 py-1.5">
          {PRIMARY_TABS.map(({ path, key, Icon }) => (
            <li key={path} className="flex flex-1">
              <NavLink to={path} end={path === '/'} className={({ isActive }) => tabClass(isActive)}>
                {({ isActive }) => (
                  <>
                    <Icon aria-hidden className="h-[19px] w-[19px]" strokeWidth={isActive ? 2.4 : 1.8} />
                    <span className="w-full truncate text-center leading-none">{t(`nav.${key}`)}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
          <li className="flex flex-1">
            <button
              type="button"
              onClick={() => setSheetOpen((v) => !v)}
              aria-expanded={sheetOpen}
              aria-haspopup="dialog"
              className={tabClass(moreActive)}
            >
              <Ellipsis aria-hidden className="h-[19px] w-[19px]" strokeWidth={moreActive ? 2.4 : 1.8} />
              <span className="w-full truncate text-center leading-none">
                {t('nav.moreLinks', 'More')}
              </span>
            </button>
          </li>
        </ul>
      </nav>

      {sheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={t('ui.menu')}>
          <div className="absolute inset-0 animate-fade-in bg-black/70 backdrop-blur-sm" onClick={closeSheet} />

          <div
            className="absolute inset-x-0 bottom-0 max-h-[85dvh] animate-sheet-up overflow-y-auto rounded-t-2xl border-t border-border bg-surface"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.25rem)' }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-5 py-3.5">
              <span className="font-display text-[15px] text-text">{t('nav.moreLinks', 'More')}</span>
              <button
                type="button"
                onClick={closeSheet}
                aria-label={t('ui.close')}
                className="cursor-pointer rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-3 hover:text-text"
              >
                <X aria-hidden className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 pt-5">
              <ul className="grid grid-cols-2 gap-2">
                {MORE_PAGES.map(({ path, key, Icon }) => (
                  <li key={path}>
                    <NavLink
                      to={path}
                      onClick={closeSheet}
                      className={({ isActive }) =>
                        cn(sheetLinkClass, isActive && 'border-primary/50 text-primary')
                      }
                    >
                      <Icon aria-hidden className="h-4 w-4 shrink-0" />
                      <span className="truncate">{t(`nav.${key}`)}</span>
                    </NavLink>
                  </li>
                ))}
                {MORE_EXTERNAL.map(({ path, key, Icon }) => (
                  <li key={path}>
                    <a
                      href={path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeSheet}
                      className={sheetLinkClass}
                    >
                      <Icon aria-hidden className="h-4 w-4 shrink-0" />
                      <span className="truncate">{t(`nav.${key}`)}</span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-5 space-y-2.5">
                <Button
                  className="w-full py-3.5 text-[15px] font-semibold"
                  onClick={() => {
                    closeSheet();
                    navigate('/contact');
                  }}
                >
                  {t('nav.getQuote')}
                </Button>
                {user ? (
                  <Button
                    variant="outline"
                    className="w-full py-3.5 text-[15px]"
                    onClick={() => {
                      closeSheet();
                      localStorage.removeItem('auth_token');
                      navigate('/login');
                      window.location.reload();
                    }}
                  >
                    <LogOut aria-hidden className="h-4 w-4" />
                    {t('nav.logout', 'Logout')}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full py-3.5 text-[15px]"
                    onClick={() => {
                      closeSheet();
                      navigate('/login');
                    }}
                  >
                    <LogIn aria-hidden className="h-4 w-4" />
                    {t('nav.login')}
                  </Button>
                )}
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <p className="mb-2.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-text-subtle">
                  {t('nav.legal')}
                </p>
                <ul className="flex flex-wrap gap-x-4 gap-y-2">
                  {LEGAL_LINKS.map(({ path, key }) => (
                    <li key={path}>
                      <Link
                        to={path}
                        onClick={closeSheet}
                        className="text-[12.5px] text-text-subtle transition-colors hover:text-primary"
                      >
                        {t(`nav.${key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[11.5px] text-text-subtle">
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

export default MobileTabBar;
