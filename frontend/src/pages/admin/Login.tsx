import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import logoMark from '../../assets/images/logo-dark.png';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login({ email, password });
      navigate(user?.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.login.error', 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-dvh bg-bg text-text lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden border-r border-border lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative z-10 max-w-md text-center">
          <img src={logoMark} alt="" className="mx-auto mb-6 h-24 w-24 object-contain" />
          <h1 className="font-display text-4xl font-bold tracking-tight">
            ALIEVS <span className="text-primary">Space</span>
          </h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-text-subtle">
            {t('admin.panel', 'Admin Panel')}
          </p>
          <p className="mt-6 leading-relaxed text-text-muted">{t('auth.login.brandTagline')}</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:hidden">
            <img src={logoMark} alt="" className="mx-auto mb-3 h-14 w-14 object-contain" />
          </div>

          <h2 className="font-display text-2xl font-bold text-text">{t('auth.login.title')}</h2>
          <p className="mt-1 text-sm text-text-muted">
            {t('auth.login.noAccount')}{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary-hover">
              {t('auth.login.signUp')}
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div role="alert" className="flex items-start gap-2 rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="break-words">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-muted">
                {t('auth.login.fields.email')}
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
                placeholder="admin@alievsspace.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-text-muted">
                {t('auth.login.fields.password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field pr-11"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-text-subtle transition-colors hover:text-text"
                  aria-label={showPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? t('auth.login.submitting') : t('auth.login.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
