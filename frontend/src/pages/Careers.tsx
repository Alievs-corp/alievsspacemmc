import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { useState } from 'react';
import Container from '../components/ui/Container';
import workWithUs from '../assets/images/work-with-us.svg';
import ismat from "../assets/images/ismat.jpeg";
import ismayil from "../assets/images/ismayil.jpeg";
import elshan from "../assets/images/elsen.jpeg";
import elmar from "../assets/images/elmar.jpeg";
import ravena from "../assets/images/ravena.jpeg";
import zehra from "../assets/images/zehra.jpg";
import parvin from "../assets/images/pervin.jpeg"
import aygun from "../assets/images/aygun.jpeg"
import fuad from "../assets/images/fuad-elizade.jpeg"
import yunis from "../assets/images/yunis.jpeg"
import selen from "../assets/images/selen.jpeg"
import nicat from "../assets/images/nicat.jpeg"
import { Helmet } from 'react-helmet-async';

export function Careers() {
  const { t } = useI18n();
  const [showAllTeam, setShowAllTeam] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [previewMemberId, setPreviewMemberId] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      roleType: 'frontend',
      description: t(
        'public.careers.teamMembers.ismat.description',
        '3 ildən artıq müddətdir Alievs Space MMC-də Frontend Developer olaraq çalışıram. Alievs Space Academy-də Frontend dərsləri tədris edirəm.'
      ),
    },
    {
      id: 'elshan',
      name: t('public.careers.teamMembers.elshan.name', 'Elşən Həsənov'),
      role: t('public.careers.teamMembers.elshan.role', 'Frontend Developer'),
      roleType: 'frontend',
      description: t(
        'public.careers.teamMembers.elshan.description',
        '3 ildən artıq müddətdir ki Alievs Space MMC-də Frontend Developer olaraq çalışıram.'
      ),
    },
    {
      id: 'ismayil',
      name: t('public.careers.teamMembers.ismayil.name', 'İsmayıl İsmayılov'),
      role: t('public.careers.teamMembers.ismayil.role', 'Frontend Developer'),
      roleType: 'frontend',
      description: t(
        'public.careers.teamMembers.ismayil.description',
        'Frontend Development sahəsi üzrə 4 ildir ki özümü inkişaf etdirməyə çalışıram. Developia Engineering şirkətində mentor və instructor olaraq işləmişəm. Artıq 2 ildir ki Alievs Space MMC-də Frontend Developer olaraq çalışıram.'
      ),
    },
    {
      id: 'ravena',
      name: t('public.careers.teamMembers.ravena.name', 'Ravena Balagözova'),
      role: t('public.careers.teamMembers.ravena.role', 'Frontend Developer'),
      roleType: 'frontend',
      description: t(
        'public.careers.teamMembers.ravena.description',
        'Təxminən 3 ildir ki Frontend üzrə biliklərimi inkişaf etdirirəm. 1 ildir ki Alievs Space MMC də Frontend Developer olaraq işləyirəm.'
      ),
    },
    {
      id: 'zehra',
      name: t('public.careers.teamMembers.zehra.name', 'Zəhra Mahmudova'),
      role: t('public.careers.teamMembers.zehra.role', 'Frontend Developer'),
      roleType: 'frontend',
      description: t(
        'public.careers.teamMembers.zehra.description',
        '3 ildir ki Frontend sahəsi üzrə daimi olaraq çalışır və inkişaf edirəm.'
      ),
    },
    {
      id: 'elmar',
      name: t('public.careers.teamMembers.elmar.name', 'Elmar Əzimli'),
      role: t('public.careers.teamMembers.elmar.role', 'Frontend Developer'),
      roleType: 'frontend',
      description: t(
        'public.careers.teamMembers.elmar.description',
        '4 ildir Fronted sahəsindəyəm. 1 ildən artıqdır ki Alievs Space MMC-də işləyirəm.'
      ),
    },
    {
      id: 'parvin',
      name: t('public.careers.teamMembers.parvin.name', 'Pərvin Əhmədov'),
      role: t('public.careers.teamMembers.parvin.role', 'Frontend Developer'),
      roleType: 'frontend',
      description: t(
        'public.careers.teamMembers.parvin.description',
        '4 ildir Software Developer sahəsində təcrübə qazanıram və biliklərimi davamlı olaraq inkişaf etdirirəm. 2 ildir ki, Alievs Space MMC-də işləyirəm.'
      ),
    },
    {
      id: 'nicat',
      name: t('public.careers.teamMembers.nicat.name', 'Nicat Məsməliyev'),
      role: t('public.careers.teamMembers.nicat.role', 'Frontend Developer'),
      roleType: 'frontend',
      description: t(
        'public.careers.teamMembers.nicat.description',
        '1 ildən artıq müddətdir Alievs Space MMC şirkətində Frontend Developer olaraq işləyirəm.'
      ),
    },
    {
      id: 'aygun',
      name: t('public.careers.teamMembers.aygun.name', 'Aygün Məmmədzadə'),
      role: t('public.careers.teamMembers.aygun.role', 'Backend Developer'),
      roleType: 'backend',
      description: t(
        'public.careers.teamMembers.aygun.description',
        '1 ildən artıq müddətdir Alievs Space MMC-də işləyirəm.'
      ),
    },
    {
      id: 'fuad',
      name: t('public.careers.teamMembers.fuad.name', 'Fuad Əlizadə'),
      role: t('public.careers.teamMembers.fuad.role', 'Full Stack Developer'),
      roleType: 'backend',
      description: t(
        'public.careers.teamMembers.fuad.description',
        '6 ildir bu sahə üzrə çalışıram. Full Stack Developer olaraq Alievs Space MMC-də işləyirəm.'
      ),
    },
    {
      id: 'selen',
      name: t('public.careers.teamMembers.selen.name', 'Selen Kalbalıyeva'),
      role: t('public.careers.teamMembers.selen.role', 'Backend Developer'),
      roleType: 'backend',
      description: t(
        'public.careers.teamMembers.selen.description',
        '2 ildir ki Alievs Space MMC-də Backend Developer olaraq işləyirəm.'
      ),
    },
    {
      id: 'yunis',
      name: t('public.careers.teamMembers.yunis.name', 'Yunis Paşayev'),
      role: t('public.careers.teamMembers.yunis.role', 'Backend Developer'),
      roleType: 'backend',
      description: t(
        'public.careers.teamMembers.yunis.description',
        '4 ildir ki Backend Developer olaraq Alievs Space MMC-də işləyirəm.'
      ),
    },
  ];

  const roleOptions = [
    { value: 'all', label: t('public.careers.allRoles', 'Hamısı') },
    { value: 'frontend', label: t('public.careers.frontend', 'Frontend') },
    { value: 'backend', label: t('public.careers.backend', 'Backend') },
  ];

  const filteredTeamMembers = selectedRole === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => member.roleType === selectedRole);

  const memberImages: Record<string, string> = {
    ismat,
    ismayil,
    elshan,
    elmar,
    ravena,
    zehra,
    parvin,
    nicat,
    aygun,
    fuad,
    yunis,
    selen,
  };

  const previewMember = previewMemberId
    ? teamMembers.find((member) => member.id === previewMemberId) || null
    : null;

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
                onClick={scrollToTop}
                className="mt-auto w-full bg-[#133FA6] hover:bg-[#1a4cc0] text-white font-inter font-semibold py-3 px-4 rounded-[6.45px] transition-colors duration-300 cursor-pointer text-center"
              >
                {t('public.careers.viewRoleCta')}
              </Link>
            </div>
          ))}
        </div>
      </Container>

      <Container className="flex justify-between mt-[120px] flex-col md:flex-row gap-[40px] md:gap-0 items-center md:items-start">
        <div className="flex flex-col gap-[10px] max-w-[586px] justify-center w-full md:w-auto">
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
          className="w-[308px] h-[168px] md:w-auto md:h-auto max-w-[586px]"
        />
      </Container>

      <Container className='w-full mt-[120px] mb-[60px] md:mb-[100px]'>
        <div className="flex flex-col justify-center items-center mb-12">
          <h3 className="font-inter text-[38px] font-bold text-white">{t('public.teamTitle')}</h3>
          
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-6">
            {roleOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSelectedRole(option.value);
                  setShowAllTeam(false);
                }}
                className={`px-4 py-2 rounded-full text-sm md:text-base font-inter transition-all duration-300 cursor-pointer ${
                  selectedRole === option.value
                    ? 'bg-[#133FA6] text-white'
                    : 'bg-transparent border border-white/20 text-[#C5C5C5] hover:border-[#133FA6] hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-6 md:gap-8">
          {filteredTeamMembers.slice(0, showAllTeam ? filteredTeamMembers.length : 4).map((member, index) => (
            <div 
              key={index}
              className="bg-[#13132F] border-l-[1px] border-b-[1px] border-white rounded-[10px] p-6 shadow-[0px_10px_20px_0px_#000000] hover:shadow-[0px_15px_30px_0px_#000000] transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0">
                  {memberImages[member.id] && (
                    <div className="relative group cursor-pointer" onClick={() => setPreviewMemberId(member.id)}>
                      <img
                        src={memberImages[member.id]}
                        alt={member.name}
                        className="w-[110px] h-[140px] md:w-[140px] md:h-[180px] object-cover object-top rounded-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
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
        
        {filteredTeamMembers.length > 4 && (
          <div className="flex justify-center mt-12">
            <button 
              onClick={() => setShowAllTeam(!showAllTeam)}
              className="bg-transparent hover:bg-[#133FA6] border-[1px] border-white/20 text-white font-inter py-[10px] px-[20px] rounded-[6.45px] transition-all duration-300 cursor-pointer hover:scale-105"
            >
              {showAllTeam ? t('public.careers.showLess') : t('public.careers.viewMore')}
            </button>
          </div>
        )}

        {filteredTeamMembers.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <p className="font-inter text-[#C5C5C5] text-[18px]">
              {t('public.careers.noTeamMembers', 'Bu sahədə hələ işçi yoxdur')}
            </p>
          </div>
        )}

        {previewMember && memberImages[previewMember.id] && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in cursor-pointer"
            onClick={() => setPreviewMemberId(null)}
          >
            <div
              className="relative max-w-[90vw] max-h-[85vh] animate-zoom-in cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setPreviewMemberId(null)}
                className="absolute -top-4 -right-4 bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-inter transition-all duration-200 hover:scale-110 backdrop-blur-sm border border-white/20 z-10 cursor-pointer"
                aria-label="Şəkli bağla"
              >
                ✕
              </button>

              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="w-8 h-8 border-4 border-[#133FA6] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={memberImages[previewMember.id]}
                  alt={previewMember.name}
                  className={`max-w-full max-h-[75vh] object-contain bg-gradient-to-b from-gray-900 to-black transition-opacity duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={() => setImageLoading(false)}
                />

                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
              </div>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-md animate-slide-up">
                <div className="bg-gradient-to-r from-[#0f0f2a] to-[#1a1a3a] backdrop-blur-md rounded-xl px-6 py-4 border border-white/20 shadow-lg">
                  <p className="font-inter text-white text-[18px] font-semibold text-center">
                    {previewMember.name}
                  </p>
                  <p className="font-inter text-[#C5C5C5] text-[14px] text-center mt-1">
                    {previewMember.role}
                  </p>
                  {previewMember.description && (
                    <p className="font-inter text-[#C5C5C5] text-[12px] text-center mt-2 pt-2 border-t border-white/10">
                      {previewMember.description.length > 100 
                        ? `${previewMember.description.substring(0, 100)}...` 
                        : previewMember.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}