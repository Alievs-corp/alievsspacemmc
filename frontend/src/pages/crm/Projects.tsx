import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FolderKanban, Plus, Pencil, Trash2, ArrowLeft, CalendarRange, ListChecks, Users, ScrollText, LayoutGrid, Clapperboard, Images } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useCrm } from '@/contexts/CrmContext';
import { crm, PLATFORMS, PROJECT_STATUSES, scopeCan, type Company, type Member, type Platform, type Project, type ProjectInput } from '@/lib/crm';
import { ApiError } from '@/lib/api';
import { EmptyState, ErrorState, LoadingRows, Notice, PageHeader, Spinner, btn, errorMessage, formatDate } from '@/components/admin/ui';
import { Avatar, Drawer, Field, PLATFORM_META, PlatformIcons, ProjectStatusBadge, Segmented, fromDateInput, projectStatusLabel, toDateInput } from '@/components/crm/ui';
import { cn } from '@/lib/utils';
import { useLoad } from '@/components/crm/useLoad';
import { TaskBoard } from './Tasks';
import { TeamList } from './Team';
import { ActivityFeed } from './Activity';
import { ContentList } from './Studio';
import { MediaLibrary } from './Media';
import { ApprovalFlowCard } from './Approvals';

export function ProjectForm({ project, companyId, open, onClose, onSaved }: {
  project: Project | null; companyId?: string; open: boolean; onClose: () => void; onSaved: (p: Project) => void;
}) {
  const { t } = useI18n();
  const { adminMode } = useCrm();
  const [form, setForm] = useState<ProjectInput>({});
  const [companies, setCompanies] = useState<Company[]>([]);
  const [people, setPeople] = useState<Member[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm(project
      ? { name: project.name, description: project.description, managerId: project.managerId, status: project.status, platforms: project.platforms,
          startDate: toDateInput(project.startDate), dueDate: toDateInput(project.dueDate) }
      : { companyId: companyId ?? '', status: 'active', platforms: [] });
    if (!project) {
      crm.companies('active').then((list) => setCompanies(list.filter((c) => adminMode || c.scope.permissions.includes('company.manage')))).catch(() => setCompanies([]));
    }
  }, [open, project, companyId, adminMode]);

  const targetCompany = project?.companyId ?? form.companyId;
  useEffect(() => {
    if (!open || !targetCompany) { setPeople([]); return; }
    const f = project ? { projectId: project.id, active: true } : { companyId: targetCompany, active: true };
    crm.members(f).then((list) => setPeople(project ? list : list.filter((m) => !m.projectId))).catch(() => setPeople([]));
  }, [open, targetCompany, project]);

  const managers = useMemo(() => {
    const seen = new Map<string, Member['user']>();
    people.forEach((m) => m.user && seen.set(m.userId, m.user));
    return [...seen.entries()];
  }, [people]);

  const togglePlatform = (p: Platform) => {
    const list = form.platforms ?? [];
    setForm({ ...form, platforms: list.includes(p) ? list.filter((x) => x !== p) : [...list, p] });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload: ProjectInput = { ...form, startDate: form.startDate ? fromDateInput(form.startDate) : '', dueDate: form.dueDate ? fromDateInput(form.dueDate) : '' };
    try {
      const saved = project ? await crm.updateProject(project.id, payload) : await crm.createProject(payload);
      onSaved(saved);
      onClose();
    } catch (err) {
      setError(errorMessage(err, t('crm.saveFailed', 'Could not save.')));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={project ? t('crm.projects.edit', 'Edit project') : t('crm.projects.new', 'New project')}
      footer={<>
        <button type="button" onClick={onClose} className={btn.secondary}>{t('ui.cancel', 'Cancel')}</button>
        <button type="submit" form="project-form" disabled={saving || !form.name?.trim() || (!project && !form.companyId)} className={btn.primary}>
          {saving && <Spinner />} {t('account.profile.save', 'Save changes')}
        </button>
      </>}
    >
      <form id="project-form" onSubmit={save} className="space-y-4">
        {error && <Notice>{error}</Notice>}
        {!project && !companyId && (
          <Field label={t('crm.company', 'Company')} htmlFor="pr-company">
            <select id="pr-company" className="field" required value={form.companyId ?? ''} onChange={(e) => setForm({ ...form, companyId: e.target.value, managerId: '' })}>
              <option value="">{t('crm.select', 'Select…')}</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
        )}
        <Field label={t('crm.fields.name', 'Name')} htmlFor="pr-name">
          <input id="pr-name" className="field" required maxLength={200} value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label={t('crm.fields.description', 'Description')} htmlFor="pr-desc">
          <textarea id="pr-desc" className="field" rows={4} value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
        <Field label={t('crm.fields.manager', 'Responsible manager')} htmlFor="pr-manager"
          hint={t('crm.fields.managerHint', 'Only people with access to this project can be chosen.')}>
          <select id="pr-manager" className="field" value={form.managerId ?? ''} onChange={(e) => setForm({ ...form, managerId: e.target.value })}>
            <option value="">{t('crm.none', 'Not set')}</option>
            {managers.map(([id, u]) => <option key={id} value={id}>{u?.name || u?.email}</option>)}
          </select>
        </Field>
        <fieldset className="space-y-1.5">
          <legend className="text-sm font-medium text-text">{t('crm.fields.platforms', 'Social networks')}</legend>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => {
              const m = PLATFORM_META[p];
              const on = (form.platforms ?? []).includes(p);
              return (
                <button key={p} type="button" onClick={() => togglePlatform(p)} aria-pressed={on}
                  className={cn('inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors',
                    on ? 'border-primary bg-primary/10 text-text' : 'border-border text-text-muted hover:bg-surface-3')}>
                  <m.Icon className={cn('h-4 w-4', m.color)} /> {m.label}
                </button>
              );
            })}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('crm.fields.start', 'Start date')} htmlFor="pr-start">
            <input id="pr-start" type="date" className="field" value={form.startDate ?? ''} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </Field>
          <Field label={t('crm.fields.due', 'Due date')} htmlFor="pr-due">
            <input id="pr-due" type="date" className="field" value={form.dueDate ?? ''} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </Field>
        </div>
        {project && (
          <Field label={t('panel.users.status', 'Status')} htmlFor="pr-status">
            <select id="pr-status" className="field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Project['status'] })}>
              {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{projectStatusLabel(s)}</option>)}
            </select>
          </Field>
        )}
      </form>
    </Drawer>
  );
}

/** Project cards; reused on the company page. */
export function ProjectList({ companyId, canCreate }: { companyId?: string; canCreate?: boolean }) {
  const { t } = useI18n();
  const [creating, setCreating] = useState(false);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const { data: items, error, reload: load } = useLoad<Project[]>(() => crm.projects({ companyId, status: status || undefined }), [companyId, status]);

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {companyId && <h2 className="font-display text-lg font-semibold text-text">{t('crm.nav.projects', 'Projects')}</h2>}
        <div className="ml-auto flex flex-wrap gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="field py-2 text-sm" aria-label={t('panel.users.status', 'Status')}>
            <option value="">{t('crm.filters.allStatuses', 'All statuses')}</option>
            {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{projectStatusLabel(s)}</option>)}
          </select>
          {canCreate && <button onClick={() => setCreating(true)} className={btn.primary}><Plus className="h-4 w-4" /> {t('crm.projects.new', 'New project')}</button>}
        </div>
      </div>
      {error ? <ErrorState message={error} onRetry={load} /> : !items ? <LoadingRows rows={3} /> : items.length === 0 ? (
        <EmptyState icon={<FolderKanban className="h-12 w-12" />} title={t('crm.projects.empty', 'No projects yet')} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => (
            <Link key={p.id} to={`/crm/projects/${p.id}`} className="card card-interactive flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-display font-semibold text-text">{p.name}</p>
                  {!companyId && <p className="truncate text-xs text-text-subtle">{p.companyName}</p>}
                </div>
                <ProjectStatusBadge status={p.status} />
              </div>
              {p.description && <p className="line-clamp-2 text-sm text-text-muted">{p.description}</p>}
              <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-subtle">
                <PlatformIcons platforms={p.platforms} />
                <span><b className="text-text">{p.openTasks}</b> {t('crm.openTasksLower', 'open tasks')}</span>
                <span><b className="text-text">{p.memberCount}</b> {t('crm.peopleLower', 'people')}</span>
                {p.manager && <span className="ml-auto flex items-center gap-1.5"><Avatar size="sm" name={p.manager.name} email={p.manager.email} /></span>}
              </div>
            </Link>
          ))}
        </div>
      )}
      <ProjectForm project={null} companyId={companyId} open={creating} onClose={() => setCreating(false)} onSaved={(p) => navigate(`/crm/projects/${p.id}`)} />
    </section>
  );
}

export function CrmProjects() {
  const { t } = useI18n();
  const { adminMode, readOnly, can } = useCrm();
  return (
    <div className="space-y-6">
      <PageHeader
        title={adminMode ? t('crm.nav.allProjects', 'All projects') : t('crm.nav.projects', 'Projects')}
        subtitle={t('crm.projects.subtitle', 'Each project is a separate workspace with its own team, tasks and networks.')}
      />
      <ProjectList canCreate={!readOnly && can('company.manage')} />
    </div>
  );
}

type Tab = 'overview' | 'content' | 'media' | 'tasks' | 'team' | 'activity';

export function CrmProjectWorkspace() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { readOnly } = useCrm();
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') as Tab) || 'overview';
  const [editing, setEditing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: project, error, reload: load } = useLoad<Project>(() => crm.project(id), [id]);

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!project) return <LoadingRows />;

  const canEdit = !readOnly && (scopeCan(project.scope, 'project.manage') || scopeCan(project.scope, 'company.manage'));
  const canDelete = !readOnly && scopeCan(project.scope, 'company.manage');

  const remove = async () => {
    if (!window.confirm(t('crm.projects.confirmDelete', 'Delete this project? Projects with tasks can only be archived.'))) return;
    setActionError(null);
    try {
      await crm.deleteProject(project.id);
      navigate(`/crm/companies/${project.companyId}`);
    } catch (err) {
      setActionError(err instanceof ApiError && err.code === 'project_not_empty'
        ? t('crm.projects.notEmpty', 'The project has tasks. Archive it instead.')
        : errorMessage(err, t('crm.saveFailed', 'Could not save.')));
    }
  };

  const tabs: Array<{ value: Tab; label: string; icon: React.ReactNode }> = [
    { value: 'overview', label: t('crm.tabs.overview', 'Overview'), icon: <LayoutGrid className="h-4 w-4" /> },
    ...(scopeCan(project.scope, 'content.view') ? [{ value: 'content' as Tab, label: t('crm.tabs.content', 'Content'), icon: <Clapperboard className="h-4 w-4" /> }] : []),
    ...(scopeCan(project.scope, 'media.view') ? [{ value: 'media' as Tab, label: t('crm.tabs.media', 'Media'), icon: <Images className="h-4 w-4" /> }] : []),
    { value: 'tasks', label: t('crm.nav.tasks', 'Tasks'), icon: <ListChecks className="h-4 w-4" /> },
    { value: 'team', label: t('crm.nav.team', 'Team'), icon: <Users className="h-4 w-4" /> },
    { value: 'activity', label: t('crm.tabs.history', 'History'), icon: <ScrollText className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <Link to={`/crm/companies/${project.companyId}`} className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-4 w-4" /> {project.companyName}
      </Link>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-text sm:text-3xl">{project.name}</h1>
            <ProjectStatusBadge status={project.status} />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
            {project.platforms.length > 0 && <PlatformIcons platforms={project.platforms} />}
            {(project.startDate || project.dueDate) && (
              <span className="inline-flex items-center gap-1"><CalendarRange className="h-3.5 w-3.5" /> {formatDate(project.startDate)} – {formatDate(project.dueDate)}</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {canEdit && <button onClick={() => setEditing(true)} className={btn.secondary}><Pencil className="h-4 w-4" /> {t('crm.edit', 'Edit')}</button>}
          {canDelete && <button onClick={remove} className={btn.danger} aria-label={t('panel.users.delete', 'Delete')}><Trash2 className="h-4 w-4" /></button>}
        </div>
      </header>
      {actionError && <Notice>{actionError}</Notice>}

      <Segmented value={tab} options={tabs} label={t('crm.tabs.label', 'Project sections')}
        onChange={(v) => setParams((p) => { p.set('tab', v); p.delete('task'); return p; }, { replace: true })} />

      {tab === 'overview' && (
        <div className="grid gap-4 lg:grid-cols-3">
          <section className="card space-y-3 p-5 lg:col-span-2">
            <h2 className="font-display font-semibold text-text">{t('crm.tabs.about', 'About the project')}</h2>
            <p className="whitespace-pre-wrap text-sm text-text-muted">{project.description || t('crm.projects.noDescription', 'No description yet.')}</p>
          </section>
          <section className="card space-y-3 p-5 text-sm">
            <div className="flex justify-between gap-3"><span className="text-text-muted">{t('crm.fields.manager', 'Responsible manager')}</span>
              <span className="text-right text-text">{project.manager ? (project.manager.name || project.manager.email) : '—'}</span></div>
            <div className="flex justify-between gap-3"><span className="text-text-muted">{t('crm.nav.team', 'Team')}</span><span className="text-text">{project.memberCount}</span></div>
            <div className="flex justify-between gap-3"><span className="text-text-muted">{t('crm.dashboard.openTasks', 'Open tasks')}</span><span className="text-text">{project.openTasks}</span></div>
            <div className="flex justify-between gap-3"><span className="text-text-muted">{t('crm.fields.created', 'Created')}</span><span className="text-text">{formatDate(project.createdAt)}</span></div>
            <div className="border-t border-border pt-3">
              <p className="mb-1 text-text-muted">{t('crm.projects.yourAccess', 'Your access here')}</p>
              <p className="text-xs text-text-subtle">{project.scope.permissions.length} {t('crm.permissionsLower', 'permissions')}
                {project.scope.platforms && project.scope.platforms.length > 0 && <> · {project.scope.platforms.map((p) => PLATFORM_META[p]?.label).join(', ')}</>}</p>
            </div>
          </section>
          <div className="lg:col-span-1"><ApprovalFlowCard project={project} /></div>
          <div className="lg:col-span-2"><ActivityFeed projectId={project.id} compact /></div>
        </div>
      )}
      {tab === 'content' && <ContentList projectId={project.id} />}
      {tab === 'media' && <MediaLibrary projectId={project.id} />}
      {tab === 'tasks' && <TaskBoard projectId={project.id} />}
      {tab === 'team' && <TeamList projectId={project.id} companyId={project.companyId} />}
      {tab === 'activity' && <ActivityFeed projectId={project.id} />}

      <ProjectForm project={project} open={editing} onClose={() => setEditing(false)} onSaved={() => load()} />
    </div>
  );
}
