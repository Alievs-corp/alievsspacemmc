import Container from '../components/ui/Container';
import { useI18n } from '@/contexts/I18nContext';
import webDevelopment from "../assets/images/web-development.svg";
import bankingFintech from "../assets/images/banking-fintech.svg";
import eCommerceSite from "../assets/images/e-commerce-site.svg";
import trueIcon from "../assets/icons/true.svg";
import { Helmet } from 'react-helmet-async';

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

export function Services() {
  const { t } = useI18n();
  return (
    <div className='mt-[60px] flex flex-col justify-center items-center'>
      <Helmet>
        <title>{`${t('nav.services', 'Services')} | Alievs Space MMC`}</title>
        <meta name="description" content={t('public.servicesIntro')} />
        <meta property="og:title" content={`${t('nav.services', 'Services')}`} />
        <meta property="og:description" content={t('public.servicesIntro')} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Container className="flex flex-col justify-center items-center mb-12">
        <h2 className="font-inter text-[38px] font-bold text-white">{t('nav.services', 'Services')}</h2>
        <p className="font-inter text-[18px] text-[#C5C5C5] text-center max-w-[800px]">
          {t('public.servicesIntro')}
        </p>
      </Container>

      <Container className="w-full mb-24">
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
      </Container>

      <Container className="flex flex-col justify-center items-center mb-12">
        <h2 className="font-inter text-[38px] font-bold text-white">{t('public.deliveryTitle')}</h2>
        <p className="font-inter text-[18px] text-[#C5C5C5] text-center max-w-[800px]">{t('public.deliveryCopy')}</p>
      </Container>

      <Container className="w-full mb-24">
        <div className="max-w-4xl">
          <div className="space-y-8">
            <div className="bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(102,102,102,0.096)_100%)] rounded-[10px] p-[10px] flex items-start gap-[20px] max-w-[560px] h-[70px] shadow-[10px_20px_40px_0px_#00000080]">
              <div className="flex-shrink-0">
                <div className="w-[50px] h-[50px] border-b border-l border-white rounded-xl flex items-center justify-center">
                  <span className="font-inter text-white text-[26px] md:text-[38px] font-bold">1</span>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-inter text-[21px] md:text-[26px] font-semibold text-white">{t('public.delivery.steps.1.title')}</h3>
                <p className="font-inter text-[#C5C5C5] text-[10px] md:text-[13px]">{t('public.delivery.steps.1.desc')}</p>
              </div>
            </div>

            <div className="bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(102,102,102,0.096)_100%)] rounded-[10px] p-[10px] flex items-start gap-[20px] max-w-[640px] h-[70px] shadow-[10px_20px_40px_0px_#00000080]">
              <div className="flex-shrink-0">
                <div className="w-[50px] h-[50px] border-b border-l border-white rounded-xl flex items-center justify-center">
                  <span className="font-inter text-white text-[26px] md:text-[38px] font-bold">2</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-inter text-[21px] md:text-[26px] font-semibold text-white">{t('public.delivery.steps.2.title')}</h3>
                <p className="font-inter text-[#C5C5C5] text-[10px] md:text-[13px]">{t('public.delivery.steps.2.desc')}</p>
              </div>
            </div>

            <div className="bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(102,102,102,0.096)_100%)] rounded-[10px] p-[10px] flex items-start gap-[20px] max-w-[720px] h-[70px] shadow-[10px_20px_40px_0px_#00000080]">
              <div className="flex-shrink-0">
                <div className="w-[50px] h-[50px] border-b border-l border-white rounded-xl flex items-center justify-center">
                  <span className="font-inter text-white text-[26px] md:text-[38px] font-bold">3</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-inter text-[21px] md:text-[26px] font-semibold text-white">{t('public.delivery.steps.3.title')}</h3>
                <p className="font-inter text-[#C5C5C5] text-[10px] md:text-[13px]">{t('public.delivery.steps.3.desc')}</p>
              </div>
            </div>

            <div className="bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(102,102,102,0.096)_100%)] rounded-[10px] p-[10px] flex items-start gap-[20px] max-w-[800px] h-[70px] shadow-[10px_20px_40px_0px_#00000080]">
              <div className="flex-shrink-0">
                <div className="w-[50px] h-[50px] border-b border-l border-white rounded-xl flex items-center justify-center">
                  <span className="font-inter text-white text-[26px] md:text-[38px] font-bold">4</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-inter text-[21px] md:text-[26px] font-semibold text-white">{t('public.delivery.steps.4.title')}</h3>
                <p className="font-inter text-[#C5C5C5] text-[10px] md:text-[13px]">{t('public.delivery.steps.4.desc')}</p>
              </div>
            </div>

            <div className="bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(102,102,102,0.096)_100%)] rounded-[10px] p-[10px] flex items-start gap-[20px] max-w-[880px] h-[70px] shadow-[10px_20px_40px_0px_#00000080]">
              <div className="flex-shrink-0">
                <div className="w-[50px] h-[50px] border-b border-l border-white rounded-xl flex items-center justify-center">
                  <span className="font-inter text-white text-[26px] md:text-[38px] font-bold">5</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-inter text-[21px] md:text-[26px] font-semibold text-white">{t('public.delivery.steps.5.title')}</h3>
                <p className="font-inter text-[#C5C5C5] text-[10px] md:text-[13px]">{t('public.delivery.steps.5.desc')}</p>
              </div>
            </div>
            <p className="font-inter text-[#C5C5C5] text-[18px]">{t('public.delivery.result')}</p>
          </div>
        </div>
      </Container>
    </div>
  );
}