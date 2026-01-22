import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';
import alievsspace from "../../assets/images/alievsspace-logo.png";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, isAdmin, loading } = useAuth();
  const { locale, setLocale, supportedLocales } = useI18n();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/', { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-gray-700 font-inter text-lg">Yüklənir...</div>
          <div className="text-gray-500 text-sm mt-2">Zəhmət olmasa gözləyin</div>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const navItems = [
  { 
    path: '/admin', 
    label: 'İdarəetmə Paneli', 
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    color: 'text-blue-500'
  },
  { 
    path: '/admin/services', 
    label: 'Xidmətlər', 
    icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z',
    color: 'text-purple-500'
  },
  { 
    path: '/admin/projects', 
    label: 'Layihələr', 
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    color: 'text-green-500'
  },
  { 
    path: '/admin/blog', 
    label: 'Blog', 
    icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
    color: 'text-orange-500'
  },
  { 
    path: '/admin/careers', 
    label: 'Vakansiyalar', 
    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    color: 'text-cyan-500'
  },
  { 
    path: '/admin/inquiries', 
    label: 'Müraciətlər', 
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    color: 'text-red-500'
  },
  { 
  path: '/admin/users', 
  label: 'İstifadəçilər', 
  icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  color: 'text-pink-500'
},
  { 
    path: '/admin/settings', 
    label: 'Parametrlər', 
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    color: 'text-yellow-500'
  },
];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const Icon = ({ path, className }: { path: string, className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0A0A1E] via-[#13132F] to-[#1A1A2E]">
      <aside
        className={cn(
          'flex flex-col bg-gradient-to-b from-[#13132F] to-[#0A0A1E] transition-all duration-300 z-20 fixed lg:relative h-full',
          sidebarOpen ? 'w-64 shadow-2xl' : 'w-[120px]'
        )}
      >
        <div className={cn(
          "flex items-center p-6 border-b border-[#2A2A3A]/50",
          sidebarOpen ? "justify-between" : "justify-center gap-2"
        )}>
          <div className={cn('flex items-center gap-3', !sidebarOpen && 'justify-center')}>
            <img src={alievsspace} className="h-8 w-8 rounded-lg" alt="Alievs Space" />
            {sidebarOpen && (
              <div>
                <div className="font-inter font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Alievs Space
                </div>
                <div className="font-inter text-xs text-gray-400">Admin Panel</div>
              </div>
            )}
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            {sidebarOpen ? (
              <Icon path="M15 19l-7-7 7-7" className="w-5 h-5" />
            ) : (
              <Icon path="M9 5l7 7-7 7" className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 font-inter transition-all duration-200 group',
                isActive(item.path)
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-l-4 border-blue-500 shadow-lg'
                  : 'text-gray-300 hover:bg-white/5 border-l-4 border-transparent',
                !sidebarOpen && 'justify-center px-3'
              )}
              title={!sidebarOpen ? item.label : undefined}
            >
              <div className={cn(
                "p-2 rounded-lg",
                isActive(item.path) 
                  ? "bg-gradient-to-br from-blue-500 to-blue-600" 
                  : "bg-gray-800/50 group-hover:bg-gray-700/50"
              )}>
                <Icon 
                  path={item.icon} 
                  className={cn(
                    "w-4 h-4",
                    isActive(item.path) ? "text-white" : item.color
                  )} 
                />
              </div>
              {sidebarOpen && (
                <div className="flex-1">
                  <span className="text-sm font-medium text-white group-hover:text-blue-100">
                    {item.label}
                  </span>
                  {isActive(item.path) && (
                    <div className="h-1 w-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-1"></div>
                  )}
                </div>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#2A2A3A]/50">
          <button
            onClick={() => navigate('/')}
            className={cn(
              'w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
              sidebarOpen 
                ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 hover:from-gray-700 hover:to-gray-800 hover:text-white justify-start hover:shadow-lg' 
                : 'justify-center p-3 text-gray-400 hover:text-white hover:bg-white/5'
            )}
            title={!sidebarOpen ? "Sayta Keçid" : undefined}
          >
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <Icon path="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" className="w-4 h-4" />
            </div>
            {sidebarOpen && <span>Sayta Keçid</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-transparent ml-[120px] lg:ml-0">
        <div className="sticky top-0 z-10 bg-[#13132F]/90 backdrop-blur-lg border-b border-[#2A2A3A]/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="lg:hidden">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-300 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Icon path="M4 6h16M4 12h16M4 18h16" className="w-6 h-6" />
                </button>
              </div>
              
              <div>
                <h1 className="font-inter text-xl font-bold text-white">
                  {navItems.find(item => isActive(item.path))?.label || 'İdarəetmə Paneli'}
                </h1>
                <p className="font-inter text-gray-400 text-sm">
                  {location.pathname === '/admin' ? 'Ümumi statistikalar və idarəetmə' : 'Məzmunun idarə edilməsi'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block text-sm text-gray-300 bg-[#1A1A2E]/80 px-4 py-2 rounded-xl border border-[#2A2A3A]">
                {new Date().toLocaleDateString('az-AZ', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}
              </div>

              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as typeof locale)}
                className="hidden md:block bg-[#1A1A2E] border border-[#2A2A3A] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {supportedLocales.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#1A1A2E] text-gray-300">
                    {l.label}
                  </option>
                ))}
              </select>

              <div className="md:hidden relative">
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as typeof locale)}
                  className="appearance-none bg-[#1A1A2E] border border-[#2A2A3A] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {supportedLocales.map((l) => (
                    <option key={l.code} value={l.code} className="bg-[#1A1A2E] text-gray-300">
                      {l.code.toUpperCase()}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <div className="text-sm font-medium text-white">{user?.name || user?.email}</div>
                  <div className="text-xs text-gray-400">Admin</div>
                </div>
                
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border-2 border-blue-500/50 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#13132F]"></div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl"
                >
                  <Icon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" className="w-4 h-4" />
                  <span className="hidden sm:inline">Çıxış</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-gradient-to-br from-[#1A1A2E] to-[#13132F]/80 rounded-2xl border border-[#2A2A3A]/50 p-6 md:p-8 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {navItems.find(item => isActive(item.path))?.label === 'İdarəetmə Paneli' 
                    ? 'Ümumi İdarəetmə' 
                    : `${navItems.find(item => isActive(item.path))?.label} İdarəetmə`}
                </h2>
                <p className="text-gray-400 mt-1">
                  {location.pathname === '/admin' 
                    ? 'Bütün sistem statistikaları və aktivliklər' 
                    : 'Məzmunu idarə etmək üçün lazım olan alətlər'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2A2A3A] to-[#1A1A2E] rounded-xl border border-[#2A2A3A]">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-300">Bütün sistemlər aktiv</span>
                </div>
              </div>
            </div>
            
            <div className="text-gray-200">
              {children}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#2A2A3A]/50">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
              <div>© {new Date().getFullYear()} Alievs Space. Bütün hüquqlar qorunur.</div>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <span className="px-3 py-1 bg-gradient-to-r from-blue-900/30 to-purple-900/30 text-blue-300 rounded-full text-xs font-medium">
                  v1.3.0
                </span>
                <span className="text-gray-600">•</span>
                <span className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  {new Date().getHours()}:{new Date().getMinutes().toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}