import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Columns3, List, CalendarDays, MessageSquare, ChevronLeft, ChevronRight, Trash2, Send, ListChecks } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCrm } from '@/contexts/CrmContext';
import {
  crm, scopeCan, TASK_PRIORITIES, TASK_STATUSES, type Activity, type Project, type Task, type TaskComment, type TaskInput, type TaskStatus, type UserBrief,
} from '@/lib/crm';
import { EmptyState, ErrorState, LoadingRows, Notice, PageHeader, Spinner, btn, errorMessage, formatDate } from '@/components/admin/ui';
import {
  Avatar, Drawer, Field, PriorityBadge, Segmented, TASK_STATUS_DOT, TaskStatusBadge, fromDateInput, isOverdue, priorityLabel, taskStatusLabel, toDateInput,
} from '@/components/crm/ui';
import { cn } from '@/lib/utils';
import { useLoad } from '@/components/crm/useLoad';
import { describeActivity } from './Activity';

type View = 'kanban' | 'list' | 'calendar';
const BOARD_COLUMNS: TaskStatus[] = ['todo', 'in_progress', 'review', 'completed'];

export function CrmTasks() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <PageHeader title={t('crm.nav.tasks', 'Tasks')} subtitle={t('crm.tasks.subtitle', 'Tasks from every project you can access. Drag cards between columns to change their status.')} />
      <TaskBoard />
    </div>
  );
}

/** Kanban / list / calendar of tasks, optionally for one project. */
export function TaskBoard({ projectId }: { projectId?: string }) {
  const { t } = useI18n();
  const { user } = useAuth();
  const { readOnly } = useCrm();
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState<View>(() => (localStorageGet('crm.tasks.view') as View) || 'kanban');
  const [projects, setProjects] = useState<Project[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ projectId: '', q: '', mine: false, showCancelled: false });
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const openTaskId = params.get('task');

  useEffect(() => { localStorageSet('crm.tasks.view', view); }, [view]);
  useEffect(() => {
    const id = setTimeout(() => setQuery(filters.q.trim()), 250);
    return () => clearTimeout(id);
  }, [filters.q]);

  useEffect(() => {
    if (!projectId) crm.projects().then(setProjects).catch(() => setProjects([]));
  }, [projectId]);

  const { data: tasks, setData: setTasks, error, reload: load } = useLoad<Task[]>(() => crm.tasks({ projectId: projectId || filters.projectId || undefined, q: query || undefined, mine: filters.mine }), [projectId, filters.projectId, filters.mine, query]);

  const visible = useMemo(
    () => (tasks ?? []).filter((x) => filters.showCancelled || x.status !== 'cancelled'),
    [tasks, filters.showCancelled],
  );

  const canCreate = !readOnly && (projectId
    ? true // the server answers 403 if the project scope lacks tasks.create
    : projects.some((p) => scopeCan(p.scope, 'tasks.create')));

  const patch = async (task: Task, data: TaskInput) => {
    setActionError(null);
    const before = tasks;
    setTasks((list) => list?.map((x) => (x.id === task.id ? { ...x, ...data } as Task : x)) ?? null);
    try {
      const saved = await crm.updateTask(task.id, data);
      setTasks((list) => list?.map((x) => (x.id === saved.id ? saved : x)) ?? null);
    } catch (err) {
      setTasks(before);
      setActionError(errorMessage(err, t('crm.saveFailed', 'Could not save.')));
    }
  };

  const openTask = (id: string | null) =>
    setParams((p) => { if (id) p.set('task', id); else p.delete('task'); return p; }, { replace: true });

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented<View> value={view} onChange={setView} label={t('crm.tasks.view', 'View')} options={[
          { value: 'kanban', label: t('crm.tasks.kanban', 'Kanban'), icon: <Columns3 className="h-4 w-4" /> },
          { value: 'list', label: t('crm.tasks.list', 'List'), icon: <List className="h-4 w-4" /> },
          { value: 'calendar', label: t('crm.tasks.calendar', 'Calendar'), icon: <CalendarDays className="h-4 w-4" /> },
        ]} />
        <div className="relative min-w-[180px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
          <input type="search" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} className="field py-2 pl-9 text-sm"
            placeholder={t('crm.tasks.search', 'Search tasks')} aria-label={t('crm.tasks.search', 'Search tasks')} />
        </div>
        {!projectId && (
          <select value={filters.projectId} onChange={(e) => setFilters({ ...filters, projectId: e.target.value })} className="field w-auto py-2 text-sm" aria-label={t('crm.project', 'Project')}>
            <option value="">{t('crm.filters.allProjects', 'All projects')}</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.companyName} · {p.name}</option>)}
          </select>
        )}
        <label className="flex items-center gap-2 text-sm text-text-muted">
          <input type="checkbox" checked={filters.mine} onChange={(e) => setFilters({ ...filters, mine: e.target.checked })} className="h-4 w-4 accent-[var(--color-primary)]" />
          {t('crm.tasks.mine', 'Assigned to me')}
        </label>
        <label className="flex items-center gap-2 text-sm text-text-muted">
          <input type="checkbox" checked={filters.showCancelled} onChange={(e) => setFilters({ ...filters, showCancelled: e.target.checked })} className="h-4 w-4 accent-[var(--color-primary)]" />
          {t('crm.tasks.showCancelled', 'Show cancelled')}
        </label>
        {canCreate && (
          <button onClick={() => setCreating(true)} className={cn(btn.primary, 'ml-auto')}><Plus className="h-4 w-4" /> {t('crm.tasks.new', 'New task')}</button>
        )}
      </div>

      {actionError && <Notice>{actionError}</Notice>}

      {error ? <ErrorState message={error} onRetry={load} /> : !tasks ? <LoadingRows /> : visible.length === 0 && view !== 'calendar' ? (
        <EmptyState icon={<ListChecks className="h-12 w-12" />} title={t('crm.tasks.empty', 'No tasks here yet')} />
      ) : view === 'kanban' ? (
        <Kanban tasks={visible} showCancelled={filters.showCancelled} onOpen={openTask} onMove={(task, status, position) => patch(task, { status, position })} showProject={!projectId} />
      ) : view === 'list' ? (
        <TaskTable tasks={visible} onOpen={openTask} showProject={!projectId} />
      ) : (
        <TaskCalendar tasks={visible} onOpen={openTask} onReschedule={(task, iso) => patch(task, { dueAt: iso })} />
      )}

      <TaskDrawer
        open={creating || !!openTaskId}
        taskId={creating ? null : openTaskId}
        projectId={projectId || filters.projectId || undefined}
        projects={projects}
        currentUser={user ? { id: user.id, name: user.name, email: user.email, role: user.role } : null}
        onClose={() => { setCreating(false); openTask(null); }}
        onSaved={(saved) => {
          setTasks((list) => list ? (list.some((x) => x.id === saved.id) ? list.map((x) => (x.id === saved.id ? saved : x)) : [saved, ...list]) : [saved]);
          if (creating) { setCreating(false); openTask(saved.id); }
        }}
        onDeleted={(id) => { setTasks((list) => list?.filter((x) => x.id !== id) ?? null); openTask(null); }}
      />
    </section>
  );
}

function localStorageGet(k: string): string | null {
  try { return localStorage.getItem(k); } catch { return null; }
}
function localStorageSet(k: string, v: string) {
  try { localStorage.setItem(k, v); } catch { /* storage unavailable */ }
}

function TaskCard({ task, onOpen, showProject, draggable }: { task: Task; onOpen: () => void; showProject: boolean; draggable: boolean }) {
  const overdue = isOverdue(task.dueAt, task.status);
  return (
    <button
      type="button"
      draggable={draggable}
      onDragStart={(e) => { e.dataTransfer.setData('text/plain', task.id); e.dataTransfer.effectAllowed = 'move'; }}
      onClick={onOpen}
      className={cn('w-full rounded-lg border border-border bg-surface p-3 text-left shadow-sm transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
        draggable && 'cursor-grab active:cursor-grabbing')}
    >
      <p className="text-sm font-medium text-text">{task.title}</p>
      {showProject && <p className="mt-0.5 truncate text-xs text-text-subtle">{task.projectName}</p>}
      <div className="mt-2 flex items-center gap-2 text-xs">
        <PriorityBadge priority={task.priority} />
        {task.dueAt && <span className={cn('tabular-nums', overdue ? 'font-medium text-danger' : 'text-text-subtle')}>{formatDate(task.dueAt)}</span>}
        {task.commentCount > 0 && <span className="inline-flex items-center gap-0.5 text-text-subtle"><MessageSquare className="h-3 w-3" />{task.commentCount}</span>}
        <span className="ml-auto">{task.assignee && <Avatar size="sm" name={task.assignee.name} email={task.assignee.email} />}</span>
      </div>
    </button>
  );
}

function Kanban({ tasks, onOpen, onMove, showProject, showCancelled }: {
  tasks: Task[]; onOpen: (id: string) => void; onMove: (t: Task, s: TaskStatus, position: number) => void; showProject: boolean; showCancelled: boolean;
}) {
  const [over, setOver] = useState<TaskStatus | null>(null);
  const columns = showCancelled ? [...BOARD_COLUMNS, 'cancelled' as TaskStatus] : BOARD_COLUMNS;
  const byStatus = (s: TaskStatus) => tasks.filter((x) => x.status === s).sort((a, b) => a.position - b.position);

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      <div className="grid min-w-[880px] gap-3" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
        {columns.map((status) => {
          const list = byStatus(status);
          return (
            <div
              key={status}
              onDragOver={(e) => { e.preventDefault(); setOver(status); }}
              onDragLeave={() => setOver((s) => (s === status ? null : s))}
              onDrop={(e) => {
                e.preventDefault();
                setOver(null);
                const task = tasks.find((x) => x.id === e.dataTransfer.getData('text/plain'));
                if (!task || !task.can.status || task.status === status) return;
                const last = list[list.length - 1];
                onMove(task, status, last ? last.position + 1 : Date.now());
              }}
              className={cn('flex min-h-[200px] flex-col rounded-xl border bg-surface-2 p-2 transition-colors', over === status ? 'border-primary' : 'border-border')}
            >
              <div className="flex items-center gap-2 px-1.5 pb-2 pt-1">
                <span className={cn('h-2 w-2 rounded-full', TASK_STATUS_DOT[status])} />
                <span className="text-sm font-medium text-text">{taskStatusLabel(status)}</span>
                <span className="ml-auto text-xs tabular-nums text-text-subtle">{list.length}</span>
              </div>
              <div className="space-y-2">
                {list.map((task) => <TaskCard key={task.id} task={task} onOpen={() => onOpen(task.id)} showProject={showProject} draggable={task.can.status} />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TaskTable({ tasks, onOpen, showProject }: { tasks: Task[]; onOpen: (id: string) => void; showProject: boolean }) {
  const { t } = useI18n();
  const sorted = [...tasks].sort((a, b) => (a.dueAt ?? '9999').localeCompare(b.dueAt ?? '9999'));
  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-2 text-xs uppercase tracking-wider text-text-subtle">
            <tr>
              <th className="px-4 py-2.5 font-medium">{t('crm.fields.title', 'Title')}</th>
              {showProject && <th className="hidden px-4 py-2.5 font-medium md:table-cell">{t('crm.project', 'Project')}</th>}
              <th className="px-4 py-2.5 font-medium">{t('panel.users.status', 'Status')}</th>
              <th className="hidden px-4 py-2.5 font-medium sm:table-cell">{t('crm.fields.priority', 'Priority')}</th>
              <th className="hidden px-4 py-2.5 font-medium lg:table-cell">{t('crm.fields.assignee', 'Assignee')}</th>
              <th className="px-4 py-2.5 font-medium">{t('crm.fields.deadline', 'Deadline')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map((task) => (
              <tr key={task.id} onClick={() => onOpen(task.id)} className="cursor-pointer hover:bg-surface-2">
                <td className="px-4 py-2.5">
                  <button className="text-left font-medium text-text hover:text-primary" onClick={(e) => { e.stopPropagation(); onOpen(task.id); }}>{task.title}</button>
                </td>
                {showProject && <td className="hidden px-4 py-2.5 text-text-muted md:table-cell">{task.projectName}</td>}
                <td className="px-4 py-2.5"><TaskStatusBadge status={task.status} /></td>
                <td className="hidden px-4 py-2.5 sm:table-cell"><PriorityBadge priority={task.priority} /></td>
                <td className="hidden px-4 py-2.5 text-text-muted lg:table-cell">{task.assignee ? (task.assignee.name || task.assignee.email) : '—'}</td>
                <td className={cn('whitespace-nowrap px-4 py-2.5 tabular-nums', isOverdue(task.dueAt, task.status) ? 'font-medium text-danger' : 'text-text-muted')}>{formatDate(task.dueAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TaskCalendar({ tasks, onOpen, onReschedule }: { tasks: Task[]; onOpen: (id: string) => void; onReschedule: (t: Task, iso: string) => void }) {
  const { t, locale } = useI18n();
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [over, setOver] = useState<string | null>(null);

  const days = useMemo(() => {
    const first = new Date(month);
    const offset = (first.getDay() + 6) % 7; // Monday first
    const start = new Date(first.getFullYear(), first.getMonth(), 1 - offset);
    return Array.from({ length: 42 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  }, [month]);

  const key = (d: Date) => toDateInput(d.toISOString());
  const byDay = useMemo(() => {
    const m = new Map<string, Task[]>();
    tasks.forEach((task) => {
      if (!task.dueAt) return;
      const k = toDateInput(task.dueAt);
      m.set(k, [...(m.get(k) ?? []), task]);
    });
    return m;
  }, [tasks]);
  const undated = tasks.filter((x) => !x.dueAt && x.status !== 'completed' && x.status !== 'cancelled');
  const today = key(new Date());
  const weekdays = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(locale, { weekday: 'short' }));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className={btn.secondary} aria-label={t('admin.prev', 'Prev')}><ChevronLeft className="h-4 w-4" /></button>
        <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className={btn.secondary} aria-label={t('admin.next', 'Next')}><ChevronRight className="h-4 w-4" /></button>
        <h3 className="font-display text-lg font-semibold text-text first-letter:uppercase">{month.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}</h3>
        <button onClick={() => { const d = new Date(); setMonth(new Date(d.getFullYear(), d.getMonth(), 1)); }} className={cn(btn.secondary, 'ml-auto')}>{t('crm.today', 'Today')}</button>
      </div>
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="grid min-w-[700px] grid-cols-7 overflow-hidden rounded-xl border border-border">
          {weekdays.map((w) => <div key={w} className="border-b border-border bg-surface-2 px-2 py-1.5 text-xs font-medium uppercase text-text-subtle">{w}</div>)}
          {days.map((d) => {
            const k = key(d);
            const list = byDay.get(k) ?? [];
            const inMonth = d.getMonth() === month.getMonth();
            return (
              <div
                key={k}
                onDragOver={(e) => { e.preventDefault(); setOver(k); }}
                onDragLeave={() => setOver((s) => (s === k ? null : s))}
                onDrop={(e) => {
                  e.preventDefault();
                  setOver(null);
                  const task = tasks.find((x) => x.id === e.dataTransfer.getData('text/plain'));
                  if (task && task.can.edit && toDateInput(task.dueAt) !== k) onReschedule(task, fromDateInput(k));
                }}
                className={cn('min-h-[96px] border-b border-r border-border p-1.5 [&:nth-child(7n)]:border-r-0', inMonth ? 'bg-surface' : 'bg-surface-2/60', over === k && 'bg-primary/10')}
              >
                <div className={cn('mb-1 text-xs tabular-nums', k === today ? 'inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary font-semibold text-on-primary' : inMonth ? 'text-text-muted' : 'text-text-subtle')}>{d.getDate()}</div>
                <div className="space-y-1">
                  {list.slice(0, 4).map((task) => (
                    <button key={task.id} draggable={task.can.edit} onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)} onClick={() => onOpen(task.id)}
                      className={cn('flex w-full items-center gap-1 truncate rounded px-1.5 py-0.5 text-left text-[11px] hover:bg-surface-3',
                        isOverdue(task.dueAt, task.status) ? 'text-danger' : 'text-text', task.status === 'completed' && 'text-text-subtle line-through')}>
                      <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', TASK_STATUS_DOT[task.status])} />
                      <span className="truncate">{task.title}</span>
                    </button>
                  ))}
                  {list.length > 4 && <p className="px-1.5 text-[11px] text-text-subtle">+{list.length - 4}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {undated.length > 0 && (
        <div className="card p-3">
          <p className="mb-2 text-sm text-text-muted">{t('crm.tasks.noDate', 'Without a deadline — drag onto a day to schedule')}</p>
          <div className="flex flex-wrap gap-2">
            {undated.map((task) => (
              <button key={task.id} draggable={task.can.edit} onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)} onClick={() => onOpen(task.id)}
                className="rounded-md border border-border px-2 py-1 text-xs text-text hover:bg-surface-3">{task.title}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TaskDrawer({ open, taskId, projectId, projects, currentUser, onClose, onSaved, onDeleted }: {
  open: boolean; taskId: string | null; projectId?: string; projects: Project[]; currentUser: UserBrief | null;
  onClose: () => void; onSaved: (t: Task) => void; onDeleted: (id: string) => void;
}) {
  const { t } = useI18n();
  const { adminMode, readOnly } = useCrm();
  const [task, setTask] = useState<Task | null>(null);
  const [form, setForm] = useState<TaskInput & { due?: string }>({});
  const [people, setPeople] = useState<UserBrief[]>([]);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [history, setHistory] = useState<Activity[]>([]);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isNew = !taskId;
  const pid = task?.projectId ?? form.projectId;

  useEffect(() => {
    if (!open) return;
    setError(null);
    setComment('');
    if (isNew) {
      setTask(null);
      setComments([]);
      setHistory([]);
      setForm({ projectId: projectId ?? '', status: 'todo', priority: 'medium', title: '', description: '', assigneeId: '', due: '' });
      return;
    }
    setLoading(true);
    Promise.all([crm.task(taskId!), crm.taskComments(taskId!), crm.activity({ entityType: 'task', entityId: taskId! })])
      .then(([tk, cm, hs]) => {
        setTask(tk);
        setComments(cm);
        setHistory(hs);
        setForm({ title: tk.title, description: tk.description, status: tk.status, priority: tk.priority, assigneeId: tk.assigneeId, due: toDateInput(tk.dueAt) });
      })
      .catch((err) => setError(errorMessage(err, t('crm.loadFailed', 'Could not load data.'))))
      .finally(() => setLoading(false));
  }, [open, taskId, isNew, projectId, t]);

  useEffect(() => {
    if (!open || !pid) { setPeople([]); return; }
    crm.members({ projectId: pid, active: true }).then((list) => {
      const map = new Map<string, UserBrief>();
      list.forEach((m) => m.user && map.set(m.userId, m.user));
      if (adminMode && currentUser) map.set(currentUser.id, currentUser);
      setPeople([...map.values()]);
    }).catch(() => setPeople(currentUser ? [currentUser] : []));
  }, [open, pid, adminMode, currentUser]);

  const can = task?.can ?? { edit: true, status: true, assign: true, delete: false };
  const editable = !readOnly && (isNew || can.edit);
  const projectOptions = projects.filter((p) => scopeCan(p.scope, 'tasks.create'));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const data: TaskInput = {};
    if (editable) Object.assign(data, { title: form.title, description: form.description, priority: form.priority, dueAt: form.due ? fromDateInput(form.due) : '' });
    if (isNew || can.status) data.status = form.status;
    if (isNew) data.projectId = form.projectId;
    if (isNew || form.assigneeId !== task?.assigneeId) data.assigneeId = form.assigneeId;
    try {
      const saved = isNew ? await crm.createTask(data) : await crm.updateTask(task!.id, data);
      onSaved(saved);
      if (!isNew) {
        setTask(saved);
        crm.activity({ entityType: 'task', entityId: saved.id }).then(setHistory).catch(() => {});
      }
    } catch (err) {
      setError(errorMessage(err, t('crm.saveFailed', 'Could not save.')));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!task || !window.confirm(t('crm.tasks.confirmDelete', 'Delete this task and its comments?'))) return;
    try {
      await crm.deleteTask(task.id);
      onDeleted(task.id);
    } catch (err) {
      setError(errorMessage(err, t('crm.saveFailed', 'Could not save.')));
    }
  };

  const addComment = async () => {
    if (!task || !comment.trim()) return;
    try {
      const c = await crm.addTaskComment(task.id, comment.trim());
      setComments((list) => [...list, c]);
      setComment('');
    } catch (err) {
      setError(errorMessage(err, t('crm.saveFailed', 'Could not save.')));
    }
  };

  const assignOptions = can.assign || isNew ? people : people.filter((p) => p.id === currentUser?.id || p.id === task?.assigneeId);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      wide
      title={isNew ? t('crm.tasks.new', 'New task') : task?.title ?? '…'}
      footer={!readOnly && (isNew || can.edit || can.status) ? <>
        {task && can.delete && <button type="button" onClick={remove} className={cn(btn.danger, 'mr-auto')}><Trash2 className="h-4 w-4" /> {t('panel.users.delete', 'Delete')}</button>}
        <button type="button" onClick={onClose} className={btn.secondary}>{t('ui.cancel', 'Cancel')}</button>
        <button type="submit" form="task-form" disabled={saving || !form.title?.trim() || (isNew && !form.projectId)} className={btn.primary}>
          {saving && <Spinner />} {isNew ? t('crm.create', 'Create') : t('account.profile.save', 'Save changes')}
        </button>
      </> : undefined}
    >
      {loading ? <LoadingRows rows={4} /> : (
        <div className="space-y-6">
          <form id="task-form" onSubmit={save} className="space-y-4">
            {error && <Notice>{error}</Notice>}
            {task && <p className="text-sm text-text-subtle">{task.companyName} · {task.projectName}{task.creator && <> · {t('crm.tasks.createdBy', 'created by')} {task.creator.name || task.creator.email}</>}</p>}
            {isNew && !projectId && (
              <Field label={t('crm.project', 'Project')} htmlFor="tk-project">
                <select id="tk-project" className="field" required value={form.projectId ?? ''} onChange={(e) => setForm({ ...form, projectId: e.target.value, assigneeId: '' })}>
                  <option value="">{t('crm.select', 'Select…')}</option>
                  {projectOptions.map((p) => <option key={p.id} value={p.id}>{p.companyName} · {p.name}</option>)}
                </select>
              </Field>
            )}
            <Field label={t('crm.fields.title', 'Title')} htmlFor="tk-title">
              <input id="tk-title" className="field" required maxLength={300} disabled={!editable} value={form.title ?? ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Field label={t('crm.fields.description', 'Description')} htmlFor="tk-desc">
              <textarea id="tk-desc" className="field" rows={5} disabled={!editable} value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t('panel.users.status', 'Status')} htmlFor="tk-status">
                <select id="tk-status" className="field" disabled={readOnly || (!isNew && !can.status)} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}>
                  {TASK_STATUSES.map((s) => <option key={s} value={s}>{taskStatusLabel(s)}</option>)}
                </select>
              </Field>
              <Field label={t('crm.fields.priority', 'Priority')} htmlFor="tk-priority">
                <select id="tk-priority" className="field" disabled={!editable} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Task['priority'] })}>
                  {TASK_PRIORITIES.map((p) => <option key={p} value={p}>{priorityLabel(p)}</option>)}
                </select>
              </Field>
              <Field label={t('crm.fields.assignee', 'Assignee')} htmlFor="tk-assignee">
                <select id="tk-assignee" className="field" disabled={readOnly || !pid} value={form.assigneeId ?? ''} onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}>
                  <option value="">{t('crm.unassigned', 'Unassigned')}</option>
                  {assignOptions.map((u) => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
                </select>
              </Field>
              <Field label={t('crm.fields.deadline', 'Deadline')} htmlFor="tk-due">
                <input id="tk-due" type="date" className="field" disabled={!editable} value={form.due ?? ''} onChange={(e) => setForm({ ...form, due: e.target.value })} />
              </Field>
            </div>
            {task && isOverdue(task.dueAt, task.status) && <Notice tone="warning">{t('crm.tasks.overdue', 'This task is overdue.')}</Notice>}
          </form>

          {task && (
            <section className="space-y-3">
              <h3 className="flex items-center gap-2 font-medium text-text"><MessageSquare className="h-4 w-4 text-text-subtle" /> {t('crm.tasks.comments', 'Comments')}</h3>
              {comments.length === 0 && <p className="text-sm text-text-subtle">{t('crm.tasks.noComments', 'No comments yet.')}</p>}
              <ul className="space-y-3">
                {comments.map((c) => (
                  <li key={c.id} className="flex gap-3">
                    <Avatar size="sm" name={c.author?.name} email={c.author?.email} />
                    <div className="min-w-0 flex-1 rounded-lg bg-surface-2 px-3 py-2">
                      <p className="text-xs text-text-subtle"><span className="font-medium text-text">{c.author?.name || c.author?.email}</span> · {formatDate(c.createdAt, true)}</p>
                      <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-text">{c.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
              {!readOnly && (
                <div className="flex gap-2">
                  <textarea rows={2} value={comment} onChange={(e) => setComment(e.target.value)} className="field flex-1" placeholder={t('crm.tasks.writeComment', 'Write a comment…')}
                    onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addComment(); }} />
                  <button type="button" onClick={addComment} disabled={!comment.trim()} className={btn.primary} aria-label={t('crm.send', 'Send')}><Send className="h-4 w-4" /></button>
                </div>
              )}
            </section>
          )}

          {task && history.length > 0 && (
            <section className="space-y-2">
              <h3 className="font-medium text-text">{t('crm.tabs.history', 'History')}</h3>
              <ul className="space-y-1.5 border-l border-border pl-4 text-sm">
                {history.map((h) => (
                  <li key={h.id} className="text-text-muted">
                    <span className="text-text">{h.actor?.name || h.actor?.email || '—'}</span> {describeActivity(h)}
                    <span className="block text-xs text-text-subtle">{formatDate(h.createdAt, true)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </Drawer>
  );
}
