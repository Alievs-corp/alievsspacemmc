import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import logoMark from '../../assets/images/logo-dark.png';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useI18n();

  const [formData, setFormData] = useState({ name: '', company: '', phone: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const set = (k: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((d) => ({ ...d, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.register.error', 'Registration failed'));
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
          <p className="mt-6 leading-relaxed text-text-muted">
            {t('auth.register.brandTagline', 'Premium Digital & Commerce Ecosystems')}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <img src={logoMark} alt="" className="mx-auto mb-3 h-14 w-14 object-contain" />
          </div>

          <h2 className="font-display text-2xl font-bold text-text">{t('auth.register.title', 'Create your account')}</h2>
          <p className="mt-1 text-sm text-text-muted">
            {t('auth.register.haveAccount', 'Already have an account?')}{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
              {t('auth.register.signIn', 'Sign in')}
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div role="alert" className="flex items-start gap-2 rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="break-words">{error}</span>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text-muted">
                  {t('auth.register.fields.name', 'Full name')} *
                </label>
                <input id="name" type="text" required autoComplete="name" value={formData.name} onChange={set('name')} className="field" />
              </div>
              <div>
                <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-text-muted">
                  {t('auth.register.fields.company', 'Company')}
                </label>
                <input id="company" type="text" autoComplete="organization" value={formData.company} onChange={set('company')} className="field" />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-text-muted">
                {t('auth.register.fields.phone', 'Phone number')}
              </label>
              <input id="phone" type="tel" autoComplete="tel" value={formData.phone} onChange={set('phone')} className="field" />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-muted">
                {t('auth.register.fields.email', 'Email address')} *
              </label>
              <input id="email" type="email" required autoComplete="email" value={formData.email} onChange={set('email')} className="field" />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-text-muted">
                {t('auth.register.fields.password', 'Password')} *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={set('password')}
                  className="field pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-text-subtle transition-colors hover:text-text"
                  aria-label={showPassword ? t('auth.register.hidePassword', 'Hide password') : t('auth.register.showPassword', 'Show password')}
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
              {loading ? t('auth.register.submitting', 'Creating account…') : t('auth.register.submit', 'Create account')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
