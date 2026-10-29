import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, FileBarChart } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { ApiError } from '@/lib/api';
import { analytics, presetRange, type AnalyticsFilter, type AnalyticsOverview } from '@/lib/crmAnalytics';
import { EmptyState, ErrorState, LoadingRows, PageHeader, RefreshButton, btn, errorMessage } from '@/components/admin/ui';
import {
  AnalyticsFilters, ApprovalsBlock, KpiRow, OutputChart, PlatformBreakdown, SocialBlock, TeamBlock, initialPeriod, type PeriodState,
} from '@/components/crm/analyticsBlocks';
import { cn } from '@/lib/utils';

type Subject = Pick<AnalyticsFilter, 'companyId' | 'projectId' | 'platform'>;

/** Remembered filters (per browser), so the page reopens where it was left. */
function stored<T>(key: string, fallback: T): T {
  try {
    const v = sessionStorage.getItem(key);
    return v ? { ...fallback, ...JSON.parse(v) } : fallback;
  } catch { return fallback; }
}

export function CrmAnalytics() {
  const { t } = useI18n();
  const [period, setPeriod] = useState<PeriodState>(() => {
    const p = stored('crm.analytics.period', initialPeriod());
    // Presets are relative to today.
    return p.preset === 'custom' ? p : { ...p, ...presetRange(p.preset) };
  });
  const [subject, setSubject] = useState<Subject>(() => stored('crm.analytics.subject', { companyId: '', projectId: '', platform: '' }));
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [error, setError] = useState<{ message: string; forbidden: boolean } | null>(null);
  const [tick, setTick] = useState(0);
  // Loading = the shown response is not for the current inputs yet.
  const key = JSON.stringify([period, subject, tick]);
  const [loadedKey, setLoadedKey] = useState('');
  const loading = key !== loadedKey;

  useEffect(() => {
    try {
      sessionStorage.setItem('crm.analytics.period', JSON.stringify(period));
      sessionStorage.setItem('crm.analytics.subject', JSON.stringify(subject));
    } catch { /* storage unavailable */ }
  }, [period, subject]);

  useEffect(() => {
    let alive = true;
    analytics.overview({ from: period.from, to: period.to, bucket: period.bucket || undefined, ...subject }).then(
      (d) => { if (alive) { setData(d); setError(null); } },
      (err) => {
        if (!alive) return;
        // A remembered project may no longer be available: start over.
        if (err instanceof ApiError && err.status === 404 && (subject.companyId || subject.projectId)) {
          setSubject({ companyId: '', projectId: '', platform: '' });
          return;
        }
        setError({ message: errorMessage(err, t('crm.loadFailed', 'Could not load data.')), forbidden: err instanceof ApiError && err.status === 403 });
      },
    ).finally(() => { if (alive) setLoadedKey(key); });
    return () => { alive = false; };
    // key covers period, subject and tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, t]);

  const reload = () => setTick((n) => n + 1);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('crm.analytics.title', 'Analytics')}
        subtitle={t('crm.analytics.subtitle', 'Content output, approvals and team workload from the CRM, limited to what you may see.')}
        actions={
          <>
            <RefreshButton onClick={reload} loading={loading} />
            <Link to="/crm/reports" className={btn.secondary}><FileBarChart className="h-4 w-4" /> {t('crm.nav.reports', 'Reports')}</Link>
          </>
        }
      />

      <AnalyticsFilters period={period} onPeriod={setPeriod} filter={subject} onFilter={setSubject} options={data?.options ?? null} />

      {error ? (
        error.forbidden
          ? <EmptyState icon={<BarChart3 className="h-8 w-8" />} title={t('crm.analytics.noAccess', 'No analytics access here')} hint={error.message} />
          : <ErrorState message={error.message} onRetry={reload} />
      ) : !data ? (
        <LoadingRows rows={4} />
      ) : (
        // Refetching keeps the previous numbers on screen, dimmed.
        <div className={cn('space-y-6 transition-opacity', loading && 'opacity-60')} aria-busy={loading}>
          <KpiRow data={data} />
          <div className="grid gap-4 xl:grid-cols-3">
            <div className="min-w-0 xl:col-span-2"><OutputChart data={data} /></div>
            <PlatformBreakdown data={data} />
          </div>
          <ApprovalsBlock data={data} />
          <TeamBlock data={data} />
          <SocialBlock data={data} />
        </div>
      )}
    </div>
  );
}
