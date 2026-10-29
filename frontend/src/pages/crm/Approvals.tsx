import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Check, CheckCheck, Inbox, UserCheck, Pencil, Plus, RotateCcw, Trash2, XCircle } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useCrm } from '@/contexts/CrmContext';
import { crm, scopeCan, type ApprovalStep, type ContentItem, type Member, type Project, type Role, type UserBrief } from '@/lib/crm';
import { EmptyState, ErrorState, LoadingRows, Notice, PageHeader, RefreshButton, Spinner, btn, errorMessage, formatDate } from '@/components/admin/ui';
import { Drawer, PLATFORM_META, Segmented, roleName } from '@/components/crm/ui';
import { MediaThumb, formatLabel, stepLabel } from '@/components/crm/content';
import { useLoad } from '@/components/crm/useLoad';
import { cn } from '@/lib/utils';

export function CrmApprovals() {
  const { t } = useI18n();
  const [scope, setScope] = useState<'mine' | 'all'>('mine');
  const { data, setData, error, reload } = useLoad<ContentItem[]>(() => crm.approvals({ mine: scope === 'mine' }), [scope]);

  return (
    <div className="space-y-6">
      <PageHeader title={t('crm.nav.approvals', 'Approvals')}
        subtitle={t('crm.approvals.subtitle', 'Content waiting for review. Approve it, or send it back with a comment.')}
        actions={<RefreshButton onClick={reload} />} />
      <Segmented value={scope} onChange={setScope} label={t('crm.approvals.scope', 'Show')} options={[
        { value: 'mine', label: t('crm.approvals.mine', 'Waiting for me'), icon: <UserCheck className="h-4 w-4" /> },
        { value: 'all', label: t('crm.approvals.all', 'All in review'), icon: <Inbox className="h-4 w-4" /> },
      ]} />
      {error ? <ErrorState message={error} onRetry={reload} /> : !data ? <LoadingRows /> : data.length === 0 ? (
        <EmptyState icon={<CheckCheck className="h-12 w-12" />} title={scope === 'mine' ? t('crm.approvals.emptyMine', 'Nothing is waiting for your decision') : t('crm.approvals.empty', 'Nothing is in review')} />
      ) : (
        <ul className="space-y-4">
          {data.map((it) => (
            <ApprovalCard key={it.id} item={it} onDone={(next) => setData((l) => (scope === 'mine' && !next.can.decide
              ? l?.filter((x) => x.id !== next.id) : l?.map((x) => (x.id === next.id ? next : x)))?.filter((x) => x.status === 'ready_for_review') ?? null)} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ApprovalCard({ item, onDone }: { item: ContentItem; onDone: (it: ContentItem) => void }) {
  const { t } = useI18n();
  const { readOnly } = useCrm();
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const a = item.approval;

  const decide = async (d: 'approve' | 'changes' | 'reject') => {
    setBusy(true);
    setError(null);
    try { onDone(await crm.decideContent(item.id, d, comment)); } catch (err) { setError(errorMessage(err, t('crm.saveFailed', 'Could not save.'))); } finally { setBusy(false); }
  };

  return (
    <li className="card space-y-4 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <Link to={`/crm/studio/${item.id}`} className="font-display text-lg font-semibold text-text hover:text-primary">{item.title}</Link>
          <p className="text-sm text-text-muted">{item.companyName} · {item.projectName} · {formatLabel(item.format)}</p>
        </div>
        {a && (
          <p className="text-right text-xs text-text-subtle">
            {t('crm.approvals.step', 'Step')} {a.step + 1}/{a.steps.length}: <span className="font-medium text-text">{stepLabel(a.stepName)}</span><br />
            {a.submitter && <>{a.submitter.name || a.submitter.email} · </>}{formatDate(a.createdAt, true)}
          </p>
        )}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {item.publications.map((p) => {
          const m = PLATFORM_META[p.platform];
          return (
            <div key={p.id} className="flex gap-3 rounded-lg border border-border p-3">
              <MediaThumb media={p.cover ?? p.media[0]} className="h-20 w-20 shrink-0 rounded-md" />
              <div className="min-w-0 space-y-1 text-sm">
                <p className="flex items-center gap-1.5 font-medium text-text"><m.Icon className={cn('h-4 w-4', m.color)} /> {m.label}
                  {p.scheduledAt && <span className="text-xs font-normal text-text-subtle">· {formatDate(p.scheduledAt, true)}</span>}</p>
                {p.title && <p className="font-medium text-text">{p.title}</p>}
                <p className="line-clamp-4 whitespace-pre-wrap text-text-muted">{p.caption || '—'}</p>
                {p.hashtags.length > 0 && <p className="line-clamp-2 text-primary">{p.hashtags.map((h) => `#${h}`).join(' ')}</p>}
                {p.media.length > 1 && <p className="text-xs text-text-subtle">{p.media.length} {t('crm.approvals.files', 'files')}</p>}
              </div>
            </div>
          );
        })}
      </div>
      {error && <Notice>{error}</Notice>}
      {!readOnly && item.can.decide ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <textarea rows={2} value={comment} onChange={(e) => setComment(e.target.value)} className="field flex-1 text-sm"
            placeholder={t('crm.approvals.commentPlaceholder', 'Comment (required to request changes or reject)')} aria-label={t('crm.approvals.comment', 'Comment')} />
          <div className="flex flex-wrap gap-2">
            <button disabled={busy} onClick={() => decide('approve')} className={btn.primary}><Check className="h-4 w-4" /> {t('crm.approvals.approve', 'Approve')}</button>
            <button disabled={busy || !comment.trim()} onClick={() => decide('changes')} className={btn.secondary}><RotateCcw className="h-4 w-4" /> {t('crm.approvals.requestChanges', 'Request changes')}</button>
            <button disabled={busy || !comment.trim()} onClick={() => decide('reject')} className={cn(btn.ghost, 'text-danger')}><XCircle className="h-4 w-4" /> {t('crm.approvals.reject', 'Reject')}</button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-text-subtle">{t('crm.approvals.notYourStep', 'This step is decided by someone else.')}</p>
      )}
    </li>
  );
}

/** The project's approval chain, shown on the project overview. */
export function ApprovalFlowCard({ project }: { project: Project }) {
  const { t } = useI18n();
  const { readOnly } = useCrm();
  const { data, setData } = useLoad(() => crm.approvalFlow(project.id), [project.id]);
  const [editing, setEditing] = useState(false);
  const canEdit = !readOnly && scopeCan(project.scope, 'project.manage');
  const steps = data?.steps ?? [];

  return (
    <section className="card space-y-3 p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display font-semibold text-text">{t('crm.flow.title', 'Approval chain')}</h2>
        {canEdit && <button onClick={() => setEditing(true)} className={btn.secondary}><Pencil className="h-4 w-4" /> {t('crm.edit', 'Edit')}</button>}
      </div>
      {!data ? <LoadingRows rows={1} /> : steps.length === 0 ? (
        <p className="text-sm text-text-muted">{t('crm.flow.default', 'One step: anyone with “Approve content” in this project can approve.')}</p>
      ) : (
        <ol className="space-y-2 text-sm">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-3 text-[11px] font-semibold text-text-muted">{i + 1}</span>
              <span className="min-w-0">
                <span className="font-medium text-text">{s.name}</span>
                <span className="block text-xs text-text-subtle">
                  {s.roles.length === 0 && s.userIds.length === 0 ? t('crm.flow.anyApprover', 'Anyone with “Approve content”')
                    : [...s.roles.map((r) => roleName(r)), ...(s.userIds.length ? [`${s.userIds.length} ${t('crm.flow.people', 'people')}`] : [])].join(', ')}
                </span>
              </span>
            </li>
          ))}
        </ol>
      )}
      {editing && data && <FlowEditor project={project} initial={steps} onClose={() => setEditing(false)} onSaved={(d) => { setData(d); setEditing(false); }} />}
    </section>
  );
}

function FlowEditor({ project, initial, onClose, onSaved }: {
  project: Project; initial: ApprovalStep[]; onClose: () => void; onSaved: (d: { steps: ApprovalStep[]; default: ApprovalStep[] }) => void;
}) {
  const { t } = useI18n();
  const [steps, setSteps] = useState<ApprovalStep[]>(initial.map((s) => ({ ...s })));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: roles } = useLoad<Role[]>(() => crm.roles(), []);
  const { data: members } = useLoad<Member[]>(() => crm.members({ projectId: project.id, active: true }), [project.id]);
  const people = useMemo(() => {
    const m = new Map<string, UserBrief>();
    (members ?? []).forEach((x) => x.user && m.set(x.userId, x.user));
    return [...m.values()];
  }, [members]);

  const update = (i: number, patch: Partial<ApprovalStep>) => setSteps((l) => l.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const save = async () => {
    setSaving(true);
    setError(null);
    try { onSaved(await crm.updateApprovalFlow(project.id, steps)); } catch (err) { setError(errorMessage(err, t('crm.saveFailed', 'Could not save.'))); } finally { setSaving(false); }
  };

  return (
    <Drawer open onClose={onClose} wide title={t('crm.flow.title', 'Approval chain')}
      footer={<>
        <button onClick={onClose} className={btn.secondary}>{t('admin.cancel', 'Cancel')}</button>
        <button disabled={saving || steps.some((s) => !s.name.trim())} onClick={save} className={btn.primary}>{saving && <Spinner />} {t('crm.save', 'Save')}</button>
      </>}>
      <div className="space-y-4">
        {error && <Notice>{error}</Notice>}
        <p className="text-sm text-text-muted">{t('crm.flow.hint', 'Content goes through the steps in order. Each step can be limited to roles or people; they also need “Approve content”. Content already in review keeps its chain.')}</p>
        {steps.length === 0 && <p className="rounded-lg border border-dashed border-border p-3 text-sm text-text-muted">{t('crm.flow.default', 'One step: anyone with “Approve content” in this project can approve.')}</p>}
        {steps.map((s, i) => (
          <div key={i} className="space-y-3 rounded-lg border border-border p-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-3 text-xs font-semibold text-text-muted">{i + 1}</span>
              <input value={s.name} onChange={(e) => update(i, { name: e.target.value })} className="field flex-1" maxLength={100}
                placeholder={t('crm.flow.stepName', 'Step name, e.g. Client review')} aria-label={t('crm.flow.stepName', 'Step name, e.g. Client review')} />
              <button onClick={() => i > 0 && setSteps((l) => { const n = [...l]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; return n; })} disabled={i === 0} className={btn.ghost} aria-label={t('crm.flow.up', 'Move up')}><ArrowUp className="h-4 w-4" /></button>
              <button onClick={() => setSteps((l) => l.filter((_, j) => j !== i))} className={cn(btn.ghost, 'text-danger')} aria-label={t('crm.remove', 'Remove')}><Trash2 className="h-4 w-4" /></button>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-text-subtle">{t('crm.flow.roles', 'Roles')}</p>
              <div className="flex flex-wrap gap-1.5">
                {(roles ?? []).filter((r) => r.permissions.includes('content.approve')).map((r) => (
                  <button key={r.key} type="button" aria-pressed={s.roles.includes(r.key)} onClick={() => update(i, { roles: toggle(s.roles, r.key) })}
                    className={cn('rounded-full border px-2.5 py-1 text-xs', s.roles.includes(r.key) ? 'border-primary bg-primary/10 text-text' : 'border-border text-text-muted hover:bg-surface-3')}>
                    {roleName(r.key, r.name)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-text-subtle">{t('crm.flow.peopleTitle', 'People')}</p>
              <div className="flex flex-wrap gap-1.5">
                {people.map((u) => (
                  <button key={u.id} type="button" aria-pressed={s.userIds.includes(u.id)} onClick={() => update(i, { userIds: toggle(s.userIds, u.id) })}
                    className={cn('rounded-full border px-2.5 py-1 text-xs', s.userIds.includes(u.id) ? 'border-primary bg-primary/10 text-text' : 'border-border text-text-muted hover:bg-surface-3')}>
                    {u.name || u.email}
                  </button>
                ))}
                {people.length === 0 && <span className="text-xs text-text-subtle">—</span>}
              </div>
            </div>
          </div>
        ))}
        {steps.length < 5 && (
          <button onClick={() => setSteps((l) => [...l, { name: '', roles: [], userIds: [] }])} className={btn.secondary}><Plus className="h-4 w-4" /> {t('crm.flow.addStep', 'Add step')}</button>
        )}
      </div>
    </Drawer>
  );
}
