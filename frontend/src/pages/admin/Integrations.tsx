import { useCallback, useEffect, useState } from 'react';
import { Database, HardDrive, KeyRound, Globe2, Plug, Lock, CheckCircle2, CircleSlash, ServerCrash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { api, type ApiErrorEntry, type Integration } from '@/lib/api';
import { ErrorState, LoadingRows, PageHeader, RefreshButton, StatusBadge, formatDate, errorMessage } from '@/components/admin/ui';

const ICONS: Record<string, typeof Plug> = { database: Database, storage: HardDrive, auth: KeyRound, cors: Globe2 };

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export function AdminIntegrations() {
  const { t } = useI18n();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [runtime, setRuntime] = useState<{ goVersion: string; port: string } | null>(null);
  const [errors, setErrors] = useState<ApiErrorEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [res, errs] = await Promise.all([api.admin.getIntegrations(), api.admin.getRecentErrors()]);
      setIntegrations(res.integrations);
      setRuntime(res.runtime);
      setErrors(errs);
      setCheckedAt(new Date().toISOString());
    } catch (err) {
      setError(errorMessage(err, t('panel.api.loadFailed', 'Could not load integrations.')));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('panel.nav.api', 'API & integrations')}
        subtitle={t('panel.api.subtitle', 'Connections the API depends on, checked live. Secret values are never sent to the browser.')}
        actions={<RefreshButton onClick={load} loading={loading} />}
      />

      <div className="card flex flex-wrap items-center gap-x-6 gap-y-2 p-4 text-sm">
        <span className="flex items-center gap-2 text-text-muted"><Plug className="h-4 w-4 text-text-subtle" /> {t('panel.api.base', 'API base URL')}</span>
        <code className="break-all font-mono text-xs text-text">{API_BASE}</code>
        {runtime && <span className="font-mono text-xs text-text-subtle">{runtime.goVersion} · :{runtime.port}</span>}
        {checkedAt && <span className="text-xs text-text-subtle sm:ml-auto">{t('panel.api.checked', 'Checked')} {formatDate(checkedAt, true)}</span>}
      </div>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : loading && integrations.length === 0 ? (
        <LoadingRows rows={4} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {integrations.map((it) => {
            const Ico = ICONS[it.id] || Plug;
            return (
              <section key={it.id} className="card flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-3 text-primary"><Ico className="h-5 w-5" /></span>
                    <div className="min-w-0">
                      <h2 className="font-display font-semibold text-text">{it.name}</h2>
                      <p className="text-sm text-text-muted">{t(`panel.api.desc.${it.id}`, it.description)}</p>
                    </div>
                  </div>
                  <StatusBadge status={it.status} />
                </div>
                {it.message && <p className="mt-3 rounded-md bg-surface-2 px-3 py-2 text-xs text-text-muted">{it.message}</p>}
                <dl className="mt-4 divide-y divide-border rounded-lg border border-border text-sm">
                  {it.settings.map((s) => (
                    <div key={s.key} className="flex items-center justify-between gap-3 px-3 py-2">
                      <dt className="shrink-0 font-mono text-xs text-text-subtle">{s.key}</dt>
                      <dd className="min-w-0 text-right">
                        {s.secret ? (
                          <span className={`inline-flex items-center gap-1 text-xs ${s.isSet ? 'text-success' : 'text-text-subtle'}`}>
                            <Lock className="h-3 w-3" /> {s.isSet ? t('panel.api.secretSet', 'Set · hidden') : t('panel.api.notSet', 'Not set')}
                          </span>
                        ) : s.isSet ? (
                          <span className="break-all font-mono text-xs text-text">{s.value}</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-text-subtle"><CircleSlash className="h-3 w-3" /> {t('panel.api.notSet', 'Not set')}</span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
                {it.latencyMs > 0 && <p className="mt-2 font-mono text-xs text-text-subtle">{t('panel.api.latency', 'Response time')}: {it.latencyMs} ms</p>}
              </section>
            );
          })}
        </div>
      )}

      <div className="card p-4 text-sm text-text-muted">
        <p className="flex items-start gap-2">
          <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-text-subtle" />
          <span>
            {t('panel.api.keysNote', 'Keys and passwords are read from the server environment (.env) and are changed there, then the API is restarted. The panel only shows whether each one is set, so a compromised admin session cannot read them.')}
            {' '}
            <Link to="/admin/system" className="font-medium text-primary hover:text-primary-hover">{t('panel.api.modulesLink', 'Public API modules can be switched on and off in System settings.')}</Link>
          </span>
        </p>
      </div>

      {/* Recent errors */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-text">
          <ServerCrash className="h-5 w-5 text-text-subtle" /> {t('panel.api.errors', 'Recent API errors')}
        </h2>
        {errors.length === 0 ? (
          <div className="card flex items-center gap-3 p-5 text-sm text-text-muted">
            <CheckCircle2 className="h-5 w-5 text-success" /> {t('panel.api.noErrors', 'No server errors since the API last started.')}
          </div>
        ) : (
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-border bg-surface-2">
                  <tr className="text-xs uppercase tracking-wider text-text-subtle">
                    <th className="px-4 py-3 font-medium">{t('panel.api.time', 'Time')}</th>
                    <th className="px-4 py-3 font-medium">{t('panel.api.request', 'Request')}</th>
                    <th className="px-4 py-3 font-medium">{t('panel.api.status', 'Status')}</th>
                    <th className="hidden px-4 py-3 font-medium md:table-cell">{t('panel.api.detail', 'Detail')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {errors.map((e, i) => (
                    <tr key={`${e.time}-${i}`}>
                      <td className="whitespace-nowrap px-4 py-3 text-text-muted">{formatDate(e.time, true)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-text"><span className="text-text-subtle">{e.method}</span> {e.path}</td>
                      <td className="px-4 py-3"><span className={`font-mono text-xs ${e.status >= 500 ? 'text-danger' : 'text-warning'}`}>{e.status}</span></td>
                      <td className="hidden max-w-xs truncate px-4 py-3 text-xs text-text-subtle md:table-cell" title={e.error}>{e.error || `${e.latencyMs} ms`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <p className="text-xs text-text-subtle">{t('panel.api.errorsNote', 'Server errors (5xx) and rate-limit rejections, newest first. Kept in memory for the last 200 events.')}</p>
      </section>
    </div>
  );
}
