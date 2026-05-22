import Container from './../Container';
import { useI18n } from '@/contexts/I18nContext';
import { useNavigate } from 'react-router-dom';

const OurApproach = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  return (
    <div className="mt-[120px]">
      <Container className="flex flex-col gap-[120px]">
        <div className="flex justify-center items-center flex-col gap-[10px]">
          <h2 className="text-white font-display text-[38px] font-bold">{t('public.about.approachTitle')}</h2>
          <p className="font-inter text-text-muted text-[18px] text-center">
            {t('public.about.approachCopy')}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-[60px] md:gap-[20px] mb-[60px] md:mb-[100px]">
            <div className='flex flex-col gap-[10px] max-w-[540px]'>
                <h3 className='font-display text-white font-semibold font-[26px] text-center md:text-left'>{t('public.about.approachWhoTitle')}</h3>
                <p className='font-inter font-[13px] text-text-muted text-center md:text-left'>{t('public.about.approachWhoCopy')}</p>
            </div>

            <div className='flex flex-col gap-[10px] max-w-[540px]'>
                <h3 className='font-display text-white font-semibold font-[26px] text-center md:text-left'>{t('public.about.approachResponsibilityTitle')}</h3>
                <p className='font-inter font-[13px] text-text-muted text-center md:text-left'>{t('public.about.approachResponsibilityCopy')}</p>
                <button
                  type='button'
                  onClick={() => navigate('/contact')}
                  className='bg-primary rounded-md p-[10px] font-inter font-[18px] text-on-primary cursor-pointer  self-center md:self-start'
                >
                  {t('public.industriesCta')}
                </button>
            </div>
        </div>
        

      </Container>
    </div>
  );
};

export default OurApproach;