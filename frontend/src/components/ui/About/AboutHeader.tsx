import Container from "./../Container";
import aboutBg from "@/assets/images/about-bg.jpg";
import { useI18n } from "@/contexts/I18nContext";

const AboutHeader = () => {
  const { t } = useI18n();
  return (
    <div className="relative w-full">
      <img 
        src={aboutBg} 
        alt="About background" 
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
                  {t('public.about.headerTitle')}
                </h2>
                <p className="text-[#C5C5C5] text-[13px] sm:text-base md:text-lg lg:text-xl max-w-full sm:max-w-[90%] md:max-w-[647px] leading-relaxed">
                  {t('public.about.headerCopy')}
                </p>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default AboutHeader