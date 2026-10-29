import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, CalendarClock, Check, CheckCircle2, Clapperboard, ExternalLink, History, ImagePlus, Plus, RotateCcw, Save, Search, Send, Trash2, Undo2, X, XCircle,
} from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCrm } from '@/contexts/CrmContext';
import { ApiError } from '@/lib/api';
import {
  CAPTION_LIMITS, CONTENT_FORMATS, CONTENT_STATUSES, MAX_HASHTAGS, PLATFORMS, TITLE_LIMITS, crm, scopeCan,
  type Approval, type ContentFormat, type ContentItem, type ContentVersion, type Platform, type Project, type Publication, type UserBrief,
} from '@/lib/crm';
import { EmptyState, ErrorState, LoadingRows, Notice, PageHeader, Spinner, btn, errorMessage, formatDate } from '@/components/admin/ui';
import { Avatar, Drawer, Field, PLATFORM_META, PlatformIcons } from '@/components/crm/ui';
import {
  CONTENT_STATUS_DOT, ContentStatusBadge, MediaPicker, MediaThumb, contentStatusLabel, formatLabel, fromDateTimeInput, stepLabel, toDateTimeInput, versionNote,
} from '@/components/crm/content';
import { useLoad } from '@/components/crm/useLoad';
import { cn } from '@/lib/utils';

export function CrmStudio() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <PageHeader title={t('crm.nav.studio', 'Content Studio')}
        subtitle={t('crm.studio.subtitle', 'Prepare one piece of content for several networks, with a separate caption, media and date for each.')} />
      <ContentList />
    </div>
  );
}

function useSaveError() {
  const { t } = useI18n();
  return (err: unknown) => {
    if (err instanceof ApiError) {
      if (err.code === 'not_approved') return t('crm.studio.notApproved', 'The content must be approved first.');
      if (err.code === 'content_published') return t('crm.studio.publishedLocked', 'Published publications can no longer be changed.');
    }
    return errorMessage(err, t('crm.saveFailed', 'Could not save.'));
  };
}

/** Content items, optionally of one project. */
export function ContentList({ projectId }: { projectId?: string }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { readOnly } = useCrm();
  const { data: projects } = useLoad<Project[]>(() => crm.projects(), []);
  const [f, setF] = useState({ projectId: '', status: '', platform: '', mine: false, q: '' });
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);
  useEffect(() => { const id = setTimeout(() => setQuery(f.q.trim()), 250); return () => clearTimeout(id); }, [f.q]);

  const { data: items, error, reload } = useLoad<ContentItem[]>(() => crm.contentList({
    projectId: projectId || f.projectId || undefined, status: f.status || undefined, platform: f.platform || undefined, mine: f.mine, q: query || undefined,
  }), [projectId, f.projectId, f.status, f.platform, f.mine, query]);

  const creatable = (projects ?? []).filter((p) => scopeCan(p.scope, 'content.create') && p.status !== 'archived' && (!projectId || p.id === projectId));

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[180px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
          <input type="search" value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} className="field py-2 pl-9 text-sm"
            placeholder={t('crm.studio.search', 'Search content')} aria-label={t('crm.studio.search', 'Search content')} />
        </div>
        {!projectId && (
          <select value={f.projectId} onChange={(e) => setF({ ...f, projectId: e.target.value })} className="field w-auto py-2 text-sm" aria-label={t('crm.project', 'Project')}>
            <option value="">{t('crm.filters.allProjects', 'All projects')}</option>
            {(projects ?? []).map((p) => <option key={p.id} value={p.id}>{p.companyName} · {p.name}</option>)}
          </select>
        )}
        <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })} className="field w-auto py-2 text-sm" aria-label={t('panel.users.status', 'Status')}>
          <option value="">{t('crm.filters.allStatuses', 'All statuses')}</option>
          {CONTENT_STATUSES.map((s) => <option key={s} value={s}>{contentStatusLabel(s)}</option>)}
        </select>
        <select value={f.platform} onChange={(e) => setF({ ...f, platform: e.target.value })} className="field w-auto py-2 text-sm" aria-label={t('crm.fields.platform', 'Platform')}>
          <option value="">{t('crm.filters.allPlatforms', 'All platforms')}</option>
          {PLATFORMS.map((p) => <option key={p} value={p}>{PLATFORM_META[p].label}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-text-muted">
          <input type="checkbox" checked={f.mine} onChange={(e) => setF({ ...f, mine: e.target.checked })} className="h-4 w-4 accent-[var(--color-primary)]" />
          {t('crm.studio.mine', 'Mine')}
        </label>
        {!readOnly && creatable.length > 0 && (
          <button onClick={() => setCreating(true)} className={cn(btn.primary, 'ml-auto')}><Plus className="h-4 w-4" /> {t('crm.studio.new', 'New content')}</button>
        )}
      </div>

      {error ? <ErrorState message={error} onRetry={reload} /> : !items ? <LoadingRows /> : items.length === 0 ? (
        <EmptyState icon={<Clapperboard className="h-12 w-12" />} title={t('crm.studio.empty', 'No content yet')}
          hint={t('crm.studio.emptyHint', 'Create content, write captions per platform, attach media and send it for approval.')} />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((it) => <ContentCard key={it.id} item={it} showProject={!projectId} />)}
        </ul>
      )}

      <NewContentDrawer open={creating} onClose={() => setCreating(false)} projects={creatable} projectId={projectId}
        onCreated={(it) => navigate(`/crm/studio/${it.id}`)} />
    </section>
  );
}

function ContentCard({ item, showProject }: { item: ContentItem; showProject: boolean }) {
  const { t } = useI18n();
  const thumb = item.publications.map((p) => p.cover ?? p.media[0]).find(Boolean);
  const next = item.publications.map((p) => p.scheduledAt).filter(Boolean).sort()[0];
  return (
    <li>
      <Link to={`/crm/studio/${item.id}`} className="card flex h-full gap-3 p-3 hover:border-primary/50">
        <MediaThumb media={thumb} className="h-20 w-20 shrink-0 rounded-md" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-2 font-medium text-text">{item.title}</p>
            <ContentStatusBadge status={item.status} />
          </div>
          {showProject && <p className="truncate text-xs text-text-subtle">{item.companyName} · {item.projectName}</p>}
          <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
            <span>{formatLabel(item.format)}</span>
            {item.publications.map((p) => {
              const m = PLATFORM_META[p.platform];
              return (
                <span key={p.id} className="inline-flex items-center gap-1" title={`${m.label}: ${contentStatusLabel(p.status)}`}>
                  <m.Icon className={cn('h-3.5 w-3.5', m.color)} />
                  <span className={cn('h-1.5 w-1.5 rounded-full', CONTENT_STATUS_DOT[p.status])} />
                </span>
              );
            })}
            {next && <span className="inline-flex items-center gap-1 tabular-nums"><CalendarClock className="h-3 w-3" />{formatDate(next, true)}</span>}
            <span className="ml-auto">{item.assignee && <Avatar size="sm" name={item.assignee.name} email={item.assignee.email} />}</span>
          </div>
          {item.approval?.status === 'pending' && (
            <p className="text-xs text-warning">{t('crm.approvals.waitingStep', 'Waiting for')}: {stepLabel(item.approval.stepName)}</p>
          )}
        </div>
      </Link>
    </li>
  );
}

/** Platforms of a project the user may create content for. */
function creatablePlatforms(p: Project | undefined): Platform[] {
  if (!p) return [];
  const allowed = p.scope.platforms;
  const list = p.platforms.length > 0 ? p.platforms : [...PLATFORMS];
  return list.filter((x) => !allowed || allowed.includes(x));
}

function NewContentDrawer({ open, onClose, projects, projectId, onCreated }: {
  open: boolean; onClose: () => void; projects: Project[]; projectId?: string; onCreated: (it: ContentItem) => void;
}) {
  const { t } = useI18n();
  const [form, setForm] = useState({ projectId: '', title: '', brief: '', format: 'post' as ContentFormat, platforms: [] as Platform[] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wasOpen, setWasOpen] = useState(false);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      const pid = projectId || projects[0]?.id || '';
      setForm({ projectId: pid, title: '', brief: '', format: 'post', platforms: creatablePlatforms(projects.find((p) => p.id === pid)) });
      setError(null);
    }
  }
  const project = projects.find((p) => p.id === form.projectId);
  const options = creatablePlatforms(project);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      onCreated(await crm.createContent(form));
    } catch (err) {
      setError(errorMessage(err, t('crm.saveFailed', 'Could not save.')));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer open={open} onClose={onClose} title={t('crm.studio.new', 'New content')}
      footer={<>
        <button onClick={onClose} className={btn.secondary}>{t('admin.cancel', 'Cancel')}</button>
        <button form="new-content" disabled={saving || !form.title.trim() || form.platforms.length === 0} className={btn.primary}>{saving && <Spinner />} {t('crm.create', 'Create')}</button>
      </>}>
      <form id="new-content" onSubmit={submit} className="space-y-4">
        {error && <Notice>{error}</Notice>}
        {!projectId && (
          <Field label={t('crm.project', 'Project')} htmlFor="nc-project">
            <select id="nc-project" value={form.projectId} className="field"
              onChange={(e) => setForm({ ...form, projectId: e.target.value, platforms: creatablePlatforms(projects.find((p) => p.id === e.target.value)) })}>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.companyName} · {p.name}</option>)}
            </select>
          </Field>
        )}
        <Field label={t('crm.fields.title', 'Title')} htmlFor="nc-title">
          <input id="nc-title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="field" maxLength={300} autoFocus />
        </Field>
        <Field label={t('crm.studio.format', 'Format')} htmlFor="nc-format">
          <select id="nc-format" value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value as ContentFormat })} className="field">
            {CONTENT_FORMATS.map((x) => <option key={x} value={x}>{formatLabel(x)}</option>)}
          </select>
        </Field>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-text">{t('crm.studio.platforms', 'Platforms')}</legend>
          <div className="flex flex-wrap gap-2">
            {options.map((p) => {
              const m = PLATFORM_META[p];
              const on = form.platforms.includes(p);
              return (
                <button key={p} type="button" aria-pressed={on}
                  onClick={() => setForm({ ...form, platforms: on ? form.platforms.filter((x) => x !== p) : [...form.platforms, p] })}
                  className={cn('inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm', on ? 'border-primary bg-primary/10 text-text' : 'border-border text-text-muted hover:bg-surface-3')}>
                  <m.Icon className={cn('h-4 w-4', m.color)} /> {m.label} {on && <Check className="h-3.5 w-3.5 text-primary" />}
                </button>
              );
            })}
          </div>
          {options.length === 0 && <p className="text-sm text-text-muted">{t('crm.studio.noPlatforms', 'You have no platforms to create content for in this project.')}</p>}
        </fieldset>
        <Field label={t('crm.studio.brief', 'Brief')} htmlFor="nc-brief" hint={t('crm.studio.briefHint', 'Idea, goal and notes for the team. Not published.')}>
          <textarea id="nc-brief" rows={4} value={form.brief} onChange={(e) => setForm({ ...form, brief: e.target.value })} className="field" />
        </Field>
      </form>
    </Drawer>
  );
}

/** /crm/studio/:id — the multi-platform editor. */
export function CrmContentEditor() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { readOnly, adminMode } = useCrm();
  const { user } = useAuth();
  const saveError = useSaveError();
  const { data: item, setData: setItem, error, reload } = useLoad<ContentItem>(() => crm.content(id), [id]);
  const [params] = useSearchParams();
  const [tab, setTab] = useState<Platform | null>(() => (params.get('platform') as Platform) || null);
  const [form, setForm] = useState({ title: '', brief: '', format: 'post' as ContentFormat, assigneeId: '' });
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [people, setPeople] = useState<UserBrief[]>([]);
  const [historyTick, setHistoryTick] = useState(0);
  const [pubDirty, setPubDirty] = useState(false);

  const stamp = item ? `${item.id}:${item.updatedAt}` : null;
  if (item && stamp !== loadedId) {
    setLoadedId(stamp);
    setForm({ title: item.title, brief: item.brief, format: item.format, assigneeId: item.assigneeId });
  }
  const pub = item?.publications.find((p) => p.platform === tab) ?? item?.publications[0] ?? null;

  useEffect(() => {
    if (!item?.projectId) return;
    crm.members({ projectId: item.projectId, active: true }).then((list) => {
      const map = new Map<string, UserBrief>();
      list.forEach((m) => m.user && map.set(m.userId, m.user));
      if (adminMode && user) map.set(user.id, { id: user.id, name: user.name, email: user.email, role: user.role });
      setPeople([...map.values()]);
    }).catch(() => setPeople([]));
  }, [item?.projectId, adminMode, user]);

  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!item) return <LoadingRows />;

  const editable = !readOnly && item.can.edit;
  const dirty = form.title !== item.title || form.brief !== item.brief || form.format !== item.format || form.assigneeId !== item.assigneeId;
  const locked = item.status === 'approved' || item.status === 'ready_for_review';

  const act = async (fn: () => Promise<ContentItem | void>, done?: string) => {
    setBusy(true);
    setActionError(null);
    setNotice(null);
    try {
      const res = await fn();
      if (res) setItem(res);
      if (done) setNotice(done);
      setHistoryTick((n) => n + 1);
    } catch (err) {
      setActionError(saveError(err));
    } finally {
      setBusy(false);
    }
  };

  const saveDetails = () => {
    if (locked && (form.title !== item.title || form.brief !== item.brief || form.format !== item.format)
      && !window.confirm(t('crm.studio.confirmReset', 'Changing approved or in-review content sends it back to work and cancels its schedule. Continue?'))) return;
    void act(() => crm.updateContent(item.id, form), t('crm.saved', 'Saved'));
  };

  return (
    <div className="space-y-6">
      <Link to="/crm/studio" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-4 w-4" /> {t('crm.nav.studio', 'Content Studio')}
      </Link>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-text sm:text-3xl">{item.title}</h1>
            <ContentStatusBadge status={item.status} />
          </div>
          <p className="mt-1 text-sm text-text-muted">
            <Link to={`/crm/projects/${item.projectId}`} className="hover:text-text">{item.companyName} · {item.projectName}</Link>
            {' · '}{formatLabel(item.format)}{item.creator && <> · {t('crm.studio.by', 'by')} {item.creator.name || item.creator.email}</>}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {item.can.submit && (
            <button disabled={busy || dirty || pubDirty} title={dirty || pubDirty ? t('crm.studio.saveFirst', 'Save your changes first') : undefined} onClick={() => act(() => crm.submitContent(item.id), t('crm.studio.submitted', 'Sent for approval'))} className={btn.primary}>
              <Send className="h-4 w-4" /> {t('crm.studio.submit', 'Send for approval')}
            </button>
          )}
          {editable && item.status === 'ready_for_review' && (
            <button disabled={busy} onClick={() => act(() => crm.withdrawContent(item.id))} className={btn.secondary}><Undo2 className="h-4 w-4" /> {t('crm.studio.withdraw', 'Withdraw')}</button>
          )}
          {!readOnly && item.can.delete && (
            <button disabled={busy} aria-label={t('panel.users.delete', 'Delete')} className={btn.danger}
              onClick={() => { if (window.confirm(t('crm.studio.confirmDelete', 'Delete this content with all its versions?'))) void act(async () => { await crm.deleteContent(item.id); navigate('/crm/studio'); }); }}>
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>
      {actionError && <Notice>{actionError}</Notice>}
      {notice && <Notice tone="success">{notice}</Notice>}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-6">
          <section className="card space-y-4 p-5">
            <h2 className="font-display font-semibold text-text">{t('crm.studio.details', 'Details')}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t('crm.fields.title', 'Title')} htmlFor="c-title">
                <input id="c-title" disabled={!editable} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="field" maxLength={300} />
              </Field>
              <Field label={t('crm.studio.format', 'Format')} htmlFor="c-format">
                <select id="c-format" disabled={!editable} value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value as ContentFormat })} className="field">
                  {CONTENT_FORMATS.map((x) => <option key={x} value={x}>{formatLabel(x)}</option>)}
                </select>
              </Field>
              <Field label={t('crm.fields.assignee', 'Assignee')} htmlFor="c-assignee">
                <select id="c-assignee" disabled={!editable} value={form.assigneeId} onChange={(e) => setForm({ ...form, assigneeId: e.target.value })} className="field">
                  <option value="">{t('crm.unassigned', 'Unassigned')}</option>
                  {item.assignee && !people.some((p) => p.id === item.assigneeId) && <option value={item.assigneeId}>{item.assignee.name || item.assignee.email}</option>}
                  {people.map((p) => <option key={p.id} value={p.id}>{p.name || p.email}</option>)}
                </select>
              </Field>
              {editable && (item.status === 'idea' || item.status === 'in_progress') && (
                <Field label={t('panel.users.status', 'Status')} htmlFor="c-status">
                  <select id="c-status" value={item.status} onChange={(e) => act(() => crm.updateContent(item.id, { status: e.target.value as ContentItem['status'] }))} className="field">
                    <option value="idea">{contentStatusLabel('idea')}</option>
                    <option value="in_progress">{contentStatusLabel('in_progress')}</option>
                  </select>
                </Field>
              )}
            </div>
            <Field label={t('crm.studio.brief', 'Brief')} htmlFor="c-brief" hint={t('crm.studio.briefHint', 'Idea, goal and notes for the team. Not published.')}>
              <textarea id="c-brief" disabled={!editable} rows={3} value={form.brief} onChange={(e) => setForm({ ...form, brief: e.target.value })} className="field" />
            </Field>
            {editable && (
              <div className="flex justify-end">
                <button disabled={busy || !dirty || !form.title.trim()} onClick={saveDetails} className={btn.primary}>{busy && <Spinner />} {t('crm.save', 'Save')}</button>
              </div>
            )}
          </section>

          <section className="space-y-3">
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label={t('crm.studio.platforms', 'Platforms')}>
              {item.publications.map((p) => {
                const m = PLATFORM_META[p.platform];
                const on = pub?.id === p.id;
                return (
                  <button key={p.id} role="tab" aria-selected={on} onClick={() => setTab(p.platform)}
                    className={cn('inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm', on ? 'border-primary bg-surface text-text shadow-sm' : 'border-border bg-surface-2 text-text-muted hover:text-text')}>
                    <m.Icon className={cn('h-4 w-4', m.color)} /> {m.label}
                    <span className={cn('h-2 w-2 rounded-full', CONTENT_STATUS_DOT[p.status])} title={contentStatusLabel(p.status)} />
                  </button>
                );
              })}
              {!readOnly && item.can.addPlatforms.map((p) => (
                <button key={p} disabled={busy} onClick={() => act(async () => { const res = await crm.addPublication(item.id, p); setTab(p); return res; })}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-text-muted hover:bg-surface-3">
                  <Plus className="h-3.5 w-3.5" /> {PLATFORM_META[p].label}
                </button>
              ))}
            </div>
            {pub ? (
              <PublicationEditor key={pub.id} item={item} pub={pub} busy={busy} readOnly={readOnly} onAct={act} onDirty={setPubDirty} />
            ) : (
              <p className="card p-6 text-center text-sm text-text-muted">{t('crm.studio.noPublications', 'Add a platform to start writing.')}</p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <ApprovalPanel item={item} busy={busy} readOnly={readOnly} onAct={act} tick={historyTick} />
          <VersionsPanel item={item} editable={editable} busy={busy} onAct={act} tick={historyTick} />
        </aside>
      </div>
    </div>
  );
}

type Act = (fn: () => Promise<ContentItem | void>, done?: string) => Promise<void>;

function parseHashtags(s: string): string[] {
  return [...new Set(s.split(/[\s,]+/).map((x) => x.replace(/^#+/, '')).filter(Boolean))];
}

function PublicationEditor({ item, pub, busy, readOnly, onAct, onDirty }: {
  item: ContentItem; pub: Publication; busy: boolean; readOnly: boolean; onAct: Act; onDirty: (dirty: boolean) => void;
}) {
  const { t } = useI18n();
  const [title, setTitle] = useState(pub.title);
  const [caption, setCaption] = useState(pub.caption);
  const [tags, setTags] = useState(pub.hashtags.map((h) => `#${h}`).join(' '));
  const [media, setMedia] = useState(pub.media);
  const [cover, setCover] = useState(pub.cover);
  const [when, setWhen] = useState(toDateTimeInput(pub.scheduledAt));
  const [picker, setPicker] = useState<'media' | 'cover' | null>(null);
  const [seen, setSeen] = useState(pub);
  if (seen !== pub) {
    setSeen(pub);
    setTitle(pub.title); setCaption(pub.caption); setTags(pub.hashtags.map((h) => `#${h}`).join(' '));
    setMedia(pub.media); setCover(pub.cover); setWhen(toDateTimeInput(pub.scheduledAt));
  }

  const meta = PLATFORM_META[pub.platform];
  const editable = !readOnly && pub.can.edit;
  const hashtags = parseHashtags(tags);
  const limit = CAPTION_LIMITS[pub.platform];
  const total = caption.length + (hashtags.length ? hashtags.map((h) => ` #${h}`).join('').length + 1 : 0);
  const mediaIds = media.map((m) => m.rootId);
  const textDirty = title !== pub.title || caption !== pub.caption || hashtags.join() !== pub.hashtags.join()
    || mediaIds.join() !== pub.mediaIds.join() || (cover?.rootId ?? '') !== pub.coverMediaId;
  const whenIso = fromDateTimeInput(when);
  const dateDirty = (whenIso || null) !== (pub.scheduledAt ? new Date(pub.scheduledAt).toISOString() : null);
  const locked = item.status === 'approved' || item.status === 'ready_for_review';
  useEffect(() => { onDirty(textDirty || dateDirty); }, [textDirty, dateDirty, onDirty]);
  useEffect(() => () => onDirty(false), [onDirty]);
  const canMedia = editable && media.length < 20;
  const needsCover = ['reel', 'video', 'short'].includes(item.format);

  const save = () => {
    if (textDirty && locked && !window.confirm(t('crm.studio.confirmReset', 'Changing approved or in-review content sends it back to work and cancels its schedule. Continue?'))) return;
    const data: Parameters<typeof crm.updatePublication>[1] = {};
    if (textDirty) Object.assign(data, { title, caption, hashtags, mediaIds, coverMediaId: cover?.rootId ?? '' });
    if (dateDirty && pub.can.reschedule) data.scheduledAt = whenIso;
    void onAct(() => crm.updatePublication(pub.id, data), t('crm.saved', 'Saved'));
  };

  const markPublished = () => {
    const url = window.prompt(t('crm.studio.publishedPrompt', 'Link to the published post (optional):'), pub.externalUrl || 'https://');
    if (url === null) return;
    void onAct(() => crm.markPublished(pub.id, url === 'https://' ? '' : url.trim()), t('crm.studio.markedPublished', 'Marked as published'));
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="card space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 font-display font-semibold text-text"><meta.Icon className={cn('h-5 w-5', meta.color)} /> {meta.label}</h3>
          <ContentStatusBadge status={pub.status} />
        </div>
        {pub.publishStatus === 'published' && (
          <Notice tone="success">
            {t('crm.studio.publishedOn', 'Published')} {formatDate(pub.publishedAt, true)}
            {pub.externalUrl && <> · <a href={pub.externalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline">{t('crm.studio.openPost', 'open post')} <ExternalLink className="h-3 w-3" /></a></>}
          </Notice>
        )}
        {pub.error && <Notice>{pub.error}</Notice>}
        {(pub.platform === 'youtube' || item.format === 'article') && (
          <Field label={t('crm.studio.pubTitle', 'Title on the platform')} htmlFor={`pt-${pub.id}`} hint={`${title.length}/${TITLE_LIMITS[pub.platform]}`}>
            <input id={`pt-${pub.id}`} disabled={!editable} value={title} onChange={(e) => setTitle(e.target.value)} className="field" maxLength={TITLE_LIMITS[pub.platform]} />
          </Field>
        )}
        <Field label={pub.platform === 'youtube' ? t('crm.studio.description', 'Description') : t('crm.studio.caption', 'Caption')} htmlFor={`pc-${pub.id}`}>
          <textarea id={`pc-${pub.id}`} disabled={!editable} rows={8} value={caption} onChange={(e) => setCaption(e.target.value)} className="field font-[inherit]" />
          <p className={cn('text-right text-xs tabular-nums', total > limit ? 'font-medium text-danger' : 'text-text-subtle')}>{total}/{limit}</p>
        </Field>
        <Field label={t('crm.studio.hashtags', 'Hashtags')} htmlFor={`ph-${pub.id}`} hint={`${hashtags.length}/${MAX_HASHTAGS} · ${t('crm.studio.hashtagsHint', 'separate with spaces or commas')}`}>
          <input id={`ph-${pub.id}`} disabled={!editable} value={tags} onChange={(e) => setTags(e.target.value)} className="field" placeholder="#brand #launch" />
        </Field>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text">{t('crm.studio.media', 'Media')}</span>
            {canMedia && <button type="button" onClick={() => setPicker('media')} className={btn.secondary}><ImagePlus className="h-4 w-4" /> {t('crm.studio.addMedia', 'Add media')}</button>}
          </div>
          {media.length === 0 ? <p className="text-sm text-text-subtle">{t('crm.studio.noMedia', 'No media attached.')}</p> : (
            <ul className="flex flex-wrap gap-2">
              {media.map((m, i) => (
                <li key={m.rootId} className="relative">
                  <MediaThumb media={m} className="h-20 w-20 rounded-md" />
                  <span className="absolute left-1 top-1 rounded bg-black/60 px-1 text-[10px] text-white">{i + 1}</span>
                  {editable && (
                    <button type="button" onClick={() => setMedia(media.filter((x) => x.rootId !== m.rootId))} aria-label={t('crm.remove', 'Remove')}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-danger"><X className="h-3 w-3" /></button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        {needsCover && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text">{t('crm.studio.cover', 'Cover')}</span>
              {editable && (
                <span className="flex gap-2">
                  {cover && <button type="button" onClick={() => setCover(null)} className={btn.ghost}>{t('crm.remove', 'Remove')}</button>}
                  <button type="button" onClick={() => setPicker('cover')} className={btn.secondary}><ImagePlus className="h-4 w-4" /> {t('crm.studio.chooseCover', 'Choose cover')}</button>
                </span>
              )}
            </div>
            {cover ? <MediaThumb media={cover} className="h-28 w-20 rounded-md" /> : <p className="text-sm text-text-subtle">{t('crm.studio.noCover', 'No cover chosen.')}</p>}
          </div>
        )}

        <Field label={t('crm.studio.date', 'Publication date')} htmlFor={`pd-${pub.id}`}
          hint={pub.publishStatus === 'scheduled' ? t('crm.studio.scheduledHint', 'Confirmed for this time.') : t('crm.studio.plannedHint', 'Planned date. It becomes final when the approved content is scheduled.')}>
          <input id={`pd-${pub.id}`} type="datetime-local" disabled={readOnly || !pub.can.reschedule} value={when} onChange={(e) => setWhen(e.target.value)} className="field sm:max-w-xs" />
        </Field>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
          {!readOnly && pub.can.delete && item.publications.length > 1 && (
            <button disabled={busy} className={cn(btn.ghost, 'mr-auto text-danger')}
              onClick={() => { if (window.confirm(t('crm.studio.confirmRemovePlatform', 'Remove this platform from the content?'))) void onAct(() => crm.deletePublication(pub.id)); }}>
              <Trash2 className="h-4 w-4" /> {t('crm.studio.removePlatform', 'Remove platform')}
            </button>
          )}
          {(editable || pub.can.reschedule) && !readOnly && (
            <button disabled={busy || (!textDirty && !dateDirty) || total > limit || hashtags.length > MAX_HASHTAGS} onClick={save} className={btn.secondary}>
              <Save className="h-4 w-4" /> {t('crm.save', 'Save')}
            </button>
          )}
          {!readOnly && pub.publishStatus === 'scheduled' && pub.can.reschedule && (
            <button disabled={busy} onClick={() => onAct(() => crm.unschedulePublication(pub.id))} className={btn.secondary}>{t('crm.studio.unschedule', 'Unschedule')}</button>
          )}
          {!readOnly && pub.can.schedule && pub.publishStatus !== 'scheduled' && (
            <button disabled={busy || !whenIso || textDirty} onClick={() => onAct(() => crm.schedulePublication(pub.id, whenIso), t('crm.studio.scheduledOk', 'Scheduled'))} className={btn.primary}
              title={!whenIso ? t('crm.studio.pickDate', 'Pick a date first') : undefined}>
              <CalendarClock className="h-4 w-4" /> {t('crm.studio.schedule', 'Schedule')}
            </button>
          )}
          {!readOnly && pub.can.publish && (
            <button disabled={busy || textDirty} onClick={markPublished} className={btn.secondary}><CheckCircle2 className="h-4 w-4" /> {t('crm.studio.markPublished', 'Mark as published')}</button>
          )}
        </div>
        {pub.can.publish && pub.publishStatus !== 'published' && (
          <p className="text-xs text-text-subtle">{t('crm.studio.manualPublishHint', 'Automatic publishing starts once the account is connected through the official API. Until then, post manually and mark it as published.')}</p>
        )}
      </div>

      <PostPreview platform={pub.platform} title={title} caption={caption} hashtags={hashtags} media={cover && needsCover ? [cover, ...media] : media} />

      <MediaPicker open={picker !== null} onClose={() => setPicker(null)} projectId={item.projectId}
        multiple={picker === 'media'} selected={picker === 'cover' ? (cover ? [cover.rootId] : []) : mediaIds}
        canUpload={!readOnly && editable}
        onPick={(ids, files) => {
          const byRoot = new Map([...media, ...(cover ? [cover] : []), ...files].map((m) => [m.rootId, m]));
          if (picker === 'cover') setCover(ids[0] ? byRoot.get(ids[0]) ?? null : null);
          else setMedia(ids.map((x) => byRoot.get(x)).filter((m): m is NonNullable<typeof m> => !!m).slice(0, 20));
        }} />
    </div>
  );
}

/** Rough look of the post on the network; it is a guide, not a pixel copy. */
function PostPreview({ platform, title, caption, hashtags, media }: { platform: Platform; title: string; caption: string; hashtags: string[]; media: Publication['media'] }) {
  const { t } = useI18n();
  const m = PLATFORM_META[platform];
  const vertical = platform === 'tiktok';
  return (
    <div className="card h-fit space-y-2 p-3">
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-text-subtle"><m.Icon className={cn('h-3.5 w-3.5', m.color)} /> {t('crm.studio.preview', 'Preview')}</p>
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        {media[0] ? <MediaThumb media={media[0]} className={cn('w-full', vertical ? 'aspect-[9/16]' : platform === 'youtube' ? 'aspect-video' : 'aspect-square')} />
          : <div className={cn('flex w-full items-center justify-center bg-surface-3 text-xs text-text-subtle', vertical ? 'aspect-[9/16]' : 'aspect-square')}>{t('crm.studio.noMedia', 'No media attached.')}</div>}
        <div className="space-y-1 p-2.5 text-sm">
          {media.length > 1 && <p className="text-xs text-text-subtle">1/{media.length}</p>}
          {title && <p className="font-semibold text-text">{title}</p>}
          <p className="line-clamp-6 whitespace-pre-wrap break-words text-text-muted">{caption || <span className="italic text-text-subtle">{t('crm.studio.noCaption', 'No caption yet')}</span>}</p>
          {hashtags.length > 0 && <p className="break-words text-primary">{hashtags.map((h) => `#${h}`).join(' ')}</p>}
        </div>
      </div>
    </div>
  );
}

function decisionLabel(d: string): string {
  return { approved: contentStatusLabel('approved'), changes_requested: contentStatusLabel('changes_requested'), rejected: contentStatusLabel('rejected') }[d] ?? d;
}

function ApprovalPanel({ item, busy, readOnly, onAct, tick }: { item: ContentItem; busy: boolean; readOnly: boolean; onAct: Act; tick: number }) {
  const { t } = useI18n();
  const [comment, setComment] = useState('');
  const { data: history } = useLoad<Approval[]>(() => crm.contentApprovals(item.id), [item.id, tick]);
  const current = item.approval;

  const decide = (d: 'approve' | 'changes' | 'reject') => {
    if (d !== 'approve' && !comment.trim()) return;
    void onAct(async () => { const res = await crm.decideContent(item.id, d, comment); setComment(''); return res; },
      d === 'approve' ? t('crm.approvals.approvedOk', 'Approved') : t('crm.approvals.sentBack', 'Sent back with your comment'));
  };

  return (
    <section className="card space-y-4 p-4">
      <h2 className="font-display font-semibold text-text">{t('crm.nav.approvals', 'Approvals')}</h2>
      {!current ? (
        <p className="text-sm text-text-muted">{t('crm.approvals.notSubmitted', 'Not sent for approval yet.')}</p>
      ) : (
        <ol className="space-y-2">
          {current.steps.map((s, i) => {
            const done = current.status === 'approved' || i < current.step;
            const active = current.status === 'pending' && i === current.step;
            return (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className={cn('inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
                  done ? 'bg-success text-white' : active ? 'bg-warning text-white' : 'bg-surface-3 text-text-subtle')}>
                  {done ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className={cn(active ? 'font-medium text-text' : 'text-text-muted')}>{stepLabel(s.name)}</span>
              </li>
            );
          })}
        </ol>
      )}

      {!readOnly && item.can.decide && (
        <div className="space-y-2 rounded-lg border border-warning/40 bg-warning/5 p-3">
          <p className="text-sm font-medium text-text">{t('crm.approvals.yourDecision', 'Your decision')}: {stepLabel(current?.stepName ?? '')}</p>
          <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} className="field text-sm"
            placeholder={t('crm.approvals.commentPlaceholder', 'Comment (required to request changes or reject)')} aria-label={t('crm.approvals.comment', 'Comment')} />
          <div className="flex flex-wrap gap-2">
            <button disabled={busy} onClick={() => decide('approve')} className={btn.primary}><Check className="h-4 w-4" /> {t('crm.approvals.approve', 'Approve')}</button>
            <button disabled={busy || !comment.trim()} onClick={() => decide('changes')} className={btn.secondary}><RotateCcw className="h-4 w-4" /> {t('crm.approvals.requestChanges', 'Request changes')}</button>
            <button disabled={busy || !comment.trim()} onClick={() => decide('reject')} className={cn(btn.ghost, 'text-danger')}><XCircle className="h-4 w-4" /> {t('crm.approvals.reject', 'Reject')}</button>
          </div>
        </div>
      )}

      {history && history.some((r) => r.decisions.length > 0) && (
        <div className="space-y-3 border-t border-border pt-3">
          <h3 className="text-sm font-medium text-text">{t('crm.approvals.history', 'Comments and decisions')}</h3>
          <ul className="space-y-3">
            {history.flatMap((r) => [...r.decisions].reverse().map((d) => (
              <li key={d.id} className="flex gap-2 text-sm">
                <Avatar size="sm" name={d.actor?.name} email={d.actor?.email} />
                <div className="min-w-0">
                  <p className="text-text"><span className="font-medium">{d.actor?.name || d.actor?.email}</span>{' · '}
                    <span className={cn(d.decision === 'approved' ? 'text-success' : d.decision === 'rejected' ? 'text-danger' : 'text-[#f97316]')}>{decisionLabel(d.decision)}</span>
                  </p>
                  <p className="text-xs text-text-subtle">{t('crm.approvals.round', 'Round')} {r.round} · {stepLabel(d.stepName)} · {formatDate(d.createdAt, true)}</p>
                  {d.comment && <p className="mt-1 whitespace-pre-wrap text-text-muted">{d.comment}</p>}
                </div>
              </li>
            )))}
          </ul>
        </div>
      )}
    </section>
  );
}

function VersionsPanel({ item, editable, busy, onAct, tick }: { item: ContentItem; editable: boolean; busy: boolean; onAct: Act; tick: number }) {
  const { t } = useI18n();
  const { data: versions } = useLoad<ContentVersion[]>(() => crm.contentVersions(item.id), [item.id, tick]);
  const [viewing, setViewing] = useState<ContentVersion | null>(null);
  const sorted = useMemo(() => versions ?? [], [versions]);

  return (
    <section className="card space-y-3 p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-display font-semibold text-text"><History className="h-4 w-4 text-text-subtle" /> {t('crm.versions', 'Versions')}</h2>
        {editable && (
          <button disabled={busy} className={btn.secondary} onClick={() => {
            const note = window.prompt(t('crm.studio.versionNote', 'Note for this version (optional):'), '');
            if (note !== null) void onAct(async () => { await crm.saveContentVersion(item.id, note); }, t('crm.studio.versionSaved', 'Version saved'));
          }}>
            <Save className="h-4 w-4" /> {t('crm.studio.saveVersion', 'Save version')}
          </button>
        )}
      </div>
      {sorted.length === 0 ? <p className="text-sm text-text-muted">{t('crm.studio.noVersions', 'Versions are saved when content is sent for approval, or by hand.')}</p> : (
        <ul className="divide-y divide-border">
          {sorted.map((v) => (
            <li key={v.id}>
              <button onClick={() => setViewing(v)} className="flex w-full items-center gap-2 py-2 text-left text-sm hover:text-primary">
                <span className="font-mono text-xs text-text-subtle">v{v.number}</span>
                <span className="min-w-0 flex-1 truncate text-text">{versionNote(v.note) || v.snapshot.title}</span>
                <span className="shrink-0 text-xs text-text-subtle">{formatDate(v.createdAt)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <Drawer open={!!viewing} onClose={() => setViewing(null)} wide title={viewing ? `v${viewing.number} · ${viewing.snapshot.title}` : ''}
        footer={editable && viewing ? <>
          <button onClick={() => setViewing(null)} className={btn.secondary}>{t('ui.close', 'Close')}</button>
          <button disabled={busy} className={btn.primary} onClick={() => {
            if (!window.confirm(t('crm.studio.confirmRestore', 'Restore this version? The current state is saved as a new version first.'))) return;
            const v = viewing;
            setViewing(null);
            void onAct(() => crm.restoreContentVersion(item.id, v.id), t('crm.studio.restored', 'Version restored'));
          }}><RotateCcw className="h-4 w-4" /> {t('crm.studio.restore', 'Restore')}</button>
        </> : undefined}>
        {viewing && (
          <div className="space-y-4 text-sm">
            <p className="text-text-muted">{viewing.author?.name || viewing.author?.email} · {formatDate(viewing.createdAt, true)}{viewing.note && ` · ${versionNote(viewing.note)}`}</p>
            {viewing.snapshot.brief && <p className="whitespace-pre-wrap text-text-muted">{viewing.snapshot.brief}</p>}
            {viewing.snapshot.publications.map((p) => (
              <div key={p.platform} className="space-y-1 rounded-lg border border-border p-3">
                <p className="flex items-center gap-2 font-medium text-text"><PlatformIcons platforms={[p.platform]} /> {PLATFORM_META[p.platform].label}</p>
                {p.title && <p className="font-medium text-text">{p.title}</p>}
                <p className="whitespace-pre-wrap text-text-muted">{p.caption || '—'}</p>
                {p.hashtags?.length > 0 && <p className="text-primary">{p.hashtags.map((h) => `#${h}`).join(' ')}</p>}
                <p className="text-xs text-text-subtle">{t('crm.studio.media', 'Media')}: {p.mediaIds?.length ?? 0}</p>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </section>
  );
}
