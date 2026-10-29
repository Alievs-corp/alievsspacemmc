import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  api,
  ApiError,
  hasPermission as userHasPermission,
  isAdminRole,
  type User,
  type LoginRequest,
  type RegisterRequest,
  type Permission,
  type PasswordChangeRequest,
} from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<User | null>;
  register: (data: RegisterRequest) => Promise<User | null>;
  logout: () => void;
  /** Re-reads the profile, e.g. after a super admin changed this account's role. */
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<Pick<User, 'name' | 'phone' | 'company'>>) => Promise<void>;
  changePassword: (data: PasswordChangeRequest) => Promise<void>;
  logoutEverywhere: () => Promise<void>;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  hasPermission: (p: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setUser(null);
      return;
    }
    try {
      setUser(await api.user.getProfile());
    } catch (err) {
      // Expired, revoked or blocked: the token is useless, drop it.
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = async (credentials: LoginRequest): Promise<User | null> => {
    // /auth/login serves every role; the separate admin endpoint is kept for
    // other clients but no longer needed here.
    const response = await api.auth.login(credentials);
    localStorage.setItem(TOKEN_KEY, response.token);
    setUser(response.user || null);
    return response.user || null;
  };

  const register = async (data: RegisterRequest): Promise<User | null> => {
    const response = await api.auth.register(data);
    localStorage.setItem(TOKEN_KEY, response.token);
    setUser(response.user || null);
    return response.user || null;
  };

  const updateProfile = async (data: Partial<Pick<User, 'name' | 'phone' | 'company'>>) => {
    setUser(await api.user.updateProfile(data));
  };

  const changePassword = async (data: PasswordChangeRequest) => {
    const { token } = await api.user.changePassword(data);
    localStorage.setItem(TOKEN_KEY, token);
  };

  const logoutEverywhere = async () => {
    try {
      await api.user.logoutEverywhere();
    } finally {
      clearSession();
    }
  };

  const isAdmin = isAdminRole(user?.role);
  const isSuperAdmin = user?.role === 'super_admin';
  const hasPermission = (p: Permission) => userHasPermission(user, p);

  return (
    <AuthContext.Provider
      value={{
        user, loading, login, register, logout: clearSession, refreshUser, updateProfile,
        changePassword, logoutEverywhere, isAdmin, isSuperAdmin, hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
