import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { api, ApiError } from '@/lib/api';
import { cn } from '@/lib/utils';
import { AuthShell } from '@/components/site/account/AuthShell';
import { AccNotice, FieldLabel } from '@/components/site/account/ui';

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

  return (
    <AuthShell
      word={t('site.account.auth.registerWord')}
      num="+"
      tone="amber"
      tagline={t('auth.register.brandTagline', 'Premium Digital & Commerce Ecosystems')}
    >
      <h1 className="acc-auth__title">{t('auth.register.title', 'Create your account')}</h1>
      <p className="acc-auth__switch">
        {t('auth.register.haveAccount', 'Already have an account?')}{' '}
        <Link to="/login" className="as-link">
          {t('auth.register.signIn', 'Sign in')}
        </Link>
      </p>

      {disabled ? (
        <AccNotice tone="warning" className="mt-8">
          {t('account.registrationClosed', 'Registration is temporarily closed. Please try again later.')}
        </AccNotice>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-8 grid gap-5">
          {error && <AccNotice>{error}</AccNotice>}

          <div>
            <FieldLabel htmlFor="name">{t('account.fields.username', 'Name')}</FieldLabel>
            <input id="name" type="text" autoComplete="name" maxLength={255} value={form.name} onChange={set('name')} onBlur={blur('name')}
              aria-invalid={!!show('name')} aria-describedby="name-err" className="acc-input" />
            {show('name') && <p id="name-err" className="acc-hint acc-hint--bad">{errors.name}</p>}
          </div>

          <div>
            <FieldLabel htmlFor="email">{t('auth.login.fields.email', 'Email')}</FieldLabel>
            <input id="email" type="email" autoComplete="email" maxLength={255} value={form.email} onChange={set('email')} onBlur={blur('email')}
              placeholder="you@example.com" aria-invalid={!!show('email')} aria-describedby="email-err" className="acc-input" />
            {show('email') && <p id="email-err" className="acc-hint acc-hint--bad">{errors.email}</p>}
          </div>

          <div>
            <FieldLabel htmlFor="password">{t('auth.login.fields.password', 'Password')}</FieldLabel>
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
                className="acc-input pr-14"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="acc-eye"
                aria-label={showPassword ? t('auth.register.hidePassword', 'Hide password') : t('auth.register.showPassword', 'Show password')}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p id="password-hint" className={cn('acc-hint', show('password') ? 'acc-hint--bad' : form.password.length >= MIN_PASSWORD && 'acc-hint--ok')}>
              {form.password.length >= MIN_PASSWORD && <Check className="h-3.5 w-3.5" />}
              {t('account.validation.passwordShort', 'At least 8 characters')}
            </p>
          </div>

          <div>
            <FieldLabel htmlFor="confirm">{t('account.fields.confirmPassword', 'Confirm password')}</FieldLabel>
            <input id="confirm" type={showPassword ? 'text' : 'password'} autoComplete="new-password" maxLength={72} value={form.confirm}
              onChange={set('confirm')} onBlur={blur('confirm')} aria-invalid={!!show('confirm')} aria-describedby="confirm-err" className="acc-input" />
            {show('confirm') && <p id="confirm-err" className="acc-hint acc-hint--bad">{errors.confirm}</p>}
          </div>

          <button type="submit" disabled={loading} className="as-btn as-btn--accent as-btn--block mt-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            <span>{loading ? t('auth.register.submitting', 'Creating account…') : t('auth.register.submit', 'Create account')}</span>
            {!loading && (
              <span className="as-arrow" aria-hidden>
                →
              </span>
            )}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
