import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Copy, Check, KeyRound, LogOut, ShieldCheck, UserCircle, MonitorSmartphone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { ApiError, isAdminRole } from '@/lib/api';
import { Seo } from '@/components/Seo';
import { btn, formatDate, Notice, RoleBadge, Spinner, errorMessage } from '@/components/admin/ui';

const MIN_PASSWORD = 8;

export function Profile() {
  const { user, updateProfile, changePassword, logout, logoutEverywhere } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [details, setDetails] = useState({ name: '', phone: '', company: '' });
  const [savingDetails, setSavingDetails] = useState(false);
  const [detailsMsg, setDetailsMsg] = useState<{ tone: 'success' | 'danger'; text: string } | null>(null);

  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ tone: 'success' | 'danger'; text: string } | null>(null);

  const [copied, setCopied] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (user) setDetails({ name: user.name || '', phone: user.phone || '', company: user.company || '' });
  }, [user]);

  if (!user) return null;

  const dirty =
    details.name.trim() !== (user.name || '') ||
    details.phone.trim() !== (user.phone || '') ||
    details.company.trim() !== (user.company || '');

  const saveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.name.trim()) {
      setDetailsMsg({ tone: 'danger', text: t('account.validation.nameRequired', 'Enter your name') });
      return;
    }
    setSavingDetails(true);
    setDetailsMsg(null);
    try {
      await updateProfile({ name: details.name.trim(), phone: details.phone.trim(), company: details.company.trim() });
      setDetailsMsg({ tone: 'success', text: t('account.profile.saved', 'Profile updated.') });
    } catch (err) {
      setDetailsMsg({ tone: 'danger', text: errorMessage(err, t('account.profile.saveFailed', 'Could not save changes.')) });
    } finally {
      setSavingDetails(false);
    }
  };

  const pwError =
    pw.next && pw.next.length < MIN_PASSWORD ? t('account.validation.passwordShort', 'At least 8 characters')
      : pw.confirm && pw.confirm !== pw.next ? t('account.validation.passwordMismatch', 'Passwords do not match')
        : '';

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pw.current || !pw.next || pwError || pw.confirm !== pw.next) {
      setPwMsg({ tone: 'danger', text: pwError || t('account.validation.passwordMismatch', 'Passwords do not match') });
      return;
    }
    setSavingPw(true);
    setPwMsg(null);
    try {
      await changePassword({ currentPassword: pw.current, newPassword: pw.next });
      setPw({ current: '', next: '', confirm: '' });
      setPwMsg({ tone: 'success', text: t('account.password.changed', 'Password changed. Other devices have been signed out.') });
    } catch (err) {
      const text = err instanceof ApiError && err.status === 401
        ? t('account.password.wrongCurrent', 'The current password is incorrect.')
        : errorMessage(err, t('account.password.failed', 'Could not change the password.'));
      setPwMsg({ tone: 'danger', text });
    } finally {
      setSavingPw(false);
    }
  };

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — the id is still selectable */
    }
  };

  const signOutEverywhere = async () => {
    if (!window.confirm(t('account.sessions.confirm', 'Sign out on all devices, including this one?'))) return;
    setSigningOut(true);
    try {
      await logoutEverywhere();
    } finally {
      navigate('/login');
    }
  };

  const label = 'mb-1.5 block text-sm font-medium text-text-muted';

  return (
    <>
      <Seo title={t('account.profile.title', 'My profile')} noindex />
      <div className="mx-auto w-full max-w-4xl px-4 pb-24 pt-28 sm:px-6 lg:pt-32">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border bg-surface-2">
              <UserCircle className="h-7 w-7 text-text-muted" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate font-display text-2xl font-bold text-text sm:text-3xl">{user.name || user.email}</h1>
              <p className="truncate text-sm text-text-muted">{user.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {isAdminRole(user.role) && (
              <Link to="/admin" className={btn.primary}>
                <ShieldCheck className="h-4 w-4" /> {t('nav.adminPanel', 'Admin panel')}
              </Link>
            )}
            <button onClick={() => { logout(); navigate('/login'); }} className={btn.secondary}>
              <LogOut className="h-4 w-4" /> {t('nav.logout', 'Logout')}
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          {/* Account facts */}
          <section className="card h-fit p-5">
            <h2 className="mb-4 font-display text-lg font-semibold text-text">{t('account.profile.account', 'Account')}</h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-text-subtle">{t('account.fields.id', 'User ID')}</dt>
                <dd className="mt-1 flex items-center gap-2">
                  <code className="min-w-0 break-all font-mono text-xs text-text">{user.id}</code>
                  <button onClick={copyId} className="shrink-0 rounded-md p-1.5 text-text-subtle hover:bg-surface-3 hover:text-text" aria-label={t('account.profile.copyId', 'Copy ID')}>
                    {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </button>
                </dd>
              </div>
              <div>
                <dt className="text-text-subtle">{t('account.fields.email', 'Email')}</dt>
                <dd className="mt-1 break-all text-text">{user.email}</dd>
              </div>
              <div>
                <dt className="text-text-subtle">{t('account.fields.role', 'Role')}</dt>
                <dd className="mt-1"><RoleBadge role={user.role} /></dd>
              </div>
              <div>
                <dt className="text-text-subtle">{t('account.fields.registered', 'Registered')}</dt>
                <dd className="mt-1 text-text">{formatDate(user.createdAt, true)}</dd>
              </div>
              <div>
                <dt className="text-text-subtle">{t('account.fields.lastLogin', 'Last sign-in')}</dt>
                <dd className="mt-1 text-text">{formatDate(user.lastLoginAt, true)}</dd>
              </div>
            </dl>
          </section>

          <div className="space-y-6">
            {/* Personal details */}
            <form onSubmit={saveDetails} className="card space-y-4 p-5">
              <h2 className="font-display text-lg font-semibold text-text">{t('account.profile.details', 'Personal details')}</h2>
              {detailsMsg && <Notice tone={detailsMsg.tone}>{detailsMsg.text}</Notice>}
              <div>
                <label htmlFor="p-name" className={label}>{t('account.fields.username', 'Name')}</label>
                <input id="p-name" className="field" maxLength={255} autoComplete="name" value={details.name}
                  onChange={(e) => setDetails((d) => ({ ...d, name: e.target.value }))} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="p-phone" className={label}>{t('account.fields.phone', 'Phone')}</label>
                  <input id="p-phone" className="field" type="tel" maxLength={64} autoComplete="tel" value={details.phone}
                    onChange={(e) => setDetails((d) => ({ ...d, phone: e.target.value }))} />
                </div>
                <div>
                  <label htmlFor="p-company" className={label}>{t('account.fields.company', 'Company')}</label>
                  <input id="p-company" className="field" maxLength={255} autoComplete="organization" value={details.company}
                    onChange={(e) => setDetails((d) => ({ ...d, company: e.target.value }))} />
                </div>
              </div>
              <p className="text-xs text-text-subtle">{t('account.profile.emailFixed', 'Email is used to sign in and cannot be changed here.')}</p>
              <button type="submit" disabled={!dirty || savingDetails} className={btn.primary}>
                {savingDetails && <Spinner />} {t('account.profile.save', 'Save changes')}
              </button>
            </form>

            {/* Password */}
            <form onSubmit={savePassword} className="card space-y-4 p-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-text">
                <KeyRound className="h-5 w-5 text-text-subtle" /> {t('account.password.title', 'Change password')}
              </h2>
              {pwMsg && <Notice tone={pwMsg.tone}>{pwMsg.text}</Notice>}
              <div>
                <label htmlFor="pw-current" className={label}>{t('account.password.current', 'Current password')}</label>
                <input id="pw-current" type="password" className="field" autoComplete="current-password" value={pw.current}
                  onChange={(e) => setPw((d) => ({ ...d, current: e.target.value }))} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="pw-next" className={label}>{t('account.password.new', 'New password')}</label>
                  <input id="pw-next" type="password" className="field" autoComplete="new-password" maxLength={72} value={pw.next}
                    onChange={(e) => setPw((d) => ({ ...d, next: e.target.value }))} />
                </div>
                <div>
                  <label htmlFor="pw-confirm" className={label}>{t('account.fields.confirmPassword', 'Confirm password')}</label>
                  <input id="pw-confirm" type="password" className="field" autoComplete="new-password" maxLength={72} value={pw.confirm}
                    onChange={(e) => setPw((d) => ({ ...d, confirm: e.target.value }))} />
                </div>
              </div>
              {pwError && <p className="text-xs text-danger">{pwError}</p>}
              <button type="submit" disabled={savingPw || !pw.current || !pw.next || !pw.confirm} className={btn.primary}>
                {savingPw && <Spinner />} {t('account.password.submit', 'Update password')}
              </button>
            </form>

            {/* Sessions */}
            <section className="card flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="flex min-w-0 items-start gap-3">
                <MonitorSmartphone className="mt-0.5 h-5 w-5 shrink-0 text-text-subtle" />
                <div>
                  <h2 className="font-display text-lg font-semibold text-text">{t('account.sessions.title', 'Sessions')}</h2>
                  <p className="text-sm text-text-muted">{t('account.sessions.body', 'Lost a device? Sign out of your account everywhere.')}</p>
                </div>
              </div>
              <button onClick={signOutEverywhere} disabled={signingOut} className={btn.danger}>
                {signingOut && <Spinner />} {t('account.sessions.action', 'Sign out everywhere')}
              </button>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
