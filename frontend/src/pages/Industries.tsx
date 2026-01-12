import Container from "../components/ui/Container";
import { useI18n } from '@/contexts/I18nContext';
import { useNavigate } from 'react-router-dom';
import eCommerce from "../assets/icons/e-commerce.svg";
import beauty from "../assets/icons/beauty.svg";
import marketplaces from "../assets/icons/marketplaces.svg";
import manufacturing from "../assets/icons/manufacturing.svg";
import logistics from "../assets/icons/logistics.svg";
import finance from "../assets/icons/finance.svg";
import startup from "../assets/icons/startup.svg";
import trustedPeople from "../assets/images/trusted-people.svg";

export function Industries() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const industries = [
    {
      icons: eCommerce,
      category: t('public.industries.items.retail.category'),
      title: t('public.industries.items.retail.title'),
      description: t('public.industries.items.retail.description'),
    },
    {
      icons: marketplaces,
      category: t('public.industries.items.marketplaces.category'),
      title: t('public.industries.items.marketplaces.title'),
      description: t('public.industries.items.marketplaces.description'),
    },
    {
      icons: finance,
      category: t('public.industries.items.banking.category'),
      title: t('public.industries.items.banking.title'),
      description: t('public.industries.items.banking.description'),
    },
        {
      icons: manufacturing,
      category: t('public.industries.items.manufacturing.category'),
      title: t('public.industries.items.manufacturing.title'),
      description: t('public.industries.items.manufacturing.description'),
    },
    {
      icons: beauty,
      category: t('public.industries.items.beauty.category'),
      title: t('public.industries.items.beauty.title'),
      description: t('public.industries.items.beauty.description'),
    },
    {
      icons: logistics,
      category: t('public.industries.items.logistics.category'),
      title: t('public.industries.items.logistics.title'),
      description: t('public.industries.items.logistics.description'),
    },
    {
      icons: startup,
      category: t('public.industries.items.startup.category'),
      title: t('public.industries.items.startup.title'),
      description: t('public.industries.items.startup.description'),
    },
  ];

  return (
    <div className="mt-[60px] flex flex-col justify-center items-center">
      <Container className="flex flex-col justify-center items-center">
        <h2 className="font-inter text-[38px] font-bold text-white">{t('nav.industries', 'Industries')}</h2>
        <p className="font-inter text-[18px] text-[#C5C5C5] text-center max-w-[800px]">{t('public.industriesIntro')}</p>
      </Container>

      <Container>
        <div className="mt-[60px] w-full grid grid-cols-1 md:grid-cols-2 gap-[100px] place-items-center">
          {industries.map((item, idx) => {
            const isLastSingle =
              industries.length % 2 === 1 && idx === industries.length - 1;

            return (
              <div
                key={item.category}
                className={`w-full max-w-[520px] h-full bg-[#13132F] rounded-[10px] p-6 flex flex-col gap-[14px] border-[0.7px] border-white shadow-[0px_10px_20px_0px_#000000] cursor-pointer transition-all duration-200 ease-out hover:-translate-y-1 hover:bg-white/5 hover:border-[#133FA6] hover:shadow-[0px_10px_20px_0px_#000000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133FA6]/50 ${
                  isLastSingle ? "md:col-span-2 md:justify-self-center" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={item.icons} alt={item.category} className="w-8 h-8" />
                  <h3 className="font-inter text-white text-[26px] font-semibold">
                    {item.category}
                  </h3>
                </div>

                <div className="max-w-[450px] flex flex-col gap-[10px]">
                  <h4 className="font-inter text-white text-[22px] font-bold">
                    {item.title}
                  </h4>
                  <p className="font-inter text-[#C5C5C5] text-[18px] flex-1">
                    {item.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="bg-[#133FA6] border-b-[1px] border-white rounded-[6.45px] p-[10px] font-inter font-[18px] text-white cursor-pointer  self-center md:self-start"
                >
                  {t('public.industriesCta')}
                </button>
              </div>
            );
          })}
        </div>
      </Container>

      <Container className="flex justify-between mt-[120px] flex-col md:flex-row gap-[40px] md:gap-0 items-center md:items-start">
        <div className="flex flex-col gap-[10px] max-w-[586px] justify-center w-full md:w-auto ">
          <h3 className="font-inter text-white text-[21px] md:text-[26px] font-semibold text-center md:text-left">{t('public.industries.trustedTitle')}</h3>
          <p className="font-inter text-[10px] md:text-[13px] text-[#C5C5C5] text-center md:text-left">{t('public.industries.trustedCopy1')}</p>
          <p className="font-inter text-[10px] md:text-[13px] text-[#C5C5C5] text-center md:text-left">{t('public.industries.trustedCopy2')}</p>
        </div>

        <img
          src={trustedPeople}
          alt="Trusted People"
          className="w-[308px] h-[168px] md:w-auto md:h-auto max-w-[586px] "
        />
      </Container>
    </div>
  );
}