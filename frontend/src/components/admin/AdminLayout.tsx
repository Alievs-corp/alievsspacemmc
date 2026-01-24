import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';
import alievsspace from "../../assets/images/alievsspace-logo.png";
import translate from "../../assets/icons/translate.svg";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, isAdmin, loading } = useAuth();
  const { locale, setLocale, supportedLocales, t } = useI18n();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/', { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0A0A1E] via-[#13132F] to-[#1A1A2E]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#133FA6] mb-4"></div>
          <div className="text-white font-inter text-lg">{t('admin.loading')}</div>
          <div className="text-[#808087] text-sm mt-2">{t('public.loading')}</div>
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
    labelKey: 'admin.dashboard', 
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    color: 'text-blue-500'
  },
  { 
    path: '/admin/services', 
    labelKey: 'admin.services', 
    icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z',
    color: 'text-purple-500'
  },
  { 
    path: '/admin/projects', 
    labelKey: 'admin.projects', 
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    color: 'text-green-500'
  },
  { 
    path: '/admin/blog', 
    labelKey: 'admin.blog', 
    icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
    color: 'text-orange-500'
  },
  { 
    path: '/admin/careers', 
    labelKey: 'admin.careers', 
    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    color: 'text-cyan-500'
  },
  { 
    path: '/admin/inquiries', 
    labelKey: 'admin.inquiries', 
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    color: 'text-red-500'
  },
  { 
  path: '/admin/users', 
  labelKey: 'admin.users', 
  icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  color: 'text-pink-500'
},
  { 
    path: '/admin/settings', 
    labelKey: 'admin.settings', 
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
    <div className="flex h-screen" style={{
      background: `
        radial-gradient(
          ellipse at center,
          rgba(52,52,93,0.35) 0%,
          rgba(8,8,30,0.85) 70%,
          rgba(8,8,30,1) 100%
        ),
        linear-gradient(
          135deg,
          #34345D 0%,
          #08081E 50%,
          #34345D 75%,
          #08081E 100%
        )
      `
    }}>
      <aside
        className={cn(
          'flex flex-col bg-gradient-to-b from-[#13132F] to-[#0A0A1E] transition-all duration-300 z-20 fixed lg:relative h-full',
          sidebarOpen ? 'w-64 shadow-2xl' : 'w-[120px]'
        )}
      >
        <div className={cn(
          "flex items-center p-4 sm:p-6 border-b border-[#546691]",
          sidebarOpen ? "justify-between" : "justify-center gap-2"
        )}>
          <div className={cn('flex items-center gap-3', !sidebarOpen && 'justify-center')}>
            <img src={alievsspace} className="h-8 w-8 rounded-lg" alt={t('company.name')} />
            {sidebarOpen && (
              <div>
                <p className='font-almarai text-lg leading-none text-white'>ALIEVS</p>
                <p className='font-kavivanar text-xs leading-tight text-white'>Space MMC</p>
                <div className="font-inter text-[10px] text-[#808087] mt-0.5">{t('admin.panel')}</div>
              </div>
            )}
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#808087] hover:text-white transition-colors p-1 rounded-lg hover:bg-[#546691]"
          >
            {sidebarOpen ? (
              <Icon path="M15 19l-7-7 7-7" className="w-5 h-5" />
            ) : (
              <Icon path="M9 5l7 7-7 7" className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 p-3 sm:p-4 space-y-1.5 sm:space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 font-inter transition-all duration-200 group',
                isActive(item.path)
                  ? 'bg-[#133FA6] text-white shadow-md'
                  : 'text-white hover:bg-[#546691]',
                !sidebarOpen && 'justify-center px-2'
              )}
              title={!sidebarOpen ? t(item.labelKey) : undefined}
            >
              <div className={cn(
                "p-1.5 sm:p-2 rounded-md flex items-center justify-center",
                isActive(item.path) 
                  ? "bg-white/10" 
                  : "bg-transparent"
              )}>
                <Icon 
                  path={item.icon} 
                  className={cn(
                    "w-4 h-4 sm:w-5 sm:h-5",
                    "text-white"
                  )} 
                />
              </div>
              {sidebarOpen && (
                <span className="text-sm font-medium text-white flex-1">
                  {t(item.labelKey)}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-3 sm:p-4 border-t border-[#546691]">
          <button
            onClick={() => navigate('/')}
            className={cn(
              'w-full flex items-center gap-2 sm:gap-3 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium transition-all',
              sidebarOpen 
                ? 'bg-[#1A1A2E] text-white hover:bg-[#546691] justify-start' 
                : 'justify-center p-2 text-white hover:bg-[#546691]'
            )}
            title={!sidebarOpen ? t('admin.goToSite') : undefined}
          >
            <Icon path="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            {sidebarOpen && <span className="text-white">{t('admin.goToSite')}</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-transparent ml-[120px] lg:ml-0">
        <div className="sticky top-0 z-10 bg-[#13132F] border-b border-[#546691] px-4 sm:px-6 lg:px-8 h-20">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-4">
              <div className="lg:hidden">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-white p-2 hover:bg-[#546691] rounded-md transition-colors"
                  aria-label="Menu"
                >
                  <Icon path="M4 6h16M4 12h16M4 18h16" className="w-6 h-6" />
                </button>
              </div>
              
              <div>
                <h1 className="font-inter text-lg sm:text-xl font-bold text-white">
                  {navItems.find(item => isActive(item.path)) ? t(navItems.find(item => isActive(item.path))!.labelKey) : t('admin.dashboard')}
                </h1>
                <p className="font-inter text-[#808087] text-xs sm:text-sm hidden sm:block">
                  {location.pathname === '/admin' ? t('admin.generalStats') : t('admin.contentManagement')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
              <button
                onClick={() => {
                  const idx = supportedLocales.findIndex((l) => l.code === locale);
                  setLocale(
                    supportedLocales[(idx + 1) % supportedLocales.length].code
                  );
                }}
                className="p-2 rounded-md hover:bg-[#546691] cursor-pointer transition-colors"
                title={t('ui.language')}
              >
                <img 
                  src={translate} 
                  alt={t('ui.translate')} 
                  className="w-4 h-4 lg:w-5 lg:h-5" 
                />
              </button>

              <div className="flex items-center gap-2 lg:gap-3">
                <div className="hidden md:block text-right">
                  <div className="text-sm font-medium text-white">{user?.name || user?.email}</div>
                  <div className="text-xs text-[#808087]">{t('nav.admin')}</div>
                </div>
                
                <div className="relative">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border border-[#546691] bg-[#1A1A2E] flex items-center justify-center hover:bg-[#546691] transition-colors cursor-pointer">
                    <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-transparent hover:bg-[#546691] text-white border border-white rounded-md transition-colors text-sm"
                >
                  <Icon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('ui.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-[#13132F]/50 rounded-2xl border border-[#546691] p-6 md:p-8 shadow-lg backdrop-blur-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">
                {location.pathname === '/admin'
                  ? t('admin.generalManagement')
                  : `${navItems.find(item => isActive(item.path)) ? t(navItems.find(item => isActive(item.path))!.labelKey) : ''} ${t('admin.management')}`}
              </h2>
              <p className="text-[#808087] mt-1">
                {location.pathname === '/admin' 
                  ? t('admin.generalStats')
                  : t('admin.contentManagement')}
              </p>
            </div>
            
            <div className="text-white">
              {children}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}