import Container from './../Container'
import { useI18n } from '@/contexts/I18nContext'
import analysis from "../../../assets/images/analysis.svg"
import uxUi from "../../../assets/images/ux-ui.svg"
import development from "../../../assets/images/development.svg"
import qualityControl from "../../../assets/images/qualityControl.svg"
import launch from "../../../assets/images/launch.svg"
import support from "../../../assets/images/support.svg"


const WeDeliver = () => {
  const { t } = useI18n();
  const items = [
    {
      img: analysis,
      alt: t('public.about.deliver.items.analysis.alt'),
      title: t('public.about.deliver.items.analysis.title'),
      text: t('public.about.deliver.items.analysis.text'),
    },
    {
      img: uxUi,
      alt: t('public.about.deliver.items.uxui.alt'),
      title: t('public.about.deliver.items.uxui.title'),
      text: t('public.about.deliver.items.uxui.text'),
    },
    {
      img: development,
      alt: t('public.about.deliver.items.development.alt'),
      title: t('public.about.deliver.items.development.title'),
      text: t('public.about.deliver.items.development.text'),
    },
    {
      img: qualityControl,
      alt: t('public.about.deliver.items.quality.alt'),
      title: t('public.about.deliver.items.quality.title'),
      text: t('public.about.deliver.items.quality.text'),
    },
    {
      img: launch,
      alt: t('public.about.deliver.items.launch.alt'),
      title: t('public.about.deliver.items.launch.title'),
      text: t('public.about.deliver.items.launch.text'),
    },
    {
      img: support,
      alt: t('public.about.deliver.items.support.alt'),
      title: t('public.about.deliver.items.support.title'),
      text: t('public.about.deliver.items.support.text'),
    },
  ] as const;
  return (
    <div className='mt-[80px] md:mt-[100px] lg:mt-[120px]'>
        <Container className='flex flex-col justify-center items-center'>
            <div className='w-full flex flex-col justify-center items-center gap-[10px]'>
              <h3 className='font-inter text-white text-[26px] md:text-[38px] font-bold'>{t('public.about.deliverTitle')}</h3>
              <p className='font-inter text-[#C5C5C5] max-w-[370px] md:max-w-[800px] text-center text-[13px] md:text-[18px]'>
                {t('public.about.deliverIntro')}
              </p>
            </div>
            <div className='mt-[60px] w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[50px] place-items-center'>
              {items.map((item, idx) => (
                <div
                  key={idx}
                  tabIndex={0}
                  className='flex justify-center items-center bg-[#13132F] h-full flex-col gap-[14px] p-5 rounded-[10px] cursor-pointer transition-all duration-200 ease-out hover:-translate-y-1 hover:bg-white/5 hover:border-[#133FA6] hover:shadow-[0_8px_24px_rgba(19,63,166,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133FA6]/50 max-w-[317px]'
                >
                    <h4 className='font-inter text-white text-[20px] md:text-[21px] font-semibold max-w-[250px]'>{item.title}</h4>
                    <img src={item.img} alt={item.alt} />
                    <p className='font-inter text-[#C5C5C5] text-[13px] '>{item.text}</p>
                </div>
              ))}
            </div>
        </Container>
    </div>
  )
}

export default WeDeliver