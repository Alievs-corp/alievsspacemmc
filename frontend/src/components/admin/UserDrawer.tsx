import { useEffect, useState } from 'react';
import { X, Ban, CheckCircle2, LogOut, Trash2, ShieldCheck, Copy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { api, PERMISSIONS, type Permission, type Role, type User } from '@/lib/api';
import { cn } from '@/lib/utils';
import { btn, formatDate, Notice, permissionLabel, RoleBadge, roleLabel, Spinner, StatusBadge, errorMessage } from './ui';

interface UserDrawerProps {
  user: User | null;
  onClose: () => void;
  /** Called with the updated user, or null when it was deleted. */
  onChange: (user: User | null, previousId: string) => void;
}

/**
 * Side panel for one account. What it offers mirrors the server rules:
 * roles and permissions are super-admin only, admins can only be managed by a
 * super admin, and nobody acts on their own account here.
 */
export function UserDrawer({ user, onClose, onChange }: UserDrawerProps) {
  const { user: me, isSuperAdmin, hasPermission } = useAuth();
  const { t } = useI18n();
  const [role, setRole] = useState<Role>('user');
  const [perms, setPerms] = useState<Permission[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ tone: 'success' | 'danger'; text: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    setRole(user.role);
    setPerms(user.permissions || []);
    setMsg(null);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [user, onClose]);

  if (!user) return null;

  const isSelf = me?.id === user.id;
  const targetIsAdmin = user.role === 'admin' || user.role === 'super_admin';
  const canManageTarget = !isSelf && (isSuperAdmin || (!targetIsAdmin && hasPermission('users.manage')));
  const roleDirty = role !== user.role || (role === 'admin' && [...perms].sort().join() !== [...(user.permissions || [])].sort().join());

  const run = async (key: string, fn: () => Promise<User | null>, success: string) => {
    setBusy(key);
    setMsg(null);
    try {
      const updated = await fn();
      onChange(updated, user.id);
      setMsg({ tone: 'success', text: success });
    } catch (err) {
      setMsg({ tone: 'danger', text: errorMessage(err, t('panel.users.actionFailed', 'The action failed.')) });
    } finally {
      setBusy(null);
    }
  };

  const saveRole = () => {
    if (role === 'super_admin' && user.role !== 'super_admin' &&
      !window.confirm(t('panel.users.confirmSuper', 'Grant full control of the system to this account?'))) return;
    run('role', () => api.admin.setUserRole(user.id, role, role === 'admin' ? perms : []), t('panel.users.roleSaved', 'Role updated.'));
  };

  const toggleBlock = () => {
    if (!user.blocked && !window.confirm(t('panel.users.confirmBlock', 'Block this account? The user will be signed out immediately.'))) return;
    run('block', () => api.admin.setUserBlocked(user.id, !user.blocked),
      user.blocked ? t('panel.users.unblocked', 'Account unblocked.') : t('panel.users.blocked', 'Account blocked.'));
  };

  const revoke = () =>
    run('revoke', async () => { await api.admin.revokeUserSessions(user.id); return user; }, t('panel.users.revoked', 'All sessions were signed out.'));

  const remove = async () => {
    if (!window.confirm(`${t('panel.users.confirmDelete', 'Delete this account permanently? This cannot be undone.')}\n\n${user.email}`)) return;
    setBusy('delete');
    try {
      await api.admin.deleteUser(user.email);
      onChange(null, user.id);
      onClose();
    } catch (err) {
      setMsg({ tone: 'danger', text: errorMessage(err, t('panel.users.actionFailed', 'The action failed.')) });
      setBusy(null);
    }
  };

  const togglePerm = (p: Permission) =>
    setPerms((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="user-drawer-title">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-surface shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-border p-5">
          <div className="min-w-0">
            <h2 id="user-drawer-title" className="truncate font-display text-lg font-semibold text-text">{user.name || user.email}</h2>
            <p className="truncate text-sm text-text-muted">{user.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <RoleBadge role={user.role} />
              <StatusBadge status={user.blocked ? 'blocked' : 'active'} />
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-text-muted hover:bg-surface-3 hover:text-text" aria-label={t('ui.close', 'Close')}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div className="col-span-2">
              <dt className="text-text-subtle">{t('account.fields.id', 'User ID')}</dt>
              <dd className="mt-1 flex items-center gap-2">
                <code className="break-all font-mono text-xs text-text">{user.id}</code>
                <button onClick={() => navigator.clipboard?.writeText(user.id)} className="rounded p-1 text-text-subtle hover:text-text" aria-label={t('account.profile.copyId', 'Copy ID')}>
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </dd>
            </div>
            <div><dt className="text-text-subtle">{t('account.fields.registered', 'Registered')}</dt><dd className="mt-1 text-text">{formatDate(user.createdAt, true)}</dd></div>
            <div><dt className="text-text-subtle">{t('account.fields.lastLogin', 'Last sign-in')}</dt><dd className="mt-1 text-text">{formatDate(user.lastLoginAt, true)}</dd></div>
            <div><dt className="text-text-subtle">{t('account.fields.phone', 'Phone')}</dt><dd className="mt-1 break-all text-text">{user.phone || '—'}</dd></div>
            <div><dt className="text-text-subtle">{t('account.fields.company', 'Company')}</dt><dd className="mt-1 break-all text-text">{user.company || '—'}</dd></div>
          </dl>

          {isSelf && (
            <Notice tone="warning">{t('panel.users.self', 'This is your own account. Use your profile page to change it.')}</Notice>
          )}

          {/* Role & permissions — super admin only */}
          {isSuperAdmin && !isSelf && (
            <section className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold text-text"><ShieldCheck className="h-4 w-4 text-text-subtle" /> {t('panel.users.roleTitle', 'Role & access')}</h3>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t('account.fields.role', 'Role')}>
                {(['user', 'admin', 'super_admin'] as Role[]).map((r) => (
                  <button
                    key={r}
                    role="radio"
                    aria-checked={role === r}
                    onClick={() => setRole(r)}
                    className={cn(
                      'rounded-lg border px-3 py-2 text-sm transition-colors',
                      role === r ? 'border-primary bg-primary/10 text-text' : 'border-border text-text-muted hover:bg-surface-3',
                    )}
                  >
                    {roleLabel(r)}
                  </button>
                ))}
              </div>

              {role === 'admin' && (
                <div className="space-y-2 rounded-lg border border-border p-3">
                  <p className="text-xs text-text-subtle">{t('panel.users.permsHint', 'Sections this admin may manage:')}</p>
                  {PERMISSIONS.map((p) => {
                    const l = permissionLabel(p);
                    return (
                      <label key={p} className="flex cursor-pointer items-start gap-3 rounded-md p-1.5 hover:bg-surface-2">
                        <input type="checkbox" checked={perms.includes(p)} onChange={() => togglePerm(p)} className="mt-1 h-4 w-4 accent-[var(--color-primary)]" />
                        <span className="min-w-0">
                          <span className="block text-sm text-text">{l.title}</span>
                          <span className="block text-xs text-text-subtle">{l.desc}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
              {role === 'super_admin' && (
                <p className="text-xs text-text-subtle">{t('panel.users.superHint', 'Super admins have every permission, including roles, integrations and system settings.')}</p>
              )}

              <button onClick={saveRole} disabled={!roleDirty || busy !== null} className={btn.primary}>
                {busy === 'role' && <Spinner />} {t('panel.users.saveRole', 'Save role')}
              </button>
            </section>
          )}

          {/* Account actions */}
          {canManageTarget && (
            <section className="space-y-3 border-t border-border pt-5">
              <h3 className="font-semibold text-text">{t('panel.users.actions', 'Account actions')}</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={toggleBlock} disabled={busy !== null} className={user.blocked ? btn.secondary : btn.danger}>
                  {busy === 'block' ? <Spinner /> : user.blocked ? <CheckCircle2 className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                  {user.blocked ? t('panel.users.unblock', 'Unblock') : t('panel.users.block', 'Block')}
                </button>
                {isSuperAdmin && (
                  <button onClick={revoke} disabled={busy !== null} className={btn.secondary}>
                    {busy === 'revoke' ? <Spinner /> : <LogOut className="h-4 w-4" />} {t('panel.users.revoke', 'Sign out everywhere')}
                  </button>
                )}
                <button onClick={remove} disabled={busy !== null} className={btn.danger}>
                  {busy === 'delete' ? <Spinner /> : <Trash2 className="h-4 w-4" />} {t('panel.users.delete', 'Delete')}
                </button>
              </div>
            </section>
          )}

          {!canManageTarget && !isSelf && (
            <p className="text-xs text-text-subtle">{t('panel.users.readOnly', 'You can view this account but not change it.')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
