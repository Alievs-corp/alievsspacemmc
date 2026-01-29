import { useRef } from 'react';
import Container from '@/components/ui/Container';
import { useI18n } from '@/contexts/I18nContext';

const Advanteges = () => {
    const { t } = useI18n();
    const cards = [
        { heading: t('public.home.advantages.headings.years'), text: t('public.home.advantages.yearsText') },
        { heading: t('public.home.advantages.headings.enterprise'), text: t('public.home.advantages.enterpriseText') },
        { heading: t('public.home.advantages.headings.premium'), text: t('public.home.advantages.premiumText') },
        { heading: t('public.home.advantages.headings.secure'), text: t('public.home.advantages.secureText') },
        { heading: t('public.home.advantages.headings.fast'), text: t('public.home.advantages.fastText') },
    ] as const;

    const scrollerRef = useRef<HTMLDivElement>(null);

    const duplicatedCards = [...cards, ...cards, ...cards, ...cards];
    
    return (
        <div className='mt-[80px] md:mt-[120px] px-4 sm:px-6 lg:px-8'>
            <style>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(calc(-250px * ${cards.length}));
                    }
                }
                
                .scroller {
                    animation: scroll 20s linear infinite;
                    will-change: transform;
                }
                
                .scroller:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <Container>
                <div className='relative overflow-hidden py-4'>
                    <div 
                        ref={scrollerRef}
                        className='flex scroller'
                    >
                        {duplicatedCards.map((card, idx) => (
                            <div
                                key={idx}
                                className='flex-shrink-0 mx-2 flex h-full flex-col gap-[10px] p-5 border-b-[1px] border-l-[1px] border-white rounded-[10px] cursor-pointer transition-all duration-200 ease-out hover:-translate-y-1 hover:bg-white/5 hover:border-[#133FA6] hover:shadow-[0_8px_24px_rgba(19,63,166,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133FA6]/50 w-[250px] sm:w-[280px] md:w-[300px]'
                            >
                                <h3 className='font-inter text-white text-2xl sm:text-[26px] font-semibold'>{card.heading}</h3>
                                <p className='font-inter text-white text-base sm:text-base md:text-base'>{card.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Advanteges;