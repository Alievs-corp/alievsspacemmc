import Container from './../Container'
import eCommerce from '../../../assets/images/eCommerce.svg'
import software from '../../../assets/images/software.svg'
import banking from '../../../assets/images/banking.svg'
import { useI18n } from '@/contexts/I18nContext'


const WeBuild = () => {
  const { t } = useI18n()
  const items = [
    {
      img: eCommerce,
      alt: t('public.home.build.items.ecommerce.alt'),
      title: t('public.home.build.items.ecommerce.title'),
      text: t('public.home.build.items.ecommerce.text'),
    },
    {
      img: software,
      alt: t('public.home.build.items.software.alt'),
      title: t('public.home.build.items.software.title'),
      text: t('public.home.build.items.software.text'),
    },
    {
      img: banking,
      alt: t('public.home.build.items.banking.alt'),
      title: t('public.home.build.items.banking.title'),
      text: t('public.home.build.items.banking.text'),
    },
  ] as const;
  return (
    <div className='mt-[80px] md:mt-[100px] lg:mt-[120px]'>
        <Container className='flex flex-col justify-center items-center'>
            <div className='w-full flex flex-col justify-center items-center gap-[10px]'>
              <h3 className='font-display text-white text-[26px] md:text-[38px] font-bold'>{t('public.buildWhat')}</h3>
              <p className='font-inter text-text-muted max-w-[370px] md:max-w-[800px] text-center text-[13px] md:text-[18px]'>
                {t('public.buildDesc')}
              </p>
            </div>
            <div className='mt-[60px] w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[40px] lg:gap-[20px]'>
              {items.map((item, idx) => (
                <div
                  key={idx}
                  tabIndex={0}
                  className='flex h-full flex-col gap-3 p-5 border border-border rounded-lg cursor-pointer transition-all duration-200 ease-out hover:border-border-strong hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus'
                >
                  <img src={item.img} alt={item.alt} />
                  <h4 className='font-display text-white text-[20px] md:text-[24px] font-semibold max-w-[250px]'>{item.title}</h4>
                  <p className='font-inter text-text-muted text-[13px] md:text-[16px]'>{item.text}</p>
                </div>
              ))}
            </div>
        </Container>
    </div>
  )
}

export default WeBuild