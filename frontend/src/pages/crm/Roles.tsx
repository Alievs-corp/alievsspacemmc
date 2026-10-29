import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, ShieldCheck, Lock } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useCrm } from '@/contexts/CrmContext';
import { crm, type CrmPermission, type PermissionInfo, type Role } from '@/lib/crm';
import { ErrorState, LoadingRows, Notice, PageHeader, Spinner, btn, errorMessage } from '@/components/admin/ui';
import { Drawer, Field, permissionGroupName, permissionName, plural, roleName } from '@/components/crm/ui';
import { cn } from '@/lib/utils';

/** Roles & Permissions (super admin). The server rejects edits from anyone else. */
export function CrmRoles() {
  const { t } = useI18n();
  const { readOnly } = useCrm();
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [catalog, setCatalog] = useState<PermissionInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ tone: 'success' | 'danger'; text: string } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState<CrmPermission[]>([]);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [r, p] = await Promise.all([crm.roles(), crm.permissions()]);
      setRoles(r);
      setCatalog(p.permissions);
      setSelected((s) => s ?? r[0]?.key ?? null);
    } catch (err) {
      setError(errorMessage(err, t('crm.loadFailed', 'Could not load data.')));
    }
  }, [t]);

  useEffect(() => { void load(); }, [load]);

  const role = roles?.find((r) => r.key === selected) ?? null;
  useEffect(() => { setDraft(role?.permissions ?? []); }, [role]);

  const groups = useMemo(() => {
    const m = new Map<string, PermissionInfo[]>();
    catalog.forEach((p) => m.set(p.group, [...(m.get(p.group) ?? []), p]));
    return [...m.entries()];
  }, [catalog]);

  const dirty = !!role && JSON.stringify([...draft].sort()) !== JSON.stringify([...role.permissions].sort());

  const save = async () => {
    if (!role) return;
    setSaving(true);
    setMsg(null);
    try {
      await crm.updateRole(role.key, { permissions: draft });
      await load();
      setMsg({ tone: 'success', text: t('crm.roles.saved', 'Role saved. It applies to everyone with this role right away.') });
    } catch (err) {
      setMsg({ tone: 'danger', text: errorMessage(err, t('crm.saveFailed', 'Could not save.')) });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!role || !window.confirm(t('crm.roles.confirmDelete', 'Delete this role?'))) return;
    setMsg(null);
    try {
      await crm.deleteRole(role.key);
      setSelected(null);
      await load();
    } catch (err) {
      setMsg({ tone: 'danger', text: errorMessage(err, t('crm.saveFailed', 'Could not save.')) });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('crm.nav.roles', 'Roles & Permissions')}
        subtitle={t('crm.roles.subtitle', 'A role is a set of permissions. Each person can additionally get or lose individual permissions in Team. Super admin always has everything and is not a role here.')}
        actions={!readOnly && <button onClick={() => setCreating(true)} className={btn.primary}><Plus className="h-4 w-4" /> {t('crm.roles.new', 'New role')}</button>}
      />
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}

      {error ? <ErrorState message={error} onRetry={load} /> : !roles ? <LoadingRows /> : (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <ul className="card divide-y divide-border overflow-hidden p-0">
            {roles.map((r) => (
              <li key={r.key}>
                <button onClick={() => setSelected(r.key)} className={cn('flex w-full items-center gap-2 px-4 py-3 text-left text-sm transition-colors', r.key === selected ? 'bg-primary/10' : 'hover:bg-surface-2')}>
                  <ShieldCheck className={cn('h-4 w-4 shrink-0', r.key === selected ? 'text-primary' : 'text-text-subtle')} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-text">{roleName(r.key, r.name)}</span>
                    <span className="block text-xs text-text-subtle">{r.permissions.length} {plural(r.permissions.length, 'permissions', 'permission', 'permissions')} · {r.memberCount} {t('crm.peopleLower', 'people')}</span>
                  </span>
                  {r.system && <Lock className="h-3.5 w-3.5 text-text-subtle" aria-label={t('crm.roles.builtIn', 'Built-in')} />}
                </button>
              </li>
            ))}
          </ul>

          {role && (
            <section className="card space-y-5 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-display text-xl font-semibold text-text">{roleName(role.key, role.name)}</h2>
                  <p className="text-sm text-text-muted">{t(`crm.roleDesc.${role.key}`, role.description)}</p>
                  <code className="mt-1 block font-mono text-[11px] text-text-subtle">{role.key}{role.system && ` · ${t('crm.roles.builtIn', 'Built-in')}`}</code>
                </div>
                {!readOnly && (
                  <div className="flex gap-2">
                    {!role.system && <button onClick={remove} disabled={role.memberCount > 0} title={role.memberCount > 0 ? t('crm.roles.inUse', 'Assigned to people — reassign them first') : undefined} className={btn.danger}><Trash2 className="h-4 w-4" /></button>}
                    <button onClick={save} disabled={!dirty || saving} className={btn.primary}>{saving && <Spinner />} {t('account.profile.save', 'Save changes')}</button>
                  </div>
                )}
              </div>
              {groups.map(([group, perms]) => (
                <div key={group}>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-text-subtle">{permissionGroupName(group)}</p>
                  <div className="grid gap-1 sm:grid-cols-2 xl:grid-cols-3">
                    {perms.map((p) => (
                      <label key={p.key} className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-surface-2">
                        <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]" disabled={readOnly} checked={draft.includes(p.key)}
                          onChange={(e) => setDraft(e.target.checked ? [...draft, p.key] : draft.filter((x) => x !== p.key))} />
                        <span className="min-w-0">
                          <span className="block text-text">{permissionName(p.key)}</span>
                          {p.platformScoped && <span className="block text-[11px] text-text-subtle">{t('crm.roles.perNetwork', 'limited by the person’s networks')}</span>}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      )}

      <NewRoleDrawer open={creating} catalog={catalog} onClose={() => setCreating(false)} onCreated={(key) => { setCreating(false); setSelected(key); load(); }} />
    </div>
  );
}

function NewRoleDrawer({ open, catalog, onClose, onCreated }: { open: boolean; catalog: PermissionInfo[]; onClose: () => void; onCreated: (key: string) => void }) {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (open) { setName(''); setKey(''); setDescription(''); setError(null); } }, [open]);

  const autoKey = name.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40);
  const finalKey = key || autoKey;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await crm.createRole({ key: finalKey, name, description, permissions: catalog.filter((p) => p.key.endsWith('.view')).map((p) => p.key) });
      onCreated(finalKey);
    } catch (err) {
      setError(errorMessage(err, t('crm.saveFailed', 'Could not save.')));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer open={open} onClose={onClose} title={t('crm.roles.new', 'New role')} footer={<>
      <button type="button" onClick={onClose} className={btn.secondary}>{t('ui.cancel', 'Cancel')}</button>
      <button type="submit" form="role-form" disabled={saving || !name.trim() || !/^[a-z][a-z0-9_]{1,48}$/.test(finalKey)} className={btn.primary}>{saving && <Spinner />} {t('crm.create', 'Create')}</button>
    </>}>
      <form id="role-form" onSubmit={save} className="space-y-4">
        {error && <Notice>{error}</Notice>}
        <Field label={t('crm.fields.name', 'Name')} htmlFor="rl-name">
          <input id="rl-name" className="field" required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label={t('crm.roles.key', 'Key')} htmlFor="rl-key" hint={t('crm.roles.keyHint', 'Latin letters, digits and _; cannot be changed later.')}>
          <input id="rl-key" className="field font-mono" value={key} placeholder={autoKey || 'reviewer'} onChange={(e) => setKey(e.target.value.toLowerCase())} />
        </Field>
        <Field label={t('crm.fields.description', 'Description')} htmlFor="rl-desc">
          <textarea id="rl-desc" className="field" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <p className="text-xs text-text-subtle">{t('crm.roles.startsView', 'The role starts with view-only permissions; tick the rest after creating it.')}</p>
      </form>
    </Drawer>
  );
}
