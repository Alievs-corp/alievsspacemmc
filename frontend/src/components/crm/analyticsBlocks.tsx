/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react';
import { AlertTriangle, CheckCheck, Clock, Link2, ListChecks, Send, Users } from 'lucide-react';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { PLATFORMS, type EffectiveStatus, type Platform } from '@/lib/crm';
import {
  PERIOD_PRESETS, presetRange, type AnalyticsData, type AnalyticsFilter, type AnalyticsOption, type Bucket, type PeriodPreset,
} from '@/lib/crmAnalytics';
import { Avatar, PLATFORM_META, StatCard, plural } from './ui';
import { CONTENT_STATUS_DOT, contentStatusLabel, stepLabel } from './content';
import { ChartCard, ColumnChart, DataTable, Legend, LineChart, SplitBar, bucketLabel, type Series } from './charts';

/** Analytics sections shared by the Analytics and Reports pages. */

/** Categorical slot per platform, fixed: color follows the platform. */
export const PLATFORM_SERIES: Record<Platform, string> = {
  instagram: 'var(--series-1)',
  tiktok: 'var(--series-2)',
  youtube: 'var(--series-3)',
  linkedin: 'var(--series-4)',
};

export function percent(v: number | null | undefined): string {
  return v === null || v === undefined ? '—' : `${Math.round(v * 100)}%`;
}

export function hours(v: number | null | undefined): string {
  if (v === null || v === undefined) return '—';
  if (v < 1) return `${Math.max(1, Math.round(v * 60))} ${t('crm.analytics.minutesShort', 'min')}`;
  if (v < 48) return `${Math.round(v * 10) / 10} ${t('crm.analytics.hoursShort', 'h')}`;
  return `${Math.round((v / 24) * 10) / 10} ${t('crm.analytics.daysShort', 'd')}`;
}

export function presetLabel(p: PeriodPreset): string {
  return {
    '7d': t('crm.analytics.preset.7d', 'Last 7 days'),
    '30d': t('crm.analytics.preset.30d', 'Last 30 days'),
    '90d': t('crm.analytics.preset.90d', 'Last 90 days'),
    month: t('crm.analytics.preset.month', 'This month'),
    lastMonth: t('crm.analytics.preset.lastMonth', 'Last month'),
    quarter: t('crm.analytics.preset.quarter', 'This quarter'),
    year: t('crm.analytics.preset.year', 'This year'),
    custom: t('crm.analytics.preset.custom', 'Custom range'),
  }[p];
}

export interface PeriodState { preset: PeriodPreset; from: string; to: string; bucket: Bucket | '' }

export function initialPeriod(): PeriodState {
  return { preset: '30d', ...presetRange('30d'), bucket: '' };
}

/** Filter row: period first, then grouping, company, project, platform. */
export function AnalyticsFilters({ period, onPeriod, filter, onFilter, options, requireSubject }: {
  period: PeriodState; onPeriod: (p: PeriodState) => void;
  filter: Pick<AnalyticsFilter, 'companyId' | 'projectId' | 'platform'>; onFilter: (f: Pick<AnalyticsFilter, 'companyId' | 'projectId' | 'platform'>) => void;
  options: { companies: AnalyticsOption[]; projects: AnalyticsOption[]; platforms: Platform[] } | null;
  /** Reports: a company is always chosen, so "all companies" is not offered. */
  requireSubject?: boolean;
}) {
  const projects = (options?.projects ?? []).filter((p) => !filter.companyId || p.companyId === filter.companyId);
  const sel = 'field w-full py-2 text-sm sm:w-auto';
  return (
    <div className="crm-no-print grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
      <select
        value={period.preset} className={cn(sel, 'col-span-2 sm:col-span-1')} aria-label={t('crm.analytics.period', 'Period')}
        onChange={(e) => {
          const preset = e.target.value as PeriodPreset;
          onPeriod(preset === 'custom' ? { ...period, preset } : { ...period, preset, ...presetRange(preset) });
        }}
      >
        {[...PERIOD_PRESETS, 'custom' as const].map((p) => <option key={p} value={p}>{presetLabel(p)}</option>)}
      </select>
      {period.preset === 'custom' && (
        <>
          <input type="date" value={period.from} max={period.to} className={sel} aria-label={t('crm.analytics.from', 'From')}
            onChange={(e) => e.target.value && onPeriod({ ...period, from: e.target.value })} />
          <input type="date" value={period.to} min={period.from} className={sel} aria-label={t('crm.analytics.to', 'To')}
            onChange={(e) => e.target.value && onPeriod({ ...period, to: e.target.value })} />
        </>
      )}
      <select value={period.bucket} onChange={(e) => onPeriod({ ...period, bucket: e.target.value as Bucket | '' })} className={sel} aria-label={t('crm.analytics.groupBy', 'Group by')}>
        <option value="">{t('crm.analytics.bucket.auto', 'Auto grouping')}</option>
        <option value="day">{t('crm.analytics.bucket.day', 'By day')}</option>
        <option value="week">{t('crm.analytics.bucket.week', 'By week')}</option>
        <option value="month">{t('crm.analytics.bucket.month', 'By month')}</option>
      </select>
      {(options?.companies.length ?? 0) > (requireSubject ? 0 : 1) && (
        <select value={filter.companyId ?? ''} onChange={(e) => onFilter({ ...filter, companyId: e.target.value, projectId: '' })} className={sel} aria-label={t('crm.company', 'Company')}>
          {!requireSubject && <option value="">{t('crm.analytics.allCompanies', 'All companies')}</option>}
          {options!.companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      )}
      <select value={filter.projectId ?? ''} onChange={(e) => onFilter({ ...filter, projectId: e.target.value })} className={sel} aria-label={t('crm.project', 'Project')}>
        <option value="">{requireSubject ? t('crm.analytics.wholeCompany', 'Whole company') : t('crm.analytics.allProjects', 'All projects')}</option>
        {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <select value={filter.platform ?? ''} onChange={(e) => onFilter({ ...filter, platform: e.target.value as Platform | '' })} className={sel} aria-label={t('crm.fields.platform', 'Platform')}>
        <option value="">{t('crm.analytics.allPlatforms', 'All platforms')}</option>
        {(options?.platforms ?? []).map((p) => <option key={p} value={p}>{PLATFORM_META[p].label}</option>)}
      </select>
    </div>
  );
}

/** Headline numbers of the period. */
export function KpiRow({ data }: { data: AnalyticsData }) {
  const c = data.content.totals;
  const dated = c.onTime + c.late;
  const a = data.approvals;
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard label={t('crm.analytics.published', 'Published')} value={c.published} icon={<Send className="h-4 w-4" />}
        hint={`${c.planned} ${t('crm.analytics.plannedInPeriod', 'planned in the period')}`} />
      <StatCard label={t('crm.analytics.onTime', 'On time')} value={dated ? percent(c.onTime / dated) : '—'} icon={<Clock className="h-4 w-4" />}
        hint={dated ? `${c.late} ${t('crm.analytics.lateShort', 'late')}` : t('crm.analytics.noDatedPublished', 'nothing published with a planned date')} />
      <StatCard label={t('crm.analytics.missed', 'Missed')} value={c.missed} tone={c.missed ? 'warning' : undefined} icon={<AlertTriangle className="h-4 w-4" />}
        hint={t('crm.analytics.missedHint', 'date passed, not published')} />
      <StatCard label={t('crm.analytics.timeToApprove', 'Time to approval')} value={hours(a.medianHoursToApprove)} icon={<CheckCheck className="h-4 w-4" />}
        hint={a.approved ? `${t('crm.analytics.median', 'median')} · ${a.approved} ${t('crm.analytics.approvedShort', 'approved')}` : t('crm.analytics.noApprovals', 'no approvals in the period')} />
    </section>
  );
}

function bucketLabels(data: AnalyticsData, starts: string[]) {
  return {
    labels: starts.map((s) => bucketLabel(s, data.period.bucket)),
    longLabels: starts.map((s) => bucketLabel(s, data.period.bucket, true)),
  };
}

export function OutputChart({ data }: { data: AnalyticsData }) {
  const b = data.content.buckets;
  const { labels, longLabels } = bucketLabels(data, b.map((x) => x.start));
  const platforms = data.social.platforms;
  const series: Series[] = platforms.map((p) => ({
    key: p, label: PLATFORM_META[p].label, color: PLATFORM_SERIES[p], values: b.map((x) => x.byPlatform[p] ?? 0),
  }));
  const planned: Series = { key: 'planned', label: t('crm.analytics.planned', 'Planned'), color: 'var(--viz-planned)', values: b.map((x) => x.planned) };
  return (
    <ChartCard
      title={t('crm.analytics.outputTitle', 'Publications over time')}
      subtitle={t('crm.analytics.outputSubtitle', 'Published per platform, and how many were planned for the same dates.')}
      legend={<Legend items={[...series.map((s) => ({ label: s.label, color: s.color })), { label: planned.label, color: planned.color, line: true }]} />}
      chart={<ColumnChart labels={labels} longLabels={longLabels} series={series} line={planned} emptyText={t('crm.analytics.noContent', 'Nothing planned or published in this period.')} />}
      table={
        <DataTable
          head={[t('crm.analytics.periodCol', 'Period'), planned.label, ...series.map((s) => s.label), t('crm.analytics.published', 'Published')]}
          rows={b.map((x, i) => [longLabels[i], x.planned, ...series.map((s) => s.values[i]), x.published])}
        />
      }
    />
  );
}

export function PlatformBreakdown({ data }: { data: AnalyticsData }) {
  const parts = (p: AnalyticsData['content']['totals']) => [
    { key: 'onTime', label: t('crm.analytics.onTime', 'On time'), value: p.onTime, color: 'var(--viz-good)' },
    { key: 'late', label: t('crm.analytics.late', 'Late'), value: p.late, color: 'var(--viz-warn)' },
    { key: 'unplanned', label: t('crm.analytics.unplanned', 'Without planned date'), value: p.unplanned, color: 'var(--viz-neutral)' },
  ];
  const rows = data.content.byPlatform;
  const statuses = Object.entries(data.content.byStatus).filter(([, n]) => (n ?? 0) > 0) as Array<[EffectiveStatus, number]>;
  return (
    <ChartCard
      title={t('crm.analytics.byPlatform', 'By platform')}
      subtitle={t('crm.analytics.byPlatformSubtitle', 'Published on time (within an hour of the planned time), late, or without a date.')}
      legend={<Legend items={parts(data.content.totals).map((p) => ({ label: p.label, color: p.color }))} />}
      chart={
        <div className="space-y-4">
          {rows.length === 0 && <p className="py-6 text-center text-sm text-text-muted">{t('crm.analytics.noPlatforms', 'No platforms available to you here.')}</p>}
          <ul className="space-y-3">
            {rows.map((p) => {
              const m = PLATFORM_META[p.platform as Platform];
              return (
                <li key={p.platform} className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm">
                    <m.Icon className={cn('h-4 w-4 shrink-0', m.color)} />
                    <span className="min-w-0 flex-1 truncate text-text">{m.label}</span>
                    <span className="tabular-nums text-text"><b>{p.published}</b><span className="text-text-subtle"> / {p.planned} {t('crm.analytics.plannedShort', 'planned')}</span></span>
                  </div>
                  <SplitBar parts={parts(p)} total={p.published} label={m.label} />
                  {(p.missed > 0 || p.failed > 0) && (
                    <p className="text-xs text-warning">
                      {p.missed > 0 && `${p.missed} ${t('crm.analytics.missedShort', 'missed')}`}
                      {p.missed > 0 && p.failed > 0 && ' · '}
                      {p.failed > 0 && `${p.failed} ${t('crm.analytics.failedShort', 'failed')}`}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
          {statuses.length > 0 && (
            <div className="border-t border-border pt-3">
              <p className="mb-2 text-xs text-text-subtle">{t('crm.analytics.byStatus', 'Status of these publications')}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
                {statuses.map(([s, n]) => (
                  <span key={s} className="inline-flex items-center gap-1.5 text-text-muted">
                    <span className={cn('h-2 w-2 rounded-full', CONTENT_STATUS_DOT[s])} aria-hidden />
                    {contentStatusLabel(s)} <b className="tabular-nums text-text">{n}</b>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      }
      table={
        <DataTable
          head={[t('crm.fields.platform', 'Platform'), t('crm.analytics.planned', 'Planned'), t('crm.analytics.published', 'Published'),
            t('crm.analytics.onTime', 'On time'), t('crm.analytics.late', 'Late'), t('crm.analytics.unplanned', 'Without planned date'),
            t('crm.analytics.missed', 'Missed'), t('crm.cstatus.failed', 'Failed')]}
          rows={[...rows, data.content.totals].map((p) => [
            p.platform === 'all' ? t('crm.analytics.total', 'Total') : PLATFORM_META[p.platform].label,
            p.planned, p.published, p.onTime, p.late, p.unplanned, p.missed, p.failed,
          ])}
        />
      }
    />
  );
}

function Metric({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs leading-snug text-text-muted">{label}</p>
      <p className="font-display text-lg font-bold tabular-nums text-text">{value}</p>
      {hint && <p className="text-xs text-text-subtle">{hint}</p>}
    </div>
  );
}

export function ApprovalsBlock({ data }: { data: AnalyticsData }) {
  const a = data.approvals;
  const maxWaiting = Math.max(1, ...a.waiting.map((w) => w.items));
  return (
    <section className="card crm-viz min-w-0 space-y-4 p-4">
      <div>
        <h2 className="flex items-center gap-2 font-display font-semibold text-text"><CheckCheck className="h-4 w-4 text-text-subtle" /> {t('crm.analytics.approvalsTitle', 'Approvals')}</h2>
        <p className="text-xs text-text-subtle">{t('crm.analytics.approvalsSubtitle', 'Rounds submitted in the period and how they ended.')}</p>
      </div>
      {a.submitted === 0 ? (
        <p className="text-sm text-text-muted">{t('crm.analytics.noSubmissions', 'Nothing was submitted for approval in this period.')}</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
          <Metric label={t('crm.analytics.submitted', 'Submitted')} value={a.submitted} hint={`${a.items} ${plural(a.items, 'items', 'item', 'items')}`} />
          <Metric label={t('crm.analytics.avgToApprove', 'Average to approval')} value={hours(a.avgHoursToApprove)} hint={`${t('crm.analytics.median', 'median')} ${hours(a.medianHoursToApprove)}`} />
          <Metric label={t('crm.analytics.rounds', 'Rounds to approval')} value={a.avgRoundsToApprove ?? '—'} hint={t('crm.analytics.roundsHint', '1 = approved first time')} />
          <Metric label={t('crm.cstatus.approved', 'Approved')} value={a.approved} />
          <Metric label={t('crm.analytics.changesRate', 'Changes requested')} value={percent(a.changesRate)} hint={`${a.changesRequested}`} />
          <Metric label={t('crm.analytics.rejectionRate', 'Rejected')} value={percent(a.rejectionRate)} hint={`${a.rejected}`} />
        </div>
      )}
      <div className="border-t border-border pt-3">
        <p className="mb-2 text-sm font-medium text-text">{t('crm.analytics.waitingNow', 'Waiting now')}</p>
        {a.waiting.length === 0 ? (
          <p className="text-sm text-text-muted">{t('crm.analytics.nothingWaiting', 'Nothing is waiting for approval.')}</p>
        ) : (
          <ul className="space-y-2">
            {a.waiting.map((w) => (
              <li key={w.step} className="text-sm">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="min-w-0 truncate text-text-muted">{w.step + 1}. {stepLabel(w.name)}</span>
                  <span className="shrink-0 tabular-nums text-text"><b>{w.items}</b> <span className="text-xs text-text-subtle">· {t('crm.analytics.oldest', 'oldest')} {hours(w.oldestHours)}</span></span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-surface-3">
                  <div className="h-full rounded-full" style={{ width: `${(w.items / maxWaiting) * 100}%`, background: 'var(--series-1)' }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export function TeamBlock({ data }: { data: AnalyticsData }) {
  const team = data.team;
  if (!team.available) {
    return (
      <section className="card p-4">
        <h2 className="flex items-center gap-2 font-display font-semibold text-text"><Users className="h-4 w-4 text-text-subtle" /> {t('crm.analytics.teamTitle', 'Team workload')}</h2>
        <p className="mt-1 text-sm text-text-muted">{t('crm.analytics.teamUnavailable', 'Workload by person is shown to people who can view the tasks of these projects.')}</p>
      </section>
    );
  }
  const b = team.buckets;
  const { labels, longLabels } = bucketLabels(data, b.map((x) => x.start));
  const series: Series[] = [
    { key: 'created', label: t('crm.analytics.tasksCreated', 'Created'), color: 'var(--series-1)', values: b.map((x) => x.created) },
    { key: 'completed', label: t('crm.analytics.tasksCompleted', 'Completed'), color: 'var(--series-2)', values: b.map((x) => x.completed) },
  ];
  const name = (m: AnalyticsData['team']['members'][number]) => m.user ? (m.user.name || m.user.email) : t('crm.unassigned', 'Unassigned');
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard
        title={t('crm.analytics.taskFlow', 'Tasks created and completed')}
        subtitle={`${team.totals.completed} ${t('crm.analytics.completedInPeriod', 'completed in the period')} · ${team.totals.open} ${t('crm.analytics.openNow', 'open now')}`}
        legend={<Legend items={series.map((s) => ({ label: s.label, color: s.color, line: true }))} />}
        chart={<LineChart labels={labels} longLabels={longLabels} series={series} emptyText={t('crm.analytics.noTasks', 'No tasks were created or completed in this period.')} />}
        table={
          <DataTable
            head={[t('crm.analytics.periodCol', 'Period'), ...series.map((s) => s.label)]}
            rows={b.map((x, i) => [longLabels[i], x.created, x.completed])}
          />
        }
      />
      <section className="card min-w-0 p-0">
        <div className="border-b border-border px-4 py-3">
          <h2 className="flex items-center gap-2 font-display font-semibold text-text"><ListChecks className="h-4 w-4 text-text-subtle" /> {t('crm.analytics.teamTitle', 'Team workload')}</h2>
          <p className="text-xs text-text-subtle">{t('crm.analytics.teamSubtitle', 'Open and overdue now; completed in the period.')}</p>
        </div>
        {team.members.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-text-muted">{t('crm.analytics.noWorkload', 'No open or completed work here.')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs uppercase tracking-wider text-text-subtle">
                <tr>
                  <th className="px-4 py-2 font-medium">{t('crm.analytics.member', 'Member')}</th>
                  <th className="px-2 py-2 text-right font-medium">{t('crm.analytics.openTasks', 'Open')}</th>
                  <th className="px-2 py-2 text-right font-medium">{t('crm.dashboard.overdue', 'Overdue')}</th>
                  <th className="px-2 py-2 text-right font-medium">{t('crm.analytics.done', 'Done')}</th>
                  <th className="px-4 py-2 text-right font-medium">{t('crm.analytics.contentInWork', 'Content')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {team.members.map((m, i) => (
                  <tr key={m.user?.id ?? `none-${i}`}>
                    <td className="max-w-[10rem] px-4 py-2">
                      <span className="flex min-w-0 items-center gap-2">
                        <Avatar size="sm" name={m.user?.name} email={m.user?.email} />
                        <span className={cn('min-w-0 truncate', m.user ? 'text-text' : 'text-text-subtle')}>{name(m)}</span>
                      </span>
                    </td>
                    <td className="px-2 py-2 text-right tabular-nums">{m.openTasks}</td>
                    <td className={cn('px-2 py-2 text-right tabular-nums', m.overdueTasks > 0 && 'font-medium text-danger')}>{m.overdueTasks}</td>
                    <td className="px-2 py-2 text-right tabular-nums">{m.completedTasks}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{m.openContent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

/** Reach, views, engagement and followers: only from connected accounts. */
export function SocialBlock({ data }: { data: AnalyticsData }) {
  const s = data.social;
  const platforms = s.platforms.length ? s.platforms : [...PLATFORMS];
  if (!s.connected) {
    return (
      <section className="rounded-xl border border-dashed border-border p-4">
        <p className="flex items-center gap-2 font-medium text-text"><Link2 className="h-4 w-4 text-text-subtle" /> {t('crm.analytics.socialTitle', 'Reach, views, engagement and followers')}</p>
        <p className="mt-1 text-sm text-text-muted">
          {t('crm.analytics.socialEmpty', 'Connect social accounts to see these numbers. They come only from the platforms’ official APIs, with the social integrations — nothing here is estimated.')}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {platforms.map((p) => {
            const m = PLATFORM_META[p];
            return (
              <span key={p} className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-sm text-text-muted">
                <m.Icon className={cn('h-4 w-4', m.color)} /> {m.label}
                <span className="text-xs text-text-subtle">· {t('crm.analytics.notConnected', 'not connected')}</span>
              </span>
            );
          })}
        </div>
      </section>
    );
  }
  return (
    <section className="card min-w-0 p-4">
      <h2 className="mb-3 font-display font-semibold text-text">{t('crm.analytics.socialTitle', 'Reach, views, engagement and followers')}</h2>
      <div className="overflow-x-auto">
        <DataTable
          head={[t('crm.fields.platform', 'Platform'), t('crm.analytics.reach', 'Reach'), t('crm.analytics.views', 'Views'),
            t('crm.analytics.engagements', 'Engagements'), t('crm.analytics.followers', 'Followers')]}
          rows={s.metrics.map((m) => [PLATFORM_META[m.platform].label, m.reach, m.views, m.engagements,
            `${m.followers} (${m.followersChange >= 0 ? '+' : ''}${m.followersChange})`])}
        />
      </div>
    </section>
  );
}
