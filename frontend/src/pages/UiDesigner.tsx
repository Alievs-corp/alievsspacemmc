import Container from "../components/ui/Container";
import { Link } from "react-router-dom";
import uxUiDesigner from "../assets/images/ux-ui-designer.jpg";
import { useI18n } from "@/contexts/I18nContext";
import { Helmet } from 'react-helmet-async';

const UiDesigner = () => {
    const { t } = useI18n();
    return (
    <>
        <Helmet>
            <title>{`${t('public.uiux.heroTitle')} | Alievs Space MMC`}</title>
            <meta name="description" content={t('public.uiux.buildCopy')} />
            <meta property="og:title" content={t('public.uiux.heroTitle')} />
            <meta property="og:description" content={t('public.uiux.buildCopy')} />
            <meta property="og:type" content="website" />
        </Helmet>
        <div className="relative w-full">
            <img 
                src={uxUiDesigner} 
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
                        {t('public.uiux.heroTitle')}
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
                            {/* The Challenge */}
                            <section className='max-w-[800px]'>
                                <h2 className="font-inter text-white text-[21px] md:text-[32px] font-bold mb-6">{t('public.uiux.buildTitle')}</h2>
                                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[18px] leading-relaxed">{t('public.uiux.buildCopy')}</p>
                            </section>

                            {/* What We Delivered */}
                            <section className='max-w-[800px]'>
                                <h2 className="font-inter text-white text-[21px] md:text-[32px] font-bold mb-6">{t('public.uiux.workOnTitle')}</h2>
                                <div className="space-y-4">
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px]">{t('public.uiux.workOn.items.flows')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px]">{t('public.uiux.workOn.items.wireframes')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px]">{t('public.uiux.workOn.items.designSystems')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px]">{t('public.uiux.workOn.items.translateRequirements')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px]">{t('public.uiux.workOn.items.collaborateDev')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.uiux.workOn.items.improveUsability')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.uiux.workOn.items.iterateFeedback')}</h3>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <section className='max-w-[800px] flex flex-col gap-[20px]'>
                                <h2 className="font-inter text-white text-[21px] md:text-[32px] font-bold mb-6">{t('public.uiux.expectTitle')}</h2>
                                <div>
                                    <h3 className="font-inter text-white text-[18px] ">{t('public.uiux.coreSkillsTitle')}</h3>
                                    <div className="space-y-4">
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px]">{t('public.uiux.skills.items.uxPrinciples')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px]">{t('public.uiux.skills.items.solidUi')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px]">{t('public.uiux.skills.items.figmaExperience')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px]">{t('public.uiux.skills.items.dataHeavyInterfaces')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px]">{t('public.uiux.skills.items.clearThinking')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.uiux.skills.items.portfolioProcess')}</h3>
                                        </li>
                                    </ul>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-inter text-white text-[18px]">{t('public.uiux.niceToHaveTitle')}</h3>
                                    <div className="space-y-4">
                                        <ul className="space-y-4">
                                            <li className="flex items-start">
                                                <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                                <h3 className="font-inter text-white text-[18px]">{t('public.uiux.nice.items.devCollab')}</h3>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                                <h3 className="font-inter text-white text-[18px]">{t('public.uiux.nice.items.responsiveMobile')}</h3>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                                <h3 className="font-inter text-white text-[18px]">{t('public.uiux.nice.items.designSystemsPatterns')}</h3>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                                <h3 className="font-inter text-white text-[18px]">{t('public.uiux.nice.items.adminInternal')}</h3>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section className='max-w-[800px]'>
                                <h2 className="font-inter text-white text-[21px] md:text-[32px] font-bold mb-6">{t('public.uiux.howWeWorkTitle')}</h2>
                                <div className="space-y-4">
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.uiux.how.items.architectureFirstProduct')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.uiux.how.items.alignedFromStart')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.uiux.how.items.noRushedVisuals')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.uiux.how.items.logicBackedDecisions')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.uiux.how.items.longTermMaintainability')}</h3>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <section className='max-w-[800px]'>
                                <h2 className="font-inter text-white text-[21px] md:text-[32px] font-bold mb-6">{t('public.uiux.whatYouGetTitle')}</h2>
                                <div className="space-y-4">
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.uiux.get.items.realProductionNotConcept')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.uiux.get.items.influenceStructureUx')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.uiux.get.items.closeCollabEngineering')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.uiux.get.items.spaceToIterate')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.uiux.get.items.professionalEnvironment')}</h3>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <section className='max-w-[800px]'>
                                <h2 className="font-inter text-white text-[21px] md:text-[32px] font-bold mb-6">{t('public.uiux.locationTitle')}</h2>
                                <div className="space-y-4">
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.uiux.location.items.country')}</h3>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                            <h3 className="font-inter text-white text-[18px] md:text-[20px]">{t('public.uiux.location.items.format')}</h3>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <div className="max-w-[800px]">
                                    <h3 className="font-inter text-white text-[21px] md:text-[26px] font-bold mb-4">{t('public.uiux.applyTitle')}</h3>
                                    <p className="font-inter text-white text-[18px] mb-[10px]">{t('public.uiux.applyCopy')}</p>    
                                    <Link 
                                        to="/apply?position=ui-ux-designer"
                                        className="inline border-b border-white bg-[#133FA6] hover:bg-[#1a4cc0] text-white font-inter py-2.5 px-2 rounded-[6.45px] transition-colors duration-300 cursor-pointer text-[16px] md:text-[18px]"
                                    >
                                        {t('public.uiux.applyCta')}
                                    </Link>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </Container>
        </>
        );
};

export default UiDesigner;