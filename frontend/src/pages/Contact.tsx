import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';
import Container from './../components/ui/Container';
import phone from "../assets/icons/phone.svg";
import mail from "../assets/icons/mail.svg";
import location from "../assets/icons/location.svg";
import { useState, useEffect } from 'react'; 
import { useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { Seo } from '@/components/Seo';
import { phoneForLocale, telHref, whatsappHref } from '@/lib/site';
import { PACKAGE_TIERS } from '@/data/packages';
import { t as translate } from '@/lib/i18n';

/** Service keys used by the "Discuss this service" links on /services. */
const SERVICE_KEYS: Record<string, string> = {
    'web-development': 'public.services.items.web.title',
    ecommerce: 'public.services.items.ecommerce.title',
    'banking-fintech': 'public.services.items.banking.title',
};

/**
 * The package cards link here as /contact?package=business and the service
 * cards as /contact?service=ecommerce; either one seeds the project field so
 * the visitor does not have to retype what they just clicked.
 */
function initialProjectOverview(packageId: string | null, serviceId: string | null): string {
    if (packageId) {
        const tier = PACKAGE_TIERS.find((p) => p.id === packageId);
        if (tier) {
            return `${translate('packages.title')} — ${translate(`packages.tiers.${tier.id}.name`)}`;
        }
    }
    if (serviceId && SERVICE_KEYS[serviceId]) {
        return translate(SERVICE_KEYS[serviceId]);
    }
    return '';
}

const Contact = () => {
    const [searchParams] = useSearchParams();

    const [formData, setFormData] = useState(() => ({
        name: '',
        company: '',
        email: '',
        phone: '',
        industry: '',
        projectOverview: initialProjectOverview(
            searchParams.get('package'),
            searchParams.get('service'),
        ),
        message: ''
    }));

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false); 

    const { t, locale } = useI18n();
    const { content, loading } = useContent();
    const settings = content?.settings;

    const cleanedEmailHref = settings?.email
        ? `mailto:${settings.email.trim()}`
        : '';

    // The line shown depends on the language, not on the CMS: a single CMS
    // field cannot express one number per market.
    const contactPhone = phoneForLocale(locale);
    const displayPhoneText = contactPhone.display;
    const phoneHref = telHref(contactPhone);

    const buildWhatsappMessage = () => {
        const lines = [
            t('public.contact.form.title'),
            '',
            `${t('public.contact.form.labels.name')}: ${formData.name}`,
        ];

        if (formData.company) {
            lines.push(`${t('public.contact.form.labels.company')}: ${formData.company}`);
        }

        lines.push(`${t('public.contact.form.labels.email')}: ${formData.email}`);

        if (formData.phone) {
            lines.push(`${t('public.contact.form.labels.phone')}: ${formData.phone}`);
        }

        lines.push(
            `${t('public.contact.form.labels.industry')}: ${formData.industry}`,
            `${t('public.contact.form.labels.projectOverview')}: ${formData.projectOverview}`,
            `${t('public.contact.form.labels.message')}: ${formData.message}`
        );

        return lines.join('\n');
    };

    useEffect(() => {
        const requiredFields = ['name', 'email', 'industry', 'projectOverview', 'message'];
        const isValid = requiredFields.every(field => 
            formData[field as keyof typeof formData]?.trim() !== ''
        );
        setIsFormValid(isValid);
    }, [formData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (submitError) setSubmitError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isFormValid) return;

        window.open(whatsappHref(contactPhone, buildWhatsappMessage()), '_blank', 'noopener,noreferrer');

        setIsSubmitting(true);
        setSubmitError('');
        setSubmitSuccess(false);

        try {
            const leadData = {
                name: formData.name,
                company: formData.company || undefined,
                email: formData.email || undefined,
                phone: formData.phone || undefined,
                interest: formData.industry || undefined,
                topic: formData.projectOverview || undefined,
                message: formData.message || undefined,
            };

            await api.createInquiry(leadData);
        } catch (error: any) {
            console.error('Failed to save lead in CRM:', error);
        }

        setSubmitSuccess(true);

        setFormData({
            name: '',
            company: '',
            email: '',
            phone: '',
            industry: '',
            projectOverview: '',
            message: ''
        });

        setTimeout(() => {
            setSubmitSuccess(false);
        }, 5000);

        setIsSubmitting(false);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-white">{t('public.contact.loading')}</div>
            </div>
        );
    }

    return (
        <div className='mt-[60px] flex flex-col justify-center items-center'>
            <Seo
              page="contact"
              breadcrumbs={[{ name: t('nav.contact'), path: '/contact' }]}
            />
            <Container className="flex flex-col justify-center items-center mb-12">
                <h2 className="font-display text-[38px] font-bold text-white text-center">{t('public.contact.heroTitle')}</h2>
                <p className="font-inter text-[18px] text-text-muted text-center max-w-[800px]">
                    {t('public.contact.heroCopy')}
                </p>
                
                <div className="mt-12 flex flex-col md:flex-row gap-12">
                  <div className="md:w-1/2">
                    <ul className="space-y-4 w-[366px]">
                      <li className="flex items-start">
                         <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                         <h3 className="font-display text-text-muted text-[18px]">{t('public.contact.hero.items.premiumUi')}</h3>
                      </li>
                      <li className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          <h3 className="font-display text-text-muted text-[18px]">{t('public.contact.hero.items.scalableBackend')}</h3>
                      </li>
                      <li className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          <h3 className="font-display text-text-muted  text-[18px]">{t('public.contact.hero.items.marketplaceInfra')}</h3>
                      </li>
                      <li className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          <h3 className="font-display text-text-muted text-[18px]">{t('public.contact.hero.items.adminDashboards')}</h3>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="md:w-1/2">
                    <div className="space-y-6">
                      <div className='flex items-center gap-[10px]'>
                        <img src={phone} alt={t('public.contact.alt.phone')} className="w-5 h-5" />
                            <a href={phoneHref} className="font-inter text-text-muted text-[16px] hover:text-white transition-colors">{displayPhoneText}</a>
                      </div>
                      <div className='flex items-center gap-[10px]'>
                        <img src={mail} alt={t('public.contact.alt.mail')} className="w-5 h-5" />
                            <a href={cleanedEmailHref} className="font-inter text-text-muted text-[16px] hover:text-white transition-colors">{t('public.contact.details.email')}</a>
                      </div>
                      <div className='flex items-center gap-[10px]'>
                        <img src={location} alt={t('public.contact.alt.location')} className="w-5 h-5" />
                        <p className="font-inter text-text-muted text-[16px]"> {t('public.contact.details.location')}</p>
                      </div>
                    </div>
                  </div>
                </div>
            </Container>

            <Container className='mb-[60px] md:mb-[100px]'>
                <div className="max-w-[800px] mx-auto">
                    <div className="mb-10 text-center">
                        <h2 className="font-display text-[26px] font-bold text-white mb-4">{t('public.contact.form.title')}</h2>
                        <p className="font-inter text-[18px] text-text-muted">
                            {t('public.contact.form.copy')}
                        </p>
                    </div>

                    {submitSuccess && (
                        <div className="mb-6 p-4 bg-green-900/20 border border-green-500 rounded-lg">
                            <p className="text-green-400 font-inter text-center">
                                {t('public.contact.form.success') || 'Thank you! Your message has been sent successfully. We will contact you soon.'}
                            </p>
                        </div>
                    )}

                    {submitError && (
                        <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
                            <p className="text-red-400 font-inter text-center">
                                {submitError}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="font-inter text-white text-[16px] font-semibold mb-2 block">
                                        {t('public.contact.form.labels.name')} *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isSubmitting}
                                        placeholder={t('public.contact.form.placeholders.name')}
                                        className="field font-inter text-text-subtle font-bold text-[13px] placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="font-inter text-white text-[16px] font-semibold mb-2 block">
                                        {t('public.contact.form.labels.company')}
                                    </label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        placeholder={t('public.contact.form.placeholders.company')}
                                        className="field font-inter text-text-subtle font-bold text-[13px] placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="font-inter text-white text-[16px] font-semibold mb-2 block">
                                        {t('public.contact.form.labels.email')} *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isSubmitting}
                                        placeholder={t('public.contact.form.placeholders.email')}
                                        className="field font-inter text-text-subtle font-bold text-[13px] placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="font-inter text-white text-[16px] font-semibold mb-2 block">
                                        {t('public.contact.form.labels.phone')}
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        placeholder={t('public.contact.form.placeholders.phone')}
                                        className="field font-inter text-text-subtle font-bold text-[13px] placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="font-inter text-white text-[16px] font-semibold mb-2 block">
                                        {t('public.contact.form.labels.industry')} *
                                    </label>
                                    <select
                                        name="industry"
                                        value={formData.industry}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isSubmitting}
                                        className="field font-inter text-text-subtle font-bold text-[13px] placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="" className="bg-surface">{t('public.contact.form.options.choose')}</option>
                                        <option value="banking" className="bg-surface">{t('public.contact.form.options.banking')}</option>
                                        <option value="ecommerce" className="bg-surface">{t('public.contact.form.options.ecommerce')}</option>
                                        <option value="software" className="bg-surface">{t('public.contact.form.options.software')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-inter text-white text-[16px] font-semibold mb-2 block">
                                        {t('public.contact.form.labels.projectOverview')} *
                                    </label>
                                    <input
                                        type="text"
                                        name="projectOverview"
                                        value={formData.projectOverview}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isSubmitting}
                                        placeholder={t('public.contact.form.placeholders.projectOverview')}
                                        className="field font-inter text-text-subtle font-bold text-[13px] placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-inter text-white text-[16px] font-semibold mb-2 block">
                                    {t('public.contact.form.labels.message')} *
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isSubmitting}
                                    rows={6}
                                    placeholder={t('public.contact.form.placeholders.message')}
                                    className="field font-inter text-text-subtle font-bold text-[13px] placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <p className='font-inter text-[10px] text-text-subtle font-bold'>{t('public.contact.form.tip')} * - {t('public.contact.form.required')}</p>
                        </div>

                        <div className="flex flex-col items-end gap-2 pt-4">
                            <button
                                type="submit"
                                disabled={!isFormValid || isSubmitting}
                                className={`bg-primary hover:bg-primary-hover text-on-primary font-inter py-3 px-8 rounded-md transition-colors duration-300 cursor-pointer text-[18px] whitespace-nowrap ${!isFormValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? t('public.contact.form.submitting') || 'Sending...' : t('public.contact.form.submit')}
                            </button>
                            <p className="font-inter text-text-subtle text-[10px] text-right">
                                {t('public.contact.form.privacy')}
                            </p>
                        </div>
                    </form>
                </div>
            </Container>
        </div>
    );
}

export default Contact;