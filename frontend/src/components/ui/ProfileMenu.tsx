import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';

interface ProfileMenuProps {

  variant?: 'md' | 'lg';
}

export function ProfileMenu({ variant = 'md' }: ProfileMenuProps) {
  const { user, isAdmin, isSuperAdmin, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  if (!user) return null;

  const buttonSizeClasses =
    variant === 'lg'
      ? 'w-9 h-9 lg:w-9 lg:h-9 xl:w-10 xl:h-10 2xl:w-11 2xl:h-11'
      : 'w-8 h-8';

  const iconSizeClasses = variant === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={`ml-1 flex items-center justify-center rounded-full bg-transparent border border-border hover:bg-surface-3 cursor-pointer transition-colors ${buttonSizeClasses}`}
        aria-label={t('nav.profile', 'Profile')}
      >
        <svg
          className={`${iconSizeClasses} text-text`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-md bg-surface-2 border border-surface-3 shadow-lg z-50">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-medium text-text">{user.name || user.email}</p>
            <p className="truncate text-xs text-text-subtle">{user.email}</p>
          </div>
          <div className="h-px bg-surface-3" />
          <button
            type="button"
            onClick={() => go('/profile')}
            className="w-full px-3 py-2 text-left text-sm font-inter text-text hover:bg-surface-3 cursor-pointer"
          >
            {t('nav.profile', 'Profile')}
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => go(isSuperAdmin ? '/panel' : '/crm')}
              className="w-full px-3 py-2 text-left text-sm font-inter text-text hover:bg-surface-3 cursor-pointer"
            >
              {isSuperAdmin ? t('nav.adminPanel', 'Admin panel') : 'CRM'}
            </button>
          )}
          <div className="h-px bg-surface-3" />
          <button
            type="button"
            onClick={handleLogout}
            className="w-full px-3 py-2 text-left text-sm font-inter text-red-400 hover:bg-red-900/30 cursor-pointer"
          >
            {t('nav.logout', 'Logout')}
          </button>
        </div>
      )}
    </div>
  );
}
