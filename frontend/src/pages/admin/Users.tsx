import { useCallback, useEffect, useState } from 'react';
import { Search, Users as UsersIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { api, type Paginated, type Role, type User } from '@/lib/api';
import { EmptyState, ErrorState, LoadingRows, PageHeader, RefreshButton, RoleBadge, StatusBadge, formatDate, errorMessage } from '@/components/admin/ui';
import { UserDrawer } from '@/components/admin/UserDrawer';

const PAGE_SIZE = 20;

interface UsersPageProps {
  /** Admin Management reuses this page pinned to administrator roles. */
  adminsOnly?: boolean;
}

export function AdminUsers({ adminsOnly = false }: UsersPageProps) {
  const { t } = useI18n();
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [role, setRole] = useState<Role | 'staff' | ''>(adminsOnly ? 'staff' : '');
  const [status, setStatus] = useState<'' | 'active' | 'blocked'>('');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<Paginated<User> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<User | null>(null);

  // Debounce typing so every keystroke doesn't hit the API.
  useEffect(() => {
    const id = setTimeout(() => { setQuery(q.trim()); setPage(1); }, 300);
    return () => clearTimeout(id);
  }, [q]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setResult(await api.admin.searchUsers({ q: query, role, status, page, limit: PAGE_SIZE }));
    } catch (err) {
      setError(errorMessage(err, t('panel.users.loadFailed', 'Could not load users.')));
    } finally {
      setLoading(false);
    }
  }, [query, role, status, page, t]);

  useEffect(() => { load(); }, [load]);

  const onChange = (updated: User | null, previousId: string) => {
    setResult((r) => r && {
      ...r,
      data: updated ? r.data.map((u) => (u.id === previousId ? updated : u)) : r.data.filter((u) => u.id !== previousId),
    });
    setSelected(updated);
  };

  const rows = result?.data ?? [];
  const totalPages = result?.totalPages || 1;

  const roleOptions: Array<{ v: Role | 'staff' | ''; l: string }> = adminsOnly
    ? [{ v: 'staff', l: t('panel.admins.all', 'All administrators') }, { v: 'admin', l: t('panel.roles.admin', 'Admin') }, { v: 'super_admin', l: t('panel.roles.super_admin', 'Super admin') }]
    : [
      { v: '', l: t('panel.users.allRoles', 'All roles') },
      { v: 'user', l: t('panel.roles.user', 'User') },
      { v: 'admin', l: t('panel.roles.admin', 'Admin') },
      { v: 'super_admin', l: t('panel.roles.super_admin', 'Super admin') },
    ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={adminsOnly ? t('panel.nav.admins', 'Administrators') : t('admin.users', 'Users')}
        subtitle={adminsOnly
          ? t('panel.admins.subtitle', 'Who can manage the system and which sections each admin may use. To add an admin, open a user in Users and change their role.')
          : t('panel.users.subtitle', 'Registered accounts. Open one to view the profile, change the role or block access.')}
        actions={<>
          {result && <span className="text-sm text-text-subtle">{result.total} {t('admin.inquiriesTotal', 'total')}</span>}
          <RefreshButton onClick={load} loading={loading} />
        </>}
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('panel.users.search', 'Search by name, email or ID')}
            aria-label={t('panel.users.search', 'Search by name, email or ID')}
            className="field pl-9"
          />
        </div>
        <select value={role} onChange={(e) => { setRole(e.target.value as Role | 'staff' | ''); setPage(1); }} className="field sm:w-44" aria-label={t('account.fields.role', 'Role')}>
          {roleOptions.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
        <select value={status} onChange={(e) => { setStatus(e.target.value as typeof status); setPage(1); }} className="field sm:w-40" aria-label={t('panel.users.status', 'Status')}>
          <option value="">{t('panel.users.allStatuses', 'Any status')}</option>
          <option value="active">{t('panel.status.active', 'Active')}</option>
          <option value="blocked">{t('panel.status.blocked', 'Blocked')}</option>
        </select>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : loading && !result ? (
        <LoadingRows />
      ) : rows.length === 0 ? (
        <EmptyState icon={<UsersIcon className="h-12 w-12" />} title={t('panel.users.empty', 'No users match')} hint={query ? undefined : t('panel.users.emptyHint', 'Accounts appear here after people register on the site.')} />
      ) : (
        <>
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-border bg-surface-2">
                  <tr className="text-xs uppercase tracking-wider text-text-subtle">
                    <th className="px-5 py-3 font-medium">{t('account.fields.username', 'Name')}</th>
                    <th className="px-5 py-3 font-medium">{t('account.fields.role', 'Role')}</th>
                    <th className="px-5 py-3 font-medium">{t('panel.users.status', 'Status')}</th>
                    <th className="hidden px-5 py-3 font-medium md:table-cell">{t('account.fields.registered', 'Registered')}</th>
                    <th className="hidden px-5 py-3 font-medium lg:table-cell">{t('account.fields.lastLogin', 'Last sign-in')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((u) => (
                    <tr
                      key={u.id}
                      onClick={() => setSelected(u)}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSelected(u))}
                      tabIndex={0}
                      className="cursor-pointer transition-colors hover:bg-surface-2/60 focus-visible:bg-surface-2 focus-visible:outline-none"
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-text">{u.name || '—'}</div>
                        <div className="break-all text-text-subtle">{u.email}</div>
                        {adminsOnly && u.role === 'admin' && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {(u.permissions || []).length === 0
                              ? <span className="text-xs text-warning">{t('panel.admins.noPerms', 'No sections granted')}</span>
                              : u.permissions.map((p) => <span key={p} className="rounded bg-surface-3 px-1.5 py-0.5 font-mono text-[11px] text-text-muted">{p}</span>)}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5"><RoleBadge role={u.role} /></td>
                      <td className="px-5 py-3.5"><StatusBadge status={u.blocked ? 'blocked' : 'active'} /></td>
                      <td className="hidden px-5 py-3.5 text-text-muted md:table-cell">{formatDate(u.createdAt)}</td>
                      <td className="hidden px-5 py-3.5 text-text-muted lg:table-cell">{formatDate(u.lastLoginAt, true)}</td>
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

      <UserDrawer user={selected} onClose={() => setSelected(null)} onChange={onChange} />
    </div>
  );
}

export function AdminAdmins() {
  return <AdminUsers adminsOnly />;
}
