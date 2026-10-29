import type { ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Lock, ArrowLeft, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCrm } from '@/contexts/CrmContext';
import { useI18n } from '@/contexts/I18nContext';
import { CrmLayout } from '@/components/crm/CrmLayout';
import { ErrorState, btn } from '@/components/admin/ui';

function FullScreenSpinner() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
    </div>
  );
}

/**
 * Entry to the CRM. Guests go to the login page and come back here; signed-in
 * users without CRM access see "Access restricted". The server enforces the
 * same rules on every API call.
 */
export function CrmGate({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { me, loading, error, reload } = useCrm();
  const location = useLocation();

  if (authLoading) return <FullScreenSpinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!me && loading) return <FullScreenSpinner />;
  if (error || !me) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg p-4">
        <ErrorState message={error || 'CRM is unavailable'} onRetry={reload} />
      </div>
    );
  }
  if (!me.hasAccess) return <AccessRestricted />;
  return <CrmLayout>{children}</CrmLayout>;
}

export function AccessRestricted() {
  const { t } = useI18n();
  const { user } = useAuth();
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg p-4">
      <div className="card w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface-2">
          <Lock className="h-6 w-6 text-warning" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-text">{t('crm.restricted.title', 'Access restricted')}</h1>
        <p className="mt-2 text-sm text-text-muted">
          {t('crm.restricted.body', "Your account doesn't have access to the CRM yet. An administrator can add you to a company or project.")}
        </p>
        <p className="mt-4 rounded-md bg-surface-2 px-3 py-2 font-mono text-xs text-text-subtle">
          {user?.email} · ID {user?.id}
        </p>
        <p className="mt-2 text-xs text-text-subtle">{t('crm.restricted.hint', 'Send this email or ID to your administrator.')}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link to="/" className={btn.secondary}><ArrowLeft className="h-4 w-4" /> {t('admin.goToSite', 'Go to site')}</Link>
          <Link to="/profile" className={btn.primary}><UserCircle className="h-4 w-4" /> {t('account.profile.title', 'My profile')}</Link>
        </div>
      </div>
    </div>
  );
}

export function SoonPage({ titleKey, title }: { titleKey: string; title: string }) {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <span className="rounded border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-subtle">{t('crm.soon', 'Soon')}</span>
      <h1 className="mt-4 font-display text-2xl font-semibold text-text">{t(titleKey, title)}</h1>
      <p className="mt-2 text-text-muted">
        {t('crm.soonBody', 'This module is planned in a later stage of the CRM. It will appear here once it works with real data — nothing on this page is simulated.')}
      </p>
    </div>
  );
}
