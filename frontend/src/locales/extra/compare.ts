/**
 * Labels for the package comparison table. Kept separate from the main
 * bundles so the table can gain a row without touching ten large files.
 */
export const COMPARE_LABELS: Record<string, Record<string, string>> = {
  en: {
    pages: 'Pages', languages: 'Languages', admin: 'Admin panel', blog: 'Blog / news',
    payments: 'Online payments', inventory: 'Stock management', rbac: 'Role-based access',
    integrations: 'API / CRM integrations', mobileApp: 'Mobile application', seo: 'SEO',
    warranty: 'Warranty', manager: 'Dedicated project manager',
    basic: 'Basic', advanced: 'Advanced',
    warranty30: '30 days', warranty90: '90 days', warranty6m: '6 months', warranty12m: '12 months',
  },
  ru: {
    pages: 'Страниц', languages: 'Языков', admin: 'Админ-панель', blog: 'Блог / новости',
    payments: 'Онлайн-оплата', inventory: 'Складской учёт', rbac: 'Ролевой доступ',
    integrations: 'Интеграции API / CRM', mobileApp: 'Мобильное приложение', seo: 'SEO',
    warranty: 'Гарантия', manager: 'Выделенный менеджер',
    basic: 'Базовое', advanced: 'Расширенное',
    warranty30: '30 дней', warranty90: '90 дней', warranty6m: '6 месяцев', warranty12m: '12 месяцев',
  },
  az: {
    pages: 'Səhifə', languages: 'Dil', admin: 'Admin panel', blog: 'Bloq / xəbərlər',
    payments: 'Onlayn ödəniş', inventory: 'Anbar uçotu', rbac: 'Rol əsaslı giriş',
    integrations: 'API / CRM inteqrasiyaları', mobileApp: 'Mobil tətbiq', seo: 'SEO',
    warranty: 'Zəmanət', manager: 'Ayrıca layihə meneceri',
    basic: 'Baza', advanced: 'Genişləndirilmiş',
    warranty30: '30 gün', warranty90: '90 gün', warranty6m: '6 ay', warranty12m: '12 ay',
  },
  de: {
    pages: 'Seiten', languages: 'Sprachen', admin: 'Adminbereich', blog: 'Blog / News',
    payments: 'Online-Zahlungen', inventory: 'Lagerverwaltung', rbac: 'Rollenbasierte Zugriffe',
    integrations: 'API-/CRM-Integrationen', mobileApp: 'Mobile App', seo: 'SEO',
    warranty: 'Gewährleistung', manager: 'Fester Projektleiter',
    basic: 'Basis', advanced: 'Erweitert',
    warranty30: '30 Tage', warranty90: '90 Tage', warranty6m: '6 Monate', warranty12m: '12 Monate',
  },
  fr: {
    pages: 'Pages', languages: 'Langues', admin: 'Back-office', blog: 'Blog / actualités',
    payments: 'Paiement en ligne', inventory: 'Gestion des stocks', rbac: 'Accès par rôles',
    integrations: 'Intégrations API / CRM', mobileApp: 'Application mobile', seo: 'SEO',
    warranty: 'Garantie', manager: 'Chef de projet dédié',
    basic: 'De base', advanced: 'Avancé',
    warranty30: '30 jours', warranty90: '90 jours', warranty6m: '6 mois', warranty12m: '12 mois',
  },
  ka: {
    pages: 'გვერდი', languages: 'ენა', admin: 'ადმინ პანელი', blog: 'ბლოგი / სიახლეები',
    payments: 'ონლაინ გადახდა', inventory: 'მარაგის მართვა', rbac: 'როლებზე დაფუძნებული წვდომა',
    integrations: 'API / CRM ინტეგრაციები', mobileApp: 'მობილური აპლიკაცია', seo: 'SEO',
    warranty: 'გარანტია', manager: 'გამოყოფილი მენეჯერი',
    basic: 'საბაზისო', advanced: 'გაფართოებული',
    warranty30: '30 დღე', warranty90: '90 დღე', warranty6m: '6 თვე', warranty12m: '12 თვე',
  },
  zh: {
    pages: '页面数', languages: '语言数', admin: '管理后台', blog: '博客 / 新闻',
    payments: '在线支付', inventory: '库存管理', rbac: '角色权限',
    integrations: 'API / CRM 集成', mobileApp: '移动应用', seo: 'SEO',
    warranty: '质保', manager: '专属项目经理',
    basic: '基础', advanced: '进阶',
    warranty30: '30 天', warranty90: '90 天', warranty6m: '6 个月', warranty12m: '12 个月',
  },
  ja: {
    pages: 'ページ数', languages: '言語数', admin: '管理画面', blog: 'ブログ / ニュース',
    payments: 'オンライン決済', inventory: '在庫管理', rbac: '権限管理',
    integrations: 'API / CRM 連携', mobileApp: 'モバイルアプリ', seo: 'SEO',
    warranty: '保証', manager: '専任担当者',
    basic: '基本', advanced: '高度',
    warranty30: '30日', warranty90: '90日', warranty6m: '6か月', warranty12m: '12か月',
  },
  ko: {
    pages: '페이지 수', languages: '언어 수', admin: '관리자 페이지', blog: '블로그 / 뉴스',
    payments: '온라인 결제', inventory: '재고 관리', rbac: '역할 기반 접근',
    integrations: 'API / CRM 연동', mobileApp: '모바일 앱', seo: 'SEO',
    warranty: '보증', manager: '전담 매니저',
    basic: '기본', advanced: '고급',
    warranty30: '30일', warranty90: '90일', warranty6m: '6개월', warranty12m: '12개월',
  },
  vi: {
    pages: 'Số trang', languages: 'Số ngôn ngữ', admin: 'Trang quản trị', blog: 'Blog / tin tức',
    payments: 'Thanh toán trực tuyến', inventory: 'Quản lý kho', rbac: 'Phân quyền theo vai trò',
    integrations: 'Tích hợp API / CRM', mobileApp: 'Ứng dụng di động', seo: 'SEO',
    warranty: 'Bảo hành', manager: 'Quản lý dự án riêng',
    basic: 'Cơ bản', advanced: 'Nâng cao',
    warranty30: '30 ngày', warranty90: '90 ngày', warranty6m: '6 tháng', warranty12m: '12 tháng',
  },
};

export default COMPARE_LABELS;
