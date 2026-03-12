import { useI18n } from '@/contexts/I18nContext';
import webDevelopment from "../assets/images/web-development.svg";
import bankingFintech from "../assets/images/banking-fintech.svg";
import eCommerceSite from "../assets/images/e-commerce-site.svg";
import trueIcon from "../assets/icons/true.svg";
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { 
  FaUtensils,
  FaShoppingCart,
  FaUniversity,
  FaGraduationCap,
  FaSearch,
  FaCalendarAlt,
  FaImages,
  FaMapMarkerAlt,
  FaTags,
  FaShoppingBag,
  FaCreditCard,
  FaMoneyBillWave,
  FaUsers,
  FaLock,
  FaExchangeAlt,
  FaBook,
  FaChalkboardTeacher,
  FaCertificate
} from 'react-icons/fa';

const servicesData: Array<{
  id: string;
  image: string;
  baseKey: 'public.services.items.web' | 'public.services.items.ecommerce' | 'public.services.items.banking';
  reqKeys: string[];
}> = [
  {
    id: 'web-development',
    image: webDevelopment,
    baseKey: 'public.services.items.web',
    reqKeys: [
      'public.services.items.web.reqs.premiumUi',
      'public.services.items.web.reqs.performancePages',
      'public.services.items.web.reqs.analyticsReady',
      'public.services.items.web.reqs.cleanDocs',
    ],
  },
  {
    id: 'ecommerce',
    image: eCommerceSite,
    baseKey: 'public.services.items.ecommerce',
    reqKeys: [
      'public.services.items.ecommerce.reqs.catalogFiltersSearch',
      'public.services.items.ecommerce.reqs.cartCheckout',
      'public.services.items.ecommerce.reqs.commissionPayout',
      'public.services.items.ecommerce.reqs.ownerDashboards',
    ],
  },
  {
    id: 'banking-fintech',
    image: bankingFintech,
    baseKey: 'public.services.items.banking',
    reqKeys: [
      'public.services.items.banking.reqs.rbac',
      'public.services.items.banking.reqs.auditReporting',
      'public.services.items.banking.reqs.secureWorkflow',
      'public.services.items.banking.reqs.complianceFriendly',
    ],
  }
];

const businessTypes = [
  { id: 'restaurant', icon: FaUtensils },
  { id: 'ecommerce', icon: FaShoppingCart },
  { id: 'banking', icon: FaUniversity },
  { id: 'education', icon: FaGraduationCap }
];

const websiteStructures = {
  restaurant: {
    businessKey: 'public.servicesBuilder.businessTypes.restaurant',
    icon: FaUtensils,
    website: [
      { id: 'menu', icon: FaSearch },
      { id: 'reservation', icon: FaCalendarAlt },
      { id: 'gallery', icon: FaImages },
      { id: 'location', icon: FaMapMarkerAlt }
    ]
  },
  ecommerce: {
    businessKey: 'public.servicesBuilder.businessTypes.ecommerce',
    icon: FaShoppingCart,
    website: [
      { id: 'products', icon: FaTags },
      { id: 'categories', icon: FaShoppingBag },
      { id: 'cart', icon: FaShoppingCart },
      { id: 'checkout', icon: FaCreditCard }
    ]
  },
  banking: {
    businessKey: 'public.servicesBuilder.businessTypes.banking',
    icon: FaUniversity,
    website: [
      { id: 'accounts', icon: FaUniversity },
      { id: 'payments', icon: FaMoneyBillWave },
      { id: 'security', icon: FaLock },
      { id: 'transactions', icon: FaExchangeAlt }
    ]
  },
  education: {
    businessKey: 'public.servicesBuilder.businessTypes.education',
    icon: FaGraduationCap,
    website: [
      { id: 'courses', icon: FaBook },
      { id: 'students', icon: FaUsers },
      { id: 'lessons', icon: FaChalkboardTeacher },
      { id: 'certificates', icon: FaCertificate }
    ]
  }
};

export function Services() {
  const { t } = useI18n();
  const [selectedBusiness, setSelectedBusiness] = useState('restaurant');

  const currentStructure = websiteStructures[selectedBusiness as keyof typeof websiteStructures];

  return (
    <div className='mt-[60px] flex flex-col justify-center items-center'>
      <Helmet>
        <title>{`${t('nav.services', 'Services')} | Alievs Space MMC`}</title>
        <meta name="description" content={t('public.servicesIntro')} />
        <meta property="og:title" content={`${t('nav.services', 'Services')}`} />
        <meta property="og:description" content={t('public.servicesIntro')} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center mb-12">
        <h2 className="font-inter text-[32px] sm:text-[38px] font-bold text-white">{t('nav.services', 'Services')}</h2>
        <p className="font-inter text-[16px] sm:text-[18px] text-[#C5C5C5] text-center max-w-[800px]">
          {t('public.servicesIntro')}
        </p>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex flex-col items-center">
          <div className="flex flex-col gap-6 md:gap-8 w-full lg:hidden">
            {servicesData.map((item) => (
              <div
                key={item.id}
                className="bg-[#13132F] border-b-[1.7px] border-l-[1.7px] border-white rounded-[10px] p-6 flex flex-col w-full max-w-[520px] mx-auto shadow-[0px_10px_20px_0px_#000000] hover:border-[#133FA6] hover:shadow-[0_8px_24px_rgba(19,63,166,0.25)] transition-all duration-300"
              >
                <div className="mb-2">
                  <span className="font-inter text-[#C5C5C5] text-[13px] ">{t(`${item.baseKey}.category`)}</span>
                </div>
                <div className="mb-4">
                  <img
                    src={item.image}
                    alt={t(`${item.baseKey}.title`, t('public.serviceFallback'))}
                    className="max-w-full h-auto inline-block rounded-md"
                  />
                </div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-4">{t(`${item.baseKey}.title`)}</h3>
                <p className="font-inter text-[#C5C5C5] text-[13px] mb-6 leading-relaxed">{t(`${item.baseKey}.description`)}</p>
                <div className="mt-auto">
                  <ul className="space-y-2">
                    {item.reqKeys.map((rk, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <img src={trueIcon} alt="ok" className="w-5 h-5" />
                        <span className="font-inter text-white text-[15px]">{t(rk)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:flex flex-col items-center w-full">
            <div className="flex gap-8 w-full max-w-[1080px] mb-8">
              {servicesData.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="bg-[#13132F] border-b-[1.7px] border-l-[1.7px] border-white rounded-[10px] p-6 flex flex-col w-[520px] shadow-[0px_10px_20px_0px_#000000] hover:border-[#133FA6] hover:shadow-[0_8px_24px_rgba(19,63,166,0.25)] transition-all duration-300"
                >
                  <div className="mb-2">
                    <span className="font-inter text-white text-[13px] font-semibold">{t(`${item.baseKey}.category`)}</span>
                  </div>
                  <div className="mb-4">
                    <img
                      src={item.image}
                      alt={t(`${item.baseKey}.title`, t('public.serviceFallback'))}
                      className="max-w-full h-auto inline-block rounded-md"
                    />
                  </div>
                  <h3 className="font-inter text-white text-[26px] font-semibold mb-4">{t(`${item.baseKey}.title`)}</h3>
                  <p className="font-inter text-[#C5C5C5] text-[18px] leading-relaxed mb-6">{t(`${item.baseKey}.description`)}</p>
                  <div className="mt-auto">
                    <ul className="space-y-2">
                      {item.reqKeys.map((rk, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <img src={trueIcon} alt="ok" className="w-5 h-5" />
                          <span className="font-inter text-white text-[15px]">{t(rk)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center w-full">
              {(() => {
                const item = servicesData[2];
                return (
                  <div className="bg-[#13132F] border-b-[1.7px] border-l-[1.7px] border-white rounded-[10px] p-6 flex flex-col w-[520px] shadow-[0px_10px_20px_0px_#000000] hover:border-[#133FA6] hover:shadow-[0_8px_24px_rgba(19,63,166,0.25)] transition-all duration-300">
                    <div className="mb-2">
                      <span className="font-inter text-white text-[13px] font-semibold">{t(`${item.baseKey}.category`)}</span>
                    </div>
                    <div className="mb-4">
                      <img
                        src={item.image}
                        alt={t(`${item.baseKey}.title`, t('public.serviceFallback'))}
                        className="max-w-full h-auto inline-block rounded-md"
                      />
                    </div>
                    <h3 className="font-inter text-white text-[26px] font-semibold mb-4">{t(`${item.baseKey}.title`)}</h3>
                    <p className="font-inter text-[#C5C5C5] text-[18px] leading-relaxed mb-6">{t(`${item.baseKey}.description`)}</p>
                    <div className="mt-auto">
                      <ul className="space-y-2">
                        {item.reqKeys.map((rk, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <img src={trueIcon} alt="ok" className="w-5 h-5" />
                            <span className="font-inter text-white text-[15px]">{t(rk)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center mb-12">
        <h2 className="font-inter text-[32px] sm:text-[38px] font-bold text-white">{t('public.servicesBuilder.title')}</h2>
        <p className="font-inter text-[16px] sm:text-[18px] text-[#C5C5C5] text-center max-w-[800px] mb-8">
          {t('public.servicesBuilder.intro')}
        </p>

        <div className="flex justify-center mb-12">
          <select 
            value={selectedBusiness}
            onChange={(e) => setSelectedBusiness(e.target.value)}
            className="bg-transparent text-white border border-[#2A2A4A] rounded-[8px] px-4 sm:px-6 py-2 sm:py-3 font-inter text-[16px] sm:text-[18px] focus:outline-none focus:border-[#133FA6] min-w-[200px] sm:min-w-[250px] text-center cursor-pointer"
          >
            {businessTypes.map(type => (
              <option key={type.id} value={type.id} className="bg-[#0A0A1F]">
                {t(`public.servicesBuilder.businessTypes.${type.id}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <div className="flex items-center justify-center gap-3 mb-8">
            <currentStructure.icon className="text-white text-2xl sm:text-3xl" />
            <h3 className="font-inter text-white text-[28px] sm:text-[32px] font-semibold">{t(currentStructure.businessKey)}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {currentStructure.website.map((page, index) => (
              <div 
                key={index}
                className="bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(102,102,102,0.096)_100%)] rounded-[10px] p-4 sm:p-6 flex flex-col items-center text-center hover:border hover:border-[#133FA6] transition-all duration-300 group min-h-[240px] sm:min-h-[280px] shadow-[10px_20px_40px_0px_#00000080]"
              >
                <page.icon className="text-white text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-inter text-white text-[18px] sm:text-[20px] font-semibold mb-2 sm:mb-3">
                  {t(`public.servicesBuilder.pages.${selectedBusiness}.${page.id}.title`)}
                </h4>
                <p className="font-inter text-[#C5C5C5] text-[12px] sm:text-[13px] leading-relaxed">
                  {t(`public.servicesBuilder.pages.${selectedBusiness}.${page.id}.desc`)}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(102,102,102,0.096)_100%)] rounded-[10px] p-3 sm:p-[15px] flex items-start gap-3 sm:gap-[25px] w-full min-h-[80px] sm:min-h-[90px] shadow-[10px_20px_40px_0px_#00000080] mb-4 sm:mb-5">
            <div className="flex-shrink-0">
              <div className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] border-b border-l border-white rounded-xl flex items-center justify-center">
                <span className="font-inter text-white text-[20px] sm:text-[30px] md:text-[42px] font-bold">1</span>
              </div>
            </div>
            <div className="flex-1 flex items-center h-full">
              <div>
                <h3 className="font-inter text-[18px] sm:text-[24px] md:text-[28px] font-semibold text-white">{t('public.servicesProcess.design.title')}</h3>
                <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
                  <span className="font-inter text-[#C5C5C5] text-[10px] sm:text-[12px] md:text-[14px] bg-[#0A0A1F] px-2 sm:px-3 py-1 sm:py-1.5 rounded">{t('public.servicesProcess.design.tags.uiux')}</span>
                  <span className="font-inter text-[#C5C5C5] text-[10px] sm:text-[12px] md:text-[14px] bg-[#0A0A1F] px-2 sm:px-3 py-1 sm:py-1.5 rounded">{t('public.servicesProcess.design.tags.wireframing')}</span>
                  <span className="font-inter text-[#C5C5C5] text-[10px] sm:text-[12px] md:text-[14px] bg-[#0A0A1F] px-2 sm:px-3 py-1 sm:py-1.5 rounded">{t('public.servicesProcess.design.tags.prototyping')}</span>
                  <span className="font-inter text-[#C5C5C5] text-[10px] sm:text-[12px] md:text-[14px] bg-[#0A0A1F] px-2 sm:px-3 py-1 sm:py-1.5 rounded">{t('public.servicesProcess.design.tags.designSystem')}</span>
                  <span className="font-inter text-[#C5C5C5] text-[10px] sm:text-[12px] md:text-[14px] bg-[#0A0A1F] px-2 sm:px-3 py-1 sm:py-1.5 rounded">{t('public.servicesProcess.design.tags.responsive')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(102,102,102,0.096)_100%)] rounded-[10px] p-3 sm:p-[15px] flex items-start gap-3 sm:gap-[25px] w-full min-h-[80px] sm:min-h-[90px] shadow-[10px_20px_40px_0px_#00000080] mb-4 sm:mb-5">
            <div className="flex-shrink-0">
              <div className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] border-b border-l border-white rounded-xl flex items-center justify-center">
                <span className="font-inter text-white text-[20px] sm:text-[30px] md:text-[42px] font-bold">2</span>
              </div>
            </div>
            <div className="flex-1 flex items-center h-full">
              <div>
                <h3 className="font-inter text-[18px] sm:text-[24px] md:text-[28px] font-semibold text-white">{t('public.servicesProcess.development.title')}</h3>
                <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
                  <span className="font-inter text-[#C5C5C5] text-[10px] sm:text-[12px] md:text-[14px] bg-[#0A0A1F] px-2 sm:px-3 py-1 sm:py-1.5 rounded">{t('public.servicesProcess.development.tags.frontend')}</span>
                  <span className="font-inter text-[#C5C5C5] text-[10px] sm:text-[12px] md:text-[14px] bg-[#0A0A1F] px-2 sm:px-3 py-1 sm:py-1.5 rounded">{t('public.servicesProcess.development.tags.backend')}</span>
                  <span className="font-inter text-[#C5C5C5] text-[10px] sm:text-[12px] md:text-[14px] bg-[#0A0A1F] px-2 sm:px-3 py-1 sm:py-1.5 rounded">{t('public.servicesProcess.development.tags.database')}</span>
                  <span className="font-inter text-[#C5C5C5] text-[10px] sm:text-[12px] md:text-[14px] bg-[#0A0A1F] px-2 sm:px-3 py-1 sm:py-1.5 rounded">{t('public.servicesProcess.development.tags.apiIntegration')}</span>
                  <span className="font-inter text-[#C5C5C5] text-[10px] sm:text-[12px] md:text-[14px] bg-[#0A0A1F] px-2 sm:px-3 py-1 sm:py-1.5 rounded">{t('public.servicesProcess.development.tags.testing')}</span>
                  <span className="font-inter text-[#C5C5C5] text-[10px] sm:text-[12px] md:text-[14px] bg-[#0A0A1F] px-2 sm:px-3 py-1 sm:py-1.5 rounded">{t('public.servicesProcess.development.tags.performance')}</span>
                  <span className="font-inter text-[#C5C5C5] text-[10px] sm:text-[12px] md:text-[14px] bg-[#0A0A1F] px-2 sm:px-3 py-1 sm:py-1.5 rounded">{t('public.servicesProcess.development.tags.security')}</span>
                  <span className="font-inter text-[#C5C5C5] text-[10px] sm:text-[12px] md:text-[14px] bg-[#0A0A1F] px-2 sm:px-3 py-1 sm:py-1.5 rounded">{t('public.servicesProcess.development.tags.versionControl')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(102,102,102,0.096)_100%)] rounded-[10px] p-3 sm:p-[15px] flex items-start gap-3 sm:gap-[25px] w-full min-h-[80px] sm:min-h-[90px] shadow-[10px_20px_40px_0px_#00000080]">
            <div className="flex-shrink-0">
              <div className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] border-b border-l border-white rounded-xl flex items-center justify-center">
                <span className="font-inter text-white text-[20px] sm:text-[30px] md:text-[42px] font-bold">3</span>
              </div>
            </div>
            <div className="flex-1 flex items-center h-full">
              <div>
                <h3 className="font-inter text-[18px] sm:text-[24px] md:text-[28px] font-semibold text-white">{t('public.servicesProcess.launch.title')}</h3>
                <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
                  <span className="font-inter text-[#C5C5C5] text-[10px] sm:text-[12px] md:text-[14px] bg-[#0A0A1F] px-2 sm:px-3 py-1 sm:py-1.5 rounded">{t('public.servicesProcess.launch.tags.domain')}</span>
                  <span className="font-inter text-[#C5C5C5] text-[10px] sm:text-[12px] md:text-[14px] bg-[#0A0A1F] px-2 sm:px-3 py-1 sm:py-1.5 rounded">{t('public.servicesProcess.launch.tags.hosting')}</span>
                  <span className="font-inter text-[#C5C5C5] text-[10px] sm:text-[12px] md:text-[14px] bg-[#0A0A1F] px-2 sm:px-3 py-1 sm:py-1.5 rounded">{t('public.servicesProcess.launch.tags.ssl')}</span>
                  <span className="font-inter text-[#C5C5C5] text-[10px] sm:text-[12px] md:text-[14px] bg-[#0A0A1F] px-2 sm:px-3 py-1 sm:py-1.5 rounded">{t('public.servicesProcess.launch.tags.deployment')}</span>
                  <span className="font-inter text-[#C5C5C5] text-[10px] sm:text-[12px] md:text-[14px] bg-[#0A0A1F] px-2 sm:px-3 py-1 sm:py-1.5 rounded">{t('public.servicesProcess.launch.tags.monitoring')}</span>
                  <span className="font-inter text-[#C5C5C5] text-[10px] sm:text-[12px] md:text-[14px] bg-[#0A0A1F] px-2 sm:px-3 py-1 sm:py-1.5 rounded">{t('public.servicesProcess.launch.tags.maintenance')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center mb-8 sm:mb-12">
        <h2 className="font-inter text-[28px] sm:text-[38px] font-bold text-white">{t('public.deliveryTitle')}</h2>
        <p className="font-inter text-[14px] sm:text-[18px] text-[#C5C5C5] text-center max-w-[800px] px-2 sm:px-0">{t('public.deliveryCopy')}</p>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 sm:space-y-8">
            <div className="bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(102,102,102,0.096)_100%)] rounded-[10px] p-3 sm:p-[10px] flex items-start gap-3 sm:gap-[20px] w-full sm:max-w-[560px] shadow-[10px_20px_40px_0px_#00000080]">
              <div className="flex-shrink-0">
                <div className="w-[35px] h-[35px] sm:w-[50px] sm:h-[50px] border-b border-l border-white rounded-xl flex items-center justify-center">
                  <span className="font-inter text-white text-[18px] sm:text-[26px] md:text-[38px] font-bold">1</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-inter text-[16px] sm:text-[21px] md:text-[26px] font-semibold text-white">{t('public.delivery.steps.1.title')}</h3>
                <p className="font-inter text-[#C5C5C5] text-[10px] sm:text-[11px] md:text-[13px] leading-tight sm:leading-normal">{t('public.delivery.steps.1.desc')}</p>
              </div>
            </div>

            <div className="bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(102,102,102,0.096)_100%)] rounded-[10px] p-3 sm:p-[10px] flex items-start gap-3 sm:gap-[20px] w-full sm:max-w-[640px] shadow-[10px_20px_40px_0px_#00000080]">
              <div className="flex-shrink-0">
                <div className="w-[35px] h-[35px] sm:w-[50px] sm:h-[50px] border-b border-l border-white rounded-xl flex items-center justify-center">
                  <span className="font-inter text-white text-[18px] sm:text-[26px] md:text-[38px] font-bold">2</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-inter text-[16px] sm:text-[21px] md:text-[26px] font-semibold text-white">{t('public.delivery.steps.2.title')}</h3>
                <p className="font-inter text-[#C5C5C5] text-[10px] sm:text-[11px] md:text-[13px] leading-tight sm:leading-normal">{t('public.delivery.steps.2.desc')}</p>
              </div>
            </div>

            <div className="bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(102,102,102,0.096)_100%)] rounded-[10px] p-3 sm:p-[10px] flex items-start gap-3 sm:gap-[20px] w-full sm:max-w-[720px] shadow-[10px_20px_40px_0px_#00000080]">
              <div className="flex-shrink-0">
                <div className="w-[35px] h-[35px] sm:w-[50px] sm:h-[50px] border-b border-l border-white rounded-xl flex items-center justify-center">
                  <span className="font-inter text-white text-[18px] sm:text-[26px] md:text-[38px] font-bold">3</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-inter text-[16px] sm:text-[21px] md:text-[26px] font-semibold text-white">{t('public.delivery.steps.3.title')}</h3>
                <p className="font-inter text-[#C5C5C5] text-[10px] sm:text-[11px] md:text-[13px] leading-tight sm:leading-normal">{t('public.delivery.steps.3.desc')}</p>
              </div>
            </div>

            <div className="bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(102,102,102,0.096)_100%)] rounded-[10px] p-3 sm:p-[10px] flex items-start gap-3 sm:gap-[20px] w-full sm:max-w-[800px] shadow-[10px_20px_40px_0px_#00000080]">
              <div className="flex-shrink-0">
                <div className="w-[35px] h-[35px] sm:w-[50px] sm:h-[50px] border-b border-l border-white rounded-xl flex items-center justify-center">
                  <span className="font-inter text-white text-[18px] sm:text-[26px] md:text-[38px] font-bold">4</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-inter text-[16px] sm:text-[21px] md:text-[26px] font-semibold text-white">{t('public.delivery.steps.4.title')}</h3>
                <p className="font-inter text-[#C5C5C5] text-[10px] sm:text-[11px] md:text-[13px] leading-tight sm:leading-normal">{t('public.delivery.steps.4.desc')}</p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(102,102,102,0.096)_100%)] rounded-[10px] p-3 sm:p-[10px] flex items-start gap-3 sm:gap-[20px] w-full sm:max-w-[880px] shadow-[10px_20px_40px_0px_#00000080]">
              <div className="flex-shrink-0">
                <div className="w-[35px] h-[35px] sm:w-[50px] sm:h-[50px] border-b border-l border-white rounded-xl flex items-center justify-center">
                  <span className="font-inter text-white text-[18px] sm:text-[26px] md:text-[38px] font-bold">5</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-inter text-[16px] sm:text-[21px] md:text-[26px] font-semibold text-white">{t('public.delivery.steps.5.title')}</h3>
                <p className="font-inter text-[#C5C5C5] text-[10px] sm:text-[11px] md:text-[13px] leading-tight sm:leading-normal">{t('public.delivery.steps.5.desc')}</p>
              </div>
            </div>
            
            <p className="font-inter text-[#C5C5C5] text-[14px] sm:text-[18px] text-center sm:text-left">{t('public.delivery.result')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}