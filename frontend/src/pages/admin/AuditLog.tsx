import { useCallback, useEffect, useState } from 'react';
import { ScrollText, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { api, type AuditLog, type Paginated } from '@/lib/api';
import { EmptyState, ErrorState, LoadingRows, PageHeader, RefreshButton, formatDate, errorMessage } from '@/components/admin/ui';

const PAGE_SIZE = 50;

/** Human label for the generic api.METHOD entries written for content edits. */
function describe(a: AuditLog, t: (k: string, f: string) => string): string {
  if (a.action.startsWith('api.')) {
    const verb = { 'api.POST': t('panel.audit.created', 'Created'), 'api.PUT': t('panel.audit.updated', 'Updated'), 'api.DELETE': t('panel.audit.deleted', 'Deleted') }[a.action] ?? a.action;
    const area = a.targetType.replace('/api/v1/admin/', '').replace(/\/:\w+/g, '');
    return `${verb} · ${area}`;
  }
  return a.action;
}

export function AdminAuditLog() {
  const { t } = useI18n();
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<Paginated<AuditLog> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => { setQuery(q.trim()); setPage(1); }, 300);
    return () => clearTimeout(id);
  }, [q]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setResult(await api.admin.getAuditLogs({ q: query, page, limit: PAGE_SIZE }));
    } catch (err) {
      setError(errorMessage(err, t('panel.audit.loadFailed', 'Could not load the audit log.')));
    } finally {
      setLoading(false);
    }
  }, [query, page, t]);

  useEffect(() => { load(); }, [load]);

  const rows = result?.data ?? [];
  const totalPages = result?.totalPages || 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('panel.nav.audit', 'Audit log')}
        subtitle={t('panel.audit.subtitle', 'Every administrative change: sign-ins, roles, blocks, content edits and settings. Entries cannot be edited or deleted from the panel.')}
        actions={<RefreshButton onClick={load} loading={loading} />}
      />

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} className="field pl-9"
          placeholder={t('panel.audit.search', 'Filter by admin email, action or target')} aria-label={t('panel.audit.search', 'Filter by admin email, action or target')} />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : loading && !result ? (
        <LoadingRows rows={8} />
      ) : rows.length === 0 ? (
        <EmptyState icon={<ScrollText className="h-12 w-12" />} title={t('panel.audit.empty', 'No recorded actions yet')} />
      ) : (
        <>
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-border bg-surface-2">
                  <tr className="text-xs uppercase tracking-wider text-text-subtle">
                    <th className="px-4 py-3 font-medium">{t('panel.api.time', 'Time')}</th>
                    <th className="px-4 py-3 font-medium">{t('panel.audit.actor', 'Administrator')}</th>
                    <th className="px-4 py-3 font-medium">{t('panel.audit.action', 'Action')}</th>
                    <th className="hidden px-4 py-3 font-medium lg:table-cell">{t('panel.api.detail', 'Detail')}</th>
                    <th className="hidden px-4 py-3 font-medium md:table-cell">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((a) => (
                    <tr key={a.id} className="align-top">
                      <td className="whitespace-nowrap px-4 py-3 text-text-muted">{formatDate(a.createdAt, true)}</td>
                      <td className="px-4 py-3 break-all text-text">{a.actorEmail || a.actorId || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-text">{describe(a, t)}</span>
                        {a.targetId && <span className="block break-all font-mono text-[11px] text-text-subtle">{a.targetId}</span>}
                      </td>
                      <td className="hidden max-w-sm break-words px-4 py-3 text-xs text-text-muted lg:table-cell">{a.details || '—'}</td>
                      <td className="hidden whitespace-nowrap px-4 py-3 font-mono text-xs text-text-subtle md:table-cell">{a.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-text-muted">
              <span>{t('admin.page', 'Page')} {page} / {totalPages}</span>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 hover:bg-surface-3 hover:text-text disabled:opacity-40">
                  <ChevronLeft className="h-4 w-4" /> {t('admin.prev', 'Prev')}
                </button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 hover:bg-surface-3 hover:text-text disabled:opacity-40">
                  {t('admin.next', 'Next')} <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
