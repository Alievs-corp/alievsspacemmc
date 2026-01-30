import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
// import { useContent } from '@/contexts/ContentContext';
// import { api, type Career } from '@/lib/api';
import { useState } from 'react';
import Container from '../components/ui/Container';
import workWithUs from '../assets/images/work-with-us.svg';
import ismat from "../assets/images/ismat.jpeg";
import ismayil from "../assets/images/ismayil.jpg";
import elshan from "../assets/images/elshan-hasanov.jpg";
import elmar from "../assets/images/elmar.png";
import ravena from "../assets/images/ravena.jpg";
import zehra from "../assets/images/zehra.jpg";
import parvin from "../assets/images/pervin.jpeg"
import { Helmet } from 'react-helmet-async';

export function Careers() {
  const { t } = useI18n();
  // const { loading: contentLoading } = useContent();
  // const [careers, setCareers] = useState<Career[]>(content?.careers || []);
  // const [loading, setLoading] = useState(contentLoading);
  const [showAllTeam, setShowAllTeam] = useState(false);

  const vacancies = [
    {
      id: 'frontend-developer',
      title: t('public.careers.vacancies.frontend.title'),
      description: t('public.careers.vacancies.frontend.description'),
      location: t('public.careers.vacancies.frontend.location'),
      requirements: [
        t('public.careers.vacancies.frontend.reqs.htmlCssJs'),
        t('public.careers.vacancies.frontend.reqs.uiSense'),
        t('public.careers.vacancies.frontend.reqs.cleanCode')
      ]
    },
    {
      id: 'backend-developer',
      title: t('public.careers.vacancies.backend.title'),
      description: t('public.careers.vacancies.backend.description'),
      location: t('public.careers.vacancies.backend.location'),
      requirements: [
        t('public.careers.vacancies.backend.reqs.restSql'),
        t('public.careers.vacancies.backend.reqs.authRbacSense'),
        t('public.careers.vacancies.backend.reqs.performanceMindset')
      ]
    },
    {
      id: 'ui-ux-designer',
      title: t('public.careers.vacancies.uiux.title'),
      description: t('public.careers.vacancies.uiux.description'),
      location: t('public.careers.vacancies.uiux.location'),
      requirements: [
        t('public.careers.vacancies.uiux.reqs.figma'),
        t('public.careers.vacancies.uiux.reqs.designSystems'),
        t('public.careers.vacancies.uiux.reqs.webMobileUx')
      ]
    },
  ];

  const teamMembers = [
    {
      id: 'ismat',
      name: t('public.careers.teamMembers.ismat.name', 'Cahangirov İsmət'),
      role: t('public.careers.teamMembers.ismat.role', 'Frontend Developer'),
      description: t(
        'public.careers.teamMembers.ismat.description',
        '1 ildən artıqdır AliyevsspaceMMC şirkətində Frontend Developer kimi fəaliyyət göstərirəm.'
      ),
    },
    {
      id: 'elshan',
      name: t('public.careers.teamMembers.elshan.name', 'Elşən Həsənov'),
      role: t('public.careers.teamMembers.elshan.role', 'Frontend Developer'),
      description: t(
        'public.careers.teamMembers.elshan.description',
        'Frontend developerəm, artıq 1 ildən çoxdur ki, AliyevsspaceMMC şirkətində çalışıram'
      ),
    },
    {
      id: 'ismayil',
      name: t('public.careers.teamMembers.ismayil.name', 'İsmayıl İsmayılov'),
      role: t('public.careers.teamMembers.ismayil.role', 'Frontend Developer'),
      description: t(
        'public.careers.teamMembers.ismayil.description',
        'Frontend Development sahəsi üzrə 2 ildir ki özümü inkişaf etdirməyə çalışıram. Developia Engineering şirkətində mentor və instructor olaraq işləmişəm.'
      ),
    },
    {
      id: 'ravena',
      name: t('public.careers.teamMembers.ravena.name', 'Ravena Balagözova'),
      role: t('public.careers.teamMembers.ravena.role', 'Frontend Developer'),
      description: t(
        'public.careers.teamMembers.ravena.description',
        '1 ildir ki Frontend Development sahəsində bilik və bacarıqlarımı davamlı şəkildə inkişaf etdirirəm'
      ),
    },
    {
      id: 'zehra',
      name: t('public.careers.teamMembers.zehra.name', 'Zəhra Mahmudova'),
      role: t('public.careers.teamMembers.zehra.role', 'Frontend Developer'),
      description: t(
        'public.careers.teamMembers.zehra.description',
        'Front end Development sahəsində təxminən bir ildir aktiv şəkildə öyrənir və praktiki bacarıqlarımı təkmilləşdirirəm'
      ),
    },
    {
      id: 'elmar',
      name: t('public.careers.teamMembers.elmar.name', 'Elmar Əzimli'),
      role: t('public.careers.teamMembers.elmar.role', 'Frontend Developer'),
      description: t(
        'public.careers.teamMembers.elmar.description',
        'Frontend üzrə 1 ildən artıq müddətdir öyrənməyə davam edirəm.'
      ),
    },
    {
      id: 'parvin',
      name: t('public.careers.teamMembers.parvin.name', 'Pərvin Əhmədov'),
      role: t('public.careers.teamMembers.parvin.role', 'Frontend Developer'),
      description: t(
        'public.careers.teamMembers.parvin.description',
        'Software Developer sahəsində 1 ildən artıqdır təcrübə qazanıram və biliklərimi davamlı olaraq inkişaf etdirirəm'
      ),
    },
  ];

  const memberImages: Record<string, string> = {
    ismat,
    ismayil,
    elshan,
    elmar,
    ravena,
    zehra,
    parvin,
  };

  return (
    <div className="mt-[60px] flex flex-col justify-center items-center">
      <Helmet>
        <title>{`${t('nav.careers', 'Careers')} | Alievs Space MMC`}</title>
        <meta name="description" content={t('public.careersIntro')} />
        <meta property="og:title" content={`${t('nav.careers', 'Careers')}`} />
        <meta property="og:description" content={t('public.careersIntro')} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Container className="flex flex-col justify-center items-center">
        <h2 className="font-inter text-[38px] font-bold text-white">{t('nav.careers')}</h2>
        <p className="font-inter text-[18px] text-[#C5C5C5] text-center max-w-[800px]">
          {t('public.careersIntro')}
        </p>
      </Container>

      <Container className="mt-[60px] w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {vacancies.map((vacancy, index) => (
            <div 
              key={index}
              className="bg-[#13132F] border border-white/20 rounded-[10px] p-6 flex flex-col h-full shadow-[0px_10px_20px_0px_#000000] hover:border-[#133FA6] hover:shadow-[0_8px_24px_rgba(19,63,166,0.25)] transition-all duration-300"
            >

              <h3 className="font-inter text-white text-[22px] md:text-[24px] font-bold mb-3">
                {vacancy.title}
              </h3>
              
              <p className="font-inter text-[#C5C5C5] text-[16px] mb-4">
                {vacancy.description}
              </p>
              
              <div className="mb-6">
                <div className="flex items-center gap-2 text-[#C5C5C5] font-inter text-[14px]">
                  <span className="font-medium">{vacancy.location}</span>
                </div>
              </div>
              
              <div className="mb-6 flex-grow">
                <h4 className="font-inter text-white text-[16px] font-semibold mb-3">{t('public.requirements')}</h4>
                <ul className="space-y-2">
                  {vacancy.requirements.map((requirement, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span className="font-inter text-[#C5C5C5] text-[14px]">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link 
                to={`/careers/${vacancy.id}`}
                className="mt-auto w-full bg-[#133FA6] hover:bg-[#1a4cc0] text-white font-inter font-semibold py-3 px-4 rounded-[6.45px] transition-colors duration-300 cursor-pointer text-center"
              >
                {t('public.careers.viewRoleCta')}
              </Link>
            </div>
          ))}
        </div>
      </Container>

      <Container className="flex justify-between mt-[120px] flex-col md:flex-row gap-[40px] md:gap-0 items-center md:items-start">
        <div className="flex flex-col gap-[10px] max-w-[586px] justify-center w-full md:w-auto ">
          <h3 className="font-inter text-white text-[21px] md:text-[26px] font-semibold text-center md:text-left">
            {t('public.careers.whyTitle')}
          </h3>
          <p className="font-inter text-[10px] md:text-[13px] text-[#C5C5C5] text-center md:text-left">
            {t('public.careers.whyCopy')}
          </p>
        </div>

        <img
          src={workWithUs}
          alt={t('public.careers.workWithUsAlt')}
          className="w-[308px] h-[168px] md:w-auto md:h-auto max-w-[586px] "
        />
      </Container>

      <Container className='w-full mt-[120px]'>
        <div className="flex flex-col justify-center items-center mb-12">
          <h3 className="font-inter text-[38px] font-bold text-white">{t('public.teamTitle')}</h3>
        </div>
        
        <div className="flex flex-col gap-6 md:gap-8">
          {teamMembers.slice(0, showAllTeam ? teamMembers.length : 4).map((member, index) => (
            <div 
              key={index}
              className="bg-[#13132F] border-l-[1px] border-b-[1px] border-white rounded-[10px] p-6 shadow-[0px_10px_20px_0px_#000000]"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0">
                  {memberImages[member.id] && (
                    <img
                      src={memberImages[member.id]}
                      alt={member.name}
                      className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] object-cover rounded-md"
                    />
                  )}

                  <div className="md:hidden flex-1">
                    <h4 className="font-inter text-white text-[20px] md:text-[26px] mb-1">
                      {member.name}
                    </h4>
                    <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[18px] font-semibold">
                      {member.role}
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex md:flex-1 md:flex-col">
                  <div className="mb-4">
                    <h4 className="font-inter text-white text-[22px] md:text-[26px] mb-2">
                      {member.name}
                    </h4>
                    <p className="font-inter text-[#C5C5C5] text-[16px] md:text-[18px] font-semibold">
                      {member.role}
                    </p>
                  </div>
                  
                  <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 md:hidden">
                <p className="font-inter text-[#C5C5C5] text-[14px] leading-relaxed">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {teamMembers.length > 4 && (
          <div className="flex justify-center mt-12">
            <button 
              onClick={() => setShowAllTeam(!showAllTeam)}
              className="bg-transparent hover:bg-[#1a4cc0] border-[1px] border-white/20 text-white font-inter py-[10px] px-[20px] rounded-[6.45px] transition-colors duration-300 cursor-pointer"
            >
              {showAllTeam ? t('public.careers.showLess') : t('public.careers.viewMore')}
            </button>
          </div>
        )}
      </Container>
    </div>
  );
}