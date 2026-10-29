import { useCallback, useEffect, useState } from 'react';
import { FileUser, Mail, Phone, Trash2, ExternalLink } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { api, type JobApplication } from '@/lib/api';
import { EmptyState, ErrorState, LoadingRows, Notice, PageHeader, RefreshButton, formatDate, errorMessage } from '@/components/admin/ui';

// "pending" is what the API assigns on submission.
const STATUSES = ['pending', 'reviewing', 'interview', 'accepted', 'rejected'] as const;

export function AdminApplications() {
  const { t } = useI18n();
  const [items, setItems] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await api.admin.getApplications());
    } catch (err) {
      setError(errorMessage(err, t('panel.applications.loadFailed', 'Could not load applications.')));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { load(); }, [load]);

  const statusLabel = (s: string) => ({
    pending: t('panel.applications.pending', 'New'),
    reviewing: t('panel.applications.reviewing', 'Reviewing'),
    interview: t('panel.applications.interview', 'Interview'),
    accepted: t('panel.applications.accepted', 'Accepted'),
    rejected: t('panel.applications.rejected', 'Rejected'),
  }[s] ?? s);

  const setStatus = async (a: JobApplication, status: string) => {
    setActionError(null);
    const prev = a.status;
    setItems((list) => list.map((x) => (x.id === a.id ? { ...x, status } : x)));
    try {
      await api.admin.updateApplicationStatus(a.id, status);
    } catch (err) {
      setItems((list) => list.map((x) => (x.id === a.id ? { ...x, status: prev } : x)));
      setActionError(errorMessage(err, t('panel.users.actionFailed', 'The action failed.')));
    }
  };

  const remove = async (a: JobApplication) => {
    if (!window.confirm(`${t('panel.applications.confirmDelete', 'Delete this application?')}\n\n${a.name} <${a.email}>`)) return;
    setActionError(null);
    try {
      await api.admin.deleteApplication(a.id);
      setItems((list) => list.filter((x) => x.id !== a.id));
    } catch (err) {
      setActionError(errorMessage(err, t('panel.users.actionFailed', 'The action failed.')));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('panel.nav.applications', 'Applications')}
        subtitle={t('panel.applications.subtitle', 'Candidates who applied to your vacancies.')}
        actions={<>
          <span className="text-sm text-text-subtle">{items.length} {t('admin.inquiriesTotal', 'total')}</span>
          <RefreshButton onClick={load} loading={loading} />
        </>}
      />

      {actionError && <Notice>{actionError}</Notice>}

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : loading && items.length === 0 ? (
        <LoadingRows />
      ) : items.length === 0 ? (
        <EmptyState icon={<FileUser className="h-12 w-12" />} title={t('panel.applications.empty', 'No applications yet')} />
      ) : (
        <ul className="space-y-3">
          {items.map((a) => (
            <li key={a.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-text">{a.name}</p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <a href={`mailto:${a.email}`} className="flex items-center gap-1.5 break-all text-text-muted hover:text-primary"><Mail className="h-3.5 w-3.5" /> {a.email}</a>
                    {a.phone && <a href={`tel:${a.phone}`} className="flex items-center gap-1.5 text-text-subtle hover:text-primary"><Phone className="h-3.5 w-3.5" /> {a.phone}</a>}
                  </div>
                  <p className="mt-1 text-xs text-text-subtle">{formatDate(a.createdAt, true)}{a.careerId ? ` · ${a.careerId}` : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select value={a.status || 'pending'} onChange={(e) => setStatus(a, e.target.value)} className="field py-1.5 text-sm" aria-label={t('panel.users.status', 'Status')}>
                    {STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
                    {a.status && !(STATUSES as readonly string[]).includes(a.status) && <option value={a.status}>{a.status}</option>}
                  </select>
                  <button onClick={() => remove(a)} className="rounded-md p-2 text-text-subtle hover:bg-danger/10 hover:text-danger" aria-label={t('panel.users.delete', 'Delete')}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                {a.resumeUrl && /^https?:\/\//.test(a.resumeUrl) && (
                  <a href={a.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary-hover">
                    {t('panel.applications.resume', 'Resume')} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {a.coverLetter && (
                  <button onClick={() => setOpen(open === a.id ? null : a.id)} className="text-text-muted underline-offset-2 hover:text-text hover:underline">
                    {open === a.id ? t('panel.applications.hideLetter', 'Hide cover letter') : t('panel.applications.showLetter', 'Cover letter')}
                  </button>
                )}
              </div>
              {open === a.id && <p className="mt-3 whitespace-pre-wrap rounded-md bg-surface-2 p-3 text-sm text-text-muted">{a.coverLetter}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
