import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileMenu } from '@/components/ui/ProfileMenu';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { CurrencySwitcher } from '@/components/ui/CurrencySwitcher';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { onSamePageTop, useLenis, useScrollFrame } from '@/components/site/scroll';
import { ORGANIZATION, phoneForLocale, telHref } from '@/lib/site';
import { cn } from '@/lib/utils';

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

const MENU_EXTRA: NavItem[] = [
  { path: '/contact', key: 'contact' },
  { path: '/crm', key: 'crm' },
];

const EXTERNAL_LINKS: NavItem[] = [
  { path: 'https://academy.alievsspace.com/vacancies', key: 'careers', external: true },
  { path: 'https://academy.alievsspace.com', key: 'academy', external: true },
];

function LoginIcon({ label, className }: { label: string; className?: string }) {
  return (
    <Link
      to="/login"
      title={label}
      aria-label={label}
      className={cn(
        'flex items-center justify-center rounded-full border border-border transition-colors hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
        className,
      )}
    >
      <LogIn aria-hidden className="h-4 w-4" />
    </Link>
  );
}

/**
 * Fixed header. Transparent with light type while a page's plaster hero is
 * behind it, solid paper once you scroll past; it slides away while reading
 * downwards and returns on the first upward scroll. Below 1180px the links
 * move into a full-screen menu.
 */
export function Header() {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const lenis = useLenis();
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const last = useRef(0);
  const phone = phoneForLocale(locale);

  // Close the menu on navigation (derived during render, no extra effect pass).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, lenis]);

  // Hero geometry is measured only when the page changes (mount, resize, DOM
  // mutations) — never inside the scroll frame, where a layout read right
  // after other effects' writes would force a style recalc on every frame.
  const geo = useRef({ hero: false, sticky: false, heroEnd: 0, h: 72 });
  const measure = () => {
    const el = headerRef.current;
    if (!el) return;
    const hero = document.querySelector<HTMLElement>('[data-hero]');
    geo.current = {
      hero: !!hero,
      // The walk hero's stage is sticky, so its copy never slides under the
      // header; on ordinary heroes the header turns solid as soon as content moves.
      sticky: hero?.dataset.hero === 'walk',
      heroEnd: hero ? hero.getBoundingClientRect().bottom + window.scrollY : 0,
      h: el.offsetHeight,
    };
  };

  const evaluate = (y: number) => {
    const el = headerRef.current;
    if (!el) return;
    const { hero, sticky, heroEnd, h } = geo.current;
    const over = hero && (sticky ? y < heroEnd - h : y < 24);
    el.classList.toggle('is-over', over);
    const delta = y - last.current;
    if (Math.abs(delta) > 4) {
      const hidden = !over && delta > 0 && y > heroEnd + 240;
      el.classList.toggle('is-hidden', hidden);
      document.documentElement.classList.toggle('as-header-hidden', hidden);
      last.current = y;
    }
  };

  useScrollFrame(evaluate);

  // Pages (often lazy) mount their hero after the header: re-check whenever
  // the main content changes, at most once per frame.
  useEffect(() => {
    const main = document.getElementById('main');
    if (!main) return;
    let queued = 0;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        measure();
        evaluate(window.scrollY);
      });
    });
    mo.observe(main, { childList: true, subtree: true });
    const ro = new ResizeObserver(() => {
      measure();
      evaluate(window.scrollY);
    });
    ro.observe(document.body);
    measure();
    evaluate(window.scrollY);
    return () => {
      mo.disconnect();
      ro.disconnect();
      cancelAnimationFrame(queued);
    };
  }, []);

  // A new page starts with the header shown.
  useEffect(() => {
    headerRef.current?.classList.remove('is-hidden');
    document.documentElement.classList.remove('as-header-hidden');
    last.current = window.scrollY;
  }, [pathname]);

  const menuLinks = [...NAV_LINKS, ...MENU_EXTRA];

  return (
    <>
      <a href="#main" className="skip-link">
        {t('ui.skipToContent', 'Skip to content')}
      </a>

      <header ref={headerRef} className={cn('as-header', open && 'is-menu')} data-open={open || undefined}>
        <Link
          to="/"
          className="as-brand"
          aria-label={t('nav.home', 'Home')}
          onClick={(e) => {
            setOpen(false);
            onSamePageTop(e, pathname);
          }}
        >
          <span className="as-brand-mark" aria-hidden />
          <span className="as-brand-name">
            Alievs<b>Space</b>
          </span>
        </Link>

        <nav aria-label="Primary" className="as-nav hidden min-[1180px]:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.path} to={link.path}>
              {t(`nav.${link.key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="as-header-tools">
          <span className="hidden sm:contents">
            <ThemeToggle />
            <CurrencySwitcher compact />
            <LanguageSwitcher compact />
          </span>
          {user ? (
            <ProfileMenu />
          ) : (
            <LoginIcon label={t('nav.login', 'Login')} className="hidden h-9 w-9 sm:flex" />
          )}
        </div>

        <Link to="/contact" className="as-header-cta hidden md:inline-flex">
          {t('nav.getQuote')}
        </Link>

        <button
          type="button"
          className="as-menu-btn min-[1180px]:hidden"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? t('ui.close', 'Close') : t('ui.menu', 'Menu')}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </header>

      <div
        id="site-menu"
        className={cn('as-menu as-stucco', open && 'is-open')}
        role="dialog"
        aria-modal="true"
        aria-label={t('ui.menu', 'Menu')}
        aria-hidden={!open}
        {...(open ? {} : ({ inert: '' } as object))}
        data-lenis-prevent
      >
        <nav className="as-menu-links" aria-label="Menu">
          {menuLinks.map((link, i) => (
            <NavLink key={link.path} to={link.path} style={{ '--i': i } as CSSProperties}>
              <span className="as-menu-n">{String(i + 1).padStart(2, '0')}</span>
              {t(`nav.${link.key}`)}
            </NavLink>
          ))}
          {EXTERNAL_LINKS.map((link, i) => (
            <a key={link.path} href={link.path} target="_blank" rel="noopener noreferrer" style={{ '--i': menuLinks.length + i } as CSSProperties}>
              <span className="as-menu-n">↗</span>
              {t(`nav.${link.key}`)}
            </a>
          ))}
        </nav>
        <div className="as-menu-foot">
          <div className="flex flex-wrap items-center gap-2">
            <ThemeToggle />
            <CurrencySwitcher />
            <LanguageSwitcher />
            {!user && <LoginIcon label={t('nav.login', 'Login')} className="h-9 w-9" />}
          </div>
          <div className="grid gap-1 text-[14px]">
            <a href={`mailto:${ORGANIZATION.email}`}>{ORGANIZATION.email}</a>
            <a href={telHref(phone)}>{phone.display}</a>
          </div>
          <Link to="/contact" className="as-btn as-btn--light">
            <span>{t('nav.getQuote')}</span>
            <span className="as-arrow" aria-hidden>
              →
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
