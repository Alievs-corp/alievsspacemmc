import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

import alievsspace from '../../assets/images/alievsspace.png';
import translate from '../../assets/icons/translate.svg';

export function Header() {
  const { t, locale, setLocale, supportedLocales } = useI18n();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/services', key: 'services' },
    { path: '/industries', key: 'industries' },
    { path: '/case-studies', key: 'caseStudies' },
    { path: '/about', key: 'about' },
    { path: '/careers', key: 'careers' },
    { path: '/contact', key: 'contact' },
  ];

  return (
    <>
      <header className='sticky top-0 z-40 w-full bg-[#13132F] text-white'>
        <div className='flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20'>
          <Link to="/" className="flex items-center space-x-1 gap-1">
            <img 
              src={alievsspace} 
              alt="Logo" 
              className="w-16 sm:w-16 md:w-14 lg:w-20" 
            />
            {/* Comment */}
            <div className="hidden sm:block">
              <p className='font-almarai sm:text-[24px] md:text-[18px] lg:text-[28px] leading-none'>ALIYEVS</p>
              <p className='font-kavivanar sm:text-[16px] md:text-[12px] lg:text-[20px] leading-tight'>Space MMC</p>
            </div>
            <div className="flex sm:hidden flex-col gap-1">
              <p className='font-almarai text-[15.44px] '>ALIYEVS</p>
              <p className='font-kavivanar text-[11.6px]'>Space MMC</p>
            </div>
          </Link>

          <div className="flex items-center md:hidden">
            <button
              className="text-white p-2"
              aria-label={t('ui.menu')}
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          <nav className="hidden md:flex lg:hidden flex-1 justify-center items-center space-x-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'whitespace-nowrap text-sm px-2 py-1 rounded transition-colors hover:bg-[#546691]',
                  'text-white'
                )}
              >
                {t(`nav.${link.key}`)}
              </Link>
            ))}
          </nav>

          <nav className="hidden lg:flex flex-1 justify-center items-center space-x-4 xl:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-[15px] lg:text-[16px] xl:text-lg px-3 py-2 rounded-md transition-colors hover:bg-[#546691]',
                  'text-white'
                )}
              >
                {t(`nav.${link.key}`)}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            <button
              onClick={() => {
                const idx = supportedLocales.findIndex((l) => l.code === locale);
                setLocale(
                  supportedLocales[(idx + 1) % supportedLocales.length].code
                );
              }}
              className="p-2 rounded-md hover:bg-[#546691]"
            >
              <img 
                src={translate} 
                alt="Translate" 
                className="w-4 h-4 md:w-5 md:h-5" 
              />
            </button>

            <div className="hidden md:block lg:hidden">
              <Button
                size="sm"
                className="bg-[#133FA6] hover:bg-[#0f2f78] text-white text-xs px-2 py-0.5 border-b-[0.7px] border-white cursor-pointer"
                onClick={() => navigate('/contact')}
              >
                Contact Sales
              </Button>
            </div>

            <div className="hidden lg:block">
              <Button
                size="sm"
                className="bg-[#133FA6] hover:bg-[#0f2f78] text-white px-4 py-2 
                border-b-[0.7px] border-white cursor-pointer"
                onClick={() => navigate('/contact')}
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white">
            <div className="sticky top-0 bg-[#13132F] px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={alievsspace} 
                    alt="Logo" 
                    className="w-12 h-12 object-cover"
                  />
                  <div>
                    <h1 className="text-lg text-white">ALIYEVS SPACE MMC</h1>
                    <p className="font-kavivanar text-sm text-white">Premium Digital & Commerce Ecosystem</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10"
                >
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="h-[calc(100vh-88px)] overflow-y-auto bg-white">
              <div className="px-6 py-8">
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2">
                    {supportedLocales.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => setLocale(l.code)}
                        className={cn(
                          "px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                          locale === l.code
                            ? "bg-[#133FA6] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                      >
                        {l.code.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <nav className="space-y-3">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-900 transition-all"
                      >
                        <span className="font-medium">
                          {t(`nav.${link.key}`)}
                        </span>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </nav>
                </div>

                <div className="mt-12">
                  <Button
                    className="w-full bg-[#133FA6] hover:bg-[#0f2f78] text-white font-semibold py-3.5 text-lg rounded-lg"
                    onClick={() => {
                      navigate('/contact');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Contact Sales
                  </Button>
                  
                  <div className="text-center mt-10 pt-6 border-t border-gray-200">
                    <p className="text-gray-500 text-sm">
                      © {new Date().getFullYear()} ALIYEVS SPACE MMC
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                      Premium Digital & Commerce Ecosystem
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}