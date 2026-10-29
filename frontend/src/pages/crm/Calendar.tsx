import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, CalendarRange, ChevronLeft, ChevronRight, Columns3, List, Plus, Rows3, Square } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useCrm } from '@/contexts/CrmContext';
import { ApiError } from '@/lib/api';
import { EFFECTIVE_STATUSES, PLATFORMS, crm, type CalendarEntry, type EffectiveStatus, type Project, type UserBrief } from '@/lib/crm';
import { ErrorState, LoadingRows, Notice, PageHeader, btn, errorMessage } from '@/components/admin/ui';
import { Avatar, PLATFORM_META, Segmented, toDateInput } from '@/components/crm/ui';
import { CONTENT_STATUS_DOT, ContentStatusBadge, MediaThumb, contentStatusLabel, formatLabel } from '@/components/crm/content';
import { useLoad } from '@/components/crm/useLoad';
import { cn } from '@/lib/utils';

type View = 'day' | 'week' | 'month' | 'list' | 'kanban';

function storedView(): View {
  try { return (localStorage.getItem('crm.calendar.view') as View) || 'month'; } catch { return 'month'; }
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const mondayOf = (d: Date) => addDays(startOfDay(d), -((d.getDay() + 6) % 7));
const entryDate = (e: CalendarEntry) => e.publishedAt ?? e.scheduledAt;

/** Range shown by each view: [from, to). */
function rangeFor(view: View, anchor: Date): [Date, Date] {
  if (view === 'day') return [startOfDay(anchor), addDays(startOfDay(anchor), 1)];
  if (view === 'week') { const m = mondayOf(anchor); return [m, addDays(m, 7)]; }
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  if (view === 'month') { const s = mondayOf(first); return [s, addDays(s, 42)]; }
  return [first, new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1)];
}

export function CrmCalendar() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const { readOnly, can, me } = useCrm();
  const [view, setView] = useState<View>(storedView);
  const [anchor, setAnchor] = useState(() => startOfDay(new Date()));
  const [f, setF] = useState({ projectId: '', platform: '', assigneeId: '', status: '' });
  const [actionError, setActionError] = useState<string | null>(null);
  useEffect(() => { try { localStorage.setItem('crm.calendar.view', view); } catch { /* storage unavailable */ } }, [view]);

  const [from, to] = rangeFor(view, anchor);
  const { data: projects } = useLoad<Project[]>(() => crm.projects(), []);
  const filter = { projectId: f.projectId || undefined, platform: f.platform || undefined, assigneeId: f.assigneeId || undefined, status: f.status || undefined };
  const { data: entries, setData: setEntries, error, reload } = useLoad<CalendarEntry[]>(
    () => crm.calendar({ ...filter, from: from.toISOString(), to: to.toISOString() }),
    [from.getTime(), to.getTime(), f.projectId, f.platform, f.assigneeId, f.status],
  );
  const { data: unscheduled, setData: setUnscheduled } = useLoad<CalendarEntry[]>(
    () => crm.calendar({ ...filter, unscheduled: true }), [f.projectId, f.platform, f.assigneeId, f.status],
  );

  const people = useMemo(() => {
    const m = new Map<string, UserBrief>();
    [...(entries ?? []), ...(unscheduled ?? [])].forEach((e) => e.assignee && m.set(e.assignee.id, e.assignee));
    return [...m.values()];
  }, [entries, unscheduled]);

  const open = (e: CalendarEntry) => navigate(`/crm/studio/${e.contentId}?platform=${e.platform}`);

  /** Moves a publication to another day, keeping its time (10:00 if it had none). */
  const reschedule = async (entryId: string, day: Date) => {
    const e = [...(entries ?? []), ...(unscheduled ?? [])].find((x) => x.id === entryId);
    if (!e || readOnly || !e.can.reschedule || e.publishStatus === 'published') return;
    const prev = e.scheduledAt ? new Date(e.scheduledAt) : null;
    const next = new Date(day.getFullYear(), day.getMonth(), day.getDate(), prev ? prev.getHours() : 10, prev ? prev.getMinutes() : 0);
    if (prev && toDateInput(prev.toISOString()) === toDateInput(next.toISOString())) return;
    setActionError(null);
    const moved = { ...e, scheduledAt: next.toISOString() };
    const beforeEntries = entries, beforeUnscheduled = unscheduled;
    setEntries((l) => [...(l ?? []).filter((x) => x.id !== e.id), moved]);
    setUnscheduled((l) => l?.filter((x) => x.id !== e.id) ?? null);
    try {
      await crm.updatePublication(e.id, { scheduledAt: next.toISOString() });
    } catch (err) {
      setEntries(beforeEntries);
      setUnscheduled(beforeUnscheduled);
      setActionError(err instanceof ApiError && err.status === 400
        ? t('crm.calendar.futureOnly', 'A scheduled publication can only move to a future date.')
        : errorMessage(err, t('crm.saveFailed', 'Could not save.')));
    }
  };

  const step = (dir: number) => {
    if (view === 'day') setAnchor(addDays(anchor, dir));
    else if (view === 'week') setAnchor(addDays(anchor, 7 * dir));
    else setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() + dir, 1));
  };
  const heading = view === 'day'
    ? anchor.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : view === 'week'
      ? `${from.toLocaleDateString(locale, { day: 'numeric', month: 'short' })} – ${addDays(to, -1).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}`
      : anchor.toLocaleDateString(locale, { month: 'long', year: 'numeric' });

  const list = entries ?? [];
  return (
    <div className="space-y-6">
      <PageHeader title={t('crm.nav.calendar', 'Content Calendar')}
        subtitle={t('crm.calendar.subtitle', 'Every planned and published post. Drag a post to another day to move it.')}
        actions={!readOnly && can('content.create') ? <Link to="/crm/studio" className={btn.primary}><Plus className="h-4 w-4" /> {t('crm.studio.new', 'New content')}</Link> : undefined} />

      <div className="flex flex-wrap items-center gap-2">
        <Segmented<View> value={view} onChange={setView} label={t('crm.tasks.view', 'View')} options={[
          { value: 'day', label: t('crm.calendar.day', 'Day'), icon: <Square className="h-4 w-4" /> },
          { value: 'week', label: t('crm.calendar.week', 'Week'), icon: <Rows3 className="h-4 w-4" /> },
          { value: 'month', label: t('crm.calendar.month', 'Month'), icon: <CalendarDays className="h-4 w-4" /> },
          { value: 'list', label: t('crm.tasks.list', 'List'), icon: <List className="h-4 w-4" /> },
          { value: 'kanban', label: t('crm.tasks.kanban', 'Kanban'), icon: <Columns3 className="h-4 w-4" /> },
        ]} />
        <select value={f.projectId} onChange={(e) => setF({ ...f, projectId: e.target.value })} className="field w-auto py-2 text-sm" aria-label={t('crm.project', 'Project')}>
          <option value="">{t('crm.filters.allProjects', 'All projects')}</option>
          {(projects ?? []).map((p) => <option key={p.id} value={p.id}>{p.companyName} · {p.name}</option>)}
        </select>
        <select value={f.platform} onChange={(e) => setF({ ...f, platform: e.target.value })} className="field w-auto py-2 text-sm" aria-label={t('crm.fields.platform', 'Platform')}>
          <option value="">{t('crm.filters.allPlatforms', 'All platforms')}</option>
          {PLATFORMS.filter((p) => !me || me.platforms.includes(p)).map((p) => <option key={p} value={p}>{PLATFORM_META[p].label}</option>)}
        </select>
        <select value={f.assigneeId} onChange={(e) => setF({ ...f, assigneeId: e.target.value })} className="field w-auto py-2 text-sm" aria-label={t('crm.fields.assignee', 'Assignee')}>
          <option value="">{t('crm.filters.everyone', 'Everyone')}</option>
          {people.map((p) => <option key={p.id} value={p.id}>{p.name || p.email}</option>)}
        </select>
        <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })} className="field w-auto py-2 text-sm" aria-label={t('panel.users.status', 'Status')}>
          <option value="">{t('crm.filters.allStatuses', 'All statuses')}</option>
          {EFFECTIVE_STATUSES.map((s) => <option key={s} value={s}>{contentStatusLabel(s)}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => step(-1)} className={btn.secondary} aria-label={t('admin.prev', 'Prev')}><ChevronLeft className="h-4 w-4" /></button>
        <button onClick={() => step(1)} className={btn.secondary} aria-label={t('admin.next', 'Next')}><ChevronRight className="h-4 w-4" /></button>
        <h2 className="font-display text-lg font-semibold text-text first-letter:uppercase">{heading}</h2>
        <button onClick={() => setAnchor(startOfDay(new Date()))} className={cn(btn.secondary, 'ml-auto')}>{t('crm.today', 'Today')}</button>
      </div>

      {actionError && <Notice>{actionError}</Notice>}

      {error ? <ErrorState message={error} onRetry={reload} /> : !entries ? <LoadingRows /> : (
        <>
          {view === 'month' && <MonthGrid from={from} anchor={anchor} entries={list} onOpen={open} onDrop={reschedule} />}
          {view === 'week' && <WeekGrid from={from} entries={list} onOpen={open} onDrop={reschedule} />}
          {view === 'day' && <DayList day={anchor} entries={list} onOpen={open} />}
          {view === 'list' && <ListView entries={list} onOpen={open} />}
          {view === 'kanban' && <KanbanView entries={[...list, ...(unscheduled ?? [])]} onOpen={open} />}
        </>
      )}

      {view !== 'kanban' && unscheduled && unscheduled.length > 0 && (
        <section className="card space-y-2 p-3">
          <p className="flex items-center gap-2 text-sm text-text-muted"><CalendarRange className="h-4 w-4" /> {t('crm.calendar.unscheduled', 'Without a date — drag onto a day to plan it')}</p>
          <div className="flex flex-wrap gap-2">
            {unscheduled.map((e) => <EntryChip key={e.id} entry={e} onOpen={open} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function EntryChip({ entry, onOpen, showTime }: { entry: CalendarEntry; onOpen: (e: CalendarEntry) => void; showTime?: boolean }) {
  const { locale } = useI18n();
  const m = PLATFORM_META[entry.platform];
  const when = entryDate(entry);
  const draggable = entry.can.reschedule && entry.publishStatus !== 'published';
  return (
    <button type="button" draggable={draggable} onClick={() => onOpen(entry)}
      onDragStart={(e) => { e.dataTransfer.setData('text/plain', entry.id); e.dataTransfer.effectAllowed = 'move'; }}
      title={`${entry.title} · ${m.label} · ${contentStatusLabel(entry.status)}`}
      className={cn('flex w-full items-center gap-1 truncate rounded border border-border bg-surface px-1.5 py-0.5 text-left text-[11px] text-text hover:border-primary/50', draggable && 'cursor-grab')}>
      <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', CONTENT_STATUS_DOT[entry.status])} />
      <m.Icon className={cn('h-3 w-3 shrink-0', m.color)} />
      {showTime !== false && when && <span className="shrink-0 tabular-nums text-text-subtle">{new Date(when).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</span>}
      <span className="truncate">{entry.title}</span>
    </button>
  );
}

function DropDay({ day, onDrop, className, children }: { day: Date; onDrop: (id: string, day: Date) => void; className?: string; children: React.ReactNode }) {
  const [over, setOver] = useState(false);
  return (
    <div onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); const id = e.dataTransfer.getData('text/plain'); if (id) onDrop(id, day); }}
      className={cn(className, over && 'bg-primary/10')}>
      {children}
    </div>
  );
}

function byDay(entries: CalendarEntry[]) {
  const m = new Map<string, CalendarEntry[]>();
  [...entries].sort((a, b) => (entryDate(a) ?? '').localeCompare(entryDate(b) ?? '')).forEach((e) => {
    const d = entryDate(e);
    if (!d) return;
    const k = toDateInput(d);
    m.set(k, [...(m.get(k) ?? []), e]);
  });
  return m;
}

function MonthGrid({ from, anchor, entries, onOpen, onDrop }: { from: Date; anchor: Date; entries: CalendarEntry[]; onOpen: (e: CalendarEntry) => void; onDrop: (id: string, d: Date) => void }) {
  const { locale } = useI18n();
  const days = Array.from({ length: 42 }, (_, i) => addDays(from, i));
  const grouped = useMemo(() => byDay(entries), [entries]);
  const today = toDateInput(new Date().toISOString());
  const weekdays = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(locale, { weekday: 'short' }));
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="grid min-w-[760px] grid-cols-7 overflow-hidden rounded-xl border border-border">
        {weekdays.map((w) => <div key={w} className="border-b border-border bg-surface-2 px-2 py-1.5 text-xs font-medium uppercase text-text-subtle">{w}</div>)}
        {days.map((d) => {
          const k = toDateInput(d.toISOString());
          const list = grouped.get(k) ?? [];
          const inMonth = d.getMonth() === anchor.getMonth();
          return (
            <DropDay key={k} day={d} onDrop={onDrop}
              className={cn('min-h-[110px] border-b border-r border-border p-1.5 [&:nth-child(7n)]:border-r-0', inMonth ? 'bg-surface' : 'bg-surface-2/60')}>
              <div className={cn('mb-1 text-xs tabular-nums', k === today ? 'inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary font-semibold text-on-primary' : inMonth ? 'text-text-muted' : 'text-text-subtle')}>{d.getDate()}</div>
              <div className="space-y-1">
                {list.slice(0, 4).map((e) => <EntryChip key={e.id} entry={e} onOpen={onOpen} />)}
                {list.length > 4 && <p className="px-1.5 text-[11px] text-text-subtle">+{list.length - 4}</p>}
              </div>
            </DropDay>
          );
        })}
      </div>
    </div>
  );
}

function WeekGrid({ from, entries, onOpen, onDrop }: { from: Date; entries: CalendarEntry[]; onOpen: (e: CalendarEntry) => void; onDrop: (id: string, d: Date) => void }) {
  const { locale } = useI18n();
  const grouped = useMemo(() => byDay(entries), [entries]);
  const today = toDateInput(new Date().toISOString());
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="grid min-w-[880px] grid-cols-7 gap-2">
        {Array.from({ length: 7 }, (_, i) => addDays(from, i)).map((d) => {
          const k = toDateInput(d.toISOString());
          return (
            <DropDay key={k} day={d} onDrop={onDrop} className="min-h-[320px] rounded-xl border border-border bg-surface-2 p-2">
              <p className={cn('mb-2 text-sm capitalize', k === today ? 'font-semibold text-primary' : 'text-text-muted')}>{d.toLocaleDateString(locale, { weekday: 'short', day: 'numeric' })}</p>
              <div className="space-y-2">
                {(grouped.get(k) ?? []).map((e) => <EntryCard key={e.id} entry={e} onOpen={onOpen} compact />)}
              </div>
            </DropDay>
          );
        })}
      </div>
    </div>
  );
}

function EntryCard({ entry, onOpen, compact }: { entry: CalendarEntry; onOpen: (e: CalendarEntry) => void; compact?: boolean }) {
  const { locale } = useI18n();
  const m = PLATFORM_META[entry.platform];
  const when = entryDate(entry);
  const draggable = entry.can.reschedule && entry.publishStatus !== 'published';
  return (
    <button type="button" draggable={draggable} onClick={() => onOpen(entry)}
      onDragStart={(e) => { e.dataTransfer.setData('text/plain', entry.id); e.dataTransfer.effectAllowed = 'move'; }}
      className={cn('flex w-full gap-2 rounded-lg border border-border bg-surface p-2 text-left shadow-sm hover:border-primary/50', draggable && 'cursor-grab')}>
      {entry.thumbnail && !compact && <MediaThumb media={entry.thumbnail} className="h-12 w-12 shrink-0 rounded" />}
      <div className="min-w-0 flex-1 space-y-1">
        <p className="flex items-center gap-1 text-xs text-text-subtle">
          <m.Icon className={cn('h-3.5 w-3.5', m.color)} />
          {when && <span className="tabular-nums">{new Date(when).toLocaleString(locale, compact ? { hour: '2-digit', minute: '2-digit' } : { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>}
        </p>
        <p className="line-clamp-2 text-sm font-medium text-text">{entry.title}</p>
        <div className="flex flex-wrap items-center gap-1"><ContentStatusBadge status={entry.status} /></div>
        {!compact && <p className="truncate text-xs text-text-subtle">{entry.projectName} · {formatLabel(entry.format)}</p>}
      </div>
    </button>
  );
}

function DayList({ day, entries, onOpen }: { day: Date; entries: CalendarEntry[]; onOpen: (e: CalendarEntry) => void }) {
  const { t } = useI18n();
  const list = byDay(entries).get(toDateInput(day.toISOString())) ?? [];
  if (list.length === 0) return <p className="card p-8 text-center text-sm text-text-muted">{t('crm.calendar.nothing', 'Nothing planned for this period.')}</p>;
  return <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{list.map((e) => <EntryCard key={e.id} entry={e} onOpen={onOpen} />)}</div>;
}

function ListView({ entries, onOpen }: { entries: CalendarEntry[]; onOpen: (e: CalendarEntry) => void }) {
  const { t, locale } = useI18n();
  const grouped = [...byDay(entries).entries()];
  if (grouped.length === 0) return <p className="card p-8 text-center text-sm text-text-muted">{t('crm.calendar.nothing', 'Nothing planned for this period.')}</p>;
  return (
    <div className="space-y-4">
      {grouped.map(([k, list]) => (
        <section key={k} className="space-y-2">
          <h3 className="text-sm font-medium capitalize text-text-muted">{new Date(`${k}T00:00`).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
          <ul className="card divide-y divide-border p-0">
            {list.map((e) => {
              const m = PLATFORM_META[e.platform];
              const when = entryDate(e);
              return (
                <li key={e.id}>
                  <button onClick={() => onOpen(e)} className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-2">
                    <span className="w-12 shrink-0 text-sm tabular-nums text-text-muted">{when && new Date(when).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</span>
                    <m.Icon className={cn('h-4 w-4 shrink-0', m.color)} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-text">{e.title}</span>
                      <span className="block truncate text-xs text-text-subtle">{e.companyName} · {e.projectName} · {formatLabel(e.format)}</span>
                    </span>
                    <ContentStatusBadge status={e.status} />
                    {e.assignee && <span className="hidden sm:inline"><Avatar size="sm" name={e.assignee.name} email={e.assignee.email} /></span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Grouped by status. Statuses change through approval and scheduling, so cards open the editor instead of being dragged. */
function KanbanView({ entries, onOpen }: { entries: CalendarEntry[]; onOpen: (e: CalendarEntry) => void }) {
  const { t } = useI18n();
  const columns: EffectiveStatus[] = ['idea', 'in_progress', 'ready_for_review', 'changes_requested', 'approved', 'scheduled', 'published'];
  return (
    <div className="space-y-2">
      <p className="text-xs text-text-subtle">{t('crm.calendar.kanbanHint', 'Includes posts without a date. Statuses change through approval and scheduling in Content Studio.')}</p>
      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <div className="grid min-w-[1260px] grid-cols-7 gap-3">
          {columns.map((s) => {
            const list = entries.filter((e) => e.status === s || (s === 'changes_requested' && (e.status === 'rejected' || e.status === 'failed')));
            return (
              <div key={s} className="flex min-h-[200px] flex-col rounded-xl border border-border bg-surface-2 p-2">
                <div className="flex items-center gap-2 px-1.5 pb-2 pt-1">
                  <span className={cn('h-2 w-2 rounded-full', CONTENT_STATUS_DOT[s])} />
                  <span className="text-sm font-medium text-text">{contentStatusLabel(s)}</span>
                  <span className="ml-auto text-xs tabular-nums text-text-subtle">{list.length}</span>
                </div>
                <div className="space-y-2">{list.map((e) => <EntryCard key={e.id} entry={e} onOpen={onOpen} />)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
