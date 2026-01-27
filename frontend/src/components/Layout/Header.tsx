import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

import alievsspace from '../../assets/images/alievsspace-logo.png';
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
    { path: 'https://academy.alievsspace.com', key: 'academy', external: true },
    { path: '/contact', key: 'contact' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = () => {
    scrollToTop();
    setMobileMenuOpen(false); 
  };

  const handleExternalLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className='sticky top-0 z-40 w-full bg-[#13132F] text-white'>
        <div className='flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20'>
          <Link 
            to="/" 
            className="flex items-center space-x-1 gap-1"
            onClick={scrollToTop} 
          >
            <img 
              src={alievsspace} 
              alt={t('ui.logo')} 
              className="w-16 sm:w-16 md:w-14 lg:w-20" 
            />
            <div className="hidden sm:block md:hidden lg:block">
              <p className='font-almarai sm:text-[24px] md:text-[18px] lg:text-[26px] xl:text-[28px] leading-none'>ALIEVS</p>
              <p className='font-kavivanar sm:text-[16px] md:text-[12px] lg:text-[18px] xl:text-[20px] leading-tight'>Space MMC</p>
            </div>
            <div className="flex sm:hidden flex-col gap-1">
              <p className='font-almarai text-[15.44px] '>ALIEVS</p>
              <p className='font-kavivanar text-[11.6px]'>Space MMC</p>
            </div>
          </Link>

          <div className="flex items-center md:hidden">
            <button
              className="text-white p-2 hover:bg-[#546691] rounded-md transition-colors"
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

          <nav className="hidden md:flex lg:hidden flex-1 justify-center items-center mx-2">
            <div className="flex items-center justify-center space-x-0.5">
              {navLinks.map((link) => (
                link.external ? (
                  <a
                    key={link.path}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'whitespace-nowrap text-[10px] px-1 py-0.5 rounded transition-colors hover:bg-[#546691]',
                      'text-white flex items-center gap-0.5'
                    )}
                    onClick={handleExternalLinkClick}
                  >
                    {t(`nav.${link.key}`)}
                    <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'whitespace-nowrap text-[10px] px-1 py-0.5 rounded transition-colors hover:bg-[#546691]',
                      'text-white'
                    )}
                    onClick={scrollToTop}
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                )
              ))}
            </div>
          </nav>

          <nav className="hidden lg:flex flex-1 justify-center items-center">
            <div className="flex items-center justify-center space-x-1 xl:space-x-3 2xl:space-x-4">
              {navLinks.map((link) => (
                link.external ? (
                  <a
                    key={link.path}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'whitespace-nowrap text-[11px] lg:text-[12px] xl:text-[14px] 2xl:text-[16px] px-1.5 lg:px-2 xl:px-2.5 2xl:px-3 py-1 lg:py-1.5 xl:py-2 rounded-md transition-colors hover:bg-[#546691]',
                      'text-white flex items-center gap-0.5 lg:gap-1 xl:gap-1.5'
                    )}
                    onClick={handleExternalLinkClick}
                  >
                    {t(`nav.${link.key}`)}
                    <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-4 2xl:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'whitespace-nowrap text-[11px] lg:text-[12px] xl:text-[14px] 2xl:text-[16px] px-1.5 lg:px-2 xl:px-2.5 2xl:px-3 py-1 lg:py-1.5 xl:py-2 rounded-md transition-colors hover:bg-[#546691]',
                      'text-white'
                    )}
                    onClick={scrollToTop}
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                )
              ))}
            </div>
          </nav>

          <div className="hidden md:flex items-center space-x-1 lg:space-x-1 xl:space-x-2 2xl:space-x-3">
            <div className="hidden md:flex lg:hidden items-center space-x-1">
              <button
                onClick={() => {
                  const idx = supportedLocales.findIndex((l) => l.code === locale);
                  setLocale(
                    supportedLocales[(idx + 1) % supportedLocales.length].code
                  );
                }}
                className="p-1 rounded-md hover:bg-[#546691] cursor-pointer transition-colors"
              >
                <img 
                  src={translate} 
                  alt="Translate" 
                  className="w-3 h-3" 
                />
              </button>

              <Button
                size="sm"
                className="bg-[#133FA6] hover:bg-[#0f2f78] text-white text-[10px] px-1.5 py-1 border-b-[0.7px] border-white cursor-pointer min-w-[70px]"
                onClick={() => {
                  navigate('/contact');
                  scrollToTop();
                }}
              >
                {t('nav.contactSales')}
              </Button>

              <Button
                size="sm"
                className="bg-transparent hover:bg-[#546691] text-white text-[10px] px-1.5 py-1 border border-white cursor-pointer min-w-[50px]"
                onClick={() => {
                  navigate('/login');
                  scrollToTop();
                }}
              >
                {t('nav.login')}
              </Button>
            </div>

            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 2xl:space-x-3">
              <button
                onClick={() => {
                  const idx = supportedLocales.findIndex((l) => l.code === locale);
                  setLocale(
                    supportedLocales[(idx + 1) % supportedLocales.length].code
                  );
                }}
                className="p-1.5 lg:p-1.5 xl:p-2 2xl:p-2 rounded-md hover:bg-[#546691] cursor-pointer transition-colors"
              >
                <img 
                  src={translate} 
                  alt={t('ui.translate')} 
                  className="w-3.5 h-3.5 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5" 
                />
              </button>

              <Button
                size="sm"
                className="bg-[#133FA6] hover:bg-[#0f2f78] text-white px-2 py-1.5 lg:px-2 lg:py-1.5 xl:px-3 xl:py-2 2xl:px-5 2xl:py-2.5 border-b-[0.7px] border-white cursor-pointer text-[10px] lg:text-[11px] xl:text-[13px] 2xl:text-base whitespace-nowrap"
                onClick={() => {
                  navigate('/contact');
                  scrollToTop();
                }}
              >
                {t('nav.contactSales')}
              </Button>

              <Button
                size="sm"
                className="bg-transparent hover:bg-[#546691] text-white px-2 py-1.5 lg:px-2 lg:py-1.5 xl:px-3 xl:py-2 2xl:px-5 2xl:py-2.5 border border-white cursor-pointer text-[10px] lg:text-[11px] xl:text-[13px] 2xl:text-base whitespace-nowrap"
                onClick={() => {
                  navigate('/login');
                  scrollToTop();
                }}
              >
                {t('nav.login')}
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
          
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-[#13132F]">
            <div className="sticky top-0 bg-[#13132F] px-6 py-5 border-b border-[#546691]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={alievsspace} 
                    alt={t('ui.logo')} 
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className='font-almarai text-lg leading-none text-white'>ALIEVS</p>
                    <p className='font-kavivanar text-xs leading-tight text-white'>Space MMC</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md hover:bg-[#546691] transition-colors"
                >
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="h-[calc(100vh-88px)] overflow-y-auto bg-[#13132F]">
              <div className="px-6 py-8">
                <div className="mb-8">
                  <p className="text-white font-inter text-sm mb-3">{t('ui.language')}</p>
                  <div className="flex flex-wrap gap-2">
                    {supportedLocales.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLocale(l.code);
                          setMobileMenuOpen(false);
                        }}
                        className={cn(
                          "px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                          locale === l.code
                            ? "bg-[#133FA6] text-white"
                            : "bg-[#1A1A2E] text-white hover:bg-[#546691]"
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
                      link.external ? (
                        <a
                          key={link.path}
                          href={link.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleExternalLinkClick}
                          className="flex items-center justify-between px-4 py-3.5 rounded-lg bg-[#1A1A2E] hover:bg-[#546691] text-white transition-all"
                        >
                          <span className="font-inter font-medium flex items-center gap-2">
                            {t(`nav.${link.key}`)}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </span>
                          <svg className="w-5 h-5 text-[#808087]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      ) : (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={handleLinkClick}
                          className="flex items-center justify-between px-4 py-3.5 rounded-lg bg-[#1A1A2E] hover:bg-[#546691] text-white transition-all"
                        >
                          <span className="font-inter font-medium">
                            {t(`nav.${link.key}`)}
                          </span>
                          <svg className="w-5 h-5 text-[#808087]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      )
                    ))}
                    
                    <Link
                      to="/login"
                      onClick={handleLinkClick}
                      className="flex items-center justify-between px-4 py-3.5 rounded-lg bg-[#1A1A2E] hover:bg-[#546691] text-white transition-all"
                    >
                      <span className="font-inter font-medium">
                        {t('nav.login')}
                      </span>
                      <svg className="w-5 h-5 text-[#808087]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </nav>
                </div>

                <div className="mt-12 space-y-3">
                  <Button
                    className="w-full bg-[#133FA6] hover:bg-[#0f2f78] text-white font-inter font-semibold py-3.5 text-lg rounded-lg"
                    onClick={() => {
                      navigate('/contact');
                      handleLinkClick();
                    }}
                  >
                    {t('nav.contactSales')}
                  </Button>
                  
                  <Button
                    className="w-full bg-transparent hover:bg-[#546691] text-white font-inter font-semibold py-3.5 text-lg rounded-lg border border-white"
                    onClick={() => {
                      navigate('/login');
                      handleLinkClick();
                    }}
                  >
                    {t('nav.login')}
                  </Button>
                  
                  <div className="text-center mt-10 pt-6 border-t border-[#546691]">
                    <p className="text-[#808087] text-sm font-inter">
                      © {new Date().getFullYear()} ALIEVS Space MMC
                    </p>
                    <p className="text-[#808087] text-xs mt-2 font-inter">
                      {t('company.tagline')}
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