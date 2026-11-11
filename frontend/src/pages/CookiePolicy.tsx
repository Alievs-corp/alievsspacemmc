import { useI18n } from '@/contexts/I18nContext';
import { LegalContactCard, LegalLayout, LegalList } from '@/components/site/account/LegalLayout';

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
  const { locale, t } = useI18n();
  const currentYear = new Date().getFullYear();

  // Legal texts exist only in en/ru/az; other UI languages read the English version.
  const content = COOKIE_CONTENT[locale as keyof typeof COOKIE_CONTENT] ?? COOKIE_CONTENT.en;
  const s = content.sections;

  return (
    <LegalLayout
      meta={{ title: content.metaTitle, description: content.metaDescription }}
      title={content.title}
      companyName={content.companyName}
      lastUpdated={`${content.lastUpdatedLabel} ${currentYear}`}
      word={t('site.account.legal.words.cookie')}
      num="04"
      tone="rust"
      callout={content.intro}
      sections={[
        { id: 'what-are-cookies', title: s.whatAreCookies.title, body: <p>{s.whatAreCookies.body}</p> },
        {
          id: 'types-of-cookies',
          title: s.types.title,
          body: (
            <>
              <h3>{s.types.essentialTitle}</h3>
              <p>{s.types.essentialBody}</p>
              <p>{s.types.essentialExamplesLabel}</p>
              <LegalList items={s.types.essentialExamples} />
              <h3>{s.types.analyticsTitle}</h3>
              <p>{s.types.analyticsBody}</p>
              <p>{s.types.analyticsExamplesLabel}</p>
              <LegalList items={s.types.analyticsExamples} />
              <h3>{s.types.marketingTitle}</h3>
              <p>{s.types.marketingBody}</p>
              <p>{s.types.marketingExamplesLabel}</p>
              <LegalList items={s.types.marketingExamples} />
            </>
          ),
        },
        {
          id: 'third-party-cookies',
          title: s.thirdParty.title,
          body: (
            <>
              <p>{s.thirdParty.body}</p>
              <LegalList items={s.thirdParty.list} />
              <p>{s.thirdParty.footer}</p>
            </>
          ),
        },
        {
          id: 'managing-cookies',
          title: s.managing.title,
          body: (
            <>
              <p>{s.managing.body}</p>
              <p>{s.managing.body2}</p>
              <LegalList items={s.managing.list} />
              <p>{s.managing.footer}</p>
            </>
          ),
        },
        { id: 'updates', title: s.updates.title, body: <p>{s.updates.body}</p> },
        {
          id: 'contact',
          title: s.contact.title,
          body: (
            <>
              <p>{s.contact.body}</p>
              <LegalContactCard companyName={content.companyName} emailLabel={s.contact.emailLabel} websiteLabel={s.contact.websiteLabel} />
            </>
          ),
        },
      ]}
    />
  );
}
