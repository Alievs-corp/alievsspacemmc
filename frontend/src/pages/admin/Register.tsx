import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    company: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('auth.register.error', 'Registration failed')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A1E] flex flex-col justify-center py-4 sm:py-8 px-3 sm:px-4">
      <div className="mx-auto w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl px-3 sm:px-4">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <p className='font-almarai text-xl sm:text-2xl md:text-3xl leading-none text-white mb-1 sm:mb-2'>ALIEVS</p>
          <p className='font-kavivanar text-base sm:text-lg md:text-xl leading-tight text-white mb-1 sm:mb-2'>Space MMC</p>
          <p className="font-inter text-xs sm:text-sm md:text-base text-[#808087] px-2">
            {t('auth.register.brandTagline', 'Premium Digital & Commerce Ecosystems')}
          </p>
        </div>

        <div className="bg-[#13132F] border border-[#546691] rounded-xl p-4 sm:p-6 md:p-8">
            <div className="text-center mb-4 sm:mb-5 md:mb-6">
              <h2 className="font-inter text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">
                {t('auth.register.title', 'Create your account')}
              </h2>
              <p className="font-inter text-xs sm:text-sm text-[#808087] mt-1">
                {t('auth.register.haveAccount', 'Already have an account?')}{' '}
                <Link to="/login" className="font-medium text-[#133FA6] hover:text-[#1a4cc0] hover:underline">
                  {t('auth.register.signIn', 'Sign in')}
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
              {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-2 sm:p-3">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-inter text-xs sm:text-sm text-red-400">{error}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                <div>
                  <label htmlFor="name" className="block font-inter text-xs sm:text-sm font-medium text-white mb-1">
                    {t('auth.register.fields.name', 'Full Name *')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-3 w-3 sm:h-4 sm:w-4 text-[#808087]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="block w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 font-inter text-xs sm:text-sm bg-[#0A0A1E] border border-[#546691] rounded-lg text-white placeholder:text-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6]"
                      placeholder={t('auth.register.placeholders.name', 'John Doe')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block font-inter text-xs sm:text-sm font-medium text-white mb-1">
                    {t('auth.register.fields.email', 'Email Address *')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-3 w-3 sm:h-4 sm:w-4 text-[#808087]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="block w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 font-inter text-xs sm:text-sm bg-[#0A0A1E] border border-[#546691] rounded-lg text-white placeholder:text-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6]"
                      placeholder={t('auth.register.placeholders.email', 'you@example.com')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block font-inter text-xs sm:text-sm font-medium text-white mb-1">
                    {t('auth.register.fields.password', 'Password *')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-3 w-3 sm:h-4 sm:w-4 text-[#808087]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      type="password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="block w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 font-inter text-xs sm:text-sm bg-[#0A0A1E] border border-[#546691] rounded-lg text-white placeholder:text-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6]"
                      placeholder={t('auth.register.placeholders.password', '••••••••')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block font-inter text-xs sm:text-sm font-medium text-white mb-1">
                    {t('auth.register.fields.phone', 'Phone Number')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-3 w-3 sm:h-4 sm:w-4 text-[#808087]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="block w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 font-inter text-xs sm:text-sm bg-[#0A0A1E] border border-[#546691] rounded-lg text-white placeholder:text-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6]"
                      placeholder={t('auth.register.placeholders.phone', '+994 (XXX) XXX-XX-XX')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block font-inter text-xs sm:text-sm font-medium text-white mb-1">
                    {t('auth.register.fields.company', 'Company Name')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-3 w-3 sm:h-4 sm:w-4 text-[#808087]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="block w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 font-inter text-xs sm:text-sm bg-[#0A0A1E] border border-[#546691] rounded-lg text-white placeholder:text-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-[#133FA6]"
                      placeholder={t('auth.register.placeholders.company', 'Your Company Inc.')}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t('auth.register.submitting', 'Creating account...')}
                    </div>
                  ) : (
                    t('auth.register.submit', 'Create account')
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-4 sm:mt-6 text-center">
              <Link 
                to="/" 
                className="inline-flex items-center font-inter text-xs sm:text-sm text-[#808087] hover:text-white transition-colors duration-200"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t('auth.register.backHome', 'Return to homepage')}
              </Link>
            </div>
          </div>

        <div className="text-center mt-3 sm:mt-4">
          <p className="font-inter text-xs sm:text-sm text-[#808087] px-2">
            © {new Date().getFullYear()} {t('company.name')}. {t('auth.register.copyright')}
          </p>
        </div>
      </div>
    </div>
  );
}