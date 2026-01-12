import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
// import { useContent } from '@/contexts/ContentContext';
// import { api, type Career } from '@/lib/api';
import { useState } from 'react';
import Container from '../components/ui/Container';
import trustedPeople from "../assets/images/trusted-people.svg";
import workWithUs from '../assets/images/work-with-us.svg';

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
    { id: 'john', name: 'John Doe', image: 'team-member-1.jpg' },
    { id: 'jane', name: 'Jane Smith', image: 'team-member-2.jpg' },
    { id: 'mike', name: 'Mike Johnson', image: 'team-member-3.jpg' },
    { id: 'sarah', name: 'Sarah Williams', image: 'team-member-4.jpg' },
    { id: 'robert', name: 'Robert Brown', image: 'team-member-5.jpg' },
    { id: 'emily', name: 'Emily Davis', image: 'team-member-6.jpg' },
    { id: 'david', name: 'David Wilson', image: 'team-member-7.jpg' },
    { id: 'lisa', name: 'Lisa Taylor', image: 'team-member-8.jpg' },
  ];

  // useEffect(() => {
  //   if (!content?.careers || content.careers.length === 0) {
  //     setLoading(true);
  //     api.getCareers(locale).then(setCareers).finally(() => setLoading(false));
  //   } else {
  //     setCareers(content.careers);
  //   }
  // }, [locale, content]);

  // if (loading) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <div className="text-white">Loading...</div>
  //     </div>
  //   );
  // }

  return (
    <div className="mt-[60px] flex flex-col justify-center items-center">
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
              className="bg-[#13132F] border-l-[1px] border-b-[1px] border-white rounded-[10px] p-6 flex flex-col md:flex-row gap-6 w-full shadow-[0px_10px_20px_0px_#000000]"
            >
                <img src={trustedPeople} alt="Trusted People" />

              <div className="flex-1 flex flex-col">
                <div className="mb-4">
                  <h4 className="font-inter text-white text-[22px] md:text-[26px]  mb-2">
                    {member.name}
                  </h4>
                  <p className="font-inter text-[#C5C5C5] text-[16px] md:text-[18px] font-semibold">
                    {t(`public.careers.team.members.${member.id}.role`)}
                  </p>
                </div>
                
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] leading-relaxed">
                  {t(`public.careers.team.members.${member.id}.description`)}
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