import Container from '../components/ui/Container';
import { useI18n } from '@/contexts/I18nContext';
import { Helmet } from 'react-helmet-async';

const PRIVACY_CONTENT = {
  en: {
    title: 'Privacy Policy',
    metaTitle: 'Privacy Policy',
    metaDescription: 'Privacy Policy for Alievs Space LLC',
    companyName: 'Alievs Space LLC',
    lastUpdatedLabel: 'Last Updated: March',
    intro1:
      'Alievs Space LLC (“Company”, “we”, “our”, or “us”) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us.',
    intro2:
      'By accessing our website or using our services, you agree to the terms described in this Privacy Policy.',
    sections: {
      infoWeCollect: {
        title: '1. Information We Collect',
        intro:
          'We may collect several types of information from users of our website and services.',
        personalTitle: '1.1 Personal Information',
        personalIntro:
          'When you contact us, create an account, or purchase services, we may collect:',
        personalList: [
          'Full name',
          'Email address',
          'Phone number',
          'Company name',
          'Billing information',
          'Payment details',
          'Project requirements or business information',
        ],
        technicalTitle: '1.2 Technical Information',
        technicalIntro: 'When you visit our website, we may automatically collect:',
        technicalList: [
          'IP address',
          'Browser type',
          'Device information',
          'Operating system',
          'Pages visited',
          'Date and time of visits',
          'Referring websites',
        ],
        cookiesTitle: '1.3 Cookies and Tracking Data',
        cookiesIntro: 'We use cookies and similar technologies to:',
        cookiesList: [
          'improve user experience',
          'analyze website traffic',
          'remember user preferences',
          'optimize marketing campaigns',
        ],
        cookiesFooter: 'You may disable cookies in your browser settings.',
      },
      howWeUse: {
        title: '2. How We Use Your Information',
        intro: 'We use the collected information for the following purposes:',
        list: [
          'To provide web development and digital services',
          'To process payments and invoices',
          'To communicate with clients',
          'To respond to inquiries and support requests',
          'To improve our website and services',
          'To analyze website performance',
          'To prevent fraud and maintain security',
          'To comply with legal obligations',
        ],
      },
      sharing: {
        title: '3. Sharing Your Information',
        intro1: 'We do not sell your personal information.',
        intro2: 'However, we may share information with trusted third parties such as:',
        list: [
          'Payment processors (Stripe, Payoneer, PayPal, etc.)',
          'Hosting providers',
          'Cloud storage providers',
          'Marketing and analytics platforms',
          'Legal authorities when required by law',
        ],
        footer: 'These partners are obligated to protect your information.',
      },
      security: {
        title: '4. Data Security',
        intro:
          'We implement appropriate technical and organizational measures to protect your information, including:',
        list: ['SSL encryption', 'Secure servers', 'Access restrictions', 'Data monitoring systems'],
        footer:
          'However, no internet transmission or storage system can be guaranteed to be 100% secure.',
      },
      retention: {
        title: '5. Data Retention',
        intro: 'We retain personal information only for as long as necessary to:',
        list: ['provide services', 'comply with legal obligations', 'resolve disputes', 'enforce agreements'],
        footer: 'When information is no longer needed, it will be securely deleted.',
      },
      rights: {
        title: '6. Your Privacy Rights',
        intro: 'Depending on your location, you may have the right to:',
        list: [
          'Access your personal information',
          'Request correction of inaccurate data',
          'Request deletion of your data',
          'Restrict processing of your data',
          'Object to data processing',
          'Request data portability',
        ],
        footer: 'To exercise these rights, contact us using the information below.',
      },
      gdpr: {
        title: '7. GDPR Compliance (For European Users)',
        intro:
          'If you are located in the European Economic Area (EEA), your personal data is processed based on:',
        list: ['your consent', 'contractual necessity', 'legal obligations', 'legitimate business interests'],
        footer:
          'You have the right to lodge a complaint with a data protection authority.',
      },
      ccpa: {
        title: '8. CCPA Privacy Rights (California Residents)',
        intro: 'If you are a California resident, you have the right to:',
        list: [
          'know what personal data we collect',
          'request deletion of personal data',
          'request disclosure of data sharing practices',
        ],
        footer: 'We do not sell personal data to third parties.',
      },
      thirdPartyLinks: {
        title: '9. Third-Party Links',
        body:
          'Our website may contain links to third-party websites. We are not responsible for the privacy practices of those external websites.',
      },
      children: {
        title: '10. Children’s Privacy',
        body:
          'Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children.',
      },
      changes: {
        title: '11. Changes to This Privacy Policy',
        body:
          'We may update this Privacy Policy from time to time. Any updates will be posted on this page with a revised “Last Updated” date.',
      },
      contact: {
        title: '12. Contact Information',
        intro:
          'If you have questions about this Privacy Policy or our data practices, please contact us:',
        emailLabel: 'Email:',
        websiteLabel: 'Website:',
      },
    },
  },
  az: {
    title: 'Məxfilik Siyasəti',
    metaTitle: 'Məxfilik Siyasəti',
    metaDescription: 'Alievs Space MMC üçün məxfilik siyasəti',
    companyName: 'Alievs Space MMC',
    lastUpdatedLabel: 'Yenilənmə tarixi: Mart',
    intro1:
      'Alievs Space MMC (“Şirkət”, “biz”, “bizim”) sizin məxfiliyinizə hörmət edir və şəxsi məlumatlarınızın qorunmasına sadiqdir. Bu Məxfilik Siyasəti vebsaytımıza daxil olduğunuz, xidmətlərimizdən istifadə etdiyiniz və ya bizimlə əlaqə saxladığınız zaman məlumatlarınızın necə toplanması, istifadəsi və qorunmasını izah edir.',
    intro2:
      'Vebsaytımıza daxil olmaqla və ya xidmətlərimizdən istifadə etməklə bu Məxfilik Siyasətində göstərilən şərtlərlə razı olduğunuzu təsdiq edirsiniz.',
    sections: {
      infoWeCollect: {
        title: '1. Topladığımız məlumatlar',
        intro:
          'Vebsaytımızdan və xidmətlərimizdən istifadə edən şəxslərdən bir neçə növ məlumat toplaya bilərik.',
        personalTitle: '1.1 Şəxsi məlumatlar',
        personalIntro:
          'Bizimlə əlaqə saxladığınız, hesab yaratdığınız və ya xidmət aldığınız zaman aşağıdakı məlumatlar tələb oluna bilər:',
        personalList: [
          'Ad və soyad',
          'E-poçt ünvanı',
          'Telefon nömrəsi',
          'Şirkət adı',
          'Hesablaşma məlumatları',
          'Ödəniş məlumatları',
          'Layihə tələbləri və biznes məlumatları',
        ],
        technicalTitle: '1.2 Texniki məlumatlar',
        technicalIntro:
          'Vebsaytımıza daxil olduğunuz zaman avtomatik olaraq aşağıdakı texniki məlumatlar toplanıla bilər:',
        technicalList: [
          'IP ünvanı',
          'Brauzer növü',
          'Cihaz haqqında məlumat',
          'Əməliyyat sistemi',
          'Baxılan səhifələr',
          'Ziyarət tarixi və vaxtı',
          'İstinad olunan vebsaytlar',
        ],
        cookiesTitle: '1.3 Kukilər və izləmə məlumatları',
        cookiesIntro: 'Biz kukilərdən və oxşar texnologiyalardan aşağıdakı məqsədlərlə istifadə edirik:',
        cookiesList: [
          'istifadəçi təcrübəsini yaxşılaşdırmaq',
          'sayt trafikini təhlil etmək',
          'istifadəçi seçimlərini yadda saxlamaq',
          'marketinq kampaniyalarını optimallaşdırmaq',
        ],
        cookiesFooter: 'Kukiləri brauzer tənzimləmələrində deaktiv edə bilərsiniz.',
      },
      howWeUse: {
        title: '2. Məlumatlarınızdan necə istifadə edirik',
        intro: 'Toplanılan məlumatlardan aşağıdakı məqsədlərlə istifadə olunur:',
        list: [
          'Veb inkişafı və rəqəmsal xidmətlərin göstərilməsi',
          'Ödənişlərin və hesabların işlənməsi',
          'Müştərilərlə əlaqə saxlanılması',
          'Sorğulara və dəstək müraciətlərinə cavab verilməsi',
          'Vebsayt və xidmətlərin təkmilləşdirilməsi',
          'Vebsaytın fəaliyyətinin təhlili',
          'Fırıldaqçılığın qarşısının alınması və təhlükəsizliyin təmin edilməsi',
          'Hüquqi öhdəliklərin yerinə yetirilməsi',
        ],
      },
      sharing: {
        title: '3. Məlumatlarınızın paylaşılması',
        intro1: 'Şəxsi məlumatlarınızı satmırıq.',
        intro2:
          'Lakin məlumatlarınız etibarlı üçüncü tərəf tərəfdaşlarla aşağıdakı hallarda paylaşına bilər:',
        list: [
          'Ödəniş sistemləri (Stripe, Payoneer, PayPal və s.)',
          'Hostinq provayderləri',
          'Bulud saxlama xidmətləri',
          'Marketinq və analitika platformaları',
          'Qanunla tələb olunduqda səlahiyyətli orqanlar',
        ],
        footer:
          'Bu tərəfdaşlar məlumatlarınızı qorumaq öhdəliyini daşıyırlar.',
      },
      security: {
        title: '4. Məlumat təhlükəsizliyi',
        intro:
          'Məlumatlarınızı qorumaq üçün aşağıdakı texniki və təşkilati tədbirlər tətbiq edirik:',
        list: [
          'SSL şifrələmə',
          'Təhlükəsiz serverlər',
          'Giriş məhdudiyyətləri',
          'Məlumat monitorinq sistemləri',
        ],
        footer:
          'Bununla belə, internet üzərindən ötürülən və ya saxlanılan məlumatların 100% təhlükəsizliyinə zəmanət vermək mümkün deyil.',
      },
      retention: {
        title: '5. Məlumatların saxlanma müddəti',
        intro:
          'Şəxsi məlumatlar yalnız aşağıdakı məqsədlər üçün tələb olunduğu müddət ərzində saxlanılır:',
        list: [
          'xidmətlərin göstərilməsi',
          'hüquqi öhdəliklərin yerinə yetirilməsi',
          'mübahisələrin həlli',
          'müqavilə şərtlərinə riayət olunması',
        ],
        footer:
          'Məlumatlara ehtiyac qalmadıqda, onlar təhlükəsiz şəkildə silinir.',
      },
      rights: {
        title: '6. Məxfilik hüquqlarınız',
        intro:
          'Sizin yerləşdiyiniz ölkəyə uyğun olaraq aşağıdakı hüquqlara malik ola bilərsiniz:',
        list: [
          'Şəxsi məlumatlarınıza çıxış hüququ',
          'Dəqiq olmayan məlumatların düzəldilməsini tələb etmək hüququ',
          'Məlumatlarınızın silinməsini tələb etmək hüququ',
          'Məlumatların emalının məhdudlaşdırılmasını tələb etmək hüququ',
          'Məlumatların emalına etiraz etmək hüququ',
          'Məlumat daşıma hüququ',
        ],
        footer:
          'Bu hüquqlardan istifadə etmək üçün aşağıdakı əlaqə məlumatlarımız vasitəsilə bizimlə əlaqə saxlayın.',
      },
      gdpr: {
        title: '7. GDPR uyğunluğu (Avropa İstifadəçiləri üçün)',
        intro:
          'Əgər Avropa İqtisadi Zonasında (AİZ) yerləşirsinizsə, şəxsi məlumatlarınız aşağıdakı əsaslarla emal olunur:',
        list: [
          'sizin razılığınız',
          'müqavilənin icrası üçün zərurət',
          'hüquqi öhdəliklər',
          'legitim biznes maraqları',
        ],
        footer:
          'Məlumatların qorunması orqanına şikayət vermək hüququnuz var.',
      },
      ccpa: {
        title: '8. CCPA Məxfilik Hüquqları (Kaliforniya sakinləri üçün)',
        intro:
          'Əgər Kaliforniya ştatının sakinisinizsə, aşağıdakı hüquqlara maliksiniz:',
        list: [
          'topladığımız şəxsi məlumatlar haqqında məlumat almaq',
          'şəxsi məlumatların silinməsini tələb etmək',
          'məlumatların necə paylaşıldığını bilmək',
        ],
        footer: 'Biz şəxsi məlumatları üçüncü tərəflərə satmırıq.',
      },
      thirdPartyLinks: {
        title: '9. Üçüncü tərəf keçidləri',
        body:
          'Vebsaytımızda üçüncü tərəf saytlarına keçidlər ola bilər. Həmin saytların məxfilik siyasətinə görə məsuliyyət daşımırıq.',
      },
      children: {
        title: '10. Uşaqların məxfiliyi',
        body:
          'Xidmətlərimiz 13 yaşdan aşağı şəxslər üçün nəzərdə tutulmamışdır və biz uşaqlardan bilərəkdən şəxsi məlumat toplamırıq.',
      },
      changes: {
        title: '11. Bu Məxfilik Siyasətinə dəyişikliklər',
        body:
          'Bu Məxfilik Siyasəti vaxtaşırı yenilənə bilər. Yeniliklər “Yenilənmə tarixi” qeyd olunmaqla bu səhifədə dərc ediləcək.',
      },
      contact: {
        title: '12. Əlaqə məlumatları',
        intro:
          'Bu Məxfilik Siyasəti və ya məlumatların emalı ilə bağlı suallarınız varsa, bizimlə aşağıdakı vasitə ilə əlaqə saxlayın:',
        emailLabel: 'E-poçt:',
        websiteLabel: 'Vebsayt:',
      },
    },
  },
  ru: {
    title: 'Политика конфиденциальности',
    metaTitle: 'Политика конфиденциальности',
    metaDescription: 'Политика конфиденциальности компании Alievs Space OOO',
    companyName: 'Alievs Space OOO',
    lastUpdatedLabel: 'Последнее обновление: Март',
    intro1:
      'Alievs Space OOO («Компания», «мы», «нас», «наш») уважает вашу конфиденциальность и стремится защищать ваши персональные данные. Настоящая Политика конфиденциальности объясняет, как мы собираем, используем, раскрываем и защищаем вашу информацию при посещении нашего сайта, использовании наших услуг или взаимодействии с нами.',
    intro2:
      'Посещая наш сайт или используя наши услуги, вы соглашаетесь с условиями, изложенными в настоящей Политике конфиденциальности.',
    sections: {
      infoWeCollect: {
        title: '1. Информация, которую мы собираем',
        intro:
          'Мы можем собирать несколько типов информации о пользователях нашего сайта и услуг.',
        personalTitle: '1.1 Персональные данные',
        personalIntro:
          'Когда вы связываетесь с нами, создаёте аккаунт или заказываете услуги, мы можем собирать следующую информацию:',
        personalList: [
          'Фамилия и имя',
          'Адрес электронной почты',
          'Номер телефона',
          'Название компании',
          'Платёжные реквизиты',
          'Платёжная информация',
          'Требования к проекту и бизнес-информация',
        ],
        technicalTitle: '1.2 Техническая информация',
        technicalIntro:
          'При посещении нашего сайта автоматически может собираться следующая техническая информация:',
        technicalList: [
          'IP-адрес',
          'Тип браузера',
          'Информация об устройстве',
          'Операционная система',
          'Просматриваемые страницы',
          'Дата и время посещений',
          'Сайты-источники переходов',
        ],
        cookiesTitle: '1.3 Файлы cookie и технологии отслеживания',
        cookiesIntro:
          'Мы используем файлы cookie и аналогичные технологии для следующих целей:',
        cookiesList: [
          'улучшение пользовательского опыта',
          'анализ трафика сайта',
          'запоминание пользовательских настроек',
          'оптимизация маркетинговых кампаний',
        ],
        cookiesFooter:
          'Вы можете отключить файлы cookie в настройках своего браузера.',
      },
      howWeUse: {
        title: '2. Как мы используем вашу информацию',
        intro: 'Собранная информация используется для следующих целей:',
        list: [
          'Предоставление услуг по веб-разработке и цифровым решениям',
          'Обработка платежей и выставление счетов',
          'Коммуникация с клиентами',
          'Ответы на запросы и обращения в службу поддержки',
          'Улучшение нашего сайта и услуг',
          'Анализ производительности сайта',
          'Предотвращение мошенничества и обеспечение безопасности',
          'Соблюдение юридических обязательств',
        ],
      },
      sharing: {
        title: '3. Передача вашей информации третьим лицам',
        intro1: 'Мы не продаём ваши персональные данные.',
        intro2:
          'Однако мы можем передавать информацию надёжным сторонним организациям, таким как:',
        list: [
          'Платёжные провайдеры (Stripe, Payoneer, PayPal и др.)',
          'Хостинг-провайдеры',
          'Провайдеры облачного хранения данных',
          'Маркетинговые и аналитические платформы',
          'Государственные органы, если это требуется по закону',
        ],
        footer:
          'Эти партнёры обязаны обеспечивать защиту ваших данных.',
      },
      security: {
        title: '4. Безопасность данных',
        intro:
          'Для защиты вашей информации мы применяем соответствующие технические и организационные меры, включая:',
        list: [
          'SSL-шифрование',
          'Защищённые серверы',
          'Ограничение доступа',
          'Системы мониторинга данных',
        ],
        footer:
          'Тем не менее ни одна система передачи или хранения данных через интернет не может быть гарантированно защищена на 100%.',
      },
      retention: {
        title: '5. Срок хранения данных',
        intro:
          'Персональные данные хранятся только в течение периода, необходимого для:',
        list: [
          'предоставления услуг',
          'выполнения юридических обязательств',
          'разрешения споров',
          'исполнения условий договоров',
        ],
        footer:
          'По истечении этого срока данные надёжно удаляются.',
      },
      rights: {
        title: '6. Ваши права в области конфиденциальности',
        intro:
          'В зависимости от вашей юрисдикции вы можете обладать следующими правами:',
        list: [
          'Право на доступ к своим персональным данным',
          'Право требовать исправления неточных данных',
          'Право требовать удаления своих данных',
          'Право ограничить обработку данных',
          'Право возражать против обработки данных',
          'Право на переносимость данных',
        ],
        footer:
          'Для реализации этих прав свяжитесь с нами, используя контакты ниже.',
      },
      gdpr: {
        title: '7. Соответствие GDPR (для пользователей из Европы)',
        intro:
          'Если вы находитесь в Европейской экономической зоне (ЕЭЗ), ваши персональные данные обрабатываются на следующих основаниях:',
        list: [
          'ваше согласие',
          'необходимость исполнения договора',
          'юридические обязательства',
          'законные интересы компании',
        ],
        footer:
          'Вы имеете право подать жалобу в уполномоченный орган по защите данных.',
      },
      ccpa: {
        title: '8. Права на конфиденциальность в соответствии с CCPA (жители Калифорнии)',
        intro:
          'Если вы являетесь жителем штата Калифорния, вы имеете право:',
        list: [
          'знать, какие персональные данные мы собираем',
          'требовать удаления персональных данных',
          'получать информацию о том, как данные передаются третьим лицам',
        ],
        footer: 'Мы не продаём персональные данные третьим лицам.',
      },
      thirdPartyLinks: {
        title: '9. Ссылки на сторонние ресурсы',
        body:
          'Наш сайт может содержать ссылки на сторонние веб-сайты. Мы не несём ответственность за политику конфиденциальности таких ресурсов.',
      },
      children: {
        title: '10. Конфиденциальность детей',
        body:
          'Наши услуги не предназначены для лиц младше 13 лет, и мы сознательно не собираем персональные данные детей.',
      },
      changes: {
        title: '11. Изменения в настоящей Политике конфиденциальности',
        body:
          'Мы можем периодически обновлять настоящую Политику конфиденциальности. Обновления будут публиковаться на этой странице с указанием новой даты «Последнее обновление».',
      },
      contact: {
        title: '12. Контактная информация',
        intro:
          'Если у вас есть вопросы по данной Политике конфиденциальности или по обработке данных, свяжитесь с нами:',
        emailLabel: 'Эл. почта:',
        websiteLabel: 'Веб-сайт:',
      },
    },
  },
} as const;

export function PrivacyPolicy() {
  const { locale } = useI18n();
  const currentYear = new Date().getFullYear();

  const content = PRIVACY_CONTENT[locale];

  return (
    <div className='mt-[60px] flex flex-col justify-center items-center'>
      <Helmet>
        <title>{`${content.metaTitle} | ${content.companyName}`}</title>
        <meta name="description" content={content.metaDescription} />
        <meta property="og:title" content={`${content.metaTitle} | ${content.companyName}`} />
        <meta property="og:description" content={content.metaDescription} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Container className="flex flex-col justify-center items-center mb-12">
        <h2 className="font-inter text-[38px] font-bold text-white">{content.title}</h2>
        <p className="font-inter text-[18px] text-[#C5C5C5] text-center max-w-[800px]">
          {content.companyName}
        </p>
        <p className="font-inter text-[16px] text-[#C5C5C5] text-center max-w-[800px] mt-2">
          {content.lastUpdatedLabel} {currentYear}
        </p>
      </Container>

      <Container className="w-full mb-24">
        <div className="flex flex-col items-center">
          <div className="bg-[#13132F] border-b-[1.7px] border-l-[1.7px] border-white rounded-[10px] p-8 md:p-10 flex flex-col w-full max-w-4xl mx-auto shadow-[0px_10px_20px_0px_#000000] hover:border-[#133FA6] hover:shadow-[0_8px_24px_rgba(19,63,166,0.25)] transition-all duration-300">
            
            <p className="font-inter text-[#C5C5C5] text-[16px] md:text-[18px] leading-relaxed mb-6">
              {content.intro1}
            </p>
            <p className="font-inter text-[#C5C5C5] text-[16px] md:text-[18px] leading-relaxed mb-8 border-l-4 border-[#133FA6] pl-4">
              {content.intro2}
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.infoWeCollect.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.infoWeCollect.intro}</p>
                <h4 className="font-inter text-white text-[18px] md:text-[20px] font-semibold mt-4 mb-2">{content.sections.infoWeCollect.personalTitle}</h4>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.infoWeCollect.personalIntro}</p>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                  {content.sections.infoWeCollect.personalList.map((item) => (
                    <li key={item} className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">
                      {item}
                    </li>
                  ))}
                </ul>

                <h4 className="font-inter text-white text-[18px] md:text-[20px] font-semibold mt-4 mb-2">{content.sections.infoWeCollect.technicalTitle}</h4>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.infoWeCollect.technicalIntro}</p>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                  {content.sections.infoWeCollect.technicalList.map((item) => (
                    <li key={item} className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">
                      {item}
                    </li>
                  ))}
                </ul>

                <h4 className="font-inter text-white text-[18px] md:text-[20px] font-semibold mt-4 mb-2">{content.sections.infoWeCollect.cookiesTitle}</h4>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.infoWeCollect.cookiesIntro}</p>
                <ul className="list-disc pl-6 space-y-1 mb-2">
                  {content.sections.infoWeCollect.cookiesList.map((item) => (
                    <li key={item} className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">{content.sections.infoWeCollect.cookiesFooter}</p>
              </div>

              <hr className="border-[#333368]" /> 

              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.howWeUse.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.howWeUse.intro}</p>
                <ul className="list-disc pl-6 space-y-1">
                  {content.sections.howWeUse.list.map((item) => (
                    <li key={item} className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <hr className="border-[#333368]" />

              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.sharing.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.sharing.intro1}</p>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.sharing.intro2}</p>
                <ul className="list-disc pl-6 space-y-1">
                  {content.sections.sharing.list.map((item) => (
                    <li key={item} className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mt-2">{content.sections.sharing.footer}</p>
              </div>

              <hr className="border-[#333368]" />

              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.security.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.security.intro}</p>
                <ul className="list-disc pl-6 space-y-1">
                  {content.sections.security.list.map((item) => (
                    <li key={item} className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mt-2">{content.sections.security.footer}</p>
              </div>

              <hr className="border-[#333368]" />

              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.retention.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.retention.intro}</p>
                <ul className="list-disc pl-6 space-y-1">
                  {content.sections.retention.list.map((item) => (
                    <li key={item} className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mt-2">{content.sections.retention.footer}</p>
              </div>

              <hr className="border-[#333368]" />

              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.rights.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.rights.intro}</p>
                <ul className="list-disc pl-6 space-y-1">
                  {content.sections.rights.list.map((item) => (
                    <li key={item} className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mt-2">{content.sections.rights.footer}</p>
              </div>

              <hr className="border-[#333368]" />

              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.gdpr.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.gdpr.intro}</p>
                <ul className="list-disc pl-6 space-y-1">
                  {content.sections.gdpr.list.map((item) => (
                    <li key={item} className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mt-2">{content.sections.gdpr.footer}</p>
              </div>

              <hr className="border-[#333368]" />

              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.ccpa.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.ccpa.intro}</p>
                <ul className="list-disc pl-6 space-y-1">
                  {content.sections.ccpa.list.map((item) => (
                    <li key={item} className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mt-2">{content.sections.ccpa.footer}</p>
              </div>

              <hr className="border-[#333368]" />

              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.thirdPartyLinks.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">{content.sections.thirdPartyLinks.body}</p>
              </div>

              <hr className="border-[#333368]" />

              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.children.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">{content.sections.children.body}</p>
              </div>

              <hr className="border-[#333368]" />

              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.changes.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">{content.sections.changes.body}</p>
              </div>

              <hr className="border-[#333368]" />

              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.contact.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.contact.intro}</p>
                <div className="bg-[#0F0F24] p-4 rounded-lg mt-2 border border-[#333368]">
                  <p className="font-inter text-white text-[16px] md:text-[18px] font-semibold">{content.companyName}</p>
                  <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">{content.sections.contact.emailLabel} info@alievsspace.com</p>
                  <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">
                    {content.sections.contact.websiteLabel}{' '}
                    <a
                      href="https://alievsspace.com"
                      className="text-[#4F8DF9] hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://alievsspace.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}