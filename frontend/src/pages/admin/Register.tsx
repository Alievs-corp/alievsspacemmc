import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Loader2, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { api, ApiError } from '@/lib/api';
import { cn } from '@/lib/utils';
import logoMark from '../../assets/images/logo-dark.png';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

type Field = 'name' | 'email' | 'password' | 'confirm';

export function Register() {
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const { t } = useI18n();

  const [form, setForm] = useState<Record<Field, string>>({ name: '', email: '', password: '', confirm: '' });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (user) navigate('/profile', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    api.getSystemStatus().then((s) => setDisabled(!s.registrationEnabled)).catch(() => {});
  }, []);

  const errors: Partial<Record<Field, string>> = {};
  if (!form.name.trim()) errors.name = t('account.validation.nameRequired', 'Enter your name');
  if (!EMAIL_RE.test(form.email.trim())) errors.email = t('account.validation.emailInvalid', 'Enter a valid email address');
  if (form.password.length < MIN_PASSWORD) errors.password = t('account.validation.passwordShort', 'At least 8 characters');
  if (form.confirm !== form.password || !form.confirm) errors.confirm = t('account.validation.passwordMismatch', 'Passwords do not match');
  const valid = Object.keys(errors).length === 0;

  const set = (k: Field) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((d) => ({ ...d, [k]: e.target.value }));
  const blur = (k: Field) => () => setTouched((d) => ({ ...d, [k]: true }));
  const show = (k: Field) => touched[k] && errors[k];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (!valid) return;
    setError('');
    setLoading(true);
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      navigate('/profile');
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError(t('account.errors.emailTaken', 'An account with this email already exists.'));
      } else if (err instanceof ApiError && err.status === 429) {
        setError(t('account.errors.tooMany', 'Too many attempts. Please wait a few minutes and try again.'));
      } else if (err instanceof ApiError && err.code === 'module_disabled') {
        setDisabled(true);
      } else {
        setError(err instanceof Error ? err.message : t('auth.register.error', 'Registration failed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (k: Field) => cn('field', show(k) && 'border-danger focus:border-danger');

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

          {disabled ? (
            <div role="status" className="mt-8 flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm text-warning">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{t('account.registrationClosed', 'Registration is temporarily closed. Please try again later.')}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
              {error && (
                <div role="alert" className="flex items-start gap-2 rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="break-words">{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text-muted">
                  {t('account.fields.username', 'Name')}
                </label>
                <input id="name" type="text" autoComplete="name" maxLength={255} value={form.name} onChange={set('name')} onBlur={blur('name')}
                  aria-invalid={!!show('name')} aria-describedby="name-err" className={fieldClass('name')} />
                {show('name') && <p id="name-err" className="mt-1.5 text-xs text-danger">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-muted">
                  {t('auth.login.fields.email', 'Email')}
                </label>
                <input id="email" type="email" autoComplete="email" maxLength={255} value={form.email} onChange={set('email')} onBlur={blur('email')}
                  placeholder="you@example.com" aria-invalid={!!show('email')} aria-describedby="email-err" className={fieldClass('email')} />
                {show('email') && <p id="email-err" className="mt-1.5 text-xs text-danger">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-text-muted">
                  {t('auth.login.fields.password', 'Password')}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    maxLength={72}
                    value={form.password}
                    onChange={set('password')}
                    onBlur={blur('password')}
                    aria-invalid={!!show('password')}
                    aria-describedby="password-hint"
                    className={cn(fieldClass('password'), 'pr-11')}
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
                <p id="password-hint" className={cn('mt-1.5 flex items-center gap-1 text-xs', show('password') ? 'text-danger' : form.password.length >= MIN_PASSWORD ? 'text-success' : 'text-text-subtle')}>
                  {form.password.length >= MIN_PASSWORD && <Check className="h-3.5 w-3.5" />}
                  {t('account.validation.passwordShort', 'At least 8 characters')}
                </p>
              </div>

              <div>
                <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium text-text-muted">
                  {t('account.fields.confirmPassword', 'Confirm password')}
                </label>
                <input id="confirm" type={showPassword ? 'text' : 'password'} autoComplete="new-password" maxLength={72} value={form.confirm}
                  onChange={set('confirm')} onBlur={blur('confirm')} aria-invalid={!!show('confirm')} aria-describedby="confirm-err" className={fieldClass('confirm')} />
                {show('confirm') && <p id="confirm-err" className="mt-1.5 text-xs text-danger">{errors.confirm}</p>}
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
          )}
        </div>
      </div>
    </div>
  );
}
