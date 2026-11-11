import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { Copy, Check, KeyRound, LogOut, ShieldCheck, MonitorSmartphone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { ApiError, isAdminRole } from '@/lib/api';
import { Seo } from '@/components/Seo';
import { formatDate, RoleBadge, Spinner, errorMessage } from '@/components/admin/ui';
import { PageHero, Pill, useReveal } from '@/components/site/blocks';
import { AccNotice, FieldLabel } from '@/components/site/account/ui';

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

  const gridRef = useReveal<HTMLDivElement>();

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

  const initial = (user.name || user.email || '?').trim().charAt(0).toLocaleUpperCase();
  const reveal = (i: number) => ({ 'data-reveal': true, style: { '--d': `${i * 90}ms` } as CSSProperties });

  return (
    <>
      <Seo title={t('account.profile.title', 'My profile')} noindex />

      <PageHero
        short
        tone="burnt"
        word={t('site.account.profile.word')}
        num={initial}
        eyebrow={t('account.profile.title', 'My profile')}
        title={user.name || user.email}
        lead={user.name ? user.email : undefined}
        actions={
          <>
            {isAdminRole(user.role) && (
              <Pill to={user.role === 'super_admin' ? '/panel' : '/crm'} variant="light">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" aria-hidden /> {user.role === 'super_admin' ? t('nav.adminPanel', 'Admin panel') : 'CRM'}
                </span>
              </Pill>
            )}
            <Pill variant="ghost" arrow={false} onClick={() => { logout(); navigate('/login'); }}>
              <span className="inline-flex items-center gap-2">
                <LogOut className="h-4 w-4" aria-hidden /> {t('nav.logout', 'Logout')}
              </span>
            </Pill>
          </>
        }
      />

      <section className="as-section--tight">
        <div ref={gridRef} className="as-wrap grid max-w-[1240px] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)] lg:gap-8">
          {/* Account facts */}
          <section className="as-box h-fit lg:sticky lg:top-[calc(var(--as-header-h)+24px)]" {...reveal(0)}>
            <h2 className="as-h3 mb-6">{t('account.profile.account', 'Account')}</h2>
            <dl className="acc-facts">
              <div>
                <dt>{t('account.fields.id', 'User ID')}</dt>
                <dd className="flex items-center gap-2">
                  <code className="min-w-0 break-all font-mono text-xs">{user.id}</code>
                  <button onClick={copyId} className="acc-eye !static !translate-y-0 shrink-0" aria-label={t('account.profile.copyId', 'Copy ID')}>
                    {copied ? <Check className="h-4 w-4 text-[var(--acc-ok)]" /> : <Copy className="h-4 w-4" />}
                  </button>
                </dd>
              </div>
              <div>
                <dt>{t('account.fields.email', 'Email')}</dt>
                <dd className="break-all">{user.email}</dd>
              </div>
              <div>
                <dt>{t('account.fields.role', 'Role')}</dt>
                <dd><RoleBadge role={user.role} /></dd>
              </div>
              <div>
                <dt>{t('account.fields.registered', 'Registered')}</dt>
                <dd>{formatDate(user.createdAt, true)}</dd>
              </div>
              <div>
                <dt>{t('account.fields.lastLogin', 'Last sign-in')}</dt>
                <dd>{formatDate(user.lastLoginAt, true)}</dd>
              </div>
            </dl>
          </section>

          <div className="grid min-w-0 gap-6 lg:gap-8">
            {/* Personal details */}
            <form onSubmit={saveDetails} className="as-tile grid gap-5" {...reveal(1)}>
              <h2 className="as-h3">{t('account.profile.details', 'Personal details')}</h2>
              {detailsMsg && <AccNotice tone={detailsMsg.tone}>{detailsMsg.text}</AccNotice>}
              <div>
                <FieldLabel htmlFor="p-name">{t('account.fields.username', 'Name')}</FieldLabel>
                <input id="p-name" className="acc-input" maxLength={255} autoComplete="name" value={details.name}
                  onChange={(e) => setDetails((d) => ({ ...d, name: e.target.value }))} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="p-phone">{t('account.fields.phone', 'Phone')}</FieldLabel>
                  <input id="p-phone" className="acc-input" type="tel" maxLength={64} autoComplete="tel" value={details.phone}
                    onChange={(e) => setDetails((d) => ({ ...d, phone: e.target.value }))} />
                </div>
                <div>
                  <FieldLabel htmlFor="p-company">{t('account.fields.company', 'Company')}</FieldLabel>
                  <input id="p-company" className="acc-input" maxLength={255} autoComplete="organization" value={details.company}
                    onChange={(e) => setDetails((d) => ({ ...d, company: e.target.value }))} />
                </div>
              </div>
              <p className="text-[13px] text-[var(--as-fg-soft)]">{t('account.profile.emailFixed', 'Email is used to sign in and cannot be changed here.')}</p>
              <div>
                <button type="submit" disabled={!dirty || savingDetails} className="as-btn as-btn--sm">
                  {savingDetails && <Spinner />} <span>{t('account.profile.save', 'Save changes')}</span>
                </button>
              </div>
            </form>

            {/* Password */}
            <form onSubmit={savePassword} className="as-tile grid gap-5" {...reveal(2)}>
              <h2 className="as-h3 flex items-center gap-3">
                <KeyRound className="h-5 w-5 shrink-0 text-[var(--as-accent)]" aria-hidden /> {t('account.password.title', 'Change password')}
              </h2>
              {pwMsg && <AccNotice tone={pwMsg.tone}>{pwMsg.text}</AccNotice>}
              <div>
                <FieldLabel htmlFor="pw-current">{t('account.password.current', 'Current password')}</FieldLabel>
                <input id="pw-current" type="password" className="acc-input" autoComplete="current-password" value={pw.current}
                  onChange={(e) => setPw((d) => ({ ...d, current: e.target.value }))} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="pw-next">{t('account.password.new', 'New password')}</FieldLabel>
                  <input id="pw-next" type="password" className="acc-input" autoComplete="new-password" maxLength={72} value={pw.next}
                    onChange={(e) => setPw((d) => ({ ...d, next: e.target.value }))} />
                </div>
                <div>
                  <FieldLabel htmlFor="pw-confirm">{t('account.fields.confirmPassword', 'Confirm password')}</FieldLabel>
                  <input id="pw-confirm" type="password" className="acc-input" autoComplete="new-password" maxLength={72} value={pw.confirm}
                    onChange={(e) => setPw((d) => ({ ...d, confirm: e.target.value }))} />
                </div>
              </div>
              {pwError && <p className="acc-hint acc-hint--bad !mt-0">{pwError}</p>}
              <div>
                <button type="submit" disabled={savingPw || !pw.current || !pw.next || !pw.confirm} className="as-btn as-btn--sm">
                  {savingPw && <Spinner />} <span>{t('account.password.submit', 'Update password')}</span>
                </button>
              </div>
            </form>

            {/* Sessions */}
            <section className="as-tile flex flex-wrap items-center justify-between gap-5" {...reveal(3)}>
              <div className="flex min-w-0 items-start gap-3">
                <MonitorSmartphone className="mt-1 h-5 w-5 shrink-0 text-[var(--as-accent)]" aria-hidden />
                <div className="min-w-0">
                  <h2 className="as-h3">{t('account.sessions.title', 'Sessions')}</h2>
                  <p className="mt-1 text-[15px] text-[var(--as-fg-soft)]">{t('account.sessions.body', 'Lost a device? Sign out of your account everywhere.')}</p>
                </div>
              </div>
              <button onClick={signOutEverywhere} disabled={signingOut} className="as-btn as-btn--sm as-btn--ghost acc-btn-danger">
                {signingOut && <Spinner />} <span>{t('account.sessions.action', 'Sign out everywhere')}</span>
              </button>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;
