/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect, useState } from 'react';
import { ScrollText } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { crm, type Activity, type Platform, type TaskStatus } from '@/lib/crm';
import { t as tr } from '@/lib/i18n';
import { aiFeatureName } from '@/lib/crmAi';
import { EmptyState, ErrorState, LoadingRows, PageHeader, RefreshButton, errorMessage, formatDate } from '@/components/admin/ui';
import { Avatar, PLATFORM_META, roleName, taskStatusLabel } from '@/components/crm/ui';

function parse(details: string): Record<string, unknown> | null {
  try {
    const v = JSON.parse(details);
    return v && typeof v === 'object' ? v : null;
  } catch {
    return null;
  }
}

function platformName(p: string): string {
  return PLATFORM_META[p as Platform]?.label ?? p;
}

/** One readable line for a CRM history entry. */
export function describeActivity(a: Activity): string {
  const d = parse(a.details);
  const text = d ? '' : a.details;
  switch (a.action) {
    case 'company.created': return `${tr('crm.act.companyCreated', 'created company')} ${text}`;
    case 'company.updated': return `${tr('crm.act.companyUpdated', 'updated company')} ${text}`;
    case 'company.deleted': return `${tr('crm.act.companyDeleted', 'deleted company')} ${text}`;
    case 'project.created': return `${tr('crm.act.projectCreated', 'created project')} ${text}`;
    case 'project.updated': return `${tr('crm.act.projectUpdated', 'updated project')} ${text}`;
    case 'project.deleted': return `${tr('crm.act.projectDeleted', 'deleted project')} ${text}`;
    case 'task.created': return `${tr('crm.act.taskCreated', 'created task')} “${text}”`;
    case 'task.deleted': return `${tr('crm.act.taskDeleted', 'deleted task')} “${text}”`;
    case 'task.commented': return tr('crm.act.taskCommented', 'commented');
    case 'task.updated': {
      if (!d) return tr('crm.act.taskUpdated', 'updated the task');
      const parts: string[] = [];
      const status = d.status as [TaskStatus, TaskStatus] | undefined;
      if (status) parts.push(`${tr('crm.act.status', 'status')}: ${taskStatusLabel(status[0])} → ${taskStatusLabel(status[1])}`);
      if (d.title) parts.push(tr('crm.act.title', 'title'));
      if (d.description) parts.push(tr('crm.act.description', 'description'));
      if (d.priority) parts.push(tr('crm.act.priority', 'priority'));
      if (d.assigneeId) parts.push(tr('crm.act.assignee', 'assignee'));
      if (d.dueAt) parts.push(tr('crm.act.deadline', 'deadline'));
      return parts.length ? `${tr('crm.act.changed', 'changed')} ${parts.join(', ')}` : tr('crm.act.taskUpdated', 'updated the task');
    }
    case 'member.added': return `${tr('crm.act.memberAdded', 'gave access to')} ${d?.user ?? ''} (${roleName(String(d?.role ?? ''))})`;
    case 'member.updated': {
      const role = d?.role as [string, string] | undefined;
      const active = d?.active as [boolean, boolean] | undefined;
      const bits = [tr('crm.act.memberUpdated', 'changed access')];
      if (role && role[0] !== role[1]) bits.push(`${roleName(role[0])} → ${roleName(role[1])}`);
      if (active && active[0] !== active[1]) bits.push(active[1] ? tr('crm.act.activated', 'activated') : tr('crm.act.deactivated', 'deactivated'));
      return bits.join(' · ');
    }
    case 'member.removed': return tr('crm.act.memberRemoved', 'removed access');
    case 'role.created': return `${tr('crm.act.roleCreated', 'created role')} ${a.entityId}`;
    case 'role.updated': return `${tr('crm.act.roleUpdated', 'changed permissions of role')} ${roleName(a.entityId)}`;
    case 'role.deleted': return `${tr('crm.act.roleDeleted', 'deleted role')} ${a.entityId}`;
    case 'project.approval_flow_updated': return tr('crm.act.flowUpdated', 'changed the approval chain');
    case 'content.created': return `${tr('crm.act.contentCreated', 'created content')} “${d?.title ?? ''}”`;
    case 'content.updated': return tr('crm.act.contentUpdated', 'edited content details');
    case 'content.deleted': return `${tr('crm.act.contentDeleted', 'deleted content')} “${text}”`;
    case 'content.platform_added': return `${tr('crm.act.platformAdded', 'added platform')} ${platformName(text)}`;
    case 'content.platform_removed': return `${tr('crm.act.platformRemoved', 'removed platform')} ${platformName(text)}`;
    case 'content.publication_edited': return `${tr('crm.act.publicationEdited', 'edited the post for')} ${platformName(text)}`;
    case 'content.rescheduled': return `${tr('crm.act.rescheduled', 'moved the date for')} ${platformName(String(d?.platform ?? ''))}`;
    case 'content.scheduled': return `${tr('crm.act.scheduled', 'scheduled the post for')} ${platformName(String(d?.platform ?? ''))}`;
    case 'content.unscheduled': return `${tr('crm.act.unscheduled', 'unscheduled the post for')} ${platformName(text)}`;
    case 'content.published': return `${tr('crm.act.published', 'marked as published on')} ${platformName(String(d?.platform ?? ''))}`;
    case 'content.version_saved': return `${tr('crm.act.versionSaved', 'saved version')} v${d?.number ?? ''}`;
    case 'content.version_restored': return `${tr('crm.act.versionRestored', 'restored version')} v${d?.number ?? ''}`;
    case 'report.exported': return `${tr('crm.act.reportExported', 'exported a report for')} ${d?.from ?? ''} – ${d?.to ?? ''} (CSV)`;
    case 'content.submitted': return tr('crm.act.submitted', 'sent content for approval');
    case 'content.withdrawn': return tr('crm.act.withdrawn', 'withdrew content from review');
    case 'content.step_approved': return `${tr('crm.act.stepApproved', 'approved step')} “${d?.step ?? ''}”`;
    case 'content.approved': return tr('crm.act.approved', 'approved the content');
    case 'content.changes_requested': return `${tr('crm.act.changesRequested', 'requested changes')}: ${d?.comment ?? ''}`;
    case 'content.rejected': return `${tr('crm.act.rejected', 'rejected the content')}: ${d?.comment ?? ''}`;
    case 'media.uploaded': return `${tr('crm.act.mediaUploaded', 'uploaded')} ${text}`;
    case 'media.version_uploaded': return `${tr('crm.act.mediaVersion', 'uploaded a new version of')} ${d?.name ?? ''}`;
    case 'media.updated': return tr('crm.act.mediaUpdated', 'renamed or moved a file');
    case 'media.deleted': return `${tr('crm.act.mediaDeleted', 'deleted file')} ${text}`;
    default:
      if (a.action.startsWith('ai.')) return `${tr('crm.act.aiUsed', 'used the AI assistant for')} ${aiFeatureName(a.action.slice(3))}`;
      return a.action;
  }
}

export function ActivityFeed({ projectId, companyId, compact }: { projectId?: string; companyId?: string; compact?: boolean }) {
  const { t } = useI18n();
  const [items, setItems] = useState<Activity[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await crm.activity({ projectId, companyId }));
    } catch (err) {
      setError(errorMessage(err, t('crm.loadFailed', 'Could not load data.')));
    } finally {
      setLoading(false);
    }
  }, [projectId, companyId, t]);

  useEffect(() => { void load(); }, [load]);

  const list = compact ? items?.slice(0, 8) : items;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-lg font-semibold text-text">{compact ? t('crm.activity.recent', 'Recent activity') : t('crm.tabs.history', 'History')}</h2>
        {!compact && <RefreshButton onClick={load} loading={loading} />}
      </div>
      {error ? <ErrorState message={error} onRetry={load} /> : !list ? <LoadingRows rows={3} /> : list.length === 0 ? (
        <EmptyState icon={<ScrollText className="h-10 w-10" />} title={t('crm.activity.empty', 'Nothing has happened here yet')} />
      ) : (
        <ul className="card divide-y divide-border p-0">
          {list.map((a) => (
            <li key={a.id} className="flex items-start gap-3 px-4 py-3">
              <Avatar size="sm" name={a.actor?.name} email={a.actor?.email} />
              <p className="min-w-0 flex-1 text-sm text-text-muted">
                <span className="font-medium text-text">{a.actor?.name || a.actor?.email || '—'}</span> {describeActivity(a)}
              </p>
              <time className="shrink-0 text-xs text-text-subtle" dateTime={a.createdAt}>{formatDate(a.createdAt, true)}</time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function CrmActivity() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <PageHeader title={t('crm.nav.activity', 'Activity Logs')}
        subtitle={t('crm.activity.subtitle', 'Changes to companies, projects, access, roles and tasks — the latest 100 entries. Site-wide admin actions are in the admin panel audit log.')} />
      <ActivityFeed />
    </div>
  );
}
