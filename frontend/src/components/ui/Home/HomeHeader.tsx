import Container from "./../Container";
import homeBg from "@/assets/images/home-bg.jpg";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";

const HomeHeader = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  return (
    <div className="relative w-full">
      <img 
        src={homeBg} 
        alt="Home background" 
        className="w-full h-[762px] sm:h-[500px] md:h-[600px] lg:h-[700px] object-cover" 
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            `linear-gradient(286.96deg, rgba(19, 19, 47, 0.2) 0.27%, rgba(19, 19, 47, 0.9) 100%), ` +
            `linear-gradient(72.85deg, rgba(17, 49, 124, 0) -0.01%, rgba(0, 53, 179, 0.2) 100%)`,
          backgroundRepeat: 'no-repeat, no-repeat',
          backgroundPosition: 'center, center',
          backgroundSize: 'cover, cover'
        }}
      />

      <div className="absolute inset-0 pt-[130px] pb-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
        <Container className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-[80px] h-full justify-start xs:justify-center">
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
                <h2 className="font-inter text-[38px] md:text-5xl lg:text-5xl xl:text-6xl text-white font-bold max-w-full sm:max-w-[370px] md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] leading-tight sm:leading-normal">
                  {t('public.home.heroTitle')}
                </h2>
                <p className="text-[#C5C5C5] text-[13px] sm:text-base md:text-lg lg:text-xl max-w-full sm:max-w-[90%] md:max-w-[647px] leading-relaxed">
                  {t('public.home.heroCopy')}
                </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 lg:gap-[10px]">
                <button
                  type="button"
                  className="bg-[#133FA6] hover:bg-[#0f2f78] rounded-[6.45px] text-white px-3 sm:px-4 py-1.5 sm:py-2 md:py-2.5 border-b-[0.7px] border-l-[0.7px] border-white cursor-pointer text-sm sm:text-base md:text-lg font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => navigate('/contact')}
                >
                  {t('public.home.ctas.contact')}
                </button>
                <button
                  type="button"
                  className="rounded-[6.45px] text-white px-3 sm:px-4 py-1.5 sm:py-2 md:py-2.5 border-b-[0.7px] border-l-[0.7px] border-white cursor-pointer text-sm sm:text-base md:text-lg font-medium transition-all duration-200 hover:scale-[1.02] hover:bg-white/10 active:scale-[0.98]"
                  onClick={() => navigate('/services')}
                >
                  {t('public.home.ctas.services')}
                </button>
                <button
                  type="button"
                  className="rounded-[6.45px] text-white px-3 sm:px-4 py-1.5 sm:py-2 md:py-2.5 border-b-[0.7px] border-l-[0.7px] border-white cursor-pointer text-sm sm:text-base md:text-lg font-medium transition-all duration-200 hover:scale-[1.02] hover:bg-white/10 active:scale-[0.98]"
                  onClick={() => navigate('/case-studies')}
                >
                  {t('public.home.ctas.caseStudies')}
                </button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default HomeHeader