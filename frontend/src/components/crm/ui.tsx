/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { FaInstagram, FaLinkedin, FaTiktok, FaYoutube } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { getLocale, t, tRaw } from '@/lib/i18n';
import type { CrmPermission, Platform, ProjectStatus, TaskPriority, TaskStatus } from '@/lib/crm';

/** Shared CRM building blocks; the admin panel's ui.tsx covers buttons and states. */

export const PLATFORM_META: Record<Platform, { label: string; Icon: typeof FaInstagram; color: string }> = {
  instagram: { label: 'Instagram', Icon: FaInstagram, color: 'text-[#E1306C]' },
  tiktok: { label: 'TikTok', Icon: FaTiktok, color: 'text-text' },
  youtube: { label: 'YouTube', Icon: FaYoutube, color: 'text-[#FF0000]' },
  linkedin: { label: 'LinkedIn', Icon: FaLinkedin, color: 'text-[#0A66C2]' },
};

export function PlatformIcons({ platforms, className }: { platforms: Platform[] | null | undefined; className?: string }) {
  if (!platforms || platforms.length === 0) return <span className="text-xs text-text-subtle">—</span>;
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      {platforms.map((p) => {
        const m = PLATFORM_META[p];
        return m ? <m.Icon key={p} className={cn('h-4 w-4', m.color)} title={m.label} aria-label={m.label} /> : null;
      })}
    </span>
  );
}

export function taskStatusLabel(s: TaskStatus): string {
  return {
    todo: t('crm.task.todo', 'To Do'),
    in_progress: t('crm.task.in_progress', 'In Progress'),
    review: t('crm.task.review', 'Review'),
    completed: t('crm.task.completed', 'Completed'),
    cancelled: t('crm.task.cancelled', 'Cancelled'),
  }[s] ?? s;
}

const TASK_STATUS_STYLE: Record<TaskStatus, string> = {
  todo: 'bg-surface-3 text-text-muted',
  in_progress: 'bg-info/15 text-info',
  review: 'bg-warning/15 text-warning',
  completed: 'bg-success/15 text-success',
  cancelled: 'bg-surface-3 text-text-subtle line-through',
};

export const TASK_STATUS_DOT: Record<TaskStatus, string> = {
  todo: 'bg-text-subtle',
  in_progress: 'bg-info',
  review: 'bg-warning',
  completed: 'bg-success',
  cancelled: 'bg-border',
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', TASK_STATUS_STYLE[status])}>{taskStatusLabel(status)}</span>;
}

export function priorityLabel(p: TaskPriority): string {
  return {
    low: t('crm.priority.low', 'Low'),
    medium: t('crm.priority.medium', 'Medium'),
    high: t('crm.priority.high', 'High'),
    urgent: t('crm.priority.urgent', 'Urgent'),
  }[p] ?? p;
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const style = { low: 'text-text-subtle', medium: 'text-text-muted', high: 'text-warning', urgent: 'text-danger' }[priority];
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium', style)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {priorityLabel(priority)}
    </span>
  );
}

export function projectStatusLabel(s: ProjectStatus | 'active' | 'archived'): string {
  return {
    active: t('crm.status.active', 'Active'),
    paused: t('crm.status.paused', 'Paused'),
    completed: t('crm.status.completed', 'Completed'),
    archived: t('crm.status.archived', 'Archived'),
  }[s] ?? s;
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus | 'active' | 'archived' }) {
  const style = {
    active: 'bg-success/15 text-success',
    paused: 'bg-warning/15 text-warning',
    completed: 'bg-info/15 text-info',
    archived: 'bg-surface-3 text-text-muted',
  }[status];
  return <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', style)}>{projectStatusLabel(status)}</span>;
}

export function Avatar({ name, email, size = 'md' }: { name?: string; email?: string; size?: 'sm' | 'md' }) {
  const label = (name || email || '?').trim();
  const initials = label.split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase()).join('') || '?';
  return (
    <span
      title={name || email}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-surface-3 font-medium text-text-muted',
        size === 'sm' ? 'h-6 w-6 text-[10px]' : 'h-8 w-8 text-xs',
      )}
    >
      {initials}
    </span>
  );
}

/**
 * The noun that goes after a count, by the language's plural rules
 * ("1 проект", "3 проекта", "5 проектов"). Translations live under
 * `crm.plural.<name>.<one|few|many|other>`; English uses one/other.
 */
export function plural(n: number, name: string, one: string, other: string): string {
  const rule = new Intl.PluralRules(getLocale()).select(Math.abs(n));
  const word = tRaw<unknown>(`crm.plural.${name}.${rule}`) ?? tRaw<unknown>(`crm.plural.${name}.other`);
  return typeof word === 'string' ? word : rule === 'one' ? one : other;
}

export function roleName(key: string, fallback?: string): string {
  return t(`crm.roleName.${key}`, fallback || key);
}

const PERMISSION_LABELS: Record<CrmPermission, string> = {
  'company.manage': 'Manage company and its projects',
  'project.manage': 'Manage project settings',
  'team.view': 'View team',
  'team.manage': 'Manage team and access',
  'tasks.view': 'View all tasks',
  'tasks.create': 'Create tasks',
  'tasks.assign': 'Assign tasks',
  'tasks.manage': 'Edit and delete any task',
  'calendar.view': 'View calendar',
  'calendar.manage': 'Manage calendar',
  'content.view': 'View content',
  'content.create': 'Create content',
  'content.edit': 'Edit content',
  'content.approve': 'Approve content',
  'content.publish': 'Publish content',
  'media.view': 'View media library',
  'media.manage': 'Upload and manage media',
  'social.view': 'View social accounts',
  'social.manage': 'Connect social accounts',
  'inbox.view': 'View inbox',
  'inbox.reply': 'Reply in inbox',
  'analytics.view': 'View analytics',
};

export function permissionName(p: CrmPermission): string {
  return t(`crm.perm.${p}`, PERMISSION_LABELS[p] ?? p);
}

export function permissionGroupName(g: string): string {
  return {
    projects: t('crm.permGroup.projects', 'Companies & projects'),
    team: t('crm.permGroup.team', 'Team'),
    tasks: t('crm.permGroup.tasks', 'Tasks'),
    content: t('crm.permGroup.content', 'Content & calendar'),
    media: t('crm.permGroup.media', 'Media'),
    social: t('crm.permGroup.social', 'Social accounts & inbox'),
    analytics: t('crm.permGroup.analytics', 'Analytics'),
  }[g] ?? g;
}

/** Right-side drawer on desktop, full-screen sheet on phones. */
export function Drawer({ open, onClose, title, children, footer, wide }: {
  open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; footer?: ReactNode; wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />
      <aside
        role="dialog"
        aria-modal="true"
        className={cn('absolute inset-y-0 right-0 flex w-full flex-col border-l border-border bg-surface shadow-2xl', wide ? 'sm:max-w-2xl' : 'sm:max-w-lg')}
      >
        <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h2 className="min-w-0 truncate font-display text-lg font-semibold text-text">{title}</h2>
          <button onClick={onClose} className="rounded-md p-1.5 text-text-muted hover:bg-surface-3 hover:text-text" aria-label={t('ui.close', 'Close')}>
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-3">{footer}</footer>}
      </aside>
    </div>
  );
}

export function Field({ label, children, hint, htmlFor }: { label: string; children: ReactNode; hint?: string; htmlFor?: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-text">{label}</label>
      {children}
      {hint && <p className="text-xs text-text-subtle">{hint}</p>}
    </div>
  );
}

export function StatCard({ label, value, hint, tone, icon }: { label: string; value: ReactNode; hint?: ReactNode; tone?: 'danger' | 'success' | 'warning'; icon?: ReactNode }) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-text-muted">{label}</p>
        {icon && <span className="text-text-subtle">{icon}</span>}
      </div>
      <p className={cn('mt-1 font-display text-2xl font-bold tabular-nums',
        tone === 'danger' ? 'text-danger' : tone === 'success' ? 'text-success' : tone === 'warning' ? 'text-warning' : 'text-text')}>
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs text-text-subtle">{hint}</p>}
    </div>
  );
}

/** Segmented control used for view switches (Kanban / List / Calendar). */
export function Segmented<T extends string>({ value, options, onChange, label }: {
  value: T; options: Array<{ value: T; label: string; icon?: ReactNode }>; onChange: (v: T) => void; label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex rounded-lg border border-border bg-surface-2 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          aria-label={o.label}
          title={o.label}
          onClick={() => onChange(o.value)}
          className={cn('inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors',
            value === o.value ? 'bg-surface text-text shadow-sm' : 'text-text-muted hover:text-text')}
        >
          {o.icon}
          <span className="hidden sm:inline">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

export function isOverdue(dueAt: string | null, status: TaskStatus): boolean {
  return !!dueAt && new Date(dueAt).getTime() < Date.now() && status !== 'completed' && status !== 'cancelled';
}

/** <input type="date"> value from an ISO timestamp. */
export function toDateInput(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Date-only input → end of that local day, so "due today" stays open until midnight. */
export function fromDateInput(v: string): string {
  if (!v) return '';
  const [y, m, d] = v.split('-').map(Number);
  return new Date(y, m - 1, d, 23, 59, 0).toISOString();
}
