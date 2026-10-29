import { useEffect, useState } from 'react';
import { Download, FileBarChart, Printer } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useCrm } from '@/contexts/CrmContext';
import { ApiError } from '@/lib/api';
import { analytics, type AnalyticsFilter, type Report } from '@/lib/crmAnalytics';
import { EmptyState, ErrorState, LoadingRows, Notice, PageHeader, Spinner, btn, errorMessage, formatDate } from '@/components/admin/ui';
import { PLATFORM_META, StatCard } from '@/components/crm/ui';
import { useLoad } from '@/components/crm/useLoad';
import {
  AnalyticsFilters, ApprovalsBlock, OutputChart, PlatformBreakdown, SocialBlock, TeamBlock, hours, initialPeriod, percent, type PeriodState,
} from '@/components/crm/analyticsBlocks';
import { cn } from '@/lib/utils';

type Subject = Pick<AnalyticsFilter, 'companyId' | 'projectId' | 'platform'>;

export function CrmReports() {
  const { t } = useI18n();
  const { readOnly } = useCrm();
  const [period, setPeriod] = useState<PeriodState>(initialPeriod);
  const [subject, setSubject] = useState<Subject>({ companyId: '', projectId: '', platform: '' });
  const { data: options, error: optionsError, reload: reloadOptions } = useLoad(() => analytics.options(), []);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [notice, setNotice] = useState<{ tone: 'success' | 'danger'; text: string } | null>(null);
  const [tick, setTick] = useState(0);
  const key = JSON.stringify([period, subject, tick]);
  const [loadedKey, setLoadedKey] = useState('');
  const loading = !!subject.companyId && key !== loadedKey;

  // A report is always for one company (or one of its projects).
  useEffect(() => {
    if (options && !subject.companyId && options.companies.length > 0) {
      setSubject((s) => ({ ...s, companyId: options.companies[0].id }));
    }
  }, [options, subject.companyId]);

  const filter: AnalyticsFilter = { from: period.from, to: period.to, bucket: period.bucket || undefined, ...subject };

  useEffect(() => {
    if (!subject.companyId) return;
    let alive = true;
    analytics.report({ from: period.from, to: period.to, bucket: period.bucket || undefined, ...subject }).then(
      (r) => { if (alive) { setReport(r); setError(null); } },
      (err) => { if (alive) setError(errorMessage(err, t('crm.loadFailed', 'Could not load data.'))); },
    ).finally(() => { if (alive) setLoadedKey(key); });
    return () => { alive = false; };
    // key covers period, subject and tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, t]);

  const exportCsv = async () => {
    setExporting(true);
    setNotice(null);
    try {
      await analytics.exportCsv(filter);
      setNotice({ tone: 'success', text: t('crm.reports.exported', 'The CSV file was downloaded. The export is recorded in the activity log.') });
    } catch (err) {
      setNotice({ tone: 'danger', text: err instanceof ApiError && err.code === 'view_as_read_only'
        ? t('crm.reports.viewAsExport', 'Exports are not available while viewing as another user.')
        : errorMessage(err, t('crm.reports.exportFailed', 'Could not export the report.')) });
    } finally {
      setExporting(false);
    }
  };

  if (optionsError) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('crm.nav.reports', 'Reports')} />
        <ErrorState message={optionsError} onRetry={reloadOptions} />
      </div>
    );
  }

  const s = report?.summary;
  const subjectName = report ? (report.subject.project?.name ?? report.subject.company.name) : '';
  const projectsLine = report && !report.subject.project ? report.subject.projects.map((p) => p.name).join(', ') : '';

  return (
    <div className="crm-report-print space-y-6">
      <div className="crm-no-print space-y-6">
        <PageHeader
          title={t('crm.nav.reports', 'Reports')}
          subtitle={t('crm.reports.subtitle', 'A report for a company or project and period, from CRM data. Export it as CSV or print it to PDF.')}
          actions={
            <>
              <button onClick={() => window.print()} disabled={!report} className={btn.secondary}>
                <Printer className="h-4 w-4" /> {t('crm.reports.print', 'Print / PDF')}
              </button>
              <button onClick={exportCsv} disabled={!report || exporting || readOnly} className={btn.primary}
                title={readOnly ? t('crm.reports.viewAsExport', 'Exports are not available while viewing as another user.') : undefined}>
                {exporting ? <Spinner className="h-4 w-4" /> : <Download className="h-4 w-4" />} {t('crm.reports.exportCsv', 'Export CSV')}
              </button>
            </>
          }
        />
        <AnalyticsFilters period={period} onPeriod={setPeriod} filter={subject} onFilter={setSubject} options={options} requireSubject />
        {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}
      </div>

      {options && options.companies.length === 0 ? (
        <EmptyState icon={<FileBarChart className="h-8 w-8" />} title={t('crm.analytics.noAccess', 'No analytics access here')} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => setTick((n) => n + 1)} />
      ) : !report ? (
        <LoadingRows rows={4} />
      ) : (
        <article className={cn('space-y-6 transition-opacity', loading && 'opacity-60')} aria-busy={loading}>
          <header className="card p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">
              {report.subject.type === 'project' ? t('crm.reports.projectReport', 'Project report') : t('crm.reports.companyReport', 'Company report')}
            </p>
            <h2 className="mt-1 break-words font-display text-2xl font-bold text-text">{subjectName}</h2>
            {report.subject.project && <p className="text-sm text-text-muted">{report.subject.company.name}</p>}
            {projectsLine && <p className="text-sm text-text-muted">{t('crm.nav.projects', 'Projects')}: {projectsLine}</p>}
            <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <div><dt className="inline text-text-subtle">{t('crm.analytics.period', 'Period')}: </dt><dd className="inline text-text">{formatDate(report.period.from)} – {formatDate(report.period.to)}</dd></div>
              <div><dt className="inline text-text-subtle">{t('crm.fields.platform', 'Platform')}: </dt><dd className="inline text-text">{report.platform ? PLATFORM_META[report.platform].label : t('crm.analytics.allPlatforms', 'All platforms')}</dd></div>
              <div><dt className="inline text-text-subtle">{t('crm.reports.generated', 'Generated')}: </dt><dd className="inline text-text">{formatDate(report.generatedAt, true)}</dd></div>
            </dl>
          </header>

          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label={t('crm.analytics.published', 'Published')} value={s!.published} hint={`${s!.planned} ${t('crm.analytics.plannedInPeriod', 'planned in the period')}`} />
            <StatCard label={t('crm.analytics.onTime', 'On time')} value={percent(s!.onTimeRate)} hint={`${s!.missed} ${t('crm.analytics.missedShort', 'missed')}`} />
            <StatCard label={t('crm.analytics.avgToApprove', 'Average to approval')} value={hours(s!.avgHoursToApprove)} hint={`${s!.approved} ${t('crm.analytics.approvedShort', 'approved')}`} />
            <StatCard
              label={t('crm.analytics.openTasksNow', 'Open tasks')}
              value={s!.openTasks ?? '—'}
              tone={s!.overdueTasks ? 'danger' : undefined}
              hint={s!.openTasks === null ? t('crm.analytics.noTaskAccess', 'no access to tasks') : `${s!.overdueTasks} ${t('crm.analytics.overdueShort', 'overdue')} · ${s!.completedTasks} ${t('crm.analytics.completedShort', 'completed')}`}
            />
          </section>

          <OutputChart data={report} />
          <PlatformBreakdown data={report} />
          <ApprovalsBlock data={report} />
          <TeamBlock data={report} />
          <SocialBlock data={report} />
        </article>
      )}
    </div>
  );
}
