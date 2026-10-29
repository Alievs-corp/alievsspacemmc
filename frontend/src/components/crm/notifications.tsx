/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlarmClock, Bell, CalendarCheck, CalendarX, CheckCheck, Clapperboard, KeyRound, ListChecks, MessageSquare,
  RefreshCw, TimerOff, UserPlus,
} from 'lucide-react';
import { useCrm } from '@/contexts/CrmContext';
import { useI18n } from '@/contexts/I18nContext';
import { crm, type CrmNotification, type NotificationType, type Platform, type TaskStatus } from '@/lib/crm';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Spinner, btn, errorMessage, formatDate } from '@/components/admin/ui';
import { PLATFORM_META, taskStatusLabel } from './ui';
import { stepLabel } from './content';

/** Fired after notifications change anywhere, so the bell recounts. */
export const NOTIFICATIONS_CHANGED = 'crm:notifications-changed';
export function notificationsChanged() {
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED));
}

export const NOTIFICATION_TYPES: NotificationType[] = [
  'task.assigned', 'task.status', 'task.comment', 'task.due_soon', 'task.overdue',
  'content.assigned', 'approval.requested', 'approval.decided',
  'publication.scheduled', 'publication.unscheduled', 'publication.missed', 'access.granted',
];

export function notificationTypeLabel(type: NotificationType): string {
  return {
    'task.assigned': t('crm.notif.type.taskAssigned', 'Task assigned to me'),
    'task.status': t('crm.notif.type.taskStatus', 'Task status changes'),
    'task.comment': t('crm.notif.type.taskComment', 'Comments on my tasks'),
    'task.due_soon': t('crm.notif.type.taskDueSoon', 'Task due within 24 hours'),
    'task.overdue': t('crm.notif.type.taskOverdue', 'Task overdue'),
    'content.assigned': t('crm.notif.type.contentAssigned', 'Content assigned to me'),
    'approval.requested': t('crm.notif.type.approvalRequested', 'Content waiting for my review'),
    'approval.decided': t('crm.notif.type.approvalDecided', 'Decisions on my content'),
    'publication.scheduled': t('crm.notif.type.pubScheduled', 'Publication scheduled'),
    'publication.unscheduled': t('crm.notif.type.pubUnscheduled', 'Publication unscheduled'),
    'publication.missed': t('crm.notif.type.pubMissed', 'Scheduled time passed without publishing'),
    'access.granted': t('crm.notif.type.access', 'CRM access and role changes'),
  }[type] ?? type;
}

const ICONS: Record<NotificationType, typeof Bell> = {
  'task.assigned': UserPlus,
  'task.status': ListChecks,
  'task.comment': MessageSquare,
  'task.due_soon': AlarmClock,
  'task.overdue': TimerOff,
  'content.assigned': Clapperboard,
  'approval.requested': CheckCheck,
  'approval.decided': CheckCheck,
  'publication.scheduled': CalendarCheck,
  'publication.unscheduled': CalendarX,
  'publication.missed': TimerOff,
  'access.granted': KeyRound,
};

const str = (v: unknown) => (typeof v === 'string' ? v : '');

function platformName(v: unknown): string {
  const meta = PLATFORM_META[v as Platform];
  return meta ? meta.label : str(v);
}

/** Headline (what happened) and the record's title, in the UI language. */
export function describeNotification(n: CrmNotification): { headline: string; title: string; detail: string } {
  const p = n.payload ?? {};
  const title = str(p.title);
  switch (n.type) {
    case 'task.assigned':
      return { headline: t('crm.notif.taskAssigned', 'Assigned a task to you'), title, detail: '' };
    case 'task.status':
      return {
        headline: t('crm.notif.taskStatus', 'Changed the task status'), title,
        detail: `${taskStatusLabel(str(p.from) as TaskStatus)} → ${taskStatusLabel(str(p.to) as TaskStatus)}`,
      };
    case 'task.comment':
      return { headline: t('crm.notif.taskComment', 'Commented on a task'), title, detail: str(p.comment) };
    case 'task.due_soon':
      return { headline: t('crm.notif.taskDueSoon', 'Task is due within 24 hours'), title, detail: formatDate(str(p.dueAt), true) };
    case 'task.overdue':
      return { headline: t('crm.notif.taskOverdue', 'Task is overdue'), title, detail: formatDate(str(p.dueAt), true) };
    case 'content.assigned':
      return { headline: t('crm.notif.contentAssigned', 'Assigned content to you'), title, detail: '' };
    case 'approval.requested':
      return { headline: t('crm.notif.approvalRequested', 'Content is waiting for your review'), title, detail: stepLabel(str(p.step)) };
    case 'approval.decided': {
      const d = str(p.decision);
      const headline = d === 'approved'
        ? (p.final ? t('crm.notif.approved', 'Approved your content') : t('crm.notif.stepApproved', 'Approved a review step'))
        : d === 'rejected' ? t('crm.notif.rejected', 'Rejected your content') : t('crm.notif.changes', 'Requested changes to your content');
      return { headline, title, detail: str(p.comment) || stepLabel(str(p.step)) };
    }
    case 'publication.scheduled':
      return {
        headline: t('crm.notif.pubScheduled', 'Scheduled a publication'), title,
        detail: `${platformName(p.platform)} · ${formatDate(str(p.scheduledAt), true)}`,
      };
    case 'publication.unscheduled':
      return { headline: t('crm.notif.pubUnscheduled', 'Took a publication off the schedule'), title, detail: platformName(p.platform) };
    case 'publication.missed':
      return {
        headline: t('crm.notif.pubMissed', 'Scheduled time passed — not marked as published'), title,
        detail: `${platformName(p.platform)} · ${formatDate(str(p.scheduledAt), true)}`,
      };
    case 'access.granted': {
      const change = str(p.change);
      const headline = change === 'role_changed' ? t('crm.notif.roleChanged', 'Your CRM role changed')
        : change === 'reactivated' ? t('crm.notif.reactivated', 'Your CRM access was restored')
          : t('crm.notif.accessGranted', 'You were given CRM access');
      const where = [str(p.companyName), str(p.projectName)].filter(Boolean).join(' / ');
      return { headline, title: where, detail: str(p.roleName) };
    }
  }
  return { headline: n.type, title, detail: '' };
}

/** Where a notification leads. */
export function notificationLink(n: CrmNotification): string {
  switch (n.entityType) {
    case 'task': return `/crm/tasks?task=${n.entityId}`;
    case 'content': return `/crm/studio/${n.entityId}`;
    case 'publication': return `/crm/studio/${str(n.payload?.contentId)}`;
    default: return '/crm/settings';
  }
}

export function NotificationIcon({ type, className }: { type: NotificationType; className?: string }) {
  const Ico = ICONS[type] ?? Bell;
  const tone = type === 'task.overdue' || type === 'publication.missed' ? 'text-danger'
    : type === 'task.due_soon' ? 'text-warning' : 'text-primary';
  return (
    <span className={cn('inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-3', tone, className)}>
      <Ico className="h-4 w-4" />
    </span>
  );
}

/** One notification row, shared by the bell and the Notifications page. */
export function NotificationRow({ n, onOpen, compact }: { n: CrmNotification; onOpen?: (n: CrmNotification) => void; compact?: boolean }) {
  const d = describeNotification(n);
  const who = n.actor ? n.actor.name || n.actor.email : t('crm.notif.system', 'CRM reminder');
  return (
    <Link to={notificationLink(n)} onClick={() => onOpen?.(n)}
      className={cn('flex min-w-0 flex-1 gap-3 rounded-lg p-2 transition-colors hover:bg-surface-3', !n.readAt && 'bg-primary/5')}>
      <NotificationIcon type={n.type} />
      <span className="min-w-0 flex-1 text-sm">
        <span className="block text-text">
          <span className="font-medium">{who}</span> <span className="text-text-muted">· {d.headline}</span>
        </span>
        {d.title && <span className="block truncate font-medium text-text">{d.title}</span>}
        {d.detail && <span className={cn('block text-text-muted', compact ? 'truncate' : 'line-clamp-2 break-words')}>{d.detail}</span>}
        <span className="block text-xs text-text-subtle">
          {n.projectName && <>{n.projectName} · </>}{formatDate(n.createdAt, true)}
        </span>
      </span>
      {!n.readAt && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label={t('crm.notif.unread', 'Unread')} />}
    </Link>
  );
}

const POLL_MS = 60_000;

/** Header bell: unread badge (polled while the tab is visible) and a dropdown of the latest items. */
export function NotificationBell() {
  const { t: tr } = useI18n();
  const { readOnly } = useCrm();
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CrmNotification[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const recount = useCallback(() => {
    crm.unreadCount().then((r) => setCount(r.count)).catch(() => { /* keep the last count */ });
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      clearInterval(timer);
      if (document.hidden) return;
      recount();
      timer = setInterval(recount, POLL_MS);
    };
    start();
    document.addEventListener('visibilitychange', start);
    window.addEventListener(NOTIFICATIONS_CHANGED, recount);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', start);
      window.removeEventListener(NOTIFICATIONS_CHANGED, recount);
    };
  }, [recount]);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    crm.notifications({ limit: 8 }).then(
      (r) => { if (alive) setItems(r.items); },
      (err) => { if (alive) setError(errorMessage(err, tr('crm.loadFailed', 'Could not load data.'))); },
    );
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      alive = false;
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, tick, tr]);

  const reset = () => {
    setItems(null);
    setError(null);
  };

  const openItem = (n: CrmNotification) => {
    setOpen(false);
    if (n.readAt || readOnly) return;
    crm.markNotificationRead(n.id).then(notificationsChanged).catch(() => { /* the link still works */ });
  };

  const readAll = async () => {
    try {
      await crm.markAllNotificationsRead();
      setItems((l) => l?.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })) ?? null);
      notificationsChanged();
    } catch (err) {
      setError(errorMessage(err, tr('crm.saveFailed', 'Could not save.')));
    }
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => { if (!open) reset(); setOpen(!open); }} aria-expanded={open} aria-haspopup="dialog"
        className="relative rounded-md p-2 text-text-muted transition-colors hover:bg-surface-3 hover:text-text"
        aria-label={count ? `${tr('crm.nav.notifications', 'Notifications')} (${count})` : tr('crm.nav.notifications', 'Notifications')}
        title={tr('crm.nav.notifications', 'Notifications')}>
        <Bell className="h-4 w-4" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-mono text-[10px] font-semibold leading-none text-on-primary">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>
      {open && (
        <div role="dialog" aria-label={tr('crm.nav.notifications', 'Notifications')}
          className="fixed inset-x-4 top-16 z-50 flex max-h-[70dvh] flex-col rounded-xl border border-border bg-surface shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96">
          <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
            <p className="font-display font-semibold text-text">{tr('crm.nav.notifications', 'Notifications')}</p>
            {!readOnly && count > 0 && (
              <button onClick={readAll} className={cn(btn.ghost, 'px-2 py-1 text-xs')}><CheckCheck className="h-3.5 w-3.5" /> {tr('crm.notif.readAll', 'Mark all read')}</button>
            )}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
            {error ? (
              <p className="flex items-center justify-between gap-2 p-3 text-sm text-danger">{error}
                <button onClick={() => { reset(); setTick((n) => n + 1); }} className={btn.ghost} aria-label={tr('admin.retry', 'Retry')}><RefreshCw className="h-4 w-4" /></button>
              </p>
            ) : !items ? (
              <p className="flex justify-center p-6 text-text-muted"><Spinner /></p>
            ) : items.length === 0 ? (
              <p className="p-6 text-center text-sm text-text-muted">{tr('crm.notif.empty', 'No notifications yet')}</p>
            ) : (
              <ul className="space-y-0.5">
                {items.map((n) => <li key={n.id} className="flex"><NotificationRow n={n} onOpen={openItem} compact /></li>)}
              </ul>
            )}
          </div>
          <button onClick={() => { setOpen(false); navigate('/crm/notifications'); }}
            className="border-t border-border px-3 py-2.5 text-sm font-medium text-primary hover:bg-surface-3">
            {tr('crm.notif.viewAll', 'View all notifications')}
          </button>
        </div>
      )}
    </div>
  );
}
