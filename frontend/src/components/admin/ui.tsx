/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';
import type { Permission, Role, ServiceStatus } from '@/lib/api';

/** Shared building blocks for the admin panel pages added with roles. */

export const btn = {
  primary:
    'inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
  secondary:
    'inline-flex items-center justify-center gap-2 rounded-md border border-border px-3.5 py-2 text-sm text-text-muted transition-colors hover:bg-surface-3 hover:text-text disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
  ghost:
    'inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-2 text-sm text-text-muted transition-colors hover:bg-surface-3 hover:text-text disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
  danger:
    'inline-flex items-center justify-center gap-2 rounded-md border border-danger/40 px-3.5 py-2 text-sm text-danger transition-colors hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
};

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-bold text-text sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function RefreshButton({ onClick, loading }: { onClick: () => void; loading?: boolean }) {
  return (
    <button onClick={onClick} disabled={loading} className={btn.secondary}>
      <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
      {t('admin.refresh', 'Refresh')}
    </button>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 p-10 text-center">
      <AlertCircle className="h-9 w-9 text-danger" />
      <p className="max-w-md text-sm text-text-muted">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className={btn.secondary}>
          {t('admin.retry', 'Retry')}
        </button>
      )}
    </div>
  );
}

export function LoadingRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-lg bg-surface-3/60" />
      ))}
    </div>
  );
}

export function EmptyState({ icon, title, hint }: { icon: ReactNode; title: string; hint?: string }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 p-14 text-center">
      <div className="text-text-subtle">{icon}</div>
      <p className="font-medium text-text">{title}</p>
      {hint && <p className="max-w-md text-sm text-text-muted">{hint}</p>}
    </div>
  );
}

export function Notice({ tone = 'danger', children }: { tone?: 'danger' | 'success' | 'warning'; children: ReactNode }) {
  const tones = {
    danger: 'border-danger/40 bg-danger/10 text-danger',
    success: 'border-success/40 bg-success/10 text-success',
    warning: 'border-warning/40 bg-warning/10 text-warning',
  };
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={cn('flex items-start gap-2 rounded-lg border p-3 text-sm', tones[tone])}>
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span className="break-words">{children}</span>
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('h-4 w-4 animate-spin', className)} />;
}

export function Toggle({
  checked, onChange, disabled, label, id,
}: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; label: string; id?: string }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'border-primary bg-primary' : 'border-border bg-surface-3',
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 rounded-full bg-[#fff] shadow transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  );
}

export function roleLabel(role: Role): string {
  return {
    user: t('panel.roles.user', 'User'),
    admin: t('panel.roles.admin', 'Admin'),
    super_admin: t('panel.roles.super_admin', 'Super admin'),
  }[role] ?? role;
}

export function RoleBadge({ role }: { role: Role }) {
  const styles: Record<Role, string> = {
    user: 'bg-surface-3 text-text-muted',
    admin: 'bg-info/15 text-info',
    super_admin: 'bg-primary/15 text-primary',
  };
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', styles[role] ?? styles.user)}>
      {roleLabel(role)}
    </span>
  );
}

export function StatusBadge({ status, label }: { status: ServiceStatus['status'] | 'blocked' | 'active'; label?: string }) {
  const styles: Record<string, string> = {
    ok: 'bg-success/15 text-success',
    active: 'bg-success/15 text-success',
    warning: 'bg-warning/15 text-warning',
    disabled: 'bg-surface-3 text-text-muted',
    unknown: 'bg-surface-3 text-text-muted',
    down: 'bg-danger/15 text-danger',
    blocked: 'bg-danger/15 text-danger',
  };
  const labels: Record<string, string> = {
    ok: t('panel.status.ok', 'Operational'),
    active: t('panel.status.active', 'Active'),
    warning: t('panel.status.warning', 'Needs attention'),
    disabled: t('panel.status.disabled', 'Not configured'),
    unknown: t('panel.status.unknown', 'Unknown'),
    down: t('panel.status.down', 'Unavailable'),
    blocked: t('panel.status.blocked', 'Blocked'),
  };
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', styles[status])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {label ?? labels[status]}
    </span>
  );
}

export function permissionLabel(p: Permission): { title: string; desc: string } {
  const map: Record<Permission, { title: string; desc: string }> = {
    content: {
      title: t('panel.perms.content', 'Site content'),
      desc: t('panel.perms.contentDesc', 'Home, about, services, projects, blog, careers, team, site settings'),
    },
    inquiries: {
      title: t('panel.perms.inquiries', 'Inquiries'),
      desc: t('panel.perms.inquiriesDesc', 'Contact form submissions'),
    },
    applications: {
      title: t('panel.perms.applications', 'Job applications'),
      desc: t('panel.perms.applicationsDesc', 'Candidates applying to vacancies'),
    },
    academy: {
      title: t('panel.perms.academy', 'Academy'),
      desc: t('panel.perms.academyDesc', 'Academy content and registrations (academy app)'),
    },
    'users.view': {
      title: t('panel.perms.usersView', 'View users'),
      desc: t('panel.perms.usersViewDesc', 'User list, search and profiles'),
    },
    'users.manage': {
      title: t('panel.perms.usersManage', 'Manage users'),
      desc: t('panel.perms.usersManageDesc', 'Block, unblock and delete regular users'),
    },
  };
  return map[p];
}

export function formatDate(value?: string | null, withTime = false): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime()) || d.getFullYear() < 2000) return '—';
  return d.toLocaleString(undefined, withTime
    ? { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { year: 'numeric', month: 'short', day: 'numeric' });
}

export function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}
