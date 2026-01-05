import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, isAdmin, loading } = useAuth();
  const { locale, setLocale, supportedLocales } = useI18n();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/', { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-[var(--color-muted-foreground)]">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const navItems = [
    { path: '/admin', label: 'Overview', icon: '📊' },
    { path: '/admin/services', label: 'Services', icon: '⚙️' },
    { path: '/admin/projects', label: 'Projects', icon: '📁' },
    { path: '/admin/blog', label: 'Blog', icon: '📝' },
    { path: '/admin/careers', label: 'Careers', icon: '💼' },
    { path: '/admin/inquiries', label: 'Inquiries', icon: '📧' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-[var(--color-background)]">
      <aside
        className={cn(
          'flex flex-col border-r border-[var(--color-border)] bg-[var(--color-card)] transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
          <div className={cn('flex items-center gap-2', !sidebarOpen && 'justify-center')}>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600"></div>
            {sidebarOpen && (
              <div>
                <div className="text-sm font-bold">Alievs Space</div>
                <div className="text-xs text-[var(--color-muted-foreground)]">Admin Console</div>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-md p-1 hover:bg-[var(--color-accent)]"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        {sidebarOpen && (
          <div className="border-b border-[var(--color-border)] p-4">
            <label className="mb-2 block text-xs font-medium">Locale</label>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as typeof locale)}
              className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
            >
              {supportedLocales.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive(item.path)
                  ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]'
                  : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]',
                !sidebarOpen && 'justify-center'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="border-t border-[var(--color-border)] p-4 space-y-2">
          {sidebarOpen && (
            <div className="mb-2 text-xs text-[var(--color-muted-foreground)]">
              Logged in as <span className="font-medium">{user?.name || user?.email}</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => navigate('/')}
          >
            {sidebarOpen ? '← Open Website' : '🌐'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            {sidebarOpen ? 'Logout' : '🚪'}
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}

