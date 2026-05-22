import { useState, useEffect, useMemo } from 'react';
import { api, type Inquiry } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';
import { RefreshCw, Inbox, AlertCircle, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 10;

export function AdminInquiries() {
  const { t } = useI18n();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => { loadInquiries(); }, []);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.admin.getInquiries();
      setInquiries(data);
      setPage(1);
    } catch (err) {
      console.error('Failed to load inquiries:', err);
      setError(t('admin.inquiriesError', 'Could not load inquiries. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(inquiries.length / PAGE_SIZE));
  const pageRows = useMemo(
    () => inquiries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [inquiries, page],
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text sm:text-3xl">
            {t('admin.inquiries', 'Inquiries')}
          </h1>
          <p className="mt-1 text-text-muted">
            {t('admin.inquiriesSubtitle', 'Contact form submissions from your website.')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-subtle">
            {inquiries.length} {t('admin.inquiriesTotal', 'total')}
          </span>
          <button
            onClick={loadInquiries}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {t('admin.refresh', 'Refresh')}
          </button>
        </div>
      </header>

      {error ? (
        <div className="card flex flex-col items-center justify-center gap-3 p-12 text-center">
          <AlertCircle className="h-10 w-10 text-danger" />
          <p className="font-medium text-text">{t('admin.inquiriesErrorTitle', 'Could not load inquiries')}</p>
          <p className="max-w-md text-sm text-text-muted">{error}</p>
          <button
            onClick={loadInquiries}
            className="mt-2 rounded-md border border-border px-4 py-2 text-sm text-text-muted hover:bg-surface-3 hover:text-text"
          >
            {t('admin.retry', 'Retry')}
          </button>
        </div>
      ) : loading ? (
        <div className="card p-4">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-surface-3/60" />
            ))}
          </div>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="card flex flex-col items-center justify-center gap-3 p-16 text-center">
          <Inbox className="h-12 w-12 text-text-subtle" />
          <p className="font-medium text-text">{t('admin.noInquiries', 'No inquiries yet')}</p>
          <p className="max-w-md text-sm text-text-muted">
            {t('admin.noInquiriesHint', 'Submissions from the contact form will appear here.')}
          </p>
        </div>
      ) : (
        <>
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-border bg-surface-2">
                  <tr className="text-xs uppercase tracking-wider text-text-subtle">
                    <th className="px-5 py-3 font-medium">{t('admin.inq.name', 'Name / Company')}</th>
                    <th className="px-5 py-3 font-medium">{t('admin.inq.contact', 'Contact')}</th>
                    <th className="px-5 py-3 font-medium">{t('admin.inq.details', 'Details')}</th>
                    <th className="px-5 py-3 font-medium">{t('admin.inq.message', 'Message')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pageRows.map((q, i) => (
                    <tr key={q.email || `row-${i}`} className="align-top transition-colors hover:bg-surface-2/60">
                      <td className="px-5 py-4">
                        <div className="font-medium text-text">{q.name}</div>
                        {q.company && <div className="text-text-subtle">{q.company}</div>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          {q.email && (
                            <a href={`mailto:${q.email}`} className="flex items-center gap-1.5 text-text-muted hover:text-primary">
                              <Mail className="h-3.5 w-3.5 shrink-0" /> <span className="break-all">{q.email}</span>
                            </a>
                          )}
                          {q.phone && (
                            <a href={`tel:${q.phone}`} className="flex items-center gap-1.5 text-text-subtle hover:text-primary">
                              <Phone className="h-3.5 w-3.5 shrink-0" /> {q.phone}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {q.interest && (
                            <span className="rounded-full bg-surface-3 px-2.5 py-0.5 text-xs text-text-muted">{q.interest}</span>
                          )}
                          {q.topic && (
                            <span className="rounded-full bg-surface-3 px-2.5 py-0.5 text-xs text-text-muted">{q.topic}</span>
                          )}
                          {!q.interest && !q.topic && <span className="text-text-subtle">—</span>}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="max-w-xs text-text-muted" title={q.message || ''}>
                          {q.message
                            ? q.message.length > 120 ? `${q.message.slice(0, 120)}…` : q.message
                            : <span className="text-text-subtle">{t('admin.inq.noMessage', 'No message')}</span>}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-text-muted">
              <span>
                {t('admin.page', 'Page')} {page} / {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 hover:bg-surface-3 hover:text-text disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" /> {t('admin.prev', 'Prev')}
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 hover:bg-surface-3 hover:text-text disabled:opacity-40"
                >
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
