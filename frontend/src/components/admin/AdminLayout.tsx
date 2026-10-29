import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Home as HomeIcon, Info, Briefcase, FolderKanban, FileText,
  GraduationCap, Mail, Users, Settings, Menu, X, Globe, LogOut, ExternalLink,
  UserCircle, ChevronLeft, ChevronRight, FileUser, ShieldCheck, Plug, SlidersHorizontal, ScrollText,
  Workflow, KeyRound, ShieldHalf, ArrowLeftRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';
import type { Permission } from '@/lib/api';
import { roleLabel } from './ui';
import logoMark from '../../assets/images/logo-dark.png';

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavItem {
  path: string;
  labelKey: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  /** Shown if the user has any of these; omitted means every admin. */
  permissions?: Permission[];
  superOnly?: boolean;
}

// Grouped by area; each item is hidden unless the server would allow it.
const navGroups: Array<{ labelKey: string; label: string; items: NavItem[] }> = [
  {
    labelKey: 'panel.nav.overview', label: 'Overview',
    items: [{ path: '/admin', labelKey: 'admin.dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true }],
  },
  {
    labelKey: 'panel.nav.content', label: 'Content',
    items: [
      { path: '/admin/home', labelKey: 'admin.home', label: 'Home', icon: HomeIcon, permissions: ['content'] },
      { path: '/admin/about', labelKey: 'admin.about', label: 'About', icon: Info, permissions: ['content'] },
      { path: '/admin/services', labelKey: 'admin.services', label: 'Services', icon: Briefcase, permissions: ['content'] },
      { path: '/admin/projects', labelKey: 'admin.projects', label: 'Projects', icon: FolderKanban, permissions: ['content'] },
      { path: '/admin/blog', labelKey: 'admin.blog', label: 'Blog', icon: FileText, permissions: ['content'] },
      { path: '/admin/careers', labelKey: 'admin.careers', label: 'Careers', icon: GraduationCap, permissions: ['content'] },
      { path: '/admin/settings', labelKey: 'panel.nav.siteSettings', label: 'Site settings', icon: Settings, permissions: ['content'] },
    ],
  },
  {
    labelKey: 'panel.nav.submissions', label: 'Submissions',
    items: [
      { path: '/admin/inquiries', labelKey: 'admin.inquiries', label: 'Inquiries', icon: Mail, permissions: ['inquiries'] },
      { path: '/admin/applications', labelKey: 'panel.nav.applications', label: 'Applications', icon: FileUser, permissions: ['applications'] },
    ],
  },
  {
    labelKey: 'panel.nav.people', label: 'People',
    items: [
      { path: '/admin/users', labelKey: 'admin.users', label: 'Users', icon: Users, permissions: ['users.view', 'users.manage'] },
      { path: '/admin/admins', labelKey: 'panel.nav.admins', label: 'Administrators', icon: ShieldCheck, superOnly: true },
    ],
  },
  {
    labelKey: 'panel.nav.crmGroup', label: 'CRM',
    items: [
      { path: '/crm', labelKey: 'panel.nav.crmWorkspace', label: 'CRM Workspace', icon: Workflow, superOnly: true },
      { path: '/admin/crm-access', labelKey: 'panel.nav.crmAccess', label: 'CRM access', icon: KeyRound, superOnly: true },
      { path: '/admin/crm-roles', labelKey: 'panel.nav.crmRoles', label: 'CRM roles', icon: ShieldHalf, superOnly: true },
    ],
  },
  {
    labelKey: 'panel.nav.systemGroup', label: 'System',
    items: [
      { path: '/admin/api', labelKey: 'panel.nav.api', label: 'API & integrations', icon: Plug, superOnly: true },
      { path: '/admin/system', labelKey: 'panel.nav.system', label: 'System settings', icon: SlidersHorizontal, superOnly: true },
      { path: '/admin/audit', labelKey: 'panel.nav.audit', label: 'Audit log', icon: ScrollText, superOnly: true },
    ],
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, isAdmin, isSuperAdmin, hasPermission, loading } = useAuth();
  const { locale, setLocale, supportedLocales, t } = useI18n();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate('/', { replace: true });
  }, [user, isAdmin, loading, navigate]);

  // Close the mobile drawer on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
          <div className="font-inter text-text-muted">{t('admin.loading', 'Loading…')}</div>
        </div>
      </div>
    );
  }
  if (!user || !isAdmin) return null;

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const visible = (i: NavItem) =>
    (!i.superOnly || isSuperAdmin) && (!i.permissions || i.permissions.some((p) => hasPermission(p)));
  const groups = navGroups
    .map((g) => ({ ...g, items: g.items.filter(visible) }))
    .filter((g) => g.items.length > 0);

  const activeItem = groups.flatMap((g) => g.items).reverse().find((i) => isActive(i.path, i.exact));

  return (
    <div className="flex min-h-dvh bg-bg text-text">
      {/* Mobile scrim */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 z-40 flex h-dvh flex-col border-r border-border bg-surface',
          'transition-[width,transform] duration-300 ease-out',
          collapsed ? 'lg:w-[76px]' : 'lg:w-64',
          'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Brand */}
        <div className={cn('flex h-16 items-center border-b border-border px-4', collapsed && 'lg:justify-center lg:px-0')}>
          <Link to="/admin" className="flex min-w-0 items-center gap-2.5">
            <img src={logoMark} alt="" className="h-8 w-8 shrink-0 object-contain" />
            {!collapsed && (
              <span className="min-w-0">
                <span className="block font-display text-base font-semibold leading-none text-text">ALIEVS</span>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-text-subtle">{t('admin.panel', 'Admin Panel')}</span>
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto rounded-md p-1.5 text-text-muted hover:bg-surface-3 hover:text-text lg:hidden"
            aria-label={t('ui.close', 'Close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-3 overflow-y-auto p-3">
          {groups.map((g) => (
            <div key={g.labelKey} className="space-y-1">
              <p className={cn('px-3 pb-1 font-mono text-[10px] uppercase tracking-wider text-text-subtle', collapsed && 'lg:hidden')}>
                {t(g.labelKey, g.label)}
              </p>
              {g.items.map((item) => {
                const active = isActive(item.path, item.exact);
                const Ico = item.icon;
                const label = t(item.labelKey, item.label);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={collapsed ? label : undefined}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                      active ? 'bg-primary text-on-primary' : 'text-text-muted hover:bg-surface-3 hover:text-text',
                      collapsed && 'lg:justify-center lg:px-0',
                    )}
                  >
                    <Ico className="h-5 w-5 shrink-0" strokeWidth={2} />
                    <span className={cn('truncate', collapsed && 'lg:hidden')}>{label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="space-y-1 border-t border-border p-3">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="hidden w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-3 hover:text-text lg:flex"
          >
            {collapsed ? <ChevronRight className="h-5 w-5 shrink-0" /> : <ChevronLeft className="h-5 w-5 shrink-0" />}
            {!collapsed && <span>{t('admin.collapse', 'Collapse')}</span>}
          </button>
          <Link
            to="/"
            title={collapsed ? t('admin.goToSite') : undefined}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-3 hover:text-text',
              collapsed && 'lg:justify-center lg:px-0',
            )}
          >
            <ExternalLink className="h-5 w-5 shrink-0" />
            <span className={cn(collapsed && 'lg:hidden')}>{t('admin.goToSite', 'Go to site')}</span>
          </Link>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-2 text-text-muted hover:bg-surface-3 hover:text-text lg:hidden"
              aria-label={t('ui.menu', 'Menu')}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 font-mono text-xs text-text-subtle">
              <span className="text-text-muted">{t('admin.panel', 'Admin')}</span>
              {activeItem && <span className="text-text-subtle"> / {t(activeItem.labelKey, activeItem.label)}</span>}
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              to="/crm"
              className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-2 text-sm text-text-muted transition-colors hover:bg-surface-3 hover:text-text"
              title={t('panel.switchToCrm', 'Switch to CRM Workspace')}
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span className="hidden md:inline">CRM</span>
            </Link>
            <button
              onClick={() => {
                const idx = supportedLocales.findIndex((l) => l.code === locale);
                setLocale(supportedLocales[(idx + 1) % supportedLocales.length].code);
              }}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm text-text-muted transition-colors hover:bg-surface-3 hover:text-text"
              title={t('ui.language')}
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{locale.toUpperCase()}</span>
            </button>

            <Link to="/profile" className="mx-1 hidden items-center gap-2 rounded-md px-1.5 py-1 hover:bg-surface-3 sm:flex" title={t('account.profile.title', 'My profile')}>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-2 text-text-muted">
                <UserCircle className="h-5 w-5" />
              </div>
              <div className="hidden text-right md:block">
                <div className="text-sm font-medium text-text">{user?.name || user?.email}</div>
                <div className="text-xs text-text-subtle">{roleLabel(user.role)}</div>
              </div>
            </Link>

            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-text-muted transition-colors hover:bg-surface-3 hover:text-text"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t('ui.logout', 'Logout')}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
