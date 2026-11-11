import { useI18n } from '@/contexts/I18nContext';
import { LegalContactCard, LegalLayout, LegalList } from '@/components/site/account/LegalLayout';

const TERMS_CONTENT = {
  en: {
    title: 'Terms of Service',
    metaTitle: 'Terms of Service',
    metaDescription: 'Terms of Service for Alievs Space LLC',
    companyName: 'Alievs Space LLC',
    lastUpdatedLabel: 'Last Updated: March',
    intro1:
      'Welcome to Alievs Space LLC. These Terms of Service ("Terms") govern your access to and use of our website, products, and services. By accessing our website or purchasing our services, you agree to be bound by these Terms.',
    intro2: 'If you do not agree with these Terms, please do not use our services.',
    sections: {
      companyInfo: {
        title: '1. Company Information',
        intro:
          'Alievs Space LLC is a digital technology company that provides services including:',
        list: [
          'Website development',
          'Mobile application development',
          'E-commerce solutions',
          'Marketplace development',
          'UI/UX design',
          'Digital consulting',
          'Software development services',
        ],
      },
      eligibility: {
        title: '2. Eligibility',
        intro: 'By using our services, you confirm that:',
        list: [
          'You are at least 18 years old',
          'You have the legal capacity to enter into agreements',
          'You will use our services only for lawful purposes',
        ],
      },
      services: {
        title: '3. Services',
        intro:
          'Alievs Space LLC provides custom digital development services. Each project may have individual agreements including:',
        list: ['scope of work', 'timeline', 'pricing', 'revisions', 'delivery terms'],
        footer:
          'These terms may be defined in project proposals or service agreements.',
      },
      payments: {
        title: '4. Payments',
        intro:
          'All payments for services must be made according to the agreed pricing structure.',
        methodsIntro: 'Payment methods may include:',
        methods: ['Credit / Debit Cards', 'Bank Transfer', 'Payoneer', 'Stripe', 'PayPal'],
        projectPaymentsIntro: 'Projects may require:',
        projectPayments: [
          'upfront deposit',
          'milestone payments',
          'full payment before final delivery',
        ],
        footer:
          'Failure to complete payment may result in suspension of services.',
      },
      clientResponsibilities: {
        title: '5. Client Responsibilities',
        intro: 'Clients agree to:',
        list: [
          'provide accurate project information',
          'respond to project requests promptly',
          'provide required materials such as content, images, branding assets',
          'respect project timelines',
        ],
        footer:
          'Delays from the client side may affect delivery schedules.',
      },
      ip: {
        title: '6. Intellectual Property',
        intro:
          'Upon full payment, ownership of the final delivered project may be transferred to the client unless otherwise specified.',
        intro2: 'However:',
        list: [
          'Alievs Space LLC retains the right to showcase completed projects in portfolios and marketing materials.',
        ],
        footer:
          'Third-party tools, frameworks, or libraries used in the project may have separate licenses.',
      },
      revisions: {
        title: '7. Project Revisions',
        body:
          'Project revisions may be limited depending on the service package. Additional revisions beyond the agreed scope may incur additional fees.',
      },
      limitation: {
        title: '8. Limitation of Liability',
        intro: 'Alievs Space LLC shall not be liable for:',
        list: [
          'indirect or consequential damages',
          'loss of profits or revenue',
          'business interruption',
          'data loss caused by third-party systems',
        ],
        footer:
          'Our liability shall not exceed the total amount paid for the services.',
      },
      termination: {
        title: '9. Termination',
        intro: 'We reserve the right to suspend or terminate services if:',
        list: [
          'terms are violated',
          'illegal activity is suspected',
          'payment obligations are not fulfilled',
        ],
        footer:
          'Clients may terminate services with written notice, subject to refund policy terms.',
      },
      law: {
        title: '10. Governing Law',
        body:
          'These Terms shall be governed and interpreted in accordance with applicable international commercial laws.',
      },
      changes: {
        title: '11. Changes to Terms',
        body:
          'We reserve the right to modify these Terms at any time. Updates will be posted on this page.',
      },
      contact: {
        title: '12. Contact',
        intro: 'For questions regarding these Terms:',
        emailLabel: 'Email:',
        websiteLabel: 'Website:',
      },
    },
  },
  az: {
    title: 'Xidmət Şərtləri',
    metaTitle: 'Xidmət Şərtləri',
    metaDescription: 'Alievs Space MMC üçün xidmət şərtləri',
    companyName: 'Alievs Space MMC',
    lastUpdatedLabel: 'Yenilənmə tarixi: Mart',
    intro1:
      'Alievs Space MMC-yə xoş gəlmisiniz. Bu Xidmət Şərtləri (“Şərtlər”) vebsaytımıza, məhsullarımıza və xidmətlərimizə çıxışınızı və onlardan istifadənizi tənzimləyir. Vebsaytımıza daxil olmaqla və ya xidmətlərimizi satın almaqla bu Şərtlərlə razılaşmış olursunuz.',
    intro2:
      'Əgər bu Şərtlərlə razı deyilsinizsə, xidmətlərimizdən istifadə etməməyiniz xahiş olunur.',
    sections: {
      companyInfo: {
        title: '1. Şirkət haqqında məlumat',
        intro:
          'Alievs Space MMC aşağıdakı xidmətləri göstərən rəqəmsal texnologiya şirkətidir:',
        list: [
          'Vebsaytların hazırlanması',
          'Mobil tətbiqlərin hazırlanması',
          'E-commerce həlləri',
          'Marketplace platformalarının inkişafı',
          'UI/UX dizayn',
          'Rəqəmsal konsaltinq',
          'Proqram təminatı xidmətləri',
        ],
      },
      eligibility: {
        title: '2. Uyğunluq tələbləri',
        intro: 'Xidmətlərimizdən istifadə etməklə təsdiq edirsiniz ki:',
        list: [
          'ən azı 18 yaşınız var',
          'müqavilə bağlamaq üçün hüquqi səlahiyyətə maliksiniz',
          'xidmətlərimizdən yalnız qanuni məqsədlərlə istifadə edəcəksiniz',
        ],
      },
      services: {
        title: '3. Xidmətlər',
        intro:
          'Alievs Space MMC fərdi rəqəmsal inkişaf xidmətləri göstərir. Hər bir layihə üçün ayrıca razılaşmalarda aşağıdakılar müəyyən oluna bilər:',
        list: [
          'işin həcmi',
          'zaman qrafiki',
          'qiymət',
          'dəyişikliklərin (reviziyaların) şərtləri',
          'təslim şərtləri',
        ],
        footer:
          'Bu şərtlər layihə təkliflərində və ya xidmət müqavilələrində müəyyən edilə bilər.',
      },
      payments: {
        title: '4. Ödənişlər',
        intro:
          'Xidmətlər üçün bütün ödənişlər razılaşdırılmış qiymət strukturu əsasında həyata keçirilməlidir.',
        methodsIntro: 'Ödəniş üsulları aşağıdakıları əhatə edə bilər:',
        methods: ['Bank kartları', 'Bank köçürməsi', 'Payoneer', 'Stripe', 'PayPal'],
        projectPaymentsIntro: 'Layihələr üçün aşağıdakı ödəniş strukturu tələb oluna bilər:',
        projectPayments: [
          'ilkin depozit',
          'mərhələ üzrə ödənişlər',
          'yekun təslimdən əvvəl tam ödəniş',
        ],
        footer:
          'Ödənişlərin tam yerinə yetirilməməsi xidmətlərin dayandırılmasına səbəb ola bilər.',
      },
      clientResponsibilities: {
        title: '5. Müştərinin öhdəlikləri',
        intro: 'Müştərilər aşağıdakıları öz üzərlərinə götürürlər:',
        list: [
          'dəqiq layihə məlumatları təqdim etmək',
          'layihə ilə bağlı sorğulara operativ cavab vermək',
          'məzmun, şəkillər, brend materialları kimi zəruri faylları təqdim etmək',
          'layihə qrafikinə riayət etmək',
        ],
        footer:
          'Müştəri tərəfdən gecikmələr layihənin təslim müddətlərinə təsir göstərə bilər.',
      },
      ip: {
        title: '6. Əqli mülkiyyət hüquqları',
        intro:
          'Tam ödəniş edildikdən sonra, başqa cür razılaşdırılmadığı halda, yekun təhvil verilmiş layihənin mülkiyyət hüquqları müştəriyə keçə bilər.',
        intro2: 'Lakin:',
        list: [
          'Alievs Space MMC tamamlanmış layihələri portfelində və marketinq materiallarında nümayiş etdirmək hüququnu saxlayır.',
        ],
        footer:
          'Layihədə istifadə edilən üçüncü tərəf alətləri, frameworklər və kitabxanalar ayrıca lisenziyalara malik ola bilər.',
      },
      revisions: {
        title: '7. Layihə üzrə dəyişikliklər',
        body:
          'Layihə üzrə reviziyalar seçilmiş xidmət paketindən asılı olaraq məhdud ola bilər. Razılaşdırılmış həddi aşan əlavə dəyişikliklər əlavə ödəniş tələb edə bilər.',
      },
      limitation: {
        title: '8. Məsuliyyətin məhdudlaşdırılması',
        intro: 'Alievs Space MMC aşağıdakılara görə məsuliyyət daşımır:',
        list: [
          'dolayı və ya nəticə etibarilə dəyə biləcək ziyanlar',
          'gəlir və ya mənfəət itkisi',
          'biznes fəaliyyətinin dayanması',
          'üçüncü tərəf sistemləri səbəbindən baş verən məlumat itkisi',
        ],
        footer:
          'Bizim məsuliyyətimiz göstərilən xidmətlər üçün ödənilmiş ümumi məbləği aşmır.',
      },
      termination: {
        title: '9. Xidmətlərin dayandırılması',
        intro: 'Aşağıdakı hallarda xidmətləri dayandırmaq və ya ləğv etmək hüququmuz var:',
        list: [
          'şərtlərin pozulması',
          'qanunsuz fəaliyyət şübhəsi',
          'ödəniş öhdəliklərinin yerinə yetirilməməsi',
        ],
        footer:
          'Müştərilər yazılı bildirişlə xidmətləri dayandıra bilər, bu halda geri ödəniş siyasətinin şərtləri tətbiq olunur.',
      },
      law: {
        title: '10. Tətbiq olunan qanunvericilik',
        body:
          'Bu Şərtlər müvafiq beynəlxalq kommersiya qanunvericiliyinə uyğun olaraq tənzimlənir və şərh olunur.',
      },
      changes: {
        title: '11. Şərtlərə dəyişikliklər',
        body:
          'Bu Şərtləri istənilən vaxt yeniləmək hüququnu saxlayırıq. Dəyişikliklər bu səhifədə yayımlanacaq.',
      },
      contact: {
        title: '12. Əlaqə',
        intro: 'Bu Şərtlərlə bağlı suallar üçün:',
        emailLabel: 'E-poçt:',
        websiteLabel: 'Vebsayt:',
      },
    },
  },
  ru: {
    title: 'Условия использования',
    metaTitle: 'Условия использования',
    metaDescription: 'Условия использования услуг компании Alievs Space OOO',
    companyName: 'Alievs Space OOO',
    lastUpdatedLabel: 'Последнее обновление: Март',
    intro1:
      'Добро пожаловать в Alievs Space OOO. Настоящие Условия использования («Условия») регулируют доступ к нашему сайту, продуктам и услугам, а также их использование. Посещая наш сайт или приобретая наши услуги, вы соглашаетесь соблюдать данные Условия.',
    intro2:
      'Если вы не согласны с этими Условиями, пожалуйста, не пользуйтесь нашими услугами.',
    sections: {
      companyInfo: {
        title: '1. Информация о компании',
        intro:
          'Alievs Space OOO — это компания в сфере цифровых технологий, предоставляющая следующие услуги:',
        list: [
          'разработка веб-сайтов',
          'разработка мобильных приложений',
          'e-commerce решения',
          'разработка маркетплейсов',
          'UI/UX дизайн',
          'цифровой консалтинг',
          'услуги по разработке программного обеспечения',
        ],
      },
      eligibility: {
        title: '2. Требования к пользователю',
        intro: 'Используя наши услуги, вы подтверждаете, что:',
        list: [
          'вам не менее 18 лет',
          'вы обладаете правоспособностью заключать договоры',
          'вы будете использовать наши услуги только в законных целях',
        ],
      },
      services: {
        title: '3. Услуги',
        intro:
          'Alievs Space OOO предоставляет услуги по индивидуальной цифровой разработке. Для каждого проекта могут заключаться отдельные соглашения, в которых определяется:',
        list: [
          'объём работ',
          'сроки выполнения',
          'стоимость',
          'условия правок и доработок',
          'условия сдачи проекта',
        ],
        footer:
          'Эти условия могут быть указаны в коммерческих предложениях или договорах на оказание услуг.',
      },
      payments: {
        title: '4. Платежи',
        intro:
          'Все платежи за услуги должны осуществляться в соответствии с согласованной ценой и графиком оплат.',
        methodsIntro: 'Способы оплаты могут включать:',
        methods: ['банковские карты', 'банковский перевод', 'Payoneer', 'Stripe', 'PayPal'],
        projectPaymentsIntro: 'Для проектов могут предусматриваться:',
        projectPayments: [
          'предварительный депозит',
          'промежуточные (этапные) платежи',
          'полная оплата до окончательной сдачи проекта',
        ],
        footer:
          'Невыполнение платёжных обязательств может привести к приостановке оказания услуг.',
      },
      clientResponsibilities: {
        title: '5. Обязанности клиента',
        intro: 'Клиент обязуется:',
        list: [
          'предоставлять точную и актуальную информацию о проекте',
          'оперативно отвечать на запросы по проекту',
          'предоставлять необходимые материалы: тексты, изображения, бренд-гайд и т.д.',
          'соблюдать согласованные сроки и этапы проекта',
        ],
        footer:
          'Задержки со стороны клиента могут повлиять на сроки сдачи проекта.',
      },
      ip: {
        title: '6. Интеллектуальная собственность',
        intro:
          'После полной оплаты права собственности на окончательную версию проекта могут быть переданы клиенту, если иное не предусмотрено договором.',
        intro2: 'Однако:',
        list: [
          'Alievs Space OOO сохраняет право демонстрировать выполненные проекты в портфолио и маркетинговых материалах.',
        ],
        footer:
          'Сторонние инструменты, фреймворки и библиотеки, используемые в проекте, могут иметь собственные лицензии.',
      },
      revisions: {
        title: '7. Правки по проекту',
        body:
          'Количество правок может быть ограничено условиями выбранного пакета услуг. Дополнительные правки сверх оговорённого объёма могут оплачиваться отдельно.',
      },
      limitation: {
        title: '8. Ограничение ответственности',
        intro: 'Компания Alievs Space OOO не несёт ответственности за:',
        list: [
          'косвенный или последующий ущерб',
          'потерю прибыли или дохода',
          'приостановку или прекращение деятельности клиента',
          'потерю данных, вызванную сбоями сторонних систем',
        ],
        footer:
          'Размер нашей ответственности не превышает общей суммы, уплаченной за оказанные услуги.',
      },
      termination: {
        title: '9. Прекращение оказания услуг',
        intro: 'Мы оставляем за собой право приостановить или прекратить оказание услуг, если:',
        list: [
          'имеет место нарушение Условий',
          'подозревается незаконная деятельность',
          'клиент не выполняет платёжные обязательства',
        ],
        footer:
          'Клиент может прекратить использование услуг, направив письменное уведомление, с учётом условий политики возврата средств.',
      },
      law: {
        title: '10. Применимое право',
        body:
          'Настоящие Условия регулируются и толкуются в соответствии с применимым международным коммерческим законодательством.',
      },
      changes: {
        title: '11. Изменения Условий',
        body:
          'Мы вправе в любое время вносить изменения в данные Условия. Обновлённая версия будет опубликована на этой странице.',
      },
      contact: {
        title: '12. Контакты',
        intro: 'По вопросам, связанным с настоящими Условиями, свяжитесь с нами:',
        emailLabel: 'Эл. почта:',
        websiteLabel: 'Веб-сайт:',
      },
    },
  },
} as const;

export function TermsOfService() {
  const { locale, t } = useI18n();
  const currentYear = new Date().getFullYear();

  // Legal texts exist only in en/ru/az; other UI languages read the English version.
  const content = TERMS_CONTENT[locale as keyof typeof TERMS_CONTENT] ?? TERMS_CONTENT.en;
  const s = content.sections;

  return (
    <LegalLayout
      meta={{ title: content.metaTitle, description: content.metaDescription }}
      title={content.title}
      companyName={content.companyName}
      lastUpdated={`${content.lastUpdatedLabel} ${currentYear}`}
      word={t('site.account.legal.words.terms')}
      num="02"
      tone="burnt"
      intro={content.intro1}
      callout={content.intro2}
      sections={[
        {
          id: 'company-information',
          title: s.companyInfo.title,
          body: (
            <>
              <p>{s.companyInfo.intro}</p>
              <LegalList items={s.companyInfo.list} />
            </>
          ),
        },
        {
          id: 'eligibility',
          title: s.eligibility.title,
          body: (
            <>
              <p>{s.eligibility.intro}</p>
              <LegalList items={s.eligibility.list} />
            </>
          ),
        },
        {
          id: 'services',
          title: s.services.title,
          body: (
            <>
              <p>{s.services.intro}</p>
              <LegalList items={s.services.list} />
              <p>{s.services.footer}</p>
            </>
          ),
        },
        {
          id: 'payments',
          title: s.payments.title,
          body: (
            <>
              <p>{s.payments.intro}</p>
              <p>{s.payments.methodsIntro}</p>
              <LegalList items={s.payments.methods} />
              <p>{s.payments.projectPaymentsIntro}</p>
              <LegalList items={s.payments.projectPayments} />
              <p>{s.payments.footer}</p>
            </>
          ),
        },
        {
          id: 'client-responsibilities',
          title: s.clientResponsibilities.title,
          body: (
            <>
              <p>{s.clientResponsibilities.intro}</p>
              <LegalList items={s.clientResponsibilities.list} />
              <p>{s.clientResponsibilities.footer}</p>
            </>
          ),
        },
        {
          id: 'intellectual-property',
          title: s.ip.title,
          body: (
            <>
              <p>{s.ip.intro}</p>
              <p>{s.ip.intro2}</p>
              <LegalList items={s.ip.list} />
              <p>{s.ip.footer}</p>
            </>
          ),
        },
        { id: 'revisions', title: s.revisions.title, body: <p>{s.revisions.body}</p> },
        {
          id: 'limitation-of-liability',
          title: s.limitation.title,
          body: (
            <>
              <p>{s.limitation.intro}</p>
              <LegalList items={s.limitation.list} />
              <p>{s.limitation.footer}</p>
            </>
          ),
        },
        {
          id: 'termination',
          title: s.termination.title,
          body: (
            <>
              <p>{s.termination.intro}</p>
              <LegalList items={s.termination.list} />
              <p>{s.termination.footer}</p>
            </>
          ),
        },
        { id: 'governing-law', title: s.law.title, body: <p>{s.law.body}</p> },
        { id: 'changes', title: s.changes.title, body: <p>{s.changes.body}</p> },
        {
          id: 'contact',
          title: s.contact.title,
          body: (
            <>
              <p>{s.contact.intro}</p>
              <LegalContactCard companyName={content.companyName} emailLabel={s.contact.emailLabel} websiteLabel={s.contact.websiteLabel} />
            </>
          ),
        },
      ]}
    />
  );
}
