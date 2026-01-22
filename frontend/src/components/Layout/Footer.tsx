import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
// import { useContent } from '@/contexts/ContentContext';
// import alievsspace from "../../assets/images/alievsspace.png"
import alievsspace from "../../assets/images/alievsspace-logo.png";
import instagram from '../../assets/icons/instagram.svg';
import linkedin from '../../assets/icons/linkedin.svg';

export function Footer() {
  const { t } = useI18n();
  // const { content } = useContent();
  // const settings = content?.settings;

  return (
    <footer className="bg-[#13132F] text-white py-[50px] px-[30px] md:px-[50px] shadow-[5px_4px_100px_0px_#000000] mt-[60px] md:mt-[100px]">
      <div className="max-w-7xl mx-auto">
        <div>
          <div className="flex flex-col lg:flex-row justify-between items-start">
            <div className="mb-8 lg:mb-0">
              <div className="flex items-center mb-4">
                <img 
                  src={alievsspace} 
                  alt={t('companyName', 'Alievs Space MMC')} 
                  className="h-10 mr-3"
                />
                <div>
                  <p className='font-almarai sm:text-[24px] md:text-[18px] leading-none'>{t('companyName', 'ALIEVS SPACE MMC')}</p>
                  <p className='font-kavivanar text-[9.4px] text-white leading-tight'>{t('public.footerTagline', 'Premium Digital & Commerce Ecosystem')}</p>
                </div>
              </div>
              <div className="w-52 h-[1px] bg-gradient-to-r from-blue-500 to-purple-500 my-4"></div>
              <p className="font-inter text-[#808087] max-w-md">
                {t('public.footerDesc', 'Premium web & mobile development, e-commerce/marketplace systems, and banking-ready dashboards.')}
              </p>
              <div className="w-52 h-[1px] bg-gradient-to-r from-blue-500 to-purple-500 my-4"></div>
              <p className="font-inter text-white text-[13px] hidden lg:block">
                {t('public.copyright', '© 2025 Alievs Space MMC. All rights reserved.')}
              </p>
            </div>
            
            <div className="flex flex-col gap-10 md:flex-row lg:gap-120 ">
              <div>
                <h3 className="font-inter text-[18px] text-white mb-4">{t('nav.about', 'About')}</h3>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      to="/services" 
                      className="font-inter text-[13px] text-white transition-colors duration-300"
                    >
                      {t('nav.services', 'Services')}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/case-studies" 
                      className="font-inter text-[13px] text-white transition-colors duration-300"
                    >
                      {t('nav.caseStudies', 'Case studies')}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/about" 
                      className="font-inter text-[13px] text-white transition-colors duration-300"
                    >
                      {t('nav.about', 'About')}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/blog" 
                      className="font-inter text-[13px] text-white transition-colors duration-300"
                    >
                      {t('nav.blog', 'Blog')}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/careers" 
                      className="font-inter text-[13px]text-white transition-colors duration-300"
                    >
                      {t('nav.careers', 'Careers')}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-inter text-[18px] text-white mb-4">{t('nav.contact', 'Contact')}</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex">
                    <p className='font-inter text-white text-[13px]'>{t('public.contactEmail', 'Email')}:</p>
                    <a 
                      href="mailto:help@aliyevsspace.com" 
                      className="font-inter text-white text-[13px] transition-colors duration-300"
                    >
                      alievsspacemmc@gmail.com
                    </a>
                  </li>
                  <li className="flex ">
                    <p className='font-inter text-white text-[13px]'>{t('public.contactPhone', 'Phone')}:</p>
                    <a 
                      href="tel:011000100" 
                      className="font-inter text-white text-[13px] transition-colors duration-300"
                    >
                    +994 (51) 700 35 00
                    </a>
                  </li>
                </ul>

                <div className="w-52 h-[1px] bg-gradient-to-r from-blue-500 to-purple-500 my-4"></div>
                
                <div className="mt-6">
                  <div className="flex gap-4 justify-center items-center md:justify-start">
                    <a 
                      href="https://www.instagram.com/alievsspace/?igsh=MWRpb3J4NmNoMTA0OQ%3D%3D#" 
                      target="_blank" 
                      rel="noopener noreferrer">
                      <img src={instagram} alt="Instagram"/>
                    </a>
                    <a 
                      href="https://www.linkedin.com/company/alievs-space-mmc" 
                      target="_blank" 
                      rel="noopener noreferrer">
                      <img src={linkedin} alt="LinkedIn"/>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <p className="font-inter text-white text-[13px] text-center mt-6 block lg:hidden">
            {t('public.copyright', '© 2025 Alievs Space MMC. All rights reserved.')}
          </p>
        </div>
      </div>
    </footer>
  );
}