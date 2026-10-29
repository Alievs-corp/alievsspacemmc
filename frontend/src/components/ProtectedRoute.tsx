import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import type { Permission } from '@/lib/api';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
  /** Passes if the user holds any of these. */
  permissions?: Permission[];
}

/**
 * Client-side gate for routes. It only decides what to render — every API call
 * behind these pages is authorised again on the server.
 */
export function ProtectedRoute({ children, requireAdmin = false, requireSuperAdmin = false, permissions }: ProtectedRouteProps) {
  const { user, loading, isAdmin, isSuperAdmin, hasPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if ((requireAdmin || requireSuperAdmin || permissions) && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const allowed =
    (!requireSuperAdmin || isSuperAdmin) &&
    (!permissions || permissions.some((p) => hasPermission(p)));

  if (!allowed) return <AccessDenied />;

  return <>{children}</>;
}

export function AccessDenied() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface-2">
        <ShieldAlert className="h-6 w-6 text-warning" />
      </div>
      <h1 className="font-display text-xl font-semibold text-text">{t('panel.denied.title', 'No access to this section')}</h1>
      <p className="mt-2 max-w-sm text-sm text-text-muted">
        {t('panel.denied.body', 'Your role does not include this section. A super admin can grant access.')}
      </p>
    </div>
  );
}
