import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function Header() {
  const { t, locale, setLocale, supportedLocales } = useI18n();
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', key: 'home' },
    { path: '/about', key: 'about' },
    { path: '/services', key: 'services' },
    { path: '/projects', key: 'projects' },
    { path: '/blog', key: 'blog' },
    { path: '/careers', key: 'careers' },
    { path: '/contact', key: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-background)]/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600"></div>
          <span className="text-xl font-bold">Alievs Space</span>
        </Link>

        <nav className="hidden items-center space-x-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                isActive(link.path) ? 'text-[var(--color-foreground)]' : 'text-[var(--color-muted-foreground)]'
              )}
            >
              {t(`nav.${link.key}`)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center space-x-4 md:flex">
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as typeof locale)}
            className="rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
          >
            {supportedLocales.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>

          {user ? (
            <div className="flex items-center space-x-2">
              {isAdmin && (
                <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
                  Dashboard
                </Button>
              )}
              <span className="text-sm text-[var(--color-muted-foreground)]">{user.name}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                {t('ui.logout')}
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button size="sm" onClick={() => navigate('/contact')}>
                {t('nav.cta')}
              </Button>
            </div>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t md:hidden">
          <div className="container space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block rounded-md px-3 py-2 text-sm font-medium',
                  isActive(link.path)
                    ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]'
                    : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]'
                )}
              >
                {t(`nav.${link.key}`)}
              </Link>
            ))}
            {user && isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-[var(--color-muted-foreground)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]"
              >
                Dashboard
              </Link>
            )}
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-[var(--color-muted-foreground)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]"
              >
                {t('ui.logout')}
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-[var(--color-muted-foreground)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
