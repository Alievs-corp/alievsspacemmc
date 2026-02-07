import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';
import Container from './../components/ui/Container';
import { Helmet } from 'react-helmet-async';

const FintechReportingDashboard = () => {
    const { t } = useI18n();
    const { loading } = useContent();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-white">{t('public.loading')}</div>
            </div>
        );
    }

    return (
        <div className='mt-[60px] flex flex-col justify-center items-center'>
            <Helmet>
                <title>{`${t('public.fintechDashboard.title')} | Alievs Space MMC`}</title>
                <meta name="description" content={t('public.fintechDashboard.intro')} />
                <meta property="og:title" content={t('public.fintechDashboard.title')} />
                <meta property="og:description" content={t('public.fintechDashboard.intro')} />
                <meta property="og:type" content="website" />
            </Helmet>
            <Container className="w-full mb-16">
                <div className="max-w-[1200px] mx-auto">
                    <div className="mb-8">
                        <Link to="/case-studies" className="font-inter text-[#808087] text-[14px] hover:text-white transition-colors duration-300">
                            {t('public.fintechDashboard.back')}
                        </Link>
                    </div>

                    <div className="mb-12">
                        <div className="mb-6">
                            <span className="font-inter text-white text-[13px] font-semibold px-4 py-2 bg-[#133FA6]/20 border border-[#133FA6] rounded-full">
                                {t('public.fintechDashboard.badge')}
                            </span>
                        </div>
                        
                        <h1 className="font-inter text-white text-[23px] md:text-[48px] font-bold mb-6">
                            {t('public.fintechDashboard.title')}
                        </h1>
                        
                        <p className="font-inter text-[#C5C5C5] text-[13px] md:text-[18px] leading-relaxed max-w-[900px]">
                            {t('public.fintechDashboard.intro')}
                        </p>
                    </div>

                    <section className="mb-12">
                        <h2 className="font-inter text-white text-[21px] md:text-[26px] font-bold mb-6">{t('public.fintechDashboard.contextTitle')}</h2>
                        
                        <div className="space-y-4">
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <div>
                                        <h3 className="font-inter text-white text-[13px] md:text-[18px] mb-1">{t('public.fintechDashboard.contextItems.industry')}</h3>
                                    </div>
                                </li>
                                
                                <li className="flex items-start">
                                    <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <div>
                                        <h3 className="font-inter text-white text-[13px] md:text-[18px] mb-1">{t('public.fintechDashboard.contextItems.projectType')}</h3>
                                    </div>
                                </li>
                                
                                <li className="flex items-start">
                                    <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <div>
                                        <h3 className="font-inter text-white text-[13px] md:text-[18px] mb-1">{t('public.fintechDashboard.contextItems.scope')}</h3>
                                    </div>
                                </li>
                                
                                <li className="flex items-start">
                                    <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <div>
                                        <h3 className="font-inter text-white text-[13px] md:text-[18px] mb-1">{t('public.fintechDashboard.contextItems.focus')}</h3>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </section>
                </div>
            </Container>

            <Container className="w-full mb-[60px] md:mb-[100px]">
                <div className="max-w-[1200px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-3 space-y-16">
                            <section className='max-w-[800px]'>
                                <h2 className="font-inter text-white text-[21px] md:text-[32px] font-bold mb-6">{t('public.fintechDashboard.challengeTitle')}</h2>
                                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[18px] leading-relaxed">
                                    {t('public.fintechDashboard.challengeCopy')}
                                </p>
                            </section>

                            <section className='max-w-[800px]'>
                                <h2 className="font-inter text-white text-[21px] md:text-[32px] font-bold mb-6">{t('public.fintechDashboard.solutionTitle')}</h2>
                                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[18px] leading-relaxed">
                                    {t('public.fintechDashboard.solutionCopy')}
                                </p>
                            </section>

                            <section className='max-w-[800px]'>
                                <h2 className="font-inter text-white text-[21px] md:text-[32px] font-bold mb-6">{t('public.fintechDashboard.deliveredTitle')}</h2>
                                <div className="space-y-4">
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.fintechDashboard.deliveredItems.rbac')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.fintechDashboard.deliveredItems.reports')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.fintechDashboard.deliveredItems.security')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.fintechDashboard.deliveredItems.dashboards')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.fintechDashboard.deliveredItems.backend')}</h3>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <section className='max-w-[800px]'>
                                <h2 className="font-inter text-white text-[21px] md:text-[26px] font-semibold mb-6">{t('public.fintechDashboard.deliveryTitle')}</h2>
                                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[18px] leading-relaxed">
                                    {t('public.fintechDashboard.deliveryCopy')}
                                </p>
                            </section>

                            <section className="pt-12 border-t border-white/20">
                                <div className="max-w-[800px]">
                                    <h3 className="font-inter text-white text-[21px] md:text-[26px] font-bold mb-4">{t('public.fintechDashboard.ctaTitle')}</h3>
                                    <Link 
                                        to="/contact"
                                        className="inline-block bg-[#133FA6] hover:bg-[#1a4cc0] text-white font-inter font-semibold py-3 px-8 rounded-[6.45px] transition-colors duration-300 cursor-pointer text-[16px] md:text-[18px]"
                                    >
                                        {t('public.fintechDashboard.ctaButton')}
                                    </Link>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default FintechReportingDashboard;