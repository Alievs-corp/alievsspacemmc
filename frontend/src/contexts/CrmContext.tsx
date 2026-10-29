/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { crm, setViewAs, type CrmMe, type CrmPermission, type UserBrief } from '@/lib/crm';

interface CrmContextType {
  me: CrmMe | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  /** Holds the permission anywhere (menu visibility; the server decides per record). */
  can: (p: CrmPermission) => boolean;
  /** Super admin acting with full rights (not viewing as someone else). */
  adminMode: boolean;
  viewingAs: UserBrief | null;
  startViewAs: (user: UserBrief) => void;
  stopViewAs: () => void;
  /** True while viewing as another user: every write is refused by the server. */
  readOnly: boolean;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

export function CrmProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [me, setMe] = useState<CrmMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingAs, setViewingAs] = useState<UserBrief | null>(null);

  const reload = useCallback(async () => {
    if (!user) {
      setMe(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setMe(await crm.me());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load CRM access');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Re-read access whenever the account or the viewed user changes.
  useEffect(() => {
    setViewAs(viewingAs?.id ?? null);
    reload();
  }, [reload, viewingAs]);

  // Leaving the CRM (or signing out) must never leave view-as switched on.
  useEffect(() => () => setViewAs(null), []);

  const can = useCallback((p: CrmPermission) => !!me && (me.superAdmin || me.permissions.includes(p)), [me]);

  return (
    <CrmContext.Provider
      value={{
        me,
        loading,
        error,
        reload,
        can,
        adminMode: !!me?.superAdmin && !viewingAs,
        viewingAs,
        startViewAs: setViewingAs,
        stopViewAs: () => setViewingAs(null),
        readOnly: !!viewingAs,
      }}
    >
      {children}
    </CrmContext.Provider>
  );
}

export function useCrm() {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error('useCrm must be used within CrmProvider');
  return ctx;
}
