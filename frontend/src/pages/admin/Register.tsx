import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import loginBg from '../../assets/images/login-bg.jpg';
import alievsspace from '../../assets/images/alievsspace-logo.png';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useI18n();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isCompanyFocused, setIsCompanyFocused] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t('auth.register.error', 'Registration failed')
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div
      className="min-h-screen flex justify-end items-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${loginBg})`,
      }}
    >
      {/* Mobil: Tam ekran, Tablet/Desktop: Sağda 50% */}
      <div className="min-h-screen flex items-center justify-end w-full md:w-1/2">
        <div 
          className="bg-[#13132F] min-h-screen flex flex-col justify-center w-full md:rounded-tl-[30.6px] md:rounded-bl-[30.6px] overflow-y-auto"
          style={{
            borderTopLeftRadius: '0px',
            borderBottomLeftRadius: '0px',
            paddingTop: 'clamp(30px, 5vh, 60px)',
            paddingRight: 'clamp(20px, 5vw, 100px)',
            paddingBottom: 'clamp(30px, 5vh, 60px)',
            paddingLeft: 'clamp(20px, 5vw, 100px)',
          }}
        >
          <div className="flex justify-center items-center flex-col text-center mb-4 md:mb-6">
            <img 
              src={alievsspace} 
              alt="Alievs Space Logo" 
              className="w-14 md:w-18 lg:w-20 mb-2"
            />
            <p className="font-inter text-[#808087] text-xs md:text-sm">
              {t('auth.register.brandTagline', 'Premium Digital & Commerce Ecosystems')}
            </p>
          </div>

          <div className="w-full">
            <div className="text-center mb-4 md:mb-6">
              <h2 className="font-inter text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">
                {t('auth.register.title', 'Create your account')}
              </h2>
              <p className="font-inter text-xs md:text-sm text-[#808087]">
                {t('auth.register.haveAccount', 'Already have an account?')}{' '}
                <Link
                  to="/login"
                  className="font-medium text-[#133FA6] hover:text-[#1a4cc0] hover:underline"
                >
                  {t('auth.register.signIn', 'Sign in')}
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-red-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-inter text-xs md:text-sm text-red-400 break-words">
                      {error}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-4 md:space-y-6">
                {/* Name and Company - Responsive grid */}
                <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                  {/* Name Input */}
                  <div className="relative w-full md:w-1/2">
                    <div className="relative">
                      <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg
                          className={`h-5 w-5 md:h-6 md:w-6 transition-colors duration-300 ${
                            isNameFocused ? 'text-[#133FA6]' : 'text-[#808087]'
                          }`}
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
                      </div>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        onFocus={() => setIsNameFocused(true)}
                        onBlur={() => !formData.name && setIsNameFocused(false)}
                        className={`block w-full pt-5 md:pt-6 pb-3 md:pb-4 px-3 md:px-4 font-inter font-semibold text-base md:text-lg bg-[#0A0A1E] rounded-[9.6px] text-white placeholder-transparent focus:outline-none transition-all duration-300 ${
                          isNameFocused
                            ? 'shadow-[0_0_0_3px_rgba(19,63,166,0.1),0_2px_8px_rgba(19,63,166,0.2)]'
                            : ''
                        }`}
                        style={{
                          paddingRight: 'clamp(40px, 4vw, 44px)',
                          paddingLeft: 'clamp(12px, 3vw, 16px)',
                          border: 'none',
                          borderBottom: isNameFocused
                            ? '3px solid #133FA6'
                            : '3px solid #808087',
                        }}
                        placeholder={t(
                          'auth.register.fields.name',
                          'Full Name *'
                        )}
                      />
                      <label
                        htmlFor="name"
                        className={`absolute left-3 md:left-4 transition-all duration-300 pointer-events-none font-inter font-semibold ${
                          isNameFocused || formData.name
                            ? 'top-2 text-[10px] md:text-xs text-[#133FA6]'
                            : 'top-1/2 transform -translate-y-1/2 text-sm md:text-lg text-[#808087]'
                        }`}
                      >
                        {t('auth.register.fields.name', 'Full Name *')}
                      </label>
                    </div>
                  </div>

                  {/* Company Input */}
                  <div className="relative w-full md:w-1/2">
                    <div className="relative">
                      <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg
                          className={`h-5 w-5 md:h-6 md:w-6 transition-colors duration-300 ${
                            isCompanyFocused ? 'text-[#133FA6]' : 'text-[#808087]'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        onFocus={() => setIsCompanyFocused(true)}
                        onBlur={() =>
                          !formData.company && setIsCompanyFocused(false)
                        }
                        className={`block w-full pt-5 md:pt-6 pb-3 md:pb-4 px-3 md:px-4 font-inter font-semibold text-base md:text-lg bg-[#0A0A1E] rounded-[9.6px] text-white placeholder-transparent focus:outline-none transition-all duration-300 ${
                          isCompanyFocused
                            ? 'shadow-[0_0_0_3px_rgba(19,63,166,0.1),0_2px_8px_rgba(19,63,166,0.2)]'
                            : ''
                        }`}
                        style={{
                          paddingRight: 'clamp(40px, 4vw, 44px)',
                          paddingLeft: 'clamp(12px, 3vw, 16px)',
                          border: 'none',
                          borderBottom: isCompanyFocused
                            ? '3px solid #133FA6'
                            : '3px solid #808087',
                        }}
                        placeholder={t(
                          'auth.register.fields.company',
                          'Company'
                        )}
                      />
                      <label
                        htmlFor="company"
                        className={`absolute left-3 md:left-4 transition-all duration-300 pointer-events-none font-inter font-semibold ${
                          isCompanyFocused || formData.company
                            ? 'top-2 text-[10px] md:text-xs text-[#133FA6]'
                            : 'top-1/2 transform -translate-y-1/2 text-sm md:text-lg text-[#808087]'
                        }`}
                      >
                        {t('auth.register.fields.company', 'Company')}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Phone Input */}
                <div className="relative">
                  <div className="relative">
                    <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg
                        className={`h-5 w-5 md:h-6 md:w-6 transition-colors duration-300 ${
                          isPhoneFocused ? 'text-[#133FA6]' : 'text-[#808087]'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      onFocus={() => setIsPhoneFocused(true)}
                      onBlur={() => !formData.phone && setIsPhoneFocused(false)}
                      className={`block w-full pt-5 md:pt-6 pb-3 md:pb-4 px-3 md:px-4 font-inter font-semibold text-base md:text-lg bg-[#0A0A1E] rounded-[9.6px] text-white placeholder-transparent focus:outline-none transition-all duration-300 ${
                        isPhoneFocused
                          ? 'shadow-[0_0_0_3px_rgba(19,63,166,0.1),0_2px_8px_rgba(19,63,166,0.2)]'
                          : ''
                      }`}
                      style={{
                        paddingRight: 'clamp(40px, 4vw, 44px)',
                        paddingLeft: 'clamp(12px, 3vw, 16px)',
                        border: 'none',
                        borderBottom: isPhoneFocused
                          ? '3px solid #133FA6'
                          : '3px solid #808087',
                      }}
                      placeholder={t(
                        'auth.register.fields.phone',
                        'Phone Number'
                      )}
                    />
                    <label
                      htmlFor="phone"
                      className={`absolute left-3 md:left-4 transition-all duration-300 pointer-events-none font-inter font-semibold ${
                        isPhoneFocused || formData.phone
                          ? 'top-2 text-[10px] md:text-xs text-[#133FA6]'
                          : 'top-1/2 transform -translate-y-1/2 text-sm md:text-lg text-[#808087]'
                      }`}
                    >
                      {t('auth.register.fields.phone', 'Phone Number')}
                    </label>
                  </div>
                </div>

                {/* Email Input */}
                <div className="relative">
                  <div className="relative">
                    <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg
                        className={`h-5 w-5 md:h-6 md:w-6 transition-colors duration-300 ${
                          isEmailFocused ? 'text-[#133FA6]' : 'text-[#808087]'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      onFocus={() => setIsEmailFocused(true)}
                      onBlur={() => !formData.email && setIsEmailFocused(false)}
                      className={`block w-full pt-5 md:pt-6 pb-3 md:pb-4 px-3 md:px-4 font-inter font-semibold text-base md:text-lg bg-[#0A0A1E] rounded-[9.6px] text-white placeholder-transparent focus:outline-none transition-all duration-300 ${
                        isEmailFocused
                          ? 'shadow-[0_0_0_3px_rgba(19,63,166,0.1),0_2px_8px_rgba(19,63,166,0.2)]'
                          : ''
                      }`}
                      style={{
                        paddingRight: 'clamp(40px, 4vw, 44px)',
                        paddingLeft: 'clamp(12px, 3vw, 16px)',
                        border: 'none',
                        borderBottom: isEmailFocused
                          ? '3px solid #133FA6'
                          : '3px solid #808087',
                      }}
                      placeholder={t(
                        'auth.register.fields.email',
                        'Email Address *'
                      )}
                    />
                    <label
                      htmlFor="email"
                      className={`absolute left-3 md:left-4 transition-all duration-300 pointer-events-none font-inter font-semibold ${
                        isEmailFocused || formData.email
                          ? 'top-2 text-[10px] md:text-xs text-[#133FA6]'
                          : 'top-1/2 transform -translate-y-1/2 text-sm md:text-lg text-[#808087]'
                      }`}
                    >
                      {t('auth.register.fields.email', 'Email Address *')}
                    </label>
                  </div>
                </div>

                {/* Password Input */}
                <div className="relative">
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() =>
                        !formData.password && setIsPasswordFocused(false)
                      }
                      className={`block w-full pt-5 md:pt-6 pb-3 md:pb-4 px-3 md:px-4 font-inter font-semibold text-base md:text-lg bg-[#0A0A1E] rounded-[9.6px] text-white placeholder-transparent focus:outline-none transition-all duration-300 ${
                        isPasswordFocused
                          ? 'shadow-[0_0_0_3px_rgba(19,63,166,0.1),0_2px_8px_rgba(19,63,166,0.2)]'
                          : ''
                      }`}
                      style={{
                        paddingRight: 'clamp(56px, 8vw, 48px)',
                        paddingLeft: 'clamp(12px, 3vw, 16px)',
                        border: 'none',
                        borderBottom: isPasswordFocused
                          ? '3px solid #133FA6'
                          : '3px solid #808087',
                      }}
                      placeholder={t(
                        'auth.register.fields.password',
                        'Password *'
                      )}
                    />

                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 focus:outline-none cursor-pointer bg-transparent p-1"
                      aria-label={showPassword ? t('auth.register.hidePassword', 'Hide password') : t('auth.register.showPassword', 'Show password')}
                    >
                      <svg
                        className={`h-5 w-5 md:h-6 md:w-6 transition-colors duration-300 ${
                          isPasswordFocused
                            ? 'text-[#133FA6]'
                            : 'text-[#808087]'
                        } hover:text-[#133FA6]`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {showPassword ? (
                          <>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </>
                        ) : (
                          <>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </>
                        )}
                      </svg>
                    </button>

                    <label
                      htmlFor="password"
                      className={`absolute left-3 md:left-4 transition-all duration-300 pointer-events-none font-inter font-semibold ${
                        isPasswordFocused || formData.password
                          ? 'top-2 text-[10px] md:text-xs text-[#133FA6]'
                          : 'top-1/2 transform -translate-y-1/2 text-sm md:text-lg text-[#808087]'
                      }`}
                    >
                      {t('auth.register.fields.password', 'Password *')}
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-inter text-white text-lg md:text-[22px] font-normal rounded-[9.6px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:opacity-90 active:opacity-80 active:scale-[0.99]"
                  style={{
                    background:
                      'linear-gradient(180deg, #0088FF -0.66%, #071840 99.34%)',
                    paddingTop: 'clamp(10px, 2vh, 13.5px)',
                    paddingRight: 'clamp(10px, 2vw, 13px)',
                    paddingBottom: 'clamp(10px, 2vh, 13.5px)',
                    paddingLeft: 'clamp(10px, 2vw, 13px)',
                  }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 md:h-5 md:w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span className="text-sm md:text-base">
                        {t(
                          'auth.register.submitting',
                          'Creating account...'
                        )}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm md:text-base lg:text-lg">
                      {t('auth.register.submit', 'Create account')}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}