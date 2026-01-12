import Container from './../Container'
import { useI18n } from '@/contexts/I18nContext'

const WhoWeAre = () => {
  const { t } = useI18n();
  const items = [
    {
      title: t('public.about.who.values.responsibility'),
    },
    {
      title: t('public.about.who.values.transparency'),
    },
    {
      title: t('public.about.who.values.premiumQuality'),
    },
    {
      title: t('public.about.who.values.securityReliability'),
    },
    {
      title: t('public.about.who.values.longTermPartnership'),
    },
  ] as const;
  
  return (
    <div className='mt-[80px] md:mt-[100px] lg:mt-[120px]'>
        <Container className='flex flex-col justify-center items-center'>
            <div className='w-full flex flex-col justify-center items-center gap-[10px]'>
              <h3 className='font-inter text-white text-[26px] md:text-[38px] font-bold'>{t('public.about.whoTitle')}</h3>
              <p className='font-inter text-[#CCCCDA] max-w-[370px] md:max-w-[800px] text-center text-[13px] md:text-[18px]'>
                {t('public.about.whoCopy')}
              </p>
            </div>
            
            {/* Mobile: grid, Desktop: flex */}
            <div className='mt-[60px] w-full'>
              <div className='flex flex-col sm:flex-row flex-wrap justify-center gap-[30px]'>
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    tabIndex={0}
                    className='flex items-center justify-center p-4 border-b-[1px] border-l-[1px] border-white rounded-[10px] cursor-pointer transition-all duration-200 ease-out hover:-translate-y-1 hover:bg-white/5 hover:border-[#133FA6] hover:shadow-[0_8px_24px_rgba(19,63,166,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133FA6]/50 w-full sm:w-auto sm:flex-1 max-w-[280px] sm:max-w-none min-h-[60px] mx-auto sm:mx-0'
                  >
                    <h4 className='font-inter text-white text-sm md:text-base text-center'>{item.title}</h4>
                  </div>
                ))}
              </div>
            </div>
        </Container>
    </div>
  )
}

export default WhoWeAre