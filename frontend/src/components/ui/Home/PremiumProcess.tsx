import React from 'react';
import { useI18n } from '@/contexts/I18nContext';

const PremiumProcessSimple: React.FC = () => {
  const { t } = useI18n();
  const phases = [
    { quarter: '01', title: t('public.home.process.phases.discovery.title'), desc: t('public.home.process.phases.discovery.desc') },
    { quarter: '02', title: t('public.home.process.phases.uxui.title'), desc: t('public.home.process.phases.uxui.desc') },
    { quarter: '03', title: t('public.home.process.phases.development.title'), desc: t('public.home.process.phases.development.desc') },
    { quarter: '04', title: t('public.home.process.phases.qa.title'), desc: t('public.home.process.phases.qa.desc') },
    { quarter: '05', title: t('public.home.process.phases.launch.title'), desc: t('public.home.process.phases.launch.desc') },
    { quarter: '06', title: t('public.home.process.phases.support.title'), desc: t('public.home.process.phases.support.desc') },
  ];

  return (
    <div className='flex justify-center mt-[80px] md:mt-[120px]'>
      <div className="max-w-6xl w-full px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="font-inter text-[26px] md:text-[38px] font-bold text-white mb-4">{t('public.premiumProcess')}</h1>
          <p className="font-inter text-[#C5C5C5] text-[13px] md:text-[18px] mx-auto max-w-3xl">{t('public.processDesc')}</p>
        </div>

        <div className="relative mt-[40px] md:mt-[60px] lg:mt-[80px]">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-[#C5C5C5] -translate-y-1/2"></div>
          
          <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-4">
            {phases.slice(0, 3).map((phase) => (
              <div key={phase.quarter} className="flex items-start md:w-[30%]">
                <div className="flex-shrink-0 mr-4 md:mr-6">
                  <div 
                    className="flex items-center justify-center w-14 h-14"
                    style={{ borderRadius: '6.45px' }}
                  >
                    <span className="text-white font-bold text-[24px] border-b-[1px] border-l-[1px] border-white px-4 py-2">
                      {phase.quarter}
                    </span>
                  </div>
                </div>
                
                <div className="pt-1">
                  <h3 className="text-white font-semibold text-xl mb-2">{phase.title}</h3>
                  <p className="text-[#C5C5C5] text-base">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-4 mt-8 md:mt-28">
            {phases.slice(3).map((phase) => (
              <div key={phase.quarter} className="flex items-start md:w-[30%]">
                <div className="flex-shrink-0 mr-4 md:mr-6">
                  <div 
                    className="flex items-center justify-center w-14 h-14"
                    style={{ borderRadius: '6.45px' }}
                  >
                    <span className="text-white font-bold text-[24px] border-t-[1px] border-r-[1px] border-white px-4 py-2">
                      {phase.quarter}
                    </span>
                  </div>
                </div>
                <div className="pt-1">
                  <h3 className="text-white font-semibold text-xl mb-2">{phase.title}</h3>
                  <p className="text-[#C5C5C5] text-base">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumProcessSimple;