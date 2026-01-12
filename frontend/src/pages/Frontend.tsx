import Container from "./../components/ui/Container";
import frontend from "../assets/images/frontend.jpg";
import { Link } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";

const Frontend = () => {
    const { t } = useI18n();
    return (
    <>
        <div className="relative w-full">
            <img 
                src={frontend} 
                alt="Frontend background" 
                className="w-full h-[320px] object-cover" 
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

            <div className="absolute inset-0 mb-[30px] md:mb-[50px]">
                <Container className="h-full px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col h-full">
                    <div className="flex-grow"></div>
                    
                    <div className="mb-[30px] md:mb-[50px]">
                    <h2 className="font-inter text-[38px] md:text-5xl lg:text-5xl xl:text-6xl text-white font-bold max-w-full sm:max-w-[370px] md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] leading-tight sm:leading-normal">
                        {t('public.frontend.heroTitle')}
                    </h2>
                    </div>
                </div>
                </Container>  
            </div>
        </div>

        <Container className="w-full mt-[80px]">
                <div className="max-w-[1200px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-3 space-y-16">
                            <section className='max-w-[800px]'>
                                <h2 className="font-inter text-white text-[21px] md:text-[32px] font-bold mb-6">{t('public.frontend.buildTitle')}</h2>
                                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[18px] leading-relaxed">
                                    {t('public.frontend.buildCopy')}
                                </p>
                            </section>

                            <section className='max-w-[800px]'>
                                <h2 className="font-inter text-white text-[21px] md:text-[32px] font-bold mb-6">{t('public.frontend.workOnTitle')}</h2>
                                <div className="space-y-4">
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px]">{t('public.frontend.workOn.items.architecture')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px]">{t('public.frontend.workOn.items.adminDashboards')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px]">{t('public.frontend.workOn.items.translateDesigns')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px]">{t('public.frontend.workOn.items.integrateApis')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px]">{t('public.frontend.workOn.items.performanceAccessibility')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.frontend.workOn.items.maintainEvolve')}</h3>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <section className='max-w-[800px] flex flex-col gap-[20px]'>
                                <h2 className="font-inter text-white text-[21px] md:text-[32px] font-bold mb-6">{t('public.frontend.expectTitle')}</h2>
                                <div>
                                    <h3 className="font-inter text-white text-[18px] ">{t('public.frontend.technicalSkillsTitle')}</h3>
                                    <div className="space-y-4">
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px]">{t('public.frontend.skills.items.jsTs')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px]">{t('public.frontend.skills.items.react')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px]">{t('public.frontend.skills.items.componentArchitecture')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px]">{t('public.frontend.skills.items.restAsync')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px]">{t('public.frontend.skills.items.responsive')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.frontend.skills.items.cleanCode')}</h3>
                                        </li>
                                    </ul>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-inter text-white text-[18px]">{t('public.frontend.niceToHaveTitle')}</h3>
                                    <div className="space-y-4">
                                        <ul className="space-y-4">
                                            <li className="flex items-start">
                                                <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                                <h3 className="font-inter text-white text-[18px]">{t('public.frontend.nice.items.adminSaaS')}</h3>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                                <h3 className="font-inter text-white text-[18px]">{t('public.frontend.nice.items.uiPerformance')}</h3>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                                <h3 className="font-inter text-white text-[18px]">{t('public.frontend.nice.items.designSystems')}</h3>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                                <h3 className="font-inter text-white text-[18px]">{t('public.frontend.nice.items.portfolio')}</h3>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section className='max-w-[800px]'>
                                <h2 className="font-inter text-white text-[21px] md:text-[32px] font-bold mb-6">{t('public.frontend.howWeWorkTitle')}</h2>
                                <div className="space-y-4">
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.frontend.how.items.architectureFirst')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.frontend.how.items.clearRequirements')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.frontend.how.items.noHacks')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.frontend.how.items.longTermStability')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.frontend.how.items.collaboration')}</h3>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <section className='max-w-[800px]'>
                                <h2 className="font-inter text-white text-[21px] md:text-[32px] font-bold mb-6">{t('public.frontend.whatYouGetTitle')}</h2>
                                <div className="space-y-4">
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.frontend.get.items.realProduction')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.frontend.get.items.ownership')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.frontend.get.items.collaboration')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.frontend.get.items.longTermThinking')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.frontend.get.items.engineeringCulture')}</h3>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <section className='max-w-[800px]'>
                                <h2 className="font-inter text-white text-[21px] md:text-[32px] font-bold mb-6">{t('public.frontend.locationTitle')}</h2>
                                <div className="space-y-4">
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.frontend.location.items.country')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.frontend.location.items.format')}</h3>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <div className="max-w-[800px]">
                                    <h3 className="font-inter text-white text-[21px] md:text-[26px] font-bold mb-4">{t('public.frontend.applyTitle')}</h3>
                                    <p className="font-inter text-white text-[18px] mb-[10px]">{t('public.frontend.applyCopy')}</p>    
                                    <Link 
                                        to="/apply?position=frontend-developer"
                                        className="border-b border-white bg-[#133FA6] hover:bg-[#1a4cc0] text-white font-inter py-2.5 px-2 rounded-[6.45px] transition-colors duration-300 cursor-pointer text-[16px] md:text-[18px]"
                                    >
                                        {t('public.frontend.applyCta')}
                                    </Link>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </Container>
    </>
  )
}

export default Frontend;