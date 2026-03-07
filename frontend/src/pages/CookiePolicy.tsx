import Container from '../components/ui/Container';
import { useI18n } from '@/contexts/I18nContext';
import { Helmet } from 'react-helmet-async';

const COOKIE_CONTENT = {
  en: {
    title: 'Cookie Policy',
    metaTitle: 'Cookie Policy',
    metaDescription: 'Cookie Policy for Alievs Space LLC',
    companyName: 'Alievs Space LLC',
    lastUpdatedLabel: 'Last Updated: March',
    intro:
      'This Cookie Policy explains how Alievs Space LLC uses cookies and similar technologies when you visit our website.',
    sections: {
      whatAreCookies: {
        title: '1. What Are Cookies',
        body:
          'Cookies are small text files stored on your device when you visit a website. They help improve user experience and website performance.',
      },
      types: {
        title: '2. Types of Cookies We Use',
        essentialTitle: 'Essential Cookies',
        essentialBody: 'These cookies are required for the website to function properly.',
        essentialExamplesLabel: 'Examples:',
        essentialExamples: ['login sessions', 'security authentication', 'form submissions'],
        analyticsTitle: 'Analytics Cookies',
        analyticsBody: 'These cookies help us understand how visitors interact with the website.',
        analyticsExamplesLabel: 'Examples:',
        analyticsExamples: ['Google Analytics', 'traffic statistics', 'user behavior analysis'],
        marketingTitle: 'Marketing Cookies',
        marketingBody:
          'Marketing cookies help deliver relevant advertisements and track marketing performance.',
        marketingExamplesLabel: 'Examples:',
        marketingExamples: ['Meta Pixel', 'Google Ads tracking', 'remarketing systems'],
      },
      thirdParty: {
        title: '3. Third-Party Cookies',
        body:
          'Some cookies may be placed by third-party services integrated into our website such as:',
        list: ['Google', 'Meta (Facebook)', 'analytics platforms', 'payment providers'],
        footer:
          'These services may collect data according to their own privacy policies.',
      },
      managing: {
        title: '4. Managing Cookies',
        body: 'You can control or disable cookies through your browser settings.',
        body2: 'Most browsers allow you to:',
        list: ['block cookies', 'delete stored cookies', 'receive alerts when cookies are used'],
        footer: 'Disabling cookies may affect website functionality.',
      },
      updates: {
        title: '5. Updates to This Policy',
        body:
          'We may update this Cookie Policy periodically to reflect changes in technology or legal requirements.',
      },
      contact: {
        title: '6. Contact',
        body: 'For questions about cookies or data usage:',
        emailLabel: 'Email:',
        websiteLabel: 'Website:',
      },
    },
  },
  az: {
    title: 'Kuki Siyasəti',
    metaTitle: 'Kuki Siyasəti',
    metaDescription: 'Alievs Space MMC üçün kuki siyasəti',
    companyName: 'Alievs Space MMC',
    lastUpdatedLabel: 'Yenilənmə tarixi: Mart',
    intro:
      'Bu Kuki Siyasəti Alievs Space MMC-nin vebsaytımıza daxil olduğunuz zaman kukilərdən və oxşar texnologiyalardan necə istifadə etdiyini izah edir.',
    sections: {
      whatAreCookies: {
        title: '1. Kuki nədir?',
        body:
          'Kukilər vebsayta daxil olduğunuz zaman cihazınızda saxlanılan kiçik mətn fayllarıdır. Onlar istifadəçi təcrübəsini və saytın ümumi fəaliyyətini yaxşılaşdırmağa kömək edir.',
      },
      types: {
        title: '2. İstifadə etdiyimiz kuki növləri',
        essentialTitle: 'Zəruri kukilər',
        essentialBody:
          'Bu kukilər saytın düzgün işləməsi üçün mütləq vacibdir.',
        essentialExamplesLabel: 'Nümunələr:',
        essentialExamples: ['giriş sessiyaları', 'təhlükəsizlik autentifikasiyası', 'formların göndərilməsi'],
        analyticsTitle: 'Analitik kukilər',
        analyticsBody:
          'Bu kukilər ziyarətçilərin vebsaytdan necə istifadə etdiyini başa düşməyimizə kömək edir.',
        analyticsExamplesLabel: 'Nümunələr:',
        analyticsExamples: ['Google Analytics', 'trafik statistikası', 'istifadəçi davranışının analizi'],
        marketingTitle: 'Marketinq kukiləri',
        marketingBody:
          'Marketinq kukiləri uyğun reklamların göstərilməsinə və marketinq kampaniyalarının effektivliyinin ölçülməsinə kömək edir.',
        marketingExamplesLabel: 'Nümunələr:',
        marketingExamples: ['Meta Pixel', 'Google Ads izləmə', 'remarketinq sistemləri'],
      },
      thirdParty: {
        title: '3. Üçüncü tərəf kukiləri',
        body:
          'Bəzi kukilər vebsaytımıza inteqrasiya olunmuş üçüncü tərəf xidmətləri tərəfindən yerləşdirilə bilər, məsələn:',
        list: ['Google', 'Meta (Facebook)', 'analitika platformaları', 'ödəniş provayderləri'],
        footer:
          'Bu xidmətlər şəxsi məlumatları öz məxfilik siyasətlərinə uyğun şəkildə toplaya bilər.',
      },
      managing: {
        title: '4. Kukilərin idarə edilməsi',
        body: 'Kukiləri brauzerinizin tənzimləmələri vasitəsilə idarə edə və ya söndürə bilərsiniz.',
        body2: 'Əksər brauzerlər sizə aşağıdakıları etməyə imkan verir:',
        list: [
          'kukilərin bloklanması',
          'saxlanılan kukilərin silinməsi',
          'kukilər istifadə olunanda bildirişlərin alınması',
        ],
        footer:
          'Kukilərin söndürülməsi vebsaytın funksionallığına mənfi təsir göstərə bilər.',
      },
      updates: {
        title: '5. Bu siyasətə dəyişikliklər',
        body:
          'Texnologiyadakı və ya hüquqi tələblərdəki dəyişiklikləri əks etdirmək üçün bu Kuki Siyasətini vaxtaşırı yeniləyə bilərik.',
      },
      contact: {
        title: '6. Əlaqə',
        body: 'Kukilər və ya məlumatlardan istifadə ilə bağlı suallar üçün:',
        emailLabel: 'E-poçt:',
        websiteLabel: 'Vebsayt:',
      },
    },
  },
  ru: {
    title: 'Политика использования файлов cookie',
    metaTitle: 'Политика cookie',
    metaDescription: 'Политика использования файлов cookie компании Alievs Space OOO',
    companyName: 'Alievs Space OOO',
    lastUpdatedLabel: 'Последнее обновление: Март',
    intro:
      'Настоящая Политика использования файлов cookie объясняет, как Alievs Space OOO использует файлы cookie и аналогичные технологии при посещении нашего сайта.',
    sections: {
      whatAreCookies: {
        title: '1. Что такое файлы cookie',
        body:
          'Файлы cookie — это небольшие текстовые файлы, которые сохраняются на вашем устройстве при посещении сайта. Они помогают улучшать работу сайта и ваш пользовательский опыт.',
      },
      types: {
        title: '2. Типы файлов cookie, которые мы используем',
        essentialTitle: 'Обязательные файлы cookie',
        essentialBody:
          'Эти файлы cookie необходимы для корректной работы сайта.',
        essentialExamplesLabel: 'Примеры:',
        essentialExamples: ['сеансы входа', 'проверка безопасности', 'отправка форм'],
        analyticsTitle: 'Аналитические файлы cookie',
        analyticsBody:
          'Эти файлы cookie помогают нам понять, как посетители взаимодействуют с сайтом.',
        analyticsExamplesLabel: 'Примеры:',
        analyticsExamples: ['Google Analytics', 'статистика трафика', 'анализ поведения пользователей'],
        marketingTitle: 'Маркетинговые файлы cookie',
        marketingBody:
          'Маркетинговые файлы cookie помогают показывать релевантную рекламу и измерять эффективность кампаний.',
        marketingExamplesLabel: 'Примеры:',
        marketingExamples: ['Meta Pixel', 'отслеживание Google Ads', 'системы ремаркетинга'],
      },
      thirdParty: {
        title: '3. Файлы cookie третьих лиц',
        body:
          'Некоторые файлы cookie могут устанавливаться сторонними сервисами, интегрированными в наш сайт, например:',
        list: ['Google', 'Meta (Facebook)', 'аналитические платформы', 'платёжные провайдеры'],
        footer:
          'Эти сервисы могут собирать данные в соответствии со своими собственными политиками конфиденциальности.',
      },
      managing: {
        title: '4. Управление файлами cookie',
        body: 'Вы можете управлять или отключать файлы cookie в настройках браузера.',
        body2: 'Большинство браузеров позволяют вам:',
        list: [
          'блокировать файлы cookie',
          'удалять сохранённые файлы cookie',
          'получать уведомления при использовании файлов cookie',
        ],
        footer:
          'Отключение файлов cookie может повлиять на корректную работу сайта.',
      },
      updates: {
        title: '5. Обновления настоящей политики',
        body:
          'Мы можем периодически обновлять настоящую Политику cookie, чтобы учитывать изменения технологий или требований законодательства.',
      },
      contact: {
        title: '6. Контакты',
        body: 'По вопросам, связанным с файлами cookie или использованием данных:',
        emailLabel: 'Эл. почта:',
        websiteLabel: 'Веб-сайт:',
      },
    },
  },
} as const;

export function CookiePolicy() {
  const { locale } = useI18n();
  const currentYear = new Date().getFullYear();

  const content = COOKIE_CONTENT[locale];

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
            <p className="font-inter text-[#C5C5C5] text-[16px] md:text-[18px] leading-relaxed mb-8 border-l-4 border-[#133FA6] pl-4">
              {content.intro}
            </p>
            <div className="space-y-8">
              
              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.whatAreCookies.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">{content.sections.whatAreCookies.body}</p>
              </div>

              <hr className="border-[#333368]" />

              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.types.title}</h3>

                <h4 className="font-inter text-white text-[18px] md:text-[20px] font-semibold mt-4 mb-2">{content.sections.types.essentialTitle}</h4>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.types.essentialBody}</p>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.types.essentialExamplesLabel}</p>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                  {content.sections.types.essentialExamples.map((item) => (
                    <li key={item} className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">
                      {item}
                    </li>
                  ))}
                </ul>

                <h4 className="font-inter text-white text-[18px] md:text-[20px] font-semibold mt-4 mb-2">{content.sections.types.analyticsTitle}</h4>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.types.analyticsBody}</p>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.types.analyticsExamplesLabel}</p>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                  {content.sections.types.analyticsExamples.map((item) => (
                    <li key={item} className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">
                      {item}
                    </li>
                  ))}
                </ul>

                <h4 className="font-inter text-white text-[18px] md:text-[20px] font-semibold mt-4 mb-2">{content.sections.types.marketingTitle}</h4>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.types.marketingBody}</p>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.types.marketingExamplesLabel}</p>
                <ul className="list-disc pl-6 space-y-1">
                  {content.sections.types.marketingExamples.map((item) => (
                    <li key={item} className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <hr className="border-[#333368]" />

              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.thirdParty.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.thirdParty.body}</p>
                <ul className="list-disc pl-6 space-y-1">
                  {content.sections.thirdParty.list.map((item) => (
                    <li key={item} className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mt-2">{content.sections.thirdParty.footer}</p>
              </div>

              <hr className="border-[#333368]" />

              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.managing.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.managing.body}</p>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.managing.body2}</p>
                <ul className="list-disc pl-6 space-y-1">
                  {content.sections.managing.list.map((item) => (
                    <li key={item} className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mt-2">{content.sections.managing.footer}</p>
              </div>

              <hr className="border-[#333368]" />

              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.updates.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">{content.sections.updates.body}</p>
              </div>

              <hr className="border-[#333368]" />

              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.contact.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.contact.body}</p>
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