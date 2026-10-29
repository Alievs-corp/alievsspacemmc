import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { api, type Inquiry, type SystemOverview, toCmsLocale } from '@/lib/api';
import { useState, useEffect, useCallback } from 'react';
import {
  Briefcase, FolderKanban, FileText, GraduationCap, Users, Mail, ArrowRight, Inbox,
  UserPlus, Activity, ShieldCheck, Ban, FileUser, ToggleRight,
} from 'lucide-react';
import { PageHeader, RefreshButton, StatusBadge, formatDate } from '@/components/admin/ui';

interface ContentStats {
  services: number; projects: number; blog: number; careers: number; employees: number;
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function Kpi({ icon: Ico, value, label, to, loading }: {
  icon: typeof Users; value: number | string | undefined; label: string; to?: string; loading: boolean;
}) {
  const body = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-3 text-primary">
        <Ico className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-2xl font-bold tabular-nums leading-none text-text">
          {loading ? <span className="inline-block h-6 w-10 animate-pulse rounded bg-surface-3 align-middle" /> : value ?? '—'}
        </span>
        <span className="mt-1 block truncate text-sm text-text-muted">{label}</span>
      </span>
    </>
  );
  return to ? (
    <Link to={to} className="card card-interactive flex items-center gap-4 p-4">{body}</Link>
  ) : (
    <div className="card flex items-center gap-4 p-4">{body}</div>
  );
}

export function AdminDashboard() {
  const { user, hasPermission, isSuperAdmin } = useAuth();
  const { locale, t } = useI18n();
  const [overview, setOverview] = useState<SystemOverview | null>(null);
  const [content, setContent] = useState<ContentStats | null>(null);
  const [recent, setRecent] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const canContent = hasPermission('content');
  const canInquiries = hasPermission('inquiries');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const cms = toCmsLocale(locale);
      const [ov, stats, inquiries] = await Promise.allSettled([
        api.admin.getOverview(),
        canContent
          ? Promise.all([api.getServices(cms), api.getProjects(cms), api.getBlogPosts(cms), api.getCareers(cms), api.getEmployees(cms)])
          : Promise.resolve(null),
        canInquiries ? api.admin.getInquiries() : Promise.resolve([] as Inquiry[]),
      ]);
      if (ov.status === 'fulfilled') setOverview(ov.value);
      if (stats.status === 'fulfilled' && stats.value) {
        const [services, projects, blog, careers, employees] = stats.value;
        setContent({ services: services.length, projects: projects.length, blog: blog.length, careers: careers.length, employees: employees.length });
      }
      if (inquiries.status === 'fulfilled') setRecent(inquiries.value.slice(0, 5));
    } finally {
      setLoading(false);
    }
  }, [locale, canContent, canInquiries]);

  useEffect(() => { load(); }, [load]);

  const u = overview?.users;
  const modules = overview?.modules;
  const moduleRows = modules ? [
    { key: 'registration', on: modules.registrationEnabled, label: t('panel.modules.registration', 'User registration') },
    { key: 'inquiries', on: modules.inquiriesEnabled, label: t('panel.modules.inquiries', 'Contact form') },
    { key: 'applications', on: modules.jobApplicationsEnabled, label: t('panel.modules.applications', 'Job applications') },
    { key: 'academy', on: modules.academyRegistrationEnabled, label: t('panel.modules.academy', 'Academy registration') },
  ] : [];

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('admin.overview', 'Overview')}
        subtitle={`${t('admin.welcome', 'Welcome')}${user?.name ? `, ${user.name}` : ''}. ${t('panel.dashboard.subtitle', 'Users, activity and the state of the system at a glance.')}`}
        actions={<RefreshButton onClick={load} loading={loading} />}
      />

      {/* Users & activity */}
      {(u || loading) && hasPermission('users.view') && (
        <section className="space-y-3">
          <h2 className="font-mono text-xs uppercase tracking-wider text-text-subtle">{t('panel.dashboard.users', 'Users & activity')}</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Kpi icon={Users} value={u?.total} label={t('panel.dashboard.totalUsers', 'Registered users')} to="/admin/users" loading={loading} />
            <Kpi icon={UserPlus} value={u?.newLast7Days} label={t('panel.dashboard.new7', 'New in 7 days')} loading={loading} />
            <Kpi icon={Activity} value={u?.activeLast7Days} label={t('panel.dashboard.active7', 'Signed in, 7 days')} loading={loading} />
            <Kpi icon={ShieldCheck} value={u ? u.byRole.admin + u.byRole.super_admin : undefined} label={t('panel.dashboard.admins', 'Administrators')} to={isSuperAdmin ? '/admin/admins' : undefined} loading={loading} />
          </div>
          {u && u.blocked > 0 && (
            <p className="flex items-center gap-1.5 text-sm text-text-muted">
              <Ban className="h-4 w-4 text-danger" /> {u.blocked} {t('panel.dashboard.blockedAccounts', 'blocked account(s)')}
            </p>
          )}
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Services */}
        <section className="card p-5">
          <h2 className="mb-4 font-display text-lg font-semibold text-text">{t('panel.dashboard.services', 'System status')}</h2>
          <ul className="divide-y divide-border">
            {(overview?.services ?? []).map((s) => (
              <li key={s.name} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-medium text-text">{s.name}</p>
                  {s.message && <p className="truncate text-xs text-text-subtle" title={s.message}>{s.message}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {s.latencyMs > 0 && <span className="font-mono text-xs text-text-subtle">{s.latencyMs} ms</span>}
                  <StatusBadge status={s.status} />
                </div>
              </li>
            ))}
            {loading && !overview && [0, 1, 2].map((i) => <li key={i} className="my-2 h-10 animate-pulse rounded bg-surface-3/60" />)}
          </ul>
          {overview && (
            <p className="mt-3 font-mono text-xs text-text-subtle">
              {t('panel.dashboard.uptime', 'Uptime')} {formatUptime(overview.requests.uptimeSeconds)} · {overview.requests.total} {t('panel.dashboard.requests', 'requests')} · {overview.requests.failed} {t('panel.dashboard.errors', 'errors')}
            </p>
          )}
        </section>

        {/* Modules & submissions */}
        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-text">{t('panel.dashboard.modules', 'Modules')}</h2>
            {isSuperAdmin && (
              <Link to="/admin/system" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover">
                {t('panel.dashboard.manage', 'Manage')} <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          <ul className="divide-y divide-border">
            {moduleRows.map((m) => (
              <li key={m.key} className="flex items-center justify-between gap-3 py-3">
                <span className="flex items-center gap-2 text-text"><ToggleRight className="h-4 w-4 text-text-subtle" /> {m.label}</span>
                <StatusBadge status={m.on ? 'ok' : 'disabled'} label={m.on ? t('panel.modules.on', 'On') : t('panel.modules.off', 'Off')} />
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            {[
              { v: overview?.counts.inquiries, l: t('admin.inquiries', 'Inquiries'), to: '/admin/inquiries' },
              { v: overview?.counts.applications, l: t('panel.nav.applications', 'Applications'), to: '/admin/applications' },
              { v: overview?.counts.academyRegistrations, l: t('panel.dashboard.academy', 'Academy'), to: undefined },
            ].filter((c) => c.v !== undefined).map((c) => {
              const inner = (
                <>
                  <span className="block font-display text-xl font-bold tabular-nums text-text">{c.v}</span>
                  <span className="block truncate text-xs text-text-muted">{c.l}</span>
                </>
              );
              return c.to
                ? <Link key={c.l} to={c.to} className="rounded-lg bg-surface-2 p-3 hover:bg-surface-3">{inner}</Link>
                : <div key={c.l} className="rounded-lg bg-surface-2 p-3">{inner}</div>;
            })}
          </div>
        </section>
      </div>

      {/* Site content */}
      {canContent && (
        <section className="space-y-3">
          <h2 className="font-mono text-xs uppercase tracking-wider text-text-subtle">{t('panel.dashboard.content', 'Site content')}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            <Kpi icon={Briefcase} value={content?.services} label={t('admin.services', 'Services')} to="/admin/services" loading={loading} />
            <Kpi icon={FolderKanban} value={content?.projects} label={t('admin.projects', 'Projects')} to="/admin/projects" loading={loading} />
            <Kpi icon={FileText} value={content?.blog} label={t('admin.blog', 'Blog')} to="/admin/blog" loading={loading} />
            <Kpi icon={GraduationCap} value={content?.careers} label={t('admin.careers', 'Careers')} to="/admin/careers" loading={loading} />
            <Kpi icon={FileUser} value={content?.employees} label={t('admin.team', 'Team')} to="/admin/careers" loading={loading} />
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {canInquiries && (
          <section className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-text">{t('admin.recentInquiries', 'Recent inquiries')}</h2>
              <Link to="/admin/inquiries" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover">
                {t('admin.viewAll', 'View all')} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {recent.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                <Inbox className="h-9 w-9 text-text-subtle" />
                <p className="text-text-muted">{t('admin.noInquiries', 'No inquiries yet')}</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recent.map((q, i) => (
                  <li key={q.email || i} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-text">{q.name || t('admin.unknown', 'Unknown')}</p>
                      <p className="truncate text-sm text-text-subtle">{q.email}</p>
                    </div>
                    <Mail className="h-4 w-4 shrink-0 text-text-subtle" />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {overview?.recentActivity && (
          <section className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-text">{t('panel.dashboard.activity', 'Recent admin activity')}</h2>
              <Link to="/admin/audit" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover">
                {t('admin.viewAll', 'View all')} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {overview.recentActivity.length === 0 ? (
              <p className="py-8 text-center text-text-muted">{t('panel.audit.empty', 'No recorded actions yet')}</p>
            ) : (
              <ul className="divide-y divide-border">
                {overview.recentActivity.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs text-text">{a.action}</p>
                      <p className="truncate text-xs text-text-subtle">{a.actorEmail} · {a.details || a.targetType}</p>
                    </div>
                    <span className="shrink-0 text-xs text-text-subtle">{formatDate(a.createdAt, true)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
