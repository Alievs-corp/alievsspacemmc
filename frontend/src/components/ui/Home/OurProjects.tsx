import luxmart from "../../../assets/images/luxmart.svg";
import azennn from "../../../assets/images/azennn.svg";
import Container from './../Container';
import { useI18n } from '@/contexts/I18nContext';

const OurProjects = () => {
  const { t } = useI18n();
  return (
    <div className="mt-[120px] hidden md:block">
      <Container className="flex flex-col">
        <div className="flex justify-center items-center flex-col gap-[10px]">
          <h2 className="text-white font-inter text-[38px] font-bold">{t('public.home.projects.title')}</h2>
          <p className="font-inter text-[#C5C5C5] text-[18px] text-center">{t('public.home.projects.copy')}</p>
        </div>

        <style>{`
          @keyframes scrollLoop {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          .scroll-loop {
            display: flex;
            animation: scrollLoop 12s linear infinite;
            width: 200%;
          }
          
          .scroll-loop:hover {
            animation-play-state: paused;
          }
          
          .logo-container {
            flex: 0 0 25%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 10px;
          }
        `}</style>

        <div className="relative mt-[60px] w-full overflow-hidden hidden md:block">
          <div className="scroll-loop">
            <div className="logo-container">
              <img src={luxmart} alt="Luxmart" className="max-h-[300px] w-auto object-contain" />
            </div>
            <div className="logo-container">
              <img src={azennn} alt="Azennn" className="max-h-[300px] w-auto object-contain" />
            </div>
            <div className="logo-container">
              <img src={luxmart} alt="Luxmart" className="max-h-[300px] w-auto object-contain" />
            </div>
            <div className="logo-container">
              <img src={azennn} alt="Azennn" className="max-h-[300px] w-auto object-contain" />
            </div>
          </div>
        </div>

      </Container>
    </div>
  );
};

export default OurProjects;