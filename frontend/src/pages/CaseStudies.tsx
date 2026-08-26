import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';
import Container from './../components/ui/Container';
import OurProjects from '@/components/ui/OurProjects';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const CaseStudies = () => {
    const { t } = useI18n();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const info = [
        {
            id: 'marketplace-mvp',
            category: t('public.caseStudies.items.marketplace.category'),
            title: t('public.caseStudies.items.marketplace.title'),
            description: t('public.caseStudies.items.marketplace.description'),
            focus: [
                t('public.caseStudies.items.marketplace.focus.0'),
                t('public.caseStudies.items.marketplace.focus.1'),
                t('public.caseStudies.items.marketplace.focus.2'),
            ]
        },
        {
            id: 'fintech-reporting-dashboard',
            category: t('public.caseStudies.items.fintech.category'),
            title: t('public.caseStudies.items.fintech.title'),
            description: t('public.caseStudies.items.fintech.description'),
            focus: [
                t('public.caseStudies.items.fintech.focus.0'),
                t('public.caseStudies.items.fintech.focus.1'),
                t('public.caseStudies.items.fintech.focus.2'),
            ]
        },
        {
            id: 'operations-inventory-system',
            category: t('public.caseStudies.items.operations.category'),
            title: t('public.caseStudies.items.operations.title'),
            description: t('public.caseStudies.items.operations.description'),
            focus: [
                t('public.caseStudies.items.operations.focus.0'),
                t('public.caseStudies.items.operations.focus.1'),
                t('public.caseStudies.items.operations.focus.2'),
            ]
        },
    ]

    const { loading } = useContent();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-white">{t('admin.loading')}</div>
            </div>
        );
    }

    return (
        <div className='mt-[60px] flex flex-col justify-center items-center'>
            <Helmet>
                <title>{`${t('nav.caseStudies', 'Case Studies')} | Alievs Space MMC`}</title>
                <meta name="description" content={t('public.caseStudiesIntro')} />
                <meta property="og:title" content={`${t('nav.caseStudies', 'Case Studies')}`} />
                <meta property="og:description" content={t('public.caseStudiesIntro')} />
                <meta property="og:type" content="website" />
            </Helmet>
            <Container className="flex flex-col justify-center items-center mb-12">
                <h2 className="font-display text-[38px] font-bold text-white">{t('nav.caseStudies', 'Case Studies')}</h2>
                <p className="font-inter text-[18px] text-text-muted text-center max-w-[800px]">{t('public.caseStudiesIntro')}</p>
            </Container>

            <Container className="w-full mb-24">
                <div className="flex flex-col items-center">
                    <div className="flex flex-col gap-6 md:gap-8 w-full lg:hidden">
                        {info.map((item, index) => (
                            <div 
                                key={index}
                                className="card p-6 flex flex-col w-full max-w-[520px] mx-auto hover:border-border-strong transition-all duration-300"
                            >
                                <div className="mb-4">
                                    <span className="font-inter text-white text-[13px] font-semibold">
                                        {item.category}
                                    </span>
                                </div>

                                <h3 className="font-display text-white text-[22px] md:text-[26px] font-semibold mb-4">
                                    {item.title}
                                </h3>

                                <p className="font-inter text-text-muted text-[18px] mb-6 leading-relaxed">
                                    {item.description}
                                </p>

                                <div className="mb-8 flex-grow">
                                    <h4 className="font-display text-white text-[16px] font-semibold mb-4">
                                        {t('public.caseStudies.keyFocusLabel')}
                                    </h4>
                                    <ul className="space-y-3">
                                        {item.focus.map((focusItem, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                                <span className="font-inter text-text-muted text-[18px]">{focusItem}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link 
                                    to={`/case-studies/${item.id}`}
                                    onClick={scrollToTop}
                                    className="mt-auto w-full bg-primary hover:bg-primary-hover text-on-primary font-inter font-semibold py-3 px-4 rounded-md transition-colors duration-300 cursor-pointer text-center"
                                >
                                    {t('public.caseStudies.viewCta')}
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="hidden lg:flex flex-col items-center w-full">
                        <div className="flex gap-8 w-full max-w-[1080px] mb-8">
                            {info.slice(0, 2).map((item, index) => (
                                <div 
                                    key={index}
                                    className="card p-6 flex flex-col w-[520px] hover:border-border-strong transition-all duration-300"
                                >
                                    <div className="mb-4">
                                        <span className="font-inter text-white text-[13px] font-semibold">
                                            {item.category}
                                        </span>
                                    </div>

                                    <h3 className="font-display text-white text-[26px] font-semibold mb-4">
                                        {item.title}
                                    </h3>

                                    <div className="mb-6">
                                        <p className="font-inter text-text-muted text-[18px] leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="font-display text-white text-[16px] font-semibold mb-3">
                                            {t('public.caseStudies.keyFocusLabel')}
                                        </h4>
                                        <ul className="space-y-2">
                                            {item.focus.map((focusItem, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                                    <span className="font-inter text-text-muted text-[18px] line-clamp-1">{focusItem}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Link 
                                        to={`/case-studies/${item.id}`}
                                        onClick={scrollToTop}
                                        className="mt-auto w-full bg-primary hover:bg-primary-hover text-on-primary font-inter font-semibold py-3 px-4 rounded-md transition-colors duration-300 cursor-pointer text-center"
                                    >
                                        {t('public.caseStudies.viewCta')}
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {info[2] && (
                            <div className="flex justify-center w-full">
                                <div 
                                    className="card p-6 flex flex-col w-[520px] hover:border-border-strong transition-all duration-300"
                                >
                                    <div className="mb-4">
                                        <span className="font-inter text-white text-[13px] font-semibold">
                                            {info[2].category}
                                        </span>
                                    </div>
                                    
                                    <h3 className="font-display text-white text-[26px] font-semibold mb-4">
                                        {info[2].title}
                                    </h3>
                                    
                                    <div className="mb-6">
                                        <p className="font-inter text-text-muted text-[18px] leading-relaxed">
                                            {info[2].description}
                                        </p>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <h4 className="font-display text-white text-[16px] font-semibold mb-3">
                                            {t('public.caseStudies.keyFocusLabel')}
                                        </h4>
                                        <ul className="space-y-2">
                                            {info[2].focus.map((focusItem, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                                    <span className="font-inter text-text-muted text-[18px]">{focusItem}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <Link 
                                        to={`/case-studies/${info[2].id}`}
                                        onClick={scrollToTop}
                                        className="mt-auto w-full bg-primary hover:bg-primary-hover text-on-primary font-inter font-semibold py-3 px-4 rounded-md transition-colors duration-300 cursor-pointer text-center"
                                    >
                                        {t('public.caseStudies.viewCta')}
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
            <OurProjects />
        </div>
    );
}

export default CaseStudies;