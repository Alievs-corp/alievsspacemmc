import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, Pencil, Trash2, Eye, Search, KeyRound } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useCrm } from '@/contexts/CrmContext';
import {
  crm, PLATFORMS, type Company, type CrmPermission, type Member, type MemberInput, type PermissionInfo, type Platform, type Project, type Role, type UserBrief,
} from '@/lib/crm';
import { ApiError } from '@/lib/api';
import { EmptyState, ErrorState, LoadingRows, Notice, PageHeader, Spinner, Toggle, btn, errorMessage, formatDate } from '@/components/admin/ui';
import { Avatar, Drawer, Field, PLATFORM_META, PlatformIcons, permissionGroupName, permissionName, roleName } from '@/components/crm/ui';
import { cn } from '@/lib/utils';
import { useLoad } from '@/components/crm/useLoad';

export function CrmTeam() {
  const { t } = useI18n();
  const { adminMode } = useCrm();
  return (
    <div className="space-y-6">
      <PageHeader
        title={adminMode ? t('crm.nav.allEmployees', 'All employees') : t('crm.nav.team', 'Team')}
        subtitle={t('crm.team.subtitle', 'Who has access to which company or project, with which role and networks.')}
      />
      <TeamList />
    </div>
  );
}

/** CRM Access Management: the same memberships, grouped by person. */
export function CrmAccess() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('crm.nav.access', 'CRM Access Management')}
        subtitle={t('crm.access.subtitle', 'Registered users get no CRM access until they are added here. Each line grants a role in one company, or in one project of it.')}
      />
      <TeamList groupByUser />
    </div>
  );
}

export function TeamList({ companyId, projectId, title, groupByUser }: { companyId?: string; projectId?: string; title?: string; groupByUser?: boolean }) {
  const { t } = useI18n();
  const { adminMode, readOnly, can, startViewAs } = useCrm();
  const [actionError, setActionError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Member | 'new' | null>(null);
  const [q, setQ] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const { data: members, setData: setMembers, error, reload: load } = useLoad<Member[]>(
    () => crm.members({ companyId: projectId ? undefined : companyId, projectId }), [companyId, projectId]);
  const { data: rolesData } = useLoad<Role[]>(() => crm.roles(), []);
  const roles = rolesData ?? [];

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (members ?? []).filter((m) =>
      (!roleFilter || m.role === roleFilter) &&
      (!s || m.user?.email.toLowerCase().includes(s) || m.user?.name.toLowerCase().includes(s) || m.companyName.toLowerCase().includes(s) || m.projectName.toLowerCase().includes(s)));
  }, [members, q, roleFilter]);

  const groups = useMemo(() => {
    if (!groupByUser) return null;
    const map = new Map<string, { user: UserBrief | null; items: Member[] }>();
    filtered.forEach((m) => {
      const g = map.get(m.userId) ?? { user: m.user, items: [] };
      g.items.push(m);
      map.set(m.userId, g);
    });
    return [...map.entries()];
  }, [filtered, groupByUser]);

  const canAdd = !readOnly && can('team.manage');
  const roleLabel = (key: string) => roleName(key, roles.find((r) => r.key === key)?.name);

  const remove = async (m: Member) => {
    if (!window.confirm(`${t('crm.team.confirmRemove', 'Remove this access?')}\n\n${m.user?.email} · ${m.companyName}${m.projectName ? ' / ' + m.projectName : ''}`)) return;
    setActionError(null);
    try {
      await crm.deleteMember(m.id);
      setMembers((list) => list?.filter((x) => x.id !== m.id) ?? null);
    } catch (err) {
      setActionError(errorMessage(err, t('crm.saveFailed', 'Could not save.')));
    }
  };

  const scopeLabel = (m: Member) => m.projectId
    ? <>{!projectId && <span className="text-text-muted">{m.companyName} / </span>}{m.projectName}</>
    : <>{m.companyName} <span className="text-text-subtle">· {t('crm.team.allProjects', 'all projects')}</span></>;

  const row = (m: Member, showUser: boolean) => (
    <tr key={m.id} className={cn(!m.active && 'opacity-60')}>
      {showUser && (
        <td className="px-4 py-3">
          <div className="flex items-center gap-2.5">
            <Avatar name={m.user?.name} email={m.user?.email} />
            <div className="min-w-0">
              <p className="truncate font-medium text-text">{m.user?.name || m.user?.email}</p>
              <p className="truncate text-xs text-text-subtle">{m.user?.email}</p>
            </div>
          </div>
        </td>
      )}
      <td className="px-4 py-3">
        <p className="font-medium text-text">{roleLabel(m.role)}</p>
        {(m.extraPermissions.length > 0 || m.deniedPermissions.length > 0) && (
          <p className="text-xs text-text-subtle">
            {m.extraPermissions.length > 0 && `+${m.extraPermissions.length}`} {m.deniedPermissions.length > 0 && `−${m.deniedPermissions.length}`} {t('crm.permissionsLower', 'permissions')}
          </p>
        )}
      </td>
      <td className="hidden px-4 py-3 text-sm md:table-cell">{scopeLabel(m)}</td>
      <td className="hidden px-4 py-3 sm:table-cell">{m.platforms.length ? <PlatformIcons platforms={m.platforms} /> : <span className="text-xs text-text-subtle">{t('crm.team.allNetworks', 'All networks')}</span>}</td>
      <td className="hidden px-4 py-3 text-xs text-text-subtle lg:table-cell">{m.active ? formatDate(m.createdAt) : t('crm.team.deactivated', 'Deactivated')}</td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-1">
          {adminMode && m.user && (
            <button onClick={() => startViewAs(m.user!)} className="rounded-md p-2 text-text-subtle hover:bg-surface-3 hover:text-text" title={t('crm.viewAs.action', 'View CRM as this user')} aria-label={t('crm.viewAs.action', 'View CRM as this user')}>
              <Eye className="h-4 w-4" />
            </button>
          )}
          {!readOnly && (
            <>
              <button onClick={() => setEditing(m)} className="rounded-md p-2 text-text-subtle hover:bg-surface-3 hover:text-text" aria-label={t('crm.edit', 'Edit')}><Pencil className="h-4 w-4" /></button>
              <button onClick={() => remove(m)} className="rounded-md p-2 text-text-subtle hover:bg-danger/10 hover:text-danger" aria-label={t('panel.users.delete', 'Delete')}><Trash2 className="h-4 w-4" /></button>
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const head = (showUser: boolean) => (
    <thead className="border-b border-border bg-surface-2 text-xs uppercase tracking-wider text-text-subtle">
      <tr>
        {showUser && <th className="px-4 py-2.5 font-medium">{t('crm.person', 'Person')}</th>}
        <th className="px-4 py-2.5 font-medium">{t('crm.fields.role', 'Role')}</th>
        <th className="hidden px-4 py-2.5 font-medium md:table-cell">{t('crm.fields.scope', 'Access to')}</th>
        <th className="hidden px-4 py-2.5 font-medium sm:table-cell">{t('crm.fields.platforms', 'Social networks')}</th>
        <th className="hidden px-4 py-2.5 font-medium lg:table-cell">{t('crm.fields.since', 'Since')}</th>
        <th className="px-4 py-2.5"><span className="sr-only">{t('crm.actions', 'Actions')}</span></th>
      </tr>
    </thead>
  );

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {title && <h2 className="mr-auto font-display text-lg font-semibold text-text">{title}</h2>}
        <div className="relative min-w-[180px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} className="field py-2 pl-9 text-sm" placeholder={t('crm.team.search', 'Search people')} aria-label={t('crm.team.search', 'Search people')} />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="field w-auto py-2 text-sm" aria-label={t('crm.fields.role', 'Role')}>
          <option value="">{t('crm.filters.allRoles', 'All roles')}</option>
          {roles.map((r) => <option key={r.key} value={r.key}>{roleLabel(r.key)}</option>)}
        </select>
        {canAdd && <button onClick={() => setEditing('new')} className={cn(btn.primary, !title && 'ml-auto')}><UserPlus className="h-4 w-4" /> {t('crm.team.add', 'Add person')}</button>}
      </div>
      {actionError && <Notice>{actionError}</Notice>}

      {error ? <ErrorState message={error} onRetry={load} /> : !members ? <LoadingRows rows={3} /> : filtered.length === 0 ? (
        <EmptyState icon={<Users className="h-12 w-12" />} title={t('crm.team.empty', 'Nobody has access here yet')}
          hint={canAdd ? t('crm.team.emptyHint', 'Add a registered user by their email to give them a role.') : undefined} />
      ) : groups ? (
        <div className="space-y-3">
          {groups.map(([uid, g]) => (
            <div key={uid} className="card overflow-hidden p-0">
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Avatar name={g.user?.name} email={g.user?.email} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-text">{g.user?.name || g.user?.email}</p>
                  <p className="truncate text-xs text-text-subtle">{g.user?.email}</p>
                </div>
                <span className="text-xs text-text-subtle">{g.items.length} {t('crm.access.grants', 'access grants')}</span>
              </div>
              <div className="overflow-x-auto"><table className="min-w-full text-left text-sm">{head(false)}<tbody className="divide-y divide-border">{g.items.map((m) => row(m, false))}</tbody></table></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto"><table className="min-w-full text-left text-sm">{head(true)}<tbody className="divide-y divide-border">{filtered.map((m) => row(m, true))}</tbody></table></div>
        </div>
      )}

      <MemberDrawer
        open={editing !== null}
        member={editing === 'new' ? null : editing}
        companyId={companyId}
        projectId={projectId}
        roles={roles}
        onClose={() => setEditing(null)}
        onSaved={() => { setEditing(null); load(); }}
      />
    </section>
  );
}

type PermState = 'role' | 'extra' | 'denied' | 'off';

function MemberDrawer({ open, member, companyId, projectId, roles, onClose, onSaved }: {
  open: boolean; member: Member | null; companyId?: string; projectId?: string; roles: Role[]; onClose: () => void; onSaved: () => void;
}) {
  const { t } = useI18n();
  const { adminMode } = useCrm();
  const [catalog, setCatalog] = useState<PermissionInfo[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [email, setEmail] = useState('');
  const [found, setFound] = useState<UserBrief[]>([]);
  const [searching, setSearching] = useState(false);
  const [picked, setPicked] = useState<UserBrief | null>(null);
  const [form, setForm] = useState<Required<Pick<MemberInput, 'companyId' | 'role' | 'platforms' | 'extraPermissions' | 'deniedPermissions' | 'active'>> & { projectId: string }>(
    { companyId: '', projectId: '', role: '', platforms: [], extraPermissions: [], deniedPermissions: [], active: true });
  const [advanced, setAdvanced] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setEmail('');
    setFound([]);
    setPicked(member?.user ?? null);
    setAdvanced(!!member && (member.extraPermissions.length > 0 || member.deniedPermissions.length > 0));
    setForm(member
      ? { companyId: member.companyId, projectId: member.projectId ?? '', role: member.role, platforms: member.platforms, extraPermissions: member.extraPermissions, deniedPermissions: member.deniedPermissions, active: member.active }
      : { companyId: companyId ?? '', projectId: projectId ?? '', role: 'viewer', platforms: [], extraPermissions: [], deniedPermissions: [], active: true });
    crm.permissions().then((r) => setCatalog(r.permissions)).catch(() => setCatalog([]));
    if (!member && !companyId) {
      crm.companies('active').then((list) => setCompanies(list.filter((c) => adminMode || c.scope.permissions.includes('team.manage')))).catch(() => setCompanies([]));
    }
  }, [open, member, companyId, projectId, adminMode]);

  useEffect(() => {
    if (!open || !form.companyId || projectId || member) { setProjects([]); return; }
    crm.projects({ companyId: form.companyId }).then(setProjects).catch(() => setProjects([]));
  }, [open, form.companyId, projectId, member]);

  const search = async () => {
    setSearching(true);
    setError(null);
    try {
      const list = await crm.searchUsers(email.trim());
      setFound(list);
      if (list.length === 0) setError(t('crm.team.notFound', 'No registered user with this email. They need to sign up first.'));
    } catch (err) {
      setError(errorMessage(err, t('crm.loadFailed', 'Could not load data.')));
    } finally {
      setSearching(false);
    }
  };

  const role = roles.find((r) => r.key === form.role);
  const stateOf = (p: CrmPermission): PermState => {
    const fromRole = role?.permissions.includes(p);
    if (fromRole) return form.deniedPermissions.includes(p) ? 'denied' : 'role';
    return form.extraPermissions.includes(p) ? 'extra' : 'off';
  };
  const toggle = (p: CrmPermission) => {
    const s = stateOf(p);
    const without = (l: CrmPermission[]) => l.filter((x) => x !== p);
    if (s === 'role') setForm({ ...form, deniedPermissions: [...form.deniedPermissions, p] });
    else if (s === 'denied') setForm({ ...form, deniedPermissions: without(form.deniedPermissions) });
    else if (s === 'extra') setForm({ ...form, extraPermissions: without(form.extraPermissions) });
    else setForm({ ...form, extraPermissions: [...form.extraPermissions, p] });
  };
  const changeRole = (key: string) => {
    // Overrides are relative to the role, so they reset with it.
    setForm({ ...form, role: key, extraPermissions: [], deniedPermissions: [] });
  };
  const togglePlatform = (p: Platform) =>
    setForm({ ...form, platforms: form.platforms.includes(p) ? form.platforms.filter((x) => x !== p) : [...form.platforms, p] });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const body: MemberInput = {
      role: form.role, platforms: form.platforms, extraPermissions: form.extraPermissions, deniedPermissions: form.deniedPermissions, active: form.active,
    };
    try {
      if (member) {
        await crm.updateMember(member.id, body);
      } else {
        await crm.createMember({ ...body, userId: picked!.id, companyId: form.companyId, projectId: form.projectId || null });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError && err.code === 'member_exists'
        ? t('crm.team.exists', 'This person already has access here — edit the existing line instead.')
        : errorMessage(err, t('crm.saveFailed', 'Could not save.')));
    } finally {
      setSaving(false);
    }
  };

  const groups = useMemo(() => {
    const m = new Map<string, PermissionInfo[]>();
    catalog.forEach((p) => m.set(p.group, [...(m.get(p.group) ?? []), p]));
    return [...m.entries()];
  }, [catalog]);

  const ready = !!picked && !!form.companyId && !!form.role;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      wide
      title={member ? t('crm.team.editAccess', 'Edit access') : t('crm.team.add', 'Add person')}
      footer={<>
        <button type="button" onClick={onClose} className={btn.secondary}>{t('ui.cancel', 'Cancel')}</button>
        <button type="submit" form="member-form" disabled={saving || !ready} className={btn.primary}>{saving && <Spinner />} {t('account.profile.save', 'Save changes')}</button>
      </>}
    >
      <form id="member-form" onSubmit={save} className="space-y-5">
        {error && <Notice>{error}</Notice>}

        {picked ? (
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <Avatar name={picked.name} email={picked.email} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-text">{picked.name || picked.email}</p>
              <p className="truncate text-xs text-text-subtle">{picked.email}</p>
            </div>
            {!member && <button type="button" onClick={() => setPicked(null)} className="text-sm text-text-muted hover:text-text">{t('crm.change', 'Change')}</button>}
          </div>
        ) : (
          <Field label={t('crm.team.findUser', 'Registered user')} htmlFor="mb-email"
            hint={adminMode ? t('crm.team.findHintSuper', 'Search by email, name or ID.') : t('crm.team.findHint', 'Type the full email the person registered with.')}>
            <div className="flex gap-2">
              <input id="mb-email" className="field flex-1" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); search(); } }} />
              <button type="button" onClick={search} disabled={email.trim().length < 2 || searching} className={btn.secondary}>{searching ? <Spinner /> : <Search className="h-4 w-4" />}</button>
            </div>
            {found.length > 0 && (
              <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
                {found.map((u) => (
                  <li key={u.id}>
                    <button type="button" onClick={() => { setPicked(u); setFound([]); }} className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-surface-2">
                      <Avatar size="sm" name={u.name} email={u.email} />
                      <span className="min-w-0 flex-1 truncate text-sm text-text">{u.name || u.email} <span className="text-text-subtle">{u.email}</span></span>
                      {u.role === 'super_admin' && <span className="text-xs text-primary">Super admin</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Field>
        )}

        {!member && !companyId && (
          <Field label={t('crm.company', 'Company')} htmlFor="mb-company">
            <select id="mb-company" className="field" required value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value, projectId: '' })}>
              <option value="">{t('crm.select', 'Select…')}</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
        )}
        {!member && !projectId && form.companyId && (
          <Field label={t('crm.fields.scope', 'Access to')} htmlFor="mb-project" hint={t('crm.team.scopeHint', 'Company-wide access also covers projects created later.')}>
            <select id="mb-project" className="field" value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
              <option value="">{t('crm.team.wholeCompany', 'The whole company (all projects)')}</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
        )}
        {member && <p className="text-sm text-text-muted">{t('crm.fields.scope', 'Access to')}: <span className="text-text">{member.companyName}{member.projectName ? ` / ${member.projectName}` : ` · ${t('crm.team.allProjects', 'all projects')}`}</span></p>}

        <Field label={t('crm.fields.role', 'Role')} htmlFor="mb-role" hint={role?.description}>
          <select id="mb-role" className="field" value={form.role} onChange={(e) => changeRole(e.target.value)}>
            {roles.map((r) => <option key={r.key} value={r.key}>{roleName(r.key, r.name)}</option>)}
          </select>
        </Field>

        <fieldset className="space-y-1.5">
          <legend className="text-sm font-medium text-text">{t('crm.fields.platforms', 'Social networks')}</legend>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => {
              const m = PLATFORM_META[p];
              const on = form.platforms.includes(p);
              return (
                <button key={p} type="button" onClick={() => togglePlatform(p)} aria-pressed={on}
                  className={cn('inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm', on ? 'border-primary bg-primary/10 text-text' : 'border-border text-text-muted hover:bg-surface-3')}>
                  <m.Icon className={cn('h-4 w-4', m.color)} /> {m.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-text-subtle">{form.platforms.length === 0 ? t('crm.team.allNetworksHint', 'None selected = access to every network of the project.') : t('crm.team.someNetworksHint', 'Content, publishing, inbox and analytics permissions apply only to the selected networks.')}</p>
        </fieldset>

        <div className="space-y-3">
          <button type="button" onClick={() => setAdvanced((v) => !v)} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover">
            <KeyRound className="h-4 w-4" /> {advanced ? t('crm.team.hidePerms', 'Hide individual permissions') : t('crm.team.showPerms', 'Fine-tune individual permissions')}
          </button>
          {advanced && (
            <div className="space-y-4 rounded-lg border border-border p-3">
              <p className="text-xs text-text-subtle">{t('crm.team.permsHint', 'Ticked = granted. Unticking a role permission revokes it for this person only; ticking an extra one adds it.')}</p>
              {groups.map(([group, perms]) => (
                <div key={group}>
                  <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-text-subtle">{permissionGroupName(group)}</p>
                  <div className="grid gap-1 sm:grid-cols-2">
                    {perms.map((p) => {
                      const s = stateOf(p.key);
                      const on = s === 'role' || s === 'extra';
                      return (
                        <label key={p.key} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-surface-2">
                          <input type="checkbox" checked={on} onChange={() => toggle(p.key)} className="h-4 w-4 accent-[var(--color-primary)]" />
                          <span className={cn('min-w-0 flex-1', s === 'denied' ? 'text-danger line-through' : 'text-text')}>{permissionName(p.key)}</span>
                          {s === 'extra' && <span className="text-[10px] font-medium uppercase text-success">+</span>}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {member && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium text-text">{t('crm.team.active', 'Access active')}</p>
              <p className="text-xs text-text-subtle">{t('crm.team.activeHint', 'Deactivating keeps the record but blocks this access immediately.')}</p>
            </div>
            <Toggle checked={form.active} onChange={(v) => setForm({ ...form, active: v })} label={t('crm.team.active', 'Access active')} />
          </div>
        )}

        {!adminMode && <p className="text-xs text-text-subtle">{t('crm.team.grantLimit', "You can't grant more permissions or networks than you have yourself.")}</p>}
        {member && <p className="text-xs text-text-subtle"><Link to="/crm/activity" className="hover:text-text">{t('crm.team.logged', 'Every change is recorded in the activity log.')}</Link></p>}
      </form>
    </Drawer>
  );
}
