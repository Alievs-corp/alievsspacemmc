import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import loginBg from "../../assets/images/login-bg.jpg";
import alievsspace from "../../assets/images/alievsspace-logo.png";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login({ email, password });
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.login.error'));
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="h-screen flex justify-end items-start md:items-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${loginBg})`,
      }}
    >
      <div className="h-full flex items-start md:items-center justify-end w-full md:w-1/2">
        <div
          className="bg-[#13132F] h-full flex flex-col justify-between w-full md:rounded-tl-[30.6px] md:rounded-bl-[30.6px]"
          style={{
            borderTopLeftRadius: '0px',
            borderBottomLeftRadius: '0px',
            paddingTop: '70px',
            paddingRight: 'clamp(20px, 5vw, 100px)',
            paddingBottom: '20px', 
            paddingLeft: 'clamp(20px, 5vw, 100px)',
          }}
        >
          <div className="flex-1 flex flex-col">
            <div className="flex justify-center items-center flex-col text-center mb-4 md:mb-8">
              <img 
                src={alievsspace} 
                alt="Alievs Space Logo" 
                className='w-16 md:w-20 lg:w-24 mb-2'
              />
              <p className="font-inter text-[#808087] text-xs md:text-sm">
                {t('auth.login.brandTagline')}
              </p>
            </div>

            <div className="w-full flex-1">
              <div className="text-center mb-3 md:mb-6">
                <h2 className="font-inter text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">
                  {t('auth.login.title')}
                </h2>
                <p className="font-inter text-xs md:text-sm text-[#808087]">
                  {t('auth.login.noAccount')}{' '}
                  <Link 
                    to="/register" 
                    className="font-medium text-[#133FA6] hover:text-[#1a4cc0] hover:underline"
                  >
                    {t('auth.login.signUp')}
                  </Link>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="md:space-y-5">
                {error && (
                  <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 mb-3 md:mb-0">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-inter text-xs md:text-sm text-red-400 break-words">
                        {error}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-3 md:space-y-6">
                  <div className="relative">
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setIsEmailFocused(true)}
                        onBlur={() => !email && setIsEmailFocused(false)}
                        className={`block w-full pt-5 md:pt-6 pb-3 md:pb-4 px-3 md:px-4 font-inter font-semibold text-base md:text-lg bg-[#0A0A1E] rounded-[9.6px] text-white placeholder-transparent focus:outline-none transition-all duration-300 ${
                          isEmailFocused 
                            ? 'shadow-[0_0_0_3px_rgba(19,63,166,0.1),0_2px_8px_rgba(19,63,166,0.2)]' 
                            : ''
                        }`}
                        style={{
                          paddingRight: 'clamp(40px, 4vw, 16px)',
                          paddingLeft: 'clamp(12px, 3vw, 16px)',
                          border: 'none',
                          borderBottom: isEmailFocused ? '3px solid #133FA6' : '3px solid #808087'
                        }}
                        placeholder={t('auth.login.fields.email')}
                      />

                      <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg 
                          className={`h-5 w-5 md:h-6 md:w-6 transition-colors duration-300 ${
                            isEmailFocused ? 'text-[#133FA6]' : 'text-[#808087]'
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>

                      <label
                        htmlFor="email"
                        className={`absolute left-3 md:left-4 transition-all duration-300 pointer-events-none font-inter font-semibold ${
                          isEmailFocused || email 
                            ? 'top-2 text-[10px] md:text-xs text-[#133FA6]' 
                            : 'top-1/2 transform -translate-y-1/2 text-sm md:text-lg text-[#808087]'
                        }`}
                      >
                        {t('auth.login.fields.email')}
                      </label>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => !password && setIsPasswordFocused(false)}
                        className={`block w-full pt-5 md:pt-6 pb-3 md:pb-4 px-3 md:px-4 font-inter font-semibold text-base md:text-lg bg-[#0A0A1E] rounded-[9.6px] text-white placeholder-transparent focus:outline-none transition-all duration-300 ${
                          isPasswordFocused 
                            ? 'shadow-[0_0_0_3px_rgba(19,63,166,0.1),0_2px_8px_rgba(19,63,166,0.2)]' 
                            : ''
                        }`}
                        style={{
                          paddingRight: 'clamp(56px, 8vw, 48px)',
                          paddingLeft: 'clamp(12px, 3vw, 16px)',
                          border: 'none',
                          borderBottom: isPasswordFocused ? '3px solid #133FA6' : '3px solid #808087'
                        }}
                        placeholder={t('auth.login.fields.password')}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 focus:outline-none cursor-pointer bg-transparent p-1"
                        aria-label={showPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')}
                      >
                        <svg 
                          className={`h-5 w-5 md:h-6 md:w-6 transition-colors duration-300 ${
                            isPasswordFocused ? 'text-[#133FA6]' : 'text-[#808087]'
                          } hover:text-[#133FA6]`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          {showPassword ? (
                            <>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </>
                          ) : (
                            <>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </>
                          )}
                        </svg>
                      </button>

                      <label
                        htmlFor="password"
                        className={`absolute left-3 md:left-4 transition-all duration-300 pointer-events-none font-inter font-semibold ${
                          isPasswordFocused || password 
                            ? 'top-2 text-[10px] md:text-xs text-[#133FA6]' 
                            : 'top-1/2 transform -translate-y-1/2 text-sm md:text-lg text-[#808087]'
                        }`}
                      >
                        {t('auth.login.fields.password')}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 mt-3 md:mt-0">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 md:h-3.5 md:w-3.5 text-[#133FA6] focus:ring-[#133FA6] border-[#808087] rounded bg-[#0A0A1E] cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 block font-inter text-sm md:text-[18px] text-[#808087]">
                      {t('auth.login.rememberMe')}
                    </label>
                  </div>

                  <div className="mt-2 sm:mt-0">
                    <a 
                      href="#" 
                      className="font-inter font-medium text-sm md:text-[18px] text-[#0088FF] hover:text-[#1a4cc0] whitespace-nowrap"
                    >
                      {t('auth.login.forgotPassword')}
                    </a>
                  </div>
                </div>

                <div className="pt-4 mt-3 md:mt-0">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full font-inter text-white text-lg md:text-[22px] font-normal rounded-[9.6px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:opacity-90 active:opacity-80 active:scale-[0.99]"
                    style={{
                      background: 'linear-gradient(180deg, #0088FF -0.66%, #071840 99.34%)',
                      paddingTop: 'clamp(10px, 2vh, 13.5px)',
                      paddingRight: 'clamp(10px, 2vw, 13px)',
                      paddingBottom: 'clamp(10px, 2vh, 13.5px)',
                      paddingLeft: 'clamp(10px, 2vw, 13px)',
                    }}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 md:h-5 md:w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-sm md:text-base">
                          {t('auth.login.submitting')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm md:text-base lg:text-lg">
                        {t('auth.login.submit')}
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}