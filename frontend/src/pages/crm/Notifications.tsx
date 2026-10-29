import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, BellDot, Check, CheckCheck, Inbox, Settings, Trash2 } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useCrm } from '@/contexts/CrmContext';
import { crm, type CrmNotification } from '@/lib/crm';
import { EmptyState, ErrorState, LoadingRows, Notice, PageHeader, RefreshButton, Spinner, btn, errorMessage } from '@/components/admin/ui';
import { Segmented } from '@/components/crm/ui';
import { NOTIFICATION_TYPES, NotificationRow, notificationTypeLabel, notificationsChanged } from '@/components/crm/notifications';
import { cn } from '@/lib/utils';

const PAGE = 20;

export function CrmNotifications() {
  const { t } = useI18n();
  const { readOnly } = useCrm();
  const [show, setShow] = useState<'all' | 'unread'>('all');
  const [type, setType] = useState('');
  const [items, setItems] = useState<CrmNotification[] | null>(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    setItems(null);
    setError(null);
    crm.notifications({ unread: show === 'unread', type: type || undefined, limit: PAGE }).then(
      (r) => { if (alive) { setItems(r.items); setTotal(r.total); setHasMore(r.hasMore); } },
      (err) => { if (alive) setError(errorMessage(err, t('crm.loadFailed', 'Could not load data.'))); },
    );
    return () => { alive = false; };
  }, [show, type, tick, t]);

  const more = async () => {
    if (!items) return;
    setLoadingMore(true);
    try {
      const r = await crm.notifications({ unread: show === 'unread', type: type || undefined, limit: PAGE, offset: items.length });
      const seen = new Set(items.map((n) => n.id));
      setItems([...items, ...r.items.filter((n) => !seen.has(n.id))]);
      setTotal(r.total);
      setHasMore(r.hasMore);
    } catch (err) {
      setActionError(errorMessage(err, t('crm.loadFailed', 'Could not load data.')));
    } finally {
      setLoadingMore(false);
    }
  };

  const act = async (fn: () => Promise<unknown>) => {
    setActionError(null);
    try {
      await fn();
      notificationsChanged();
    } catch (err) {
      setActionError(errorMessage(err, t('crm.saveFailed', 'Could not save.')));
    }
  };

  const markRead = (n: CrmNotification) => {
    if (n.readAt || readOnly) return;
    act(async () => {
      const next = await crm.markNotificationRead(n.id);
      setItems((l) => l?.map((x) => (x.id === n.id ? next : x)) ?? null);
    });
  };

  const remove = (n: CrmNotification) => act(async () => {
    await crm.deleteNotification(n.id);
    setItems((l) => l?.filter((x) => x.id !== n.id) ?? null);
    setTotal((x) => Math.max(0, x - 1));
  });

  const unreadShown = items?.some((n) => !n.readAt);

  return (
    <div className="space-y-6">
      <PageHeader title={t('crm.nav.notifications', 'Notifications')}
        subtitle={t('crm.notif.subtitle', 'What happened in your projects: assignments, reviews, deadlines and schedule changes.')}
        actions={<>
          <RefreshButton onClick={() => setTick((n) => n + 1)} />
          {!readOnly && (
            <button onClick={() => act(async () => {
              await crm.markAllNotificationsRead();
              setItems((l) => (show === 'unread' ? [] : l?.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })) ?? null));
            })} disabled={!unreadShown} className={btn.secondary}>
              <CheckCheck className="h-4 w-4" /> {t('crm.notif.readAll', 'Mark all read')}
            </button>
          )}
          <Link to="/crm/settings" className={btn.ghost}><Settings className="h-4 w-4" /> {t('crm.nav.settings', 'Settings')}</Link>
        </>} />

      <div className="flex flex-wrap items-center gap-2">
        <Segmented value={show} onChange={setShow} label={t('crm.notif.show', 'Show')} options={[
          { value: 'all', label: t('crm.notif.all', 'All'), icon: <Inbox className="h-4 w-4" /> },
          { value: 'unread', label: t('crm.notif.unreadOnly', 'Unread'), icon: <BellDot className="h-4 w-4" /> },
        ]} />
        <select value={type} onChange={(e) => setType(e.target.value)} className="field w-auto min-w-0 max-w-full py-2 text-sm" aria-label={t('crm.notif.typeFilter', 'Type')}>
          <option value="">{t('crm.notif.allTypes', 'All types')}</option>
          {NOTIFICATION_TYPES.map((x) => <option key={x} value={x}>{notificationTypeLabel(x)}</option>)}
        </select>
        {items && <span className="text-sm text-text-subtle">{total} {t('crm.notif.count', 'in total')}</span>}
      </div>

      {readOnly && <Notice tone="warning">{t('crm.notif.viewAsNote', 'You are viewing another user’s notifications. Nothing is marked as read.')}</Notice>}
      {actionError && <Notice>{actionError}</Notice>}

      {error ? <ErrorState message={error} onRetry={() => setTick((n) => n + 1)} /> : !items ? <LoadingRows /> : items.length === 0 ? (
        <EmptyState icon={<Bell className="h-12 w-12" />}
          title={show === 'unread' ? t('crm.notif.emptyUnread', 'You’re all caught up') : t('crm.notif.empty', 'No notifications yet')}
          hint={t('crm.notif.emptyHint', 'You will be notified here when someone assigns you work, asks for your review or a deadline is close.')} />
      ) : (
        <div className="space-y-3">
          <ul className="card divide-y divide-border p-1.5">
            {items.map((n) => (
              <li key={n.id} className="flex items-start gap-1 py-1">
                <NotificationRow n={n} onOpen={markRead} />
                {!readOnly && (
                  <div className="flex shrink-0 flex-col gap-0.5 sm:flex-row">
                    {!n.readAt && (
                      <button onClick={() => markRead(n)} className={cn(btn.ghost, 'p-2')} title={t('crm.notif.markRead', 'Mark as read')} aria-label={t('crm.notif.markRead', 'Mark as read')}>
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button onClick={() => remove(n)} className={cn(btn.ghost, 'p-2 hover:text-danger')} title={t('panel.users.delete', 'Delete')} aria-label={t('panel.users.delete', 'Delete')}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {hasMore && (
            <div className="flex justify-center">
              <button onClick={more} disabled={loadingMore} className={btn.secondary}>
                {loadingMore && <Spinner />} {t('crm.notif.loadMore', 'Load more')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
