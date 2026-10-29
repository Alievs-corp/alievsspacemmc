import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, CalendarClock, FolderKanban, ListChecks, Users, Building2, BarChart3, Clapperboard, Bell } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useCrm } from '@/contexts/CrmContext';
import { crm, PLATFORMS, type Dashboard } from '@/lib/crm';
import { ErrorState, LoadingRows, PageHeader, RefreshButton, errorMessage, formatDate } from '@/components/admin/ui';
import { Avatar, PLATFORM_META, PriorityBadge, StatCard, TaskStatusBadge, isOverdue, projectStatusLabel } from '@/components/crm/ui';
import { cn } from '@/lib/utils';

export function CrmDashboard({ global = false }: { global?: boolean }) {
  const { t } = useI18n();
  const { me, adminMode, can } = useCrm();
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await crm.dashboard());
    } catch (err) {
      setError(errorMessage(err, t('crm.dashboard.loadFailed', 'Could not load the dashboard.')));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { void load(); }, [load]);

  const title = global ? t('crm.nav.global', 'Global Dashboard') : t('crm.nav.dashboard', 'Dashboard');
  const subtitle = global
    ? t('crm.dashboard.globalSubtitle', 'Every company, project and team member across the CRM.')
    : adminMode
      ? t('crm.dashboard.adminSubtitle', 'Admin Mode: you see all companies and projects.')
      : t('crm.dashboard.subtitle', 'Your projects and tasks, limited to what you have access to.');

  if (error) return <ErrorState message={error} onRetry={load} />;

  const tasks = data?.tasks;
  const openTasks = tasks ? (tasks.byStatus.todo ?? 0) + (tasks.byStatus.in_progress ?? 0) + (tasks.byStatus.review ?? 0) : 0;

  return (
    <div className="space-y-6">
      <PageHeader title={title} subtitle={subtitle} actions={<RefreshButton onClick={load} loading={loading} />} />

      {!data ? (
        <LoadingRows rows={4} />
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label={t('crm.dashboard.activeProjects', 'Active projects')} value={data.projects.byStatus.active ?? 0}
              hint={`${data.projects.total} ${t('crm.dashboard.total', 'total')}`} icon={<FolderKanban className="h-4 w-4" />} />
            <StatCard label={t('crm.dashboard.openTasks', 'Open tasks')} value={openTasks}
              hint={`${tasks!.mine} ${t('crm.dashboard.assignedToMe', 'assigned to me')}`} icon={<ListChecks className="h-4 w-4" />} />
            <StatCard label={t('crm.dashboard.overdue', 'Overdue')} value={tasks!.overdue} tone={tasks!.overdue ? 'danger' : undefined}
              hint={`${tasks!.dueThisWeek} ${t('crm.dashboard.dueThisWeek', 'due this week')}`} icon={<AlertTriangle className="h-4 w-4" />} />
            <StatCard label={adminMode ? t('crm.dashboard.companies', 'Companies') : t('crm.dashboard.team', 'Team members')}
              value={adminMode ? data.companies : data.members}
              hint={adminMode ? `${data.members} ${t('crm.dashboard.membersShort', 'people with access')}` : undefined}
              icon={adminMode ? <Building2 className="h-4 w-4" /> : <Users className="h-4 w-4" />} />
          </section>

          {global && data.companyBreakdown && (
            <section className="card overflow-hidden p-0">
              <h2 className="border-b border-border px-4 py-3 font-display font-semibold text-text">{t('crm.dashboard.byCompany', 'By company')}</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-surface-2 text-xs uppercase tracking-wider text-text-subtle">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">{t('crm.company', 'Company')}</th>
                      <th className="px-4 py-2.5 text-right font-medium">{t('crm.nav.projects', 'Projects')}</th>
                      <th className="px-4 py-2.5 text-right font-medium">{t('crm.nav.team', 'Team')}</th>
                      <th className="px-4 py-2.5 text-right font-medium">{t('crm.dashboard.openTasks', 'Open tasks')}</th>
                      <th className="px-4 py-2.5 text-right font-medium">{t('crm.dashboard.overdue', 'Overdue')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.companyBreakdown.length === 0 && (
                      <tr><td colSpan={5} className="px-4 py-6 text-center text-text-muted">{t('crm.companies.empty', 'No companies yet')}</td></tr>
                    )}
                    {data.companyBreakdown.map((c) => (
                      <tr key={c.id} className="hover:bg-surface-2">
                        <td className="px-4 py-2.5">
                          <Link to={`/crm/companies/${c.id}`} className="font-medium text-text hover:text-primary">{c.name}</Link>
                          {c.status === 'archived' && <span className="ml-2 text-xs text-text-subtle">{projectStatusLabel('archived')}</span>}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums">{c.projects}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums">{c.members}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums">{c.openTasks}</td>
                        <td className={cn('px-4 py-2.5 text-right tabular-nums', c.overdue > 0 && 'font-medium text-danger')}>{c.overdue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <section className="card min-w-0 p-0 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h2 className="flex items-center gap-2 font-display font-semibold text-text"><CalendarClock className="h-4 w-4 text-text-subtle" /> {t('crm.dashboard.deadlines', 'Upcoming deadlines')}</h2>
                <Link to="/crm/tasks" className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-hover">{t('crm.dashboard.allTasks', 'All tasks')} <ArrowRight className="h-3.5 w-3.5" /></Link>
              </div>
              {data.upcoming.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-text-muted">{t('crm.dashboard.noDeadlines', 'No open tasks with a deadline.')}</p>
              ) : (
                <ul className="divide-y divide-border">
                  {data.upcoming.map((task) => (
                    <li key={task.id}>
                      <Link to={`/crm/tasks?task=${task.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-text">{task.title}</p>
                          <p className="truncate text-xs text-text-subtle">{task.projectName}</p>
                        </div>
                        <PriorityBadge priority={task.priority} />
                        <span className="hidden sm:inline"><TaskStatusBadge status={task.status} /></span>
                        <span className={cn('w-24 shrink-0 text-right text-xs tabular-nums', isOverdue(task.dueAt, task.status) ? 'font-medium text-danger' : 'text-text-muted')}>
                          {formatDate(task.dueAt)}
                        </span>
                        {task.assignee && <Avatar size="sm" name={task.assignee.name} email={task.assignee.email} />}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="card min-w-0 space-y-4 p-4">
              <h2 className="font-display font-semibold text-text">{t('crm.dashboard.projects', 'Projects overview')}</h2>
              <dl className="space-y-2 text-sm">
                {(['active', 'paused', 'completed', 'archived'] as const).map((s) => (
                  <div key={s} className="flex justify-between">
                    <dt className="text-text-muted">{projectStatusLabel(s)}</dt>
                    <dd className="tabular-nums text-text">{data.projects.byStatus[s] ?? 0}</dd>
                  </div>
                ))}
              </dl>
              <div>
                <p className="mb-2 text-sm text-text-muted">{t('crm.dashboard.networks', 'Networks in active projects')}</p>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.filter((p) => !me || me.platforms.includes(p)).map((p) => {
                    const m = PLATFORM_META[p];
                    return (
                      <div key={p} className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-sm">
                        <m.Icon className={cn('h-4 w-4', m.color)} />
                        <span className="min-w-0 flex-1 truncate text-text-muted">{m.label}</span>
                        <span className="tabular-nums text-text">{data.platforms[p] ?? 0}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          <ContentOverview stats={data.content} />

          {/* Social metrics need connected accounts: shown as empty, never with made-up numbers. */}
          <section className="grid gap-3 md:grid-cols-2">
            {[
              { icon: BarChart3, title: t('crm.dashboard.analytics', 'Analytics overview'), body: t('crm.dashboard.analyticsSoon', 'Reach, views and engagement appear once social accounts are connected through their official APIs.'),
                link: can('analytics.view') ? { to: '/crm/analytics', label: t('crm.dashboard.openAnalytics', 'Content output, approvals and workload') } : undefined },
              { icon: Bell, title: t('crm.nav.notifications', 'Notifications'), body: t('crm.dashboard.notificationsLive', 'Assignments, approval requests, publishing changes and deadline reminders arrive in your notifications.'),
                link: { to: '/crm/notifications', label: t('crm.dashboard.openNotifications', 'Open notifications') } },
            ].map((b) => (
              <div key={b.title} className="rounded-xl border border-dashed border-border p-4">
                <p className="flex items-center gap-2 font-medium text-text"><b.icon className="h-4 w-4 text-text-subtle" /> {b.title}</p>
                <p className="mt-1 text-sm text-text-muted">{b.body}</p>
                {b.link && (
                  <Link to={b.link.to} className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:text-primary-hover">
                    {b.link.label} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
}

function ContentOverview({ stats }: { stats: Dashboard['content'] }) {
  const { t } = useI18n();
  const { can } = useCrm();
  const drafts = (stats.byStatus.idea ?? 0) + (stats.byStatus.in_progress ?? 0) + (stats.byStatus.changes_requested ?? 0) + (stats.byStatus.rejected ?? 0);
  const rows: Array<{ label: string; value: number; to: string; tone?: string }> = [
    { label: t('crm.dashboard.postsToday', 'Planned today'), value: stats.today, to: '/crm/calendar' },
    { label: t('crm.dashboard.postsWeek', 'Next 7 days'), value: stats.thisWeek, to: '/crm/calendar' },
    { label: t('crm.dashboard.drafts', 'In work'), value: drafts, to: '/crm/studio' },
    { label: t('crm.cstatus.ready_for_review', 'Ready for Review'), value: stats.byStatus.ready_for_review ?? 0, to: '/crm/approvals' },
    { label: t('crm.cstatus.approved', 'Approved'), value: stats.byStatus.approved ?? 0, to: '/crm/studio' },
    { label: t('crm.cstatus.scheduled', 'Scheduled'), value: stats.scheduled, to: '/crm/calendar' },
    { label: t('crm.dashboard.published30', 'Published, 30 days'), value: stats.publishedLast30Days, to: '/crm/calendar' },
    { label: t('crm.cstatus.failed', 'Failed'), value: stats.failed, to: '/crm/calendar', tone: stats.failed ? 'text-danger' : undefined },
  ];
  return (
    <section className="card p-0">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h2 className="flex items-center gap-2 font-display font-semibold text-text"><Clapperboard className="h-4 w-4 text-text-subtle" /> {t('crm.dashboard.content', 'Content overview')}</h2>
        {can('content.approve') && stats.pendingMyApproval > 0 && (
          <Link to="/crm/approvals" className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2.5 py-1 text-xs font-medium text-warning">
            {stats.pendingMyApproval} {t('crm.dashboard.waitingForYou', 'waiting for your approval')} <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 [&>*]:border-b [&>*]:border-border">
        {rows.map((r) => (
          <Link key={r.label} to={r.to} className="px-4 py-3 hover:bg-surface-2">
            <p className="text-xs text-text-muted">{r.label}</p>
            <p className={cn('font-display text-xl font-bold tabular-nums text-text', r.tone)}>{r.value}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
