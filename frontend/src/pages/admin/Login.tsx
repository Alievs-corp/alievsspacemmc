import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { ApiError, homePath } from '@/lib/api';
import { AuthShell } from '@/components/site/account/AuthShell';
import { AccNotice, FieldLabel } from '@/components/site/account/ui';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Where ProtectedRoute bounced the visitor from, if anywhere.
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;

  // An already signed-in visitor doesn't need this page. Skipped right after
  // submitting, where handleSubmit picks the destination itself.
  const submitted = useRef(false);
  useEffect(() => {
    if (user && !submitted.current) navigate(homePath(user.role), { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    submitted.current = true;
    try {
      const signedIn = await login({ email, password });
      const home = homePath(signedIn?.role);
      const target = from && (!from.startsWith('/panel') || signedIn?.role === 'super_admin') ? from : home;
      navigate(target, { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.code === 'account_blocked') {
        setError(t('account.errors.blocked', 'This account has been blocked. Contact support if you think this is a mistake.'));
      } else if (err instanceof ApiError && err.status === 429) {
        setError(t('account.errors.tooMany', 'Too many attempts. Please wait a few minutes and try again.'));
      } else if (err instanceof ApiError && err.status === 401) {
        setError(t('account.errors.invalidCredentials', 'Incorrect email or password.'));
      } else {
        setError(err instanceof Error ? err.message : t('auth.login.error', 'Login failed'));
      }
      submitted.current = false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell word={t('site.account.auth.loginWord')} num="A" tone="mustard" tagline={t('auth.login.brandTagline')}>
      <h1 className="acc-auth__title">{t('auth.login.title')}</h1>
      <p className="acc-auth__switch">
        {t('auth.login.noAccount')}{' '}
        <Link to="/register" className="as-link">
          {t('auth.login.signUp')}
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
        {error && <AccNotice>{error}</AccNotice>}

        <div>
          <FieldLabel htmlFor="email">{t('auth.login.fields.email')}</FieldLabel>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="acc-input"
            placeholder="admin@alievsspace.com"
          />
        </div>

        <div>
          <FieldLabel htmlFor="password">{t('auth.login.fields.password')}</FieldLabel>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="acc-input pr-14"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="acc-eye"
              aria-label={showPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="as-btn as-btn--accent as-btn--block mt-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          <span>{loading ? t('auth.login.submitting') : t('auth.login.submit')}</span>
          {!loading && (
            <span className="as-arrow" aria-hidden>
              →
            </span>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
