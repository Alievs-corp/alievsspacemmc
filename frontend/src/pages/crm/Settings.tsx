import { useState } from 'react';
import { Bell, Building2, FolderKanban, Mail, MonitorSmartphone, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useCrm } from '@/contexts/CrmContext';
import { crm, type NotificationSettings, type NotificationType } from '@/lib/crm';
import { ErrorState, LoadingRows, Notice, PageHeader, Toggle, errorMessage } from '@/components/admin/ui';
import { Avatar, PlatformIcons, permissionName, roleName } from '@/components/crm/ui';
import { notificationTypeLabel } from '@/components/crm/notifications';
import { useLoad } from '@/components/crm/useLoad';
import { t as t2 } from '@/lib/i18n';

export function CrmSettings() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <PageHeader title={t('crm.nav.settings', 'Settings')}
        subtitle={t('crm.settings.subtitle', 'Your notification preferences and what you can do in the CRM.')} />
      <div className="grid gap-6 xl:grid-cols-2">
        <NotificationPrefs />
        <ProfileSummary />
      </div>
    </div>
  );
}

function groupName(g: string): string {
  return {
    tasks: t2('crm.settings.groupTasks', 'Tasks'),
    content: t2('crm.settings.groupContent', 'Content & approvals'),
    access: t2('crm.settings.groupAccess', 'Access'),
  }[g] ?? g;
}

function NotificationPrefs() {
  const { t } = useI18n();
  const { readOnly } = useCrm();
  const { data, setData, error, reload } = useLoad<NotificationSettings>(() => crm.notificationSettings(), []);
  const [saving, setSaving] = useState<NotificationType | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const toggle = async (type: NotificationType, enabled: boolean) => {
    setSaving(type);
    setSaveError(null);
    const before = data;
    setData((d) => d && { ...d, types: d.types.map((x) => (x.type === type ? { ...x, enabled } : x)) });
    try {
      setData(await crm.updateNotificationSettings({ [type]: enabled }));
    } catch (err) {
      setData(before);
      setSaveError(errorMessage(err, t('crm.saveFailed', 'Could not save.')));
    } finally {
      setSaving(null);
    }
  };

  const groups = data ? [...new Set(data.types.map((x) => x.group))] : [];
  const email = data?.channels.find((c) => c.key === 'email');

  return (
    <section className="card space-y-4 p-5">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-text"><Bell className="h-5 w-5 text-primary" /> {t('crm.settings.notifications', 'Notifications')}</h2>
      {readOnly && <Notice tone="warning">{t('crm.settings.viewAs', 'View-as mode: preferences are shown read-only.')}</Notice>}
      {saveError && <Notice>{saveError}</Notice>}
      {error ? <ErrorState message={error} onRetry={reload} /> : !data ? <LoadingRows rows={4} /> : (
        <>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border border-border p-3">
              <MonitorSmartphone className="mt-0.5 h-5 w-5 shrink-0 text-success" />
              <div className="min-w-0 text-sm">
                <p className="font-medium text-text">{t('crm.settings.inApp', 'In the CRM')}</p>
                <p className="text-text-muted">{t('crm.settings.inAppOn', 'On — the bell in the header and the Notifications page.')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border p-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-text-subtle" />
              <div className="min-w-0 text-sm">
                <p className="font-medium text-text">{t('crm.settings.email', 'Email')}</p>
                <p className="text-text-muted">{email?.available
                  ? t('crm.settings.emailOn', 'Connected.')
                  : t('crm.settings.emailLater', 'Later — no email provider is connected yet, so nothing is sent by email.')}</p>
              </div>
            </div>
          </div>
          {groups.map((g) => (
            <div key={g} className="space-y-1">
              <p className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">{groupName(g)}</p>
              <ul className="divide-y divide-border rounded-lg border border-border">
                {data.types.filter((x) => x.group === g).map((x) => (
                  <li key={x.type} className="flex items-center justify-between gap-3 px-3 py-2.5">
                    <span className="min-w-0 text-sm text-text">{notificationTypeLabel(x.type)}</span>
                    <Toggle checked={x.enabled} disabled={readOnly || saving === x.type} label={notificationTypeLabel(x.type)}
                      onChange={(v) => toggle(x.type, v)} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
    </section>
  );
}

function ProfileSummary() {
  const { t } = useI18n();
  const { me } = useCrm();
  if (!me) return null;
  return (
    <section className="card space-y-4 p-5">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-text"><ShieldCheck className="h-5 w-5 text-primary" /> {t('crm.settings.profile', 'My CRM access')}</h2>
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={me.user.name} email={me.user.email} />
        <div className="min-w-0">
          <p className="truncate font-medium text-text">{me.user.name || me.user.email}</p>
          <p className="truncate text-sm text-text-muted">{me.user.email}</p>
        </div>
        {me.superAdmin && <span className="ml-auto shrink-0 rounded-full bg-primary/15 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">Super admin</span>}
      </div>
      <p className="text-xs text-text-subtle">{t('crm.settings.readOnlyAccess', 'Access is managed by your team manager or a super admin; it can’t be changed here.')}</p>
      {me.superAdmin ? (
        <p className="text-sm text-text-muted">{t('crm.settings.superAll', 'Full access to every company and project.')}</p>
      ) : me.memberships.length === 0 ? (
        <p className="text-sm text-text-muted">{t('crm.settings.noMemberships', 'No memberships.')}</p>
      ) : (
        <ul className="space-y-3">
          {me.memberships.map((m) => (
            <li key={m.id} className="space-y-2 rounded-lg border border-border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-text">
                  {m.projectId ? <FolderKanban className="h-4 w-4 shrink-0 text-text-subtle" /> : <Building2 className="h-4 w-4 shrink-0 text-text-subtle" />}
                  <span className="min-w-0 break-words">{m.companyName}{m.projectId ? ` / ${m.projectName}` : ` · ${t('crm.settings.allProjects', 'all projects')}`}</span>
                </p>
                <span className="rounded-full bg-surface-3 px-2 py-0.5 text-xs text-text-muted">{roleName(m.role, m.roleName)}</span>
              </div>
              <p className="flex items-center gap-2 text-xs text-text-subtle">
                {t('crm.settings.platforms', 'Platforms')}: {m.platforms.length ? <PlatformIcons platforms={m.platforms} /> : t('crm.settings.allPlatforms', 'all')}
              </p>
              <div className="flex flex-wrap gap-1">
                {m.permissions.map((p) => <span key={p} className="rounded border border-border px-1.5 py-0.5 text-[11px] text-text-muted">{permissionName(p)}</span>)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
