import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, FolderKanban, CalendarDays, Clapperboard, Images, ListChecks, Users, CheckCheck,
  Inbox, BarChart3, FileBarChart, Sparkles, Bell, Settings, UserCircle, Globe2, KeyRound, ShieldCheck, ScrollText,
  ShieldHalf, Menu, X, LogOut, ExternalLink, Eye, ArrowLeftRight,
} from 'lucide-react';
import { FaInstagram, FaLinkedin, FaTiktok, FaYoutube } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { useCrm } from '@/contexts/CrmContext';
import { useI18n } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';
import type { CrmPermission } from '@/lib/crm';
import { Avatar } from './ui';
import logoMark from '../../assets/images/logo-dark.png';

interface NavItem {
  path: string;
  labelKey: string;
  label: string;
  /** Label used in Admin Mode, where the page lists everything. */
  adminLabelKey?: string;
  adminLabel?: string;
  icon: typeof LayoutDashboard | typeof FaInstagram;
  exact?: boolean;
  /** Shown if the user holds any of these anywhere; omitted = every CRM user. */
  permissions?: CrmPermission[];
  /** Module not built yet: listed so the structure is visible, but inert. */
  soon?: boolean;
}

const NAV: Array<{ key: string; label: string; superOnly?: boolean; items: NavItem[] }> = [
  {
    key: 'crm.nav.main', label: 'Main',
    items: [
      { path: '/crm', labelKey: 'crm.nav.dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { path: '/crm/companies', labelKey: 'crm.nav.companies', label: 'Companies', adminLabelKey: 'crm.nav.allCompanies', adminLabel: 'All companies', icon: Building2 },
      { path: '/crm/projects', labelKey: 'crm.nav.projects', label: 'Projects', adminLabelKey: 'crm.nav.allProjects', adminLabel: 'All projects', icon: FolderKanban },
      { path: '/crm/calendar', labelKey: 'crm.nav.calendar', label: 'Content Calendar', icon: CalendarDays, permissions: ['calendar.view'] },
      { path: '/crm/studio', labelKey: 'crm.nav.studio', label: 'Content Studio', icon: Clapperboard, permissions: ['content.view', 'content.create', 'content.edit'] },
      { path: '/crm/media', labelKey: 'crm.nav.media', label: 'Media Library', icon: Images, permissions: ['media.view'] },
    ],
  },
  {
    key: 'crm.nav.social', label: 'Social media',
    items: [
      { path: '/crm/instagram', labelKey: 'crm.nav.instagram', label: 'Instagram', icon: FaInstagram, permissions: ['social.view'], soon: true },
      { path: '/crm/tiktok', labelKey: 'crm.nav.tiktok', label: 'TikTok', icon: FaTiktok, permissions: ['social.view'], soon: true },
      { path: '/crm/youtube', labelKey: 'crm.nav.youtube', label: 'YouTube', icon: FaYoutube, permissions: ['social.view'], soon: true },
      { path: '/crm/linkedin', labelKey: 'crm.nav.linkedin', label: 'LinkedIn', icon: FaLinkedin, permissions: ['social.view'], soon: true },
    ],
  },
  {
    key: 'crm.nav.management', label: 'Management',
    items: [
      { path: '/crm/tasks', labelKey: 'crm.nav.tasks', label: 'Tasks', icon: ListChecks },
      { path: '/crm/team', labelKey: 'crm.nav.team', label: 'Team', adminLabelKey: 'crm.nav.allEmployees', adminLabel: 'All employees', icon: Users, permissions: ['team.view', 'team.manage'] },
      { path: '/crm/approvals', labelKey: 'crm.nav.approvals', label: 'Approvals', icon: CheckCheck, permissions: ['content.approve'] },
      { path: '/crm/inbox', labelKey: 'crm.nav.inbox', label: 'Social Inbox', icon: Inbox, permissions: ['inbox.view'], soon: true },
    ],
  },
  {
    key: 'crm.nav.analytics', label: 'Analytics',
    items: [
      { path: '/crm/analytics', labelKey: 'crm.nav.analyticsOverview', label: 'Overview', icon: BarChart3, permissions: ['analytics.view'], soon: true },
      { path: '/crm/reports', labelKey: 'crm.nav.reports', label: 'Reports', icon: FileBarChart, permissions: ['analytics.view'], soon: true },
    ],
  },
  {
    key: 'crm.nav.tools', label: 'Tools',
    items: [
      { path: '/crm/ai', labelKey: 'crm.nav.ai', label: 'AI Assistant', icon: Sparkles, permissions: ['content.create', 'content.edit'] },
      { path: '/crm/notifications', labelKey: 'crm.nav.notifications', label: 'Notifications', icon: Bell, soon: true },
    ],
  },
  {
    key: 'crm.nav.system', label: 'System',
    items: [
      { path: '/crm/settings', labelKey: 'crm.nav.settings', label: 'Settings', icon: Settings, soon: true },
      { path: '/profile', labelKey: 'crm.nav.profile', label: 'My Profile', icon: UserCircle },
    ],
  },
  {
    key: 'crm.nav.superOnly', label: 'Super admin', superOnly: true,
    items: [
      { path: '/crm/global', labelKey: 'crm.nav.global', label: 'Global Dashboard', icon: Globe2 },
      { path: '/crm/access', labelKey: 'crm.nav.access', label: 'CRM Access Management', icon: KeyRound },
      { path: '/crm/roles', labelKey: 'crm.nav.roles', label: 'Roles & Permissions', icon: ShieldCheck },
      { path: '/crm/activity', labelKey: 'crm.nav.activity', label: 'Activity Logs', icon: ScrollText },
      { path: '/admin', labelKey: 'crm.nav.openAdmin', label: 'Open Admin Panel', icon: ShieldHalf },
    ],
  },
];

export function CrmLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isSuperAdmin, isAdmin } = useAuth();
  const { me, can, adminMode, viewingAs, stopViewAs } = useCrm();
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname === path || location.pathname.startsWith(path + '/');

  const groups = NAV
    .filter((g) => !g.superOnly || adminMode)
    .map((g) => ({ ...g, items: g.items.filter((i) => !i.permissions || i.permissions.some(can)) }))
    .filter((g) => g.items.length > 0);

  const all = groups.flatMap((g) => g.items);
  const active = [...all].reverse().find((i) => isActive(i.path, i.exact));
  const label = (i: NavItem) => (adminMode && i.adminLabelKey ? t(i.adminLabelKey, i.adminLabel) : t(i.labelKey, i.label));

  return (
    <div className="flex min-h-dvh bg-bg text-text">
      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden />}

      <aside
        className={cn(
          'fixed top-0 z-40 flex h-dvh w-64 flex-col border-r border-border bg-surface transition-transform duration-300 ease-out lg:sticky lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center border-b border-border px-4">
          <Link to="/crm" className="flex min-w-0 items-center gap-2.5">
            <img src={logoMark} alt="" className="h-8 w-8 shrink-0 object-contain" />
            <span className="min-w-0">
              <span className="block font-display text-base font-semibold leading-none text-text">ALIEVS</span>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-text-subtle">{t('crm.brand', 'CRM System')}</span>
            </span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="ml-auto rounded-md p-1.5 text-text-muted hover:bg-surface-3 hover:text-text lg:hidden" aria-label={t('ui.close', 'Close')}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto p-3" aria-label="CRM">
          {groups.map((g) => (
            <div key={g.key} className="space-y-0.5">
              <p className={cn('px-3 pb-1 font-mono text-[10px] uppercase tracking-wider', g.superOnly ? 'text-primary' : 'text-text-subtle')}>{t(g.key, g.label)}</p>
              {g.items.map((item) => {
                const Ico = item.icon;
                const on = isActive(item.path, item.exact);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    aria-current={on ? 'page' : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                      on ? 'bg-primary text-on-primary' : item.soon ? 'text-text-subtle hover:bg-surface-3' : 'text-text-muted hover:bg-surface-3 hover:text-text',
                    )}
                  >
                    <Ico className="h-[18px] w-[18px] shrink-0" />
                    <span className="min-w-0 flex-1 truncate">{label(item)}</span>
                    {item.soon && !on && (
                      <span className="rounded border border-border px-1 font-mono text-[9px] uppercase tracking-wide text-text-subtle">{t('crm.soon', 'Soon')}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-muted hover:bg-surface-3 hover:text-text">
            <ExternalLink className="h-[18px] w-[18px] shrink-0" />
            {t('admin.goToSite', 'Go to site')}
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {viewingAs && (
          <div className="flex flex-wrap items-center justify-between gap-2 bg-warning/15 px-4 py-2 text-sm text-warning sm:px-6">
            <span className="flex min-w-0 items-center gap-2">
              <Eye className="h-4 w-4 shrink-0" />
              <span className="min-w-0 truncate">
                {t('crm.viewAs.banner', 'Viewing as')} <b>{viewingAs.name || viewingAs.email}</b> · {t('crm.viewAs.readOnly', 'read-only, your role is unchanged')}
              </span>
            </span>
            <button onClick={stopViewAs} className="rounded-md border border-warning/40 px-2.5 py-1 font-medium hover:bg-warning/10">
              {t('crm.viewAs.back', 'Back to Admin Mode')}
            </button>
          </div>
        )}

        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="rounded-md p-2 text-text-muted hover:bg-surface-3 hover:text-text lg:hidden" aria-label={t('ui.menu', 'Menu')}>
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 truncate font-mono text-xs text-text-subtle">
              <span className="text-text-muted">CRM</span>
              {active && <span> / {label(active)}</span>}
            </div>
            {adminMode && (
              <span className="hidden shrink-0 items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary sm:inline-flex">
                Super admin <span className="text-primary/60">|</span> {t('crm.adminMode', 'Admin Mode')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {(isSuperAdmin || isAdmin) && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-2 text-sm text-text-muted transition-colors hover:bg-surface-3 hover:text-text"
                title={t('crm.switchToAdmin', 'Switch to Admin Panel')}
              >
                <ArrowLeftRight className="h-4 w-4" />
                <span className="hidden md:inline">{t('admin.panel', 'Admin Panel')}</span>
              </Link>
            )}
            <Link to="/profile" className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-surface-3" title={t('account.profile.title', 'My profile')}>
              <Avatar name={user?.name} email={user?.email} />
              <span className="hidden text-right md:block">
                <span className="block max-w-[160px] truncate text-sm font-medium text-text">{user?.name || user?.email}</span>
                <span className="block text-xs text-text-subtle">
                  {me?.superAdmin || isSuperAdmin ? 'Super admin' : me?.memberships[0]?.roleName ?? ''}
                </span>
              </span>
            </Link>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="rounded-md p-2 text-text-muted transition-colors hover:bg-surface-3 hover:text-text"
              aria-label={t('ui.logout', 'Logout')}
              title={t('ui.logout', 'Logout')}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main key={viewingAs?.id ?? 'self'} className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
