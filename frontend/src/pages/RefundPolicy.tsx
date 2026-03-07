import Container from '../components/ui/Container';
import { useI18n } from '@/contexts/I18nContext';
import { Helmet } from 'react-helmet-async';

const REFUND_CONTENT = {
  en: {
    title: 'Refund Policy',
    metaTitle: 'Refund Policy',
    metaDescription: 'Refund Policy for Alievs Space LLC',
    companyName: 'Alievs Space LLC',
    lastUpdatedLabel: 'Last Updated: March',
    intro:
      'At Alievs Space LLC, we aim to provide high-quality digital services. This Refund Policy outlines the conditions under which refunds may be issued.',
    sections: {
      nature: {
        title: '1. Digital Service Nature',
        body:
          'Our services involve custom digital development, including websites, applications, and software solutions. Because of the nature of digital work, refunds may be limited once work has begun.',
      },
      deposits: {
        title: '2. Deposit Payments',
        body:
          'Initial deposits used to begin a project are generally non-refundable, as they cover project planning, design, and development preparation.',
      },
      eligibility: {
        title: '3. Refund Eligibility',
        intro: 'Refunds may be issued in the following situations:',
        list: [
          'Project has not started yet',
          'Service cannot be delivered due to internal reasons',
          'Mutual cancellation agreement between the client and company',
        ],
      },
      partial: {
        title: '4. Partial Refunds',
        intro:
          'If a project has already started, partial refunds may be considered depending on:',
        list: ['amount of completed work', 'project phase', 'resources already invested'],
      },
      nonRefundable: {
        title: '5. Non-Refundable Situations',
        intro: 'Refunds will not be issued if:',
        list: [
          'work has been delivered according to the agreement',
          'delays are caused by the client',
          'the client changes project requirements significantly',
          'the client fails to respond during development',
        ],
      },
      disputes: {
        title: '6. Payment Disputes',
        body:
          'Clients agree to contact Alievs Space LLC before initiating payment disputes with payment providers. We aim to resolve issues professionally and fairly.',
      },
      processing: {
        title: '7. Refund Processing',
        body:
          'Approved refunds will be processed through the original payment method within 5–14 business days, depending on the payment provider.',
      },
      contact: {
        title: '8. Contact',
        intro: 'For refund requests:',
        emailLabel: 'Email:',
        websiteLabel: 'Website:',
      },
    },
  },
  az: {
    title: 'Geri Ödəniş Siyasəti',
    metaTitle: 'Geri Ödəniş Siyasəti',
    metaDescription: 'Alievs Space MMC üçün geri ödəniş siyasəti',
    companyName: 'Alievs Space MMC',
    lastUpdatedLabel: 'Yenilənmə tarixi: Mart',
    intro:
      'Alievs Space MMC olaraq yüksək keyfiyyətli rəqəmsal xidmətlər təqdim etməyi hədəfləyirik. Bu Geri Ödəniş Siyasəti hansı hallarda geri ödənişlərin həyata keçirilə biləcəyini izah edir.',
    sections: {
      nature: {
        title: '1. Rəqəmsal xidmətlərin mahiyyəti',
        body:
          'Xidmətlərimizə vebsaytlar, tətbiqlər və proqram həlləri daxil olmaqla fərdi rəqəmsal inkişaf daxildir. Rəqəmsal işlərin təbiətinə görə, layihə başladıqdans sonra geri ödənişlər məhdud ola bilər.',
      },
      deposits: {
        title: '2. Depozit ödənişləri',
        body:
          'Layihəyə başlamaq üçün edilən ilkin depozitlər adətən geri qaytarılmır, çünki onlar layihənin planlaşdırılması, dizaynı və hazırlanması üçün istifadə olunur.',
      },
      eligibility: {
        title: '3. Geri ödənişə uyğun hallar',
        intro: 'Aşağıdakı hallarda geri ödəniş mümkündür:',
        list: [
          'layihəyə hələ başlanmayıbsa',
          'xidmət daxili səbəblərə görə təqdim edilə bilmirsə',
          'müştəri və şirkət arasında qarşılıqlı ləğv razılaşması olduqda',
        ],
      },
      partial: {
        title: '4. Qismən geri ödənişlər',
        intro:
          'Layihə artıq başlamışdırsa, qismən geri ödənişlər aşağıdakılardan asılı olaraq nəzərdən keçirilə bilər:',
        list: [
          'yerinə yetirilmiş işin miqdarı',
          'layihənin mərhələsi',
          'artıq sərf olunmuş resurslar',
        ],
      },
      nonRefundable: {
        title: '5. Geri ödənilməyən hallar',
        intro: 'Aşağıdakı situasiyalarda geri ödənişlər həyata keçirilmir:',
        list: [
          'iş razılaşmaya uyğun olaraq təhvil verilibsə',
          'gecikmələr müştəri səbəbindən yaranıbsa',
          'müştəri layihə tələblərini əhəmiyyətli dərəcədə dəyişdirirsə',
          'inkişaf zamanı müştəri uzun müddət ərzində cavab vermirsə',
        ],
      },
      disputes: {
        title: '6. Ödəniş mübahisələri',
        body:
          'Müştərilər ödəniş provayderləri ilə mübahisə qaldırmadan əvvəl Alievs Space MMC ilə əlaqə saxlayacaqlarına razılaşırlar. Biz məsələləri peşəkar və ədalətli şəkildə həll etməyə çalışırıq.',
      },
      processing: {
        title: '7. Geri ödənişlərin emalı',
        body:
          'Təsdiq edilmiş geri ödənişlər ödəniş provayderindən asılı olaraq 5–14 iş günü ərzində ilkin ödəniş üsulu ilə geri qaytarılacaq.',
      },
      contact: {
        title: '8. Əlaqə',
        intro: 'Geri ödəniş tələbləri üçün:',
        emailLabel: 'E-poçt:',
        websiteLabel: 'Vebsayt:',
      },
    },
  },
  ru: {
    title: 'Политика возврата средств',
    metaTitle: 'Политика возврата',
    metaDescription: 'Политика возврата средств компании Alievs Space OOO',
    companyName: 'Alievs Space OOO',
    lastUpdatedLabel: 'Последнее обновление: Март',
    intro:
      'В компании Alievs Space OOO мы стремимся предоставлять услуги высокого качества. Настоящая Политика возврата средств описывает условия, при которых возможен возврат.',
    sections: {
      nature: {
        title: '1. Особенности цифровых услуг',
        body:
          'Наши услуги включают индивидуальную разработку цифровых решений: веб-сайты, приложения и программное обеспечение. В связи с природой цифровых продуктов возможность возврата средств может быть ограничена после начала работ.',
      },
      deposits: {
        title: '2. Депозитные платежи',
        body:
          'Начальные депозиты, необходимые для старта проекта, как правило, не подлежат возврату, так как покрывают планирование проекта, дизайн и подготовительные работы по разработке.',
      },
      eligibility: {
        title: '3. Условия для возврата средств',
        intro: 'Возврат средств возможен в следующих случаях:',
        list: [
          'проект ещё не был запущен',
          'услуга не может быть оказана по внутренним причинам компании',
          'клиент и компания достигли взаимного соглашения о расторжении проекта',
        ],
      },
      partial: {
        title: '4. Частичный возврат',
        intro:
          'Если работа над проектом уже началась, частичный возврат может быть рассмотрен в зависимости от:',
        list: [
          'объёма выполненной работы',
          'текущего этапа проекта',
          'уже затраченных ресурсов',
        ],
      },
      nonRefundable: {
        title: '5. Случаи, когда возврат невозможен',
        intro: 'Возврат средств не производится, если:',
        list: [
          'работа выполнена и передана в соответствии с соглашением',
          'задержки вызваны действиями или бездействием клиента',
          'клиент существенно меняет требования к проекту',
          'клиент не отвечает в процессе разработки в течение длительного времени',
        ],
      },
      disputes: {
        title: '6. Платёжные споры',
        body:
          'Клиенты соглашаются сначала связаться с Alievs Space OOO до инициирования платёжных споров через платёжные системы. Мы стремимся решать вопросы профессионально и справедливо.',
      },
      processing: {
        title: '7. Обработка возврата средств',
        body:
          'Одобренные возвраты средств обрабатываются через исходный способ оплаты в течение 5–14 рабочих дней, в зависимости от платёжного провайдера.',
      },
      contact: {
        title: '8. Контакты',
        intro: 'По вопросам, связанным с возвратом средств:',
        emailLabel: 'Эл. почта:',
        websiteLabel: 'Веб-сайт:',
      },
    },
  },
} as const;

export function RefundPolicy() {
  const { locale } = useI18n();
  const currentYear = new Date().getFullYear();

  const content = REFUND_CONTENT[locale];

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
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.nature.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">{content.sections.nature.body}</p>
              </div>

              <hr className="border-[#333368]" />

              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.deposits.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">{content.sections.deposits.body}</p>
              </div>

              <hr className="border-[#333368]" />
              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.eligibility.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.eligibility.intro}</p>
                <ul className="list-disc pl-6 space-y-1">
                  {content.sections.eligibility.list.map((item) => (
                    <li key={item} className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <hr className="border-[#333368]" />
              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.partial.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.partial.intro}</p>
                <ul className="list-disc pl-6 space-y-1">
                  {content.sections.partial.list.map((item) => (
                    <li key={item} className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <hr className="border-[#333368]" />
              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.nonRefundable.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px] mb-2">{content.sections.nonRefundable.intro}</p>
                <ul className="list-disc pl-6 space-y-1">
                  {content.sections.nonRefundable.list.map((item) => (
                    <li key={item} className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <hr className="border-[#333368]" />
              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.disputes.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">{content.sections.disputes.body}</p>
              </div>

              <hr className="border-[#333368]" />
              <div>
                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-3">{content.sections.processing.title}</h3>
                <p className="font-inter text-[#C5C5C5] text-[14px] md:text-[16px]">{content.sections.processing.body}</p>
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