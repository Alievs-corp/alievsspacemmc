import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import alievsspace from "../../assets/images/alievsspace-logo.png";
import instagram from '../../assets/icons/instagram.svg';
import linkedin from '../../assets/icons/linkedin.svg';

export function Footer() {
  const { t } = useI18n();

  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#13132F] text-white py-[50px] px-[30px] md:px-[50px] shadow-[5px_4px_100px_0px_#000000] ">
      <div className="max-w-7xl mx-auto">
        <div>
          <div className="flex flex-col lg:flex-row justify-between items-start">
            <div className="mb-8 lg:mb-0">
              <Link 
                to="/" 
                onClick={scrollToTop}
                className="flex items-center mb-4 cursor-pointer"
              >
                <img 
                  src={alievsspace} 
                  alt={t('companyName', 'Alievs Space MMC')} 
                  className="h-10 mr-3"
                />
                <div>
                  <p className='font-almarai sm:text-[24px] md:text-[18px] leading-none'>{t('companyName', 'ALIEVS SPACE MMC')}</p>
                  <p className='font-kavivanar text-[9.4px] text-white leading-tight'>{t('public.footerTagline', 'Premium Digital & Commerce Ecosystem')}</p>
                </div>
              </Link>
              <div className="w-52 h-[1px] bg-gradient-to-r from-blue-500 to-purple-500 my-4"></div>
              <p className="font-inter text-[#808087] max-w-md">
                {t('public.footerDesc', 'Premium web & mobile development, e-commerce/marketplace systems, and banking-ready dashboards.')}
              </p>
              <div className="w-52 h-[1px] bg-gradient-to-r from-blue-500 to-purple-500 my-4"></div>
              <p className="font-inter text-white text-[13px] hidden lg:block">
                © {currentYear} Alievs Space {t('ui.companyDescription')}. {t('public.copyrightSuffix', 'All rights reserved.')}
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:gap-120 w-full lg:w-auto">
              <div className="grid grid-cols-2 lg:flex lg:flex-row lg:gap-120 w-full">
                <div className="lg:block">
                  <h3 className="font-inter text-[18px] text-white mb-4">{t('nav.company', 'Company')}</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link 
                        to="/services" 
                        className="font-inter text-[13px] text-white transition-colors duration-300 hover:text-blue-400"
                        onClick={scrollToTop}
                      >
                        {t('nav.services', 'Services')}
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/case-studies" 
                        className="font-inter text-[13px] text-white transition-colors duration-300 hover:text-blue-400"
                        onClick={scrollToTop}
                      >
                        {t('nav.caseStudies', 'Case studies')}
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/about" 
                        className="font-inter text-[13px] text-white transition-colors duration-300 hover:text-blue-400"
                        onClick={scrollToTop}
                      >
                        {t('nav.about', 'About')}
                      </Link>
                    </li>
                    {/* <li>
                      <Link 
                        to="/blog" 
                        className="font-inter text-[13px] text-white transition-colors duration-300 hover:text-blue-400"
                        onClick={scrollToTop}
                      >
                        {t('nav.blog', 'Blog')}
                      </Link>
                    </li> */}
                    <li>
                      <Link 
                        to="/careers" 
                        className="font-inter text-[13px] text-white transition-colors duration-300 hover:text-blue-400"
                        onClick={scrollToTop}
                      >
                        {t('nav.careers', 'Careers')}
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="lg:block">
                  <h3 className="font-inter text-[18px] text-white mb-4">{t('nav.contact', 'Contact')}</h3>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start flex-col md:flex-row md:items-center gap-1 md:gap-2">
                      <p className='font-inter text-white text-[13px] font-semibold'>{t('public.contactEmail', 'Email')}:</p>
                      <a 
                        href="mailto:info@alievsspace.com" 
                        className="font-inter text-white text-[13px] transition-colors duration-300 hover:text-blue-400"
                      >
                        info@alievsspace.com
                      </a>
                    </li>
                    <li className="flex items-start flex-col md:flex-row md:items-center gap-1 md:gap-2">
                      <p className='font-inter text-white text-[13px] font-semibold'>{t('public.contactPhone', 'Phone')}:</p>
                      <a 
                        href="tel:+994517003500" 
                        className="font-inter text-white text-[13px] transition-colors duration-300 hover:text-blue-400"
                      >
                        +994 (51) 700 35 00
                      </a>
                    </li>
                  </ul>
                  
                  {/* Desktopda olan xett - yalnız desktopda gorsenir */}
                  <div className="hidden lg:block w-52 h-[1px] bg-gradient-to-r from-blue-500 to-purple-500 my-4"></div>

                  <div className="hidden lg:block mt-6">
                    <div className="flex gap-4 justify-center items-center md:justify-start">
                      <a 
                        href="https://www.instagram.com/alievsspace/?igsh=MWRpb3J4NmNoMTA0OQ%3D%3D#" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity duration-300"
                      >
                        <img src={instagram} alt="Instagram"/>
                      </a>
                      <a 
                        href="https://www.linkedin.com/company/alievs-space-mmc" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity duration-300"
                      >
                        <img src={linkedin} alt="LinkedIn"/>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="block lg:hidden w-full h-[1px] bg-gradient-to-r from-blue-500 to-purple-500 my-6"></div>

              <div className="block lg:hidden">
                <div className="flex flex-col items-center">
                  <div className="flex gap-4 mb-4">
                    <a 
                      href="https://www.instagram.com/alievsspace/?igsh=MWRpb3J4NmNoMTA0OQ%3D%3D#" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity duration-300"
                    >
                      <img src={instagram} alt="Instagram"/>
                    </a>
                    <a 
                      href="https://www.linkedin.com/company/alievs-space-mmc" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity duration-300"
                    >
                      <img src={linkedin} alt="LinkedIn"/>
                    </a>
                  </div>
                  
                  <p className="font-inter text-white text-[13px]">
                    © {currentYear} Alievs Space {t('ui.companyDescription')}. {t('public.copyrightSuffix')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}