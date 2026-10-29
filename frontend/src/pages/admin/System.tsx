import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Settings as SettingsIcon, Home as HomeIcon, Info } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { api, type SystemSettings } from '@/lib/api';
import { btn, ErrorState, LoadingRows, Notice, PageHeader, Spinner, Toggle, errorMessage } from '@/components/admin/ui';

type ModuleKey = 'registrationEnabled' | 'inquiriesEnabled' | 'jobApplicationsEnabled' | 'academyRegistrationEnabled';

export function AdminSystem() {
  const { t } = useI18n();
  const [saved, setSaved] = useState<SystemSettings | null>(null);
  const [draft, setDraft] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ tone: 'success' | 'danger'; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const s = await api.admin.getSystemSettings();
      setSaved(s);
      setDraft(s);
    } catch (err) {
      setLoadError(errorMessage(err, t('panel.system.loadFailed', 'Could not load settings.')));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { load(); }, [load]);

  const modules: Array<{ key: ModuleKey; title: string; desc: string; endpoint: string }> = [
    {
      key: 'registrationEnabled',
      title: t('panel.modules.registration', 'User registration'),
      desc: t('panel.system.registrationDesc', 'New visitors can create accounts. Existing users can always sign in.'),
      endpoint: 'POST /auth/register',
    },
    {
      key: 'inquiriesEnabled',
      title: t('panel.modules.inquiries', 'Contact form'),
      desc: t('panel.system.inquiriesDesc', 'Quote requests and messages from the contact page.'),
      endpoint: 'POST /inquiries',
    },
    {
      key: 'jobApplicationsEnabled',
      title: t('panel.modules.applications', 'Job applications'),
      desc: t('panel.system.applicationsDesc', 'Candidates applying to open vacancies.'),
      endpoint: 'POST /applications',
    },
    {
      key: 'academyRegistrationEnabled',
      title: t('panel.modules.academy', 'Academy registration'),
      desc: t('panel.system.academyDesc', 'Sign-ups from the academy site.'),
      endpoint: 'POST /academy/registrations',
    },
  ];

  const dirty = !!draft && !!saved && JSON.stringify(draft) !== JSON.stringify(saved);

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    setMsg(null);
    try {
      const s = await api.admin.updateSystemSettings(draft);
      setSaved(s);
      setDraft(s);
      setMsg({ tone: 'success', text: t('panel.system.saved', 'Settings saved. Changes apply immediately.') });
    } catch (err) {
      setMsg({ tone: 'danger', text: errorMessage(err, t('panel.system.saveFailed', 'Could not save settings.')) });
    } finally {
      setSaving(false);
    }
  };

  const contentLinks = [
    { to: '/admin/settings', icon: SettingsIcon, label: t('panel.system.siteSettings', 'Site settings — brand, contacts, social links') },
    { to: '/admin/home', icon: HomeIcon, label: t('panel.system.homeContent', 'Home page content') },
    { to: '/admin/about', icon: Info, label: t('panel.system.aboutContent', 'About page content') },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('panel.nav.system', 'System settings')}
        subtitle={t('panel.system.subtitle', 'Turn public modules of the site on or off. A disabled module rejects new submissions on the server; stored data is not touched.')}
        actions={
          <button onClick={save} disabled={!dirty || saving} className={btn.primary}>
            {saving && <Spinner />} {t('account.profile.save', 'Save changes')}
          </button>
        }
      />

      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}

      {loadError ? (
        <ErrorState message={loadError} onRetry={load} />
      ) : loading || !draft ? (
        <LoadingRows rows={4} />
      ) : (
        <>
          <section className="card divide-y divide-border p-0">
            {modules.map((m) => (
              <div key={m.key} className="flex items-center justify-between gap-4 p-5">
                <div className="min-w-0">
                  <label htmlFor={`mod-${m.key}`} className="font-medium text-text">{m.title}</label>
                  <p className="text-sm text-text-muted">{m.desc}</p>
                  <code className="mt-1 block font-mono text-[11px] text-text-subtle">{m.endpoint}</code>
                </div>
                <Toggle id={`mod-${m.key}`} label={m.title} checked={draft[m.key]} onChange={(v) => setDraft({ ...draft, [m.key]: v })} />
              </div>
            ))}
          </section>

          <section className="card space-y-2 p-5">
            <label htmlFor="maint" className="font-medium text-text">{t('panel.system.messageTitle', 'Message for disabled modules')}</label>
            <p className="text-sm text-text-muted">{t('panel.system.messageDesc', 'Shown to visitors who try to use a module that is switched off. Leave empty for the default text.')}</p>
            <textarea
              id="maint"
              rows={3}
              maxLength={500}
              value={draft.maintenanceMessage}
              onChange={(e) => setDraft({ ...draft, maintenanceMessage: e.target.value })}
              className="field"
              placeholder={t('panel.system.messagePlaceholder', 'e.g. We are updating this form, please email us in the meantime.')}
            />
          </section>
        </>
      )}

      <section className="space-y-3">
        <h2 className="font-mono text-xs uppercase tracking-wider text-text-subtle">{t('panel.system.contentTitle', 'Site configuration')}</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {contentLinks.map((l) => (
            <Link key={l.to} to={l.to} className="card card-interactive flex items-center gap-3 p-4 text-sm text-text">
              <l.icon className="h-5 w-5 shrink-0 text-primary" />
              <span className="min-w-0 flex-1">{l.label}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-text-subtle" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
