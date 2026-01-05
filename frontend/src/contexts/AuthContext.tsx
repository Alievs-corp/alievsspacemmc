import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { api, type User, type LoginRequest, type RegisterRequest } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<User | null>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      api.auth
        .getCurrentUser()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('auth_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginRequest): Promise<User | null> => {
    try {
      const response = await api.auth.userLogin(credentials);
      localStorage.setItem('auth_token', response.token);
      setUser(response.user || null);
      return response.user || null;
    } catch (userError) {
      try {
        const adminResponse = await api.auth.adminLogin(credentials);
        localStorage.setItem('auth_token', adminResponse.token);
        setUser(adminResponse.user || null);
        return adminResponse.user || null;
      } catch (adminError) {
        throw userError;
      }
    }
  };

  const register = async (data: RegisterRequest) => {
    const response = await api.auth.register(data);
    localStorage.setItem('auth_token', response.token);
    setUser(response.user || null);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

