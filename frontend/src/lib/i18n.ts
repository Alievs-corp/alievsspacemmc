export type Locale = 'en' | 'az' | 'ru';

export const SUPPORTED_LOCALES: Array<{ code: Locale; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'az', label: 'Azərbaycanca' },
];

export const DEFAULT_LOCALE: Locale = 'en';

const LOCALE_KEY = 'alievs_space_locale';

function getNavigatorLocale(): Locale | null {
  try {
    const nav = navigator.language || (navigator.languages && navigator.languages[0]);
    if (!nav) return null;
    const short = nav.slice(0, 2).toLowerCase() as Locale;
    const supported = SUPPORTED_LOCALES.map((l) => l.code);
    if (supported.includes(short)) return short;
    return null;
  } catch {
    return null;
  }
}

export function getLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const stored = localStorage.getItem(LOCALE_KEY);
  if (stored && SUPPORTED_LOCALES.some((l) => l.code === stored)) {
    return stored as Locale;
  }
  return getNavigatorLocale() || DEFAULT_LOCALE;
}

export function setLocale(code: Locale): void {
  if (!SUPPORTED_LOCALES.some((l) => l.code === code)) return;
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCALE_KEY, code);
    document.documentElement.lang = code;
  }
}

const translations: Record<Locale, Record<string, any>> = {
  en: {
    ui: {
      language: 'Language',
      menu: 'Menu',
      close: 'Close',
      openSite: 'Open Website',
      logout: 'Logout',
    },
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      industries: 'Industries',
      projects: 'Case Studies',
      careers: 'Careers',
      blog: 'Blog',
      contact: 'Contact',
      cta: 'Request a Proposal',
      admin: 'Admin',
    },
    public: {
      footerDesc:
        'Premium web & mobile development, e-commerce/marketplace systems, and banking-ready dashboards.',
      industriesCta: 'Discuss this industry →',
      requirements: 'Requirements:',
      apply: 'Apply',
      notFoundProject: 'Project not found',
      notFoundPost: 'Post not found',
      contactThanks: "Thank you — we received your request. We'll reply soon.",
      contactValidation: 'Please provide at least your name and email/phone.',
      contactStatusNew: 'New',
      heroTagline: 'Premium • Platinum • Blue',
      buildWhat: 'What we build',
      buildDesc:
        'A structured ecosystem across software, commerce, and banking-focused dashboards — designed premium and built to last.',
      premiumProcess: 'Premium process',
      focusIndustries: 'Focus industries',
      processDesc:
        'We keep delivery structured: architecture first, premium UI, quality control, then launch & support.',
      focusDesc:
        'E-commerce & marketplaces, banking/fintech dashboards, and operational systems where control and reporting matter.',
      adminIncluded: 'Admin Panel Included',
      adminDesc:
        'Manage services, projects, blog, careers, and incoming inquiries in a dedicated admin dashboard. Changes reflect instantly across the site.',
      aboutWho: 'Who we are',
      aboutValues: 'Values',
      aboutHow: 'How we deliver',
      aboutDelivery:
        'A structured delivery pipeline designed to stay stable and maintainable as you scale.',
      stepLabel: 'Step',
      serviceFallback: 'Service',
      servicesIntro:
        'Premium engineering & design across software development, e-commerce/marketplaces, and banking-ready dashboards.',
      deliveryTitle: 'Delivery model',
      deliveryCopy:
        'We start with the architecture and UI system. Then we build modules, integrate analytics, and ship in controlled milestones — with ongoing support.',
      projectsIntro: 'Selected examples across marketplaces, banking dashboards, and operational systems.',
      blogIntro: 'Insights on marketplaces, premium UX, admin systems, and banking-ready dashboards.',
      careersIntro: 'We build premium systems. Join a team that cares about design, structure, and reliability.',
      teamTitle: 'Our team',
      contactIntro: "Tell us what you're building. We'll reply with a structured proposal.",
      contactFormTitle: 'Send a request',
      contactName: 'Your name *',
      contactCompany: 'Company',
      contactEmail: 'Email',
      contactPhone: 'Phone',
      contactInterest: 'Interest',
      contactTopic: 'Topic',
      contactMessage: 'Message',
      contactCompanyPlaceholder: 'Company name',
      contactTopicPlaceholder: 'What do you want to build?',
      contactMessagePlaceholder: 'Describe your project, timeline, and goals...',
      contactInterestSoftware: 'Software Development',
      contactInterestCommerce: 'E-commerce / Marketplace',
      contactInterestBanking: 'Banking / Fintech Dashboard',
      contactInterestDesign: 'UI/UX & Design System',
      contactInterestSupport: 'Support & Scaling',
      contactHelper:
        'Tip: mention industry (e-commerce/banking), required modules, and target markets.',
      contactSubmit: 'Send request',
      companyDetails: 'Company details',
      companyDetailsCopy:
        'We combine premium UI/UX with stable engineering and admin tooling — across commerce and banking-ready systems.',
      noteBadge: 'Note',
      noteCopy: 'Contact requests are saved and visible in Admin → Inquiries.',
      industriesIntro:
        'We build systems where reliability, reporting, and premium UX are business-critical.',
      projectDetails: 'Details',
      industry: 'Industry',
      tags: 'Tags',
      nextStep: 'Next step',
      projectNextCopy:
        'Want a similar system? We can estimate and propose a clean architecture with premium UI.',
      openLink: 'Open link',
      postLabel: 'Post',
      postHelpTitle: 'Need help?',
      postHelpCopy:
        "If you're building a marketplace, e-commerce platform, or a banking-ready dashboard — we can propose a premium architecture.",
    },
  },
  ru: {
    ui: {
      language: 'Язык',
      menu: 'Меню',
      close: 'Закрыть',
      openSite: 'Открыть сайт',
      logout: 'Выйти',
    },
    nav: {
      home: 'Главная',
      about: 'О нас',
      services: 'Услуги',
      industries: 'Отрасли',
      projects: 'Кейсы',
      careers: 'Карьера',
      blog: 'Блог',
      contact: 'Контакты',
      cta: 'Запросить предложение',
      admin: 'Админ',
    },
    public: {
      footerDesc:
        'Премиальная разработка веб и мобильных продуктов, e-commerce/маркетплейсы и банковские дашборды.',
      industriesCta: 'Обсудить отрасль →',
      requirements: 'Требования:',
      apply: 'Откликнуться',
      notFoundProject: 'Проект не найден',
      notFoundPost: 'Статья не найдена',
      contactThanks: 'Спасибо — мы получили запрос и скоро ответим.',
      contactValidation: 'Укажите имя и контакт (email или телефон).',
      contactStatusNew: 'Новая',
      heroTagline: 'Premium • Platinum • Blue',
      buildWhat: 'Что мы делаем',
      buildDesc:
        'Структурированная экосистема ПО, e-commerce и банковских дашбордов — премиальный дизайн и надежная реализация.',
      premiumProcess: 'Премиальный процесс',
      focusIndustries: 'Ключевые отрасли',
      processDesc:
        'Структурированный процесс: архитектура, премиальный UI, контроль качества, запуск и поддержка.',
      focusDesc:
        'E-commerce и маркетплейсы, финтех-дашборды и операционные системы с отчетностью.',
      adminIncluded: 'Админ-панель включена',
      adminDesc:
        'Управляйте услугами, кейсами, блогом, вакансиями и лидами. Изменения сразу на сайте.',
      aboutWho: 'Кто мы',
      aboutValues: 'Ценности',
      aboutHow: 'Как мы работаем',
      aboutDelivery: 'Структурированный процесс поставки, который остаётся стабильным при росте.',
      stepLabel: 'Шаг',
      serviceFallback: 'Услуга',
      servicesIntro:
        'Премиальная инженерия и дизайн: разработка, e-commerce/маркетплейсы и банковские дашборды.',
      deliveryTitle: 'Модель поставки',
      deliveryCopy:
        'Начинаем с архитектуры и UI системы, затем строим модули, подключаем аналитику и сдаём контролируемыми этапами с поддержкой.',
      projectsIntro: 'Примеры проектов: маркетплейсы, банковские дашборды и операционные системы.',
      blogIntro: 'Мысли о маркетплейсах, премиальном UX, админ-системах и банковских панелях.',
      careersIntro:
        'Мы строим премиальные системы. Присоединяйтесь, если важны дизайн, структура и надежность.',
      teamTitle: 'Наша команда',
      contactIntro: 'Расскажите, что хотите создать. Ответим структурным предложением.',
      contactFormTitle: 'Отправить запрос',
      contactName: 'Ваше имя *',
      contactCompany: 'Компания',
      contactEmail: 'Email',
      contactPhone: 'Телефон',
      contactInterest: 'Интерес',
      contactTopic: 'Тема',
      contactMessage: 'Сообщение',
      contactCompanyPlaceholder: 'Название компании',
      contactTopicPlaceholder: 'Что хотите построить?',
      contactMessagePlaceholder: 'Опишите проект, сроки и цели...',
      contactInterestSoftware: 'Разработка ПО',
      contactInterestCommerce: 'E-commerce / Маркетплейс',
      contactInterestBanking: 'Банковский / финтех дашборд',
      contactInterestDesign: 'UI/UX и дизайн-система',
      contactInterestSupport: 'Поддержка и масштабирование',
      contactHelper: 'Совет: укажите отрасль, нужные модули и целевые рынки.',
      contactSubmit: 'Отправить',
      companyDetails: 'Данные компании',
      companyDetailsCopy:
        'Мы соединяем премиальный UX/UI с надежной инженерией и админ-инструментами для commerce и банковских систем.',
      noteBadge: 'Заметка',
      noteCopy: 'В демо запросы сохраняются локально и видны в Admin → Leads.',
      industriesIntro:
        'Мы делаем системы, где критичны надежность, отчетность и премиальный UX.',
      projectDetails: 'Детали',
      industry: 'Отрасль',
      tags: 'Теги',
      nextStep: 'Следующий шаг',
      projectNextCopy:
        'Хотите похожую систему? Рассчитаем и предложим архитектуру с премиальным UI.',
      openLink: 'Открыть ссылку',
      postLabel: 'Статья',
      postHelpTitle: 'Нужна помощь?',
      postHelpCopy:
        'Если строите маркетплейс, e-commerce или банковский дашборд — подготовим архитектуру с премиальным UX.',
    },
  },
  az: {
    ui: {
      language: 'Dil',
      menu: 'Menyu',
      close: 'Bağla',
      openSite: 'Saytı aç',
      logout: 'Çıxış',
    },
    nav: {
      home: 'Baş səhifə',
      about: 'Haqqımızda',
      services: 'Xidmətlər',
      industries: 'Sahələr',
      projects: 'Layihələr',
      careers: 'Karyera',
      blog: 'Bloq',
      contact: 'Əlaqə',
      cta: 'Təklif istəyin',
      admin: 'Admin',
    },
    public: {
      footerDesc:
        'Premium veb və mobil inkişaf, e-ticarət/marketpleys sistemləri və bank paneli həlləri.',
      industriesCta: 'Bu sahəni müzakirə edək →',
      requirements: 'Tələblər:',
      apply: 'Müraciət et',
      notFoundProject: 'Layihə tapılmadı',
      notFoundPost: 'Məqalə tapılmadı',
      contactThanks: 'Təşəkkürlər — sorğunuzu aldıq, tezliklə cavab verəcəyik.',
      contactValidation: 'Zəhmət olmasa ad və əlaqə məlumatı (email və ya telefon) daxil edin.',
      contactStatusNew: 'Yeni',
      heroTagline: 'Premium • Platinum • Blue',
      buildWhat: 'Biz nələri qururuq',
      buildDesc:
        'Proqram, e-ticarət və bank yönümlü panellər üzrə strukturlaşdırılmış ekosistem — premium dizayn və dayanıqlı icra.',
      premiumProcess: 'Premium proses',
      focusIndustries: 'Prioritet sahələr',
      processDesc:
        'Mərhələli çatdırılma: memarlıq, premium UI, keyfiyyətə nəzarət, buraxılış və dəstək.',
      focusDesc:
        'E-ticarət və marketpleyslər, fintex panelləri və hesabatlı əməliyyat sistemləri.',
      adminIncluded: 'Admin panel daxildir',
      adminDesc:
        'Xidmətlərə, layihələrə, bloqa, vakansiyalara və sorğulara nəzarət edin. Dəyişikliklər dərhal saytda görünür.',
      aboutWho: 'Biz kimik',
      aboutValues: 'Dəyərlər',
      aboutHow: 'Necə çatdırırıq',
      aboutDelivery: 'Miqyası saxlayan sabit və idarə olunan çatdırılma prosesi.',
      stepLabel: 'Addım',
      serviceFallback: 'Xidmət',
      servicesIntro:
        'Premium mühəndislik və dizayn: proqram inkişafı, e-ticarət/marketpleyslər və bank panelləri.',
      deliveryTitle: 'Çatdırılma modeli',
      deliveryCopy:
        'Əvvəlcə memarlıq və UI sistemi qururuq, sonra modullar əlavə edir, analitikanı qoşur və mərhələli şəkildə dəstəklə təqdim edirik.',
      projectsIntro: 'Marketpleyslər, bank panelləri və əməliyyat sistemləri üzrə nümunələr.',
      blogIntro: 'Marketpleyslər, premium UX, admin sistemləri və bank panelləri barədə fikirlər.',
      careersIntro:
        'Premium sistemlər qururuq. Dizayn və etibarlılığı önəmli sayan komandaya qoşulun.',
      teamTitle: 'Komandamız',
      contactIntro: 'Nə qurmaq istədiyinizi deyin, strukturlu təklif göndərək.',
      contactFormTitle: 'Sorğu göndərin',
      contactName: 'Adınız *',
      contactCompany: 'Şirkət',
      contactEmail: 'Email',
      contactPhone: 'Telefon',
      contactInterest: 'Maraq',
      contactTopic: 'Mövzu',
      contactMessage: 'Mesaj',
      contactCompanyPlaceholder: 'Şirkətin adı',
      contactTopicPlaceholder: 'Nə qurmaq istəyirsiniz?',
      contactMessagePlaceholder: 'Layihəni, müddətləri və məqsədləri təsvir edin...',
      contactInterestSoftware: 'Proqram inkişafı',
      contactInterestCommerce: 'E-ticarət / Marketpleys',
      contactInterestBanking: 'Bank / Fintex paneli',
      contactInterestDesign: 'UI/UX və dizayn sistemi',
      contactInterestSupport: 'Dəstək və miqyaslama',
      contactHelper: 'Tövsiyə: sahəni, lazımi modulları və hədəf bazarları qeyd edin.',
      contactSubmit: 'Sorğunu göndər',
      companyDetails: 'Şirkət məlumatı',
      companyDetailsCopy:
        'Premium UI/UX-i sabit mühəndislik və admin alətləri ilə birləşdiririk — commerce və bank sistemləri üçün.',
      noteBadge: 'Qeyd',
      noteCopy: 'Sorğular saxlanılır və Admin → Inquiries bölməsində görünür.',
      industriesIntro: 'Etibarlılıq, hesabat və premium UX vacib olan sistemlər qururuq.',
      projectDetails: 'Təfərrüatlar',
      industry: 'Sahə',
      tags: 'Teqlər',
      nextStep: 'Növbəti addım',
      projectNextCopy:
        'Oxşar sistem lazımdır? Büdcəni və premium UI ilə memarlığı təklif edə bilərik.',
      openLink: 'Linki aç',
      postLabel: 'Məqalə',
      postHelpTitle: 'Kömək lazımdır?',
      postHelpCopy:
        'Marketpleys, e-ticarət və ya bank paneli qurursunuzsa, premium memarlıq təklif edə bilərik.',
    },
  },
};

function getPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

export function t(key: string, fallback = ''): string {
  const lang = getLocale();
  const byLang = translations[lang] || translations[DEFAULT_LOCALE] || {};
  const val = getPath(byLang, key);
  return val ?? fallback ?? key;
}

