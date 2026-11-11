import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '@/contexts/I18nContext';
import workWithUs from '../assets/images/work-with-us.svg';
import { CtaWalk, PageHero, Pill, RevealGrid, SectionHead, Ticker, useReveal, WordsReveal } from '@/components/site/blocks';
import { scrollToTarget } from '@/components/site/scroll';
import { accentLast } from '@/components/site/work/text';
import '@/components/site/work/work.css';

// The "Our Team" section (member cards, role filter, photo preview) is
// temporarily disabled; its data and markup are kept at the end of this file.

/** Shared reasons to join, drawn from the "what you get" lists of the role pages. */
const PERKS = [
  'public.frontend.get.items.realProduction',
  'public.frontend.get.items.ownership',
  'public.backend.get.items.cleanArchitecture',
  'public.uiux.get.items.spaceToIterate',
  'public.uiux.get.items.professionalEnvironment',
  'public.frontend.location.items.format',
];

export function Careers() {
  const { t, tRaw } = useI18n();
  const rolesRef = useReveal<HTMLOListElement>();

  const vacancies = [
    {
      id: 'frontend-developer',
      title: t('public.careers.vacancies.frontend.title'),
      description: t('public.careers.vacancies.frontend.description'),
      location: t('public.careers.vacancies.frontend.location'),
      requirements: [
        t('public.careers.vacancies.frontend.reqs.htmlCssJs'),
        t('public.careers.vacancies.frontend.reqs.uiSense'),
        t('public.careers.vacancies.frontend.reqs.cleanCode'),
      ],
    },
    {
      id: 'backend-developer',
      title: t('public.careers.vacancies.backend.title'),
      description: t('public.careers.vacancies.backend.description'),
      location: t('public.careers.vacancies.backend.location'),
      requirements: [
        t('public.careers.vacancies.backend.reqs.restSql'),
        t('public.careers.vacancies.backend.reqs.authRbacSense'),
        t('public.careers.vacancies.backend.reqs.performanceMindset'),
      ],
    },
    {
      id: 'ui-ux-designer',
      title: t('public.careers.vacancies.uiux.title'),
      description: t('public.careers.vacancies.uiux.description'),
      location: t('public.careers.vacancies.uiux.location'),
      requirements: [
        t('public.careers.vacancies.uiux.reqs.figma'),
        t('public.careers.vacancies.uiux.reqs.designSystems'),
        t('public.careers.vacancies.uiux.reqs.webMobileUx'),
      ],
    },
  ];

  const careersTitle = t('nav.careers', 'Careers');

  return (
    <>
      <Helmet>
        <title>{`${t('nav.careers', 'Careers')} | Alievs Space MMC`}</title>
        <meta name="description" content={t('public.careersIntro')} />
        <meta property="og:title" content={`${t('nav.careers', 'Careers')}`} />
        <meta property="og:description" content={t('public.careersIntro')} />
        <meta property="og:type" content="website" />
      </Helmet>

      <PageHero
        word={t('site.work.careers.word')}
        num={String(vacancies.length)}
        tone="mustard"
        eyebrow="Alievs Space"
        title={careersTitle}
        lead={t('public.careersIntro')}
        crumbs={[{ label: t('nav.home'), to: '/' }, { label: careersTitle }]}
        actions={
          <>
            <Pill variant="light" onClick={() => scrollToTarget('#roles')}>
              {t('site.work.careers.rolesCta')}
            </Pill>
            <Pill to="/apply" variant="ghost">
              {t('public.apply', 'Apply')}
            </Pill>
          </>
        }
      />

      {/* Culture: the "why work with us" copy as a scroll-lit statement. */}
      <section className="as-section" aria-labelledby="careers-why">
        <div className="as-wrap grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="grid gap-8 lg:col-span-8">
            <SectionHead id="careers-why" eyebrow={careersTitle} title={t('public.careers.whyTitle')} size="sm" />
            <WordsReveal
              text={t('public.careers.whyCopy')}
              highlight={tRaw<string[]>('site.work.careers.highlight', [])}
              className="max-w-[24ch] !text-[clamp(28px,4.2vw,64px)]"
            />
          </div>
          <RevealGrid className="lg:col-span-4">
            <div className="as-box grid place-items-center">
              <img
                src={workWithUs}
                alt={t('public.careers.workWithUsAlt')}
                loading="lazy"
                decoding="async"
                width={242}
                height={162}
                className="h-auto w-full max-w-[420px] rounded-[14px]"
              />
            </div>
          </RevealGrid>
        </div>
      </section>

      <Ticker items={vacancies.map((v) => v.title)} duration={26} />

      {/* Open roles as ruled rows; the whole row links to the role page. */}
      <section id="roles" className="as-section as-bg-cream" aria-labelledby="careers-roles">
        <div className="as-wrap grid gap-12 md:gap-16">
          <SectionHead id="careers-roles" eyebrow={t('site.work.careers.rolesEyebrow')} title={t('site.work.careers.rolesTitle')} size="md" />
          <ol ref={rolesRef} className="wk-roles">
            {vacancies.map((vacancy, index) => (
              <li key={vacancy.id} data-reveal style={{ '--d': `${index * 90}ms` } as CSSProperties}>
                <Link to={`/careers/${vacancy.id}`} className="wk-role wk-hover" aria-label={`${vacancy.title}: ${t('public.careers.viewRoleCta')}`}>
                  <span className="wk-role__n" aria-hidden>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="grid content-start gap-3">
                    <h3 className="wk-role__title as-h3">{vacancy.title}</h3>
                    <p className="max-w-[48ch] text-[16px] leading-relaxed text-[var(--as-fg-soft)]">{vacancy.description}</p>
                    <p className="as-mono text-[var(--as-fg-soft)]">{vacancy.location}</p>
                  </div>
                  <div className="wk-role__meta">
                    <p className="as-mono text-[var(--as-fg-soft)]">{t('public.requirements')}</p>
                    <ul className="as-tags">
                      {vacancy.requirements.map((requirement, idx) => (
                        <li key={idx}>{requirement}</li>
                      ))}
                    </ul>
                  </div>
                  <span className="wk-role__go inline-flex items-center gap-4 font-semibold">
                    <span className="wk-arrow" aria-hidden>
                      <span>→</span>
                      <span>→</span>
                    </span>
                    <span className="lg:sr-only">{t('public.careers.viewRoleCta')}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What working here looks like. */}
      <section className="as-section" aria-labelledby="careers-perks">
        <div className="as-wrap grid gap-12 md:gap-16">
          <SectionHead id="careers-perks" eyebrow={t('site.work.careers.perksEyebrow')} title={t('public.frontend.whatYouGetTitle')} size="md" />
          <RevealGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PERKS.map((key, i) => (
              <div key={key} className="as-tile as-tile--hover grid h-full content-between gap-10">
                <span className="wk-num-line text-[64px]" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="as-h3 !text-[clamp(19px,1.7vw,24px)]">{t(key)}</p>
              </div>
            ))}
          </RevealGrid>
        </div>
      </section>

      <CtaWalk
        tone="burnt"
        eyebrow={careersTitle}
        title={accentLast(t('public.frontend.applyTitle'))}
        lead={t('site.work.careers.ctaLead')}
        actions={
          <Pill to="/apply" variant="light">
            {t('public.apply', 'Apply')}
          </Pill>
        }
      />
    </>
  );
}

/* --- "Our Team" section temporarily disabled ---
   To bring it back: restore these imports and state, then render the markup
   below (restyled with the `as-*` classes) after the perks section.

   import { useState } from 'react';
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

   // const [showAllTeam, setShowAllTeam] = useState(false);
   // const [selectedRole, setSelectedRole] = useState<string>('all');
   // const [previewMemberId, setPreviewMemberId] = useState<string | null>(null);
   // const [imageLoading, setImageLoading] = useState(true);

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

      <Container className='w-full mt-[120px] mb-[60px] md:mb-[100px]'>
        <div className="flex flex-col justify-center items-center mb-12">
          <h3 className="font-display text-[38px] font-bold text-white">{t('public.teamTitle')}</h3>
          
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
                    ? 'bg-primary text-on-primary'
                    : 'bg-transparent border border-border text-text-muted hover:border-border-strong hover:text-white'
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
              className="card p-6"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0">
                  {memberImages[member.id] && (
                    <div className="relative group cursor-pointer" onClick={() => setPreviewMemberId(member.id)}>
                      <img
                        src={memberImages[member.id]}
                        alt={member.name}
                        className="w-[110px] h-[140px] md:w-[140px] md:h-[180px] object-cover object-top rounded-lg transition-all duration-300 group-group-hover:shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  )}

                  <div className="md:hidden flex-1">
                    <h4 className="font-display text-white text-[20px] md:text-[26px] mb-1">
                      {member.name}
                    </h4>
                    <p className="font-inter text-text-muted text-[14px] md:text-[18px] font-semibold">
                      {member.role}
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex md:flex-1 md:flex-col">
                  <div className="mb-4">
                    <h4 className="font-display text-white text-[22px] md:text-[26px] mb-2">
                      {member.name}
                    </h4>
                    <p className="font-inter text-text-muted text-[16px] md:text-[18px] font-semibold">
                      {member.role}
                    </p>
                  </div>
                  
                  <p className="font-inter text-text-muted text-[14px] md:text-[16px] leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 md:hidden">
                <p className="font-inter text-text-muted text-[14px] leading-relaxed">
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
              className="bg-transparent hover:bg-surface-3 border border-border text-white font-inter py-[10px] px-[20px] rounded-md transition-colors duration-300 cursor-pointer"
            >
              {showAllTeam ? t('public.careers.showLess') : t('public.careers.viewMore')}
            </button>
          </div>
        )}

        {filteredTeamMembers.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <p className="font-inter text-text-muted text-[18px]">
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
                className="absolute -top-4 -right-4 bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-inter transition-all duration-200 backdrop-blur-sm border border-border z-10 cursor-pointer"
                aria-label="Şəkli bağla"
              >
                ✕
              </button>

              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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
                <div className="panel px-6 py-4 shadow-lg">
                  <p className="font-inter text-white text-[18px] font-semibold text-center">
                    {previewMember.name}
                  </p>
                  <p className="font-inter text-text-muted text-[14px] text-center mt-1">
                    {previewMember.role}
                  </p>
                  {previewMember.description && (
                    <p className="font-inter text-text-muted text-[12px] text-center mt-2 pt-2 border-t border-border/10">
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
--- end of disabled "Our Team" section --- */
