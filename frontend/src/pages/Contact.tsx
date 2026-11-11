import type { CSSProperties } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Seo } from '@/components/Seo';
import { phoneForLocale, telHref, whatsappHref } from '@/lib/site';
import { PACKAGE_TIERS } from '@/data/packages';
import { t as translate } from '@/lib/i18n';
import { PageHero, Pill, SectionHead, Ticker, useReveal, WordsReveal } from '@/components/site/blocks';
import { AccNotice, FieldLabel } from '@/components/site/account/ui';

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

    const { t, tRaw, locale } = useI18n();
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

    // Derived on every render, so the submit button tracks the fields exactly.
    const requiredFields = ['name', 'email', 'industry', 'projectOverview', 'message'];
    const isFormValid = requiredFields.every(field =>
        formData[field as keyof typeof formData]?.trim() !== ''
    );

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
        } catch (error) {
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

    const accent = tRaw<string[]>('site.account.contact.accent', []);
    const splitRef = useReveal<HTMLDivElement>();
    const whyRef = useReveal<HTMLDivElement>();

    const whyItems = [
        t('public.contact.hero.items.premiumUi'),
        t('public.contact.hero.items.scalableBackend'),
        t('public.contact.hero.items.marketplaceInfra'),
        t('public.contact.hero.items.adminDashboards'),
    ];

    if (loading) {
        return (
            <div className="flex min-h-[70svh] items-center justify-center">
                <div className="as-mono text-[var(--as-fg-soft)]">{t('public.contact.loading')}</div>
            </div>
        );
    }

    const channels = [
        { label: t('site.account.contact.phone'), value: displayPhoneText, href: phoneHref },
        { label: t('site.account.contact.email'), value: t('public.contact.details.email'), href: cleanedEmailHref || `mailto:${t('public.contact.details.email').trim()}` },
        {
            label: t('site.account.contact.whatsapp'),
            value: t('site.account.contact.openChat'),
            href: whatsappHref(contactPhone),
            external: true,
        },
        { label: t('site.account.contact.office'), value: t('public.contact.details.location') },
    ];

    const fieldProps = {
        onChange: handleInputChange,
        disabled: isSubmitting,
        className: 'acc-input',
    };

    return (
        <>
            <Seo
              page="contact"
              breadcrumbs={[{ name: t('nav.contact'), path: '/contact' }]}
            />

            <PageHero
                short
                tone="rust"
                word={t('site.account.contact.word')}
                num="@"
                eyebrow={t('nav.contact')}
                title={t('site.account.contact.title')}
                accent={accent}
                lead={t('site.account.contact.lead')}
                actions={
                    <>
                        <Pill href="#contact-form" variant="light">{t('public.contact.form.title')}</Pill>
                        <Pill href={whatsappHref(contactPhone)} variant="ghost" target="_blank" rel="noopener noreferrer">
                            {t('site.account.contact.whatsapp')}
                        </Pill>
                    </>
                }
            />

            <section className="as-section--tight">
                <div ref={splitRef} className="as-wrap grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-[clamp(48px,6vw,110px)]">
                    {/* Direct lines */}
                    <div className="min-w-0 lg:sticky lg:top-[calc(var(--as-header-h)+32px)] lg:self-start">
                        <p className="as-eyebrow mb-6" data-reveal>{t('site.account.contact.channels')}</p>
                        <ul className="acc-rows">
                            {channels.map((c, i) => (
                                <li key={c.label} data-reveal="left" style={{ '--d': `${i * 80}ms` } as CSSProperties}>
                                    {c.href ? (
                                        <a
                                            href={c.href}
                                            className="acc-row acc-row--stack"
                                            {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                        >
                                            <span className="acc-row__label">{c.label}</span>
                                            <span className="acc-row__value">{c.value}</span>
                                            <span className="acc-row__arrow" aria-hidden>→</span>
                                        </a>
                                    ) : (
                                        <div className="acc-row acc-row--stack">
                                            <span className="acc-row__label">{c.label}</span>
                                            <span className="acc-row__value">{c.value}</span>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Request form */}
                    <div id="contact-form" className="as-box min-w-0 !p-[clamp(22px,3.4vw,48px)]" data-reveal="scale">
                        <p className="as-eyebrow">{t('site.account.contact.formEyebrow')}</p>
                        <h2 className="as-title as-title--sm mt-4">{t('public.contact.form.title')}</h2>
                        <p className="as-lead mt-4 !text-[16px]">{t('public.contact.form.copy')}</p>

                        <div className="mt-8 grid gap-3 empty:hidden">
                            {submitSuccess && <AccNotice tone="success">{t('site.account.contact.success')}</AccNotice>}
                            {submitError && <AccNotice>{submitError}</AccNotice>}
                        </div>

                        <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <FieldLabel htmlFor="c-name" required>{t('public.contact.form.labels.name')}</FieldLabel>
                                    <input id="c-name" type="text" name="name" value={formData.name} required autoComplete="name"
                                        placeholder={t('public.contact.form.placeholders.name')} {...fieldProps} />
                                </div>
                                <div>
                                    <FieldLabel htmlFor="c-company">{t('public.contact.form.labels.company')}</FieldLabel>
                                    <input id="c-company" type="text" name="company" value={formData.company} autoComplete="organization"
                                        placeholder={t('public.contact.form.placeholders.company')} {...fieldProps} />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <FieldLabel htmlFor="c-email" required>{t('public.contact.form.labels.email')}</FieldLabel>
                                    <input id="c-email" type="email" name="email" value={formData.email} required autoComplete="email"
                                        placeholder={t('public.contact.form.placeholders.email')} {...fieldProps} />
                                </div>
                                <div>
                                    <FieldLabel htmlFor="c-phone">{t('public.contact.form.labels.phone')}</FieldLabel>
                                    <input id="c-phone" type="tel" name="phone" value={formData.phone} autoComplete="tel"
                                        placeholder={t('public.contact.form.placeholders.phone')} {...fieldProps} />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <FieldLabel htmlFor="c-industry" required>{t('public.contact.form.labels.industry')}</FieldLabel>
                                    <select id="c-industry" name="industry" value={formData.industry} required {...fieldProps}>
                                        <option value="">{t('public.contact.form.options.choose')}</option>
                                        <option value="banking">{t('public.contact.form.options.banking')}</option>
                                        <option value="ecommerce">{t('public.contact.form.options.ecommerce')}</option>
                                        <option value="software">{t('public.contact.form.options.software')}</option>
                                    </select>
                                </div>
                                <div>
                                    <FieldLabel htmlFor="c-project" required>{t('public.contact.form.labels.projectOverview')}</FieldLabel>
                                    <input id="c-project" type="text" name="projectOverview" value={formData.projectOverview} required
                                        placeholder={t('public.contact.form.placeholders.projectOverview')} {...fieldProps} />
                                </div>
                            </div>

                            <div>
                                <FieldLabel htmlFor="c-message" required>{t('public.contact.form.labels.message')}</FieldLabel>
                                <textarea id="c-message" name="message" value={formData.message} required rows={6}
                                    placeholder={t('public.contact.form.placeholders.message')} {...fieldProps} />
                            </div>

                            <p className="text-[13px] leading-relaxed text-[var(--as-fg-soft)]">
                                {t('public.contact.form.tip')}{' '}
                                <span className="as-mono whitespace-nowrap text-[var(--as-accent)]">* — {t('site.account.contact.required')}</span>
                            </p>

                            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--as-line)] pt-6">
                                <p className="max-w-[40ch] text-[12.5px] leading-relaxed text-[var(--as-fg-soft)]">
                                    {t('public.contact.form.privacy')}
                                </p>
                                <button type="submit" disabled={!isFormValid || isSubmitting} className="as-btn as-btn--accent">
                                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                                    <span>{isSubmitting ? t('site.account.contact.submitting') : t('public.contact.form.submit')}</span>
                                    {!isSubmitting && <span className="as-arrow" aria-hidden>→</span>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <Ticker items={whyItems} duration={28} />

            <section className="as-section as-bg-cream">
                <div ref={whyRef} className="as-wrap grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-[clamp(48px,6vw,110px)]">
                    <SectionHead
                        eyebrow={t('site.account.contact.whyEyebrow')}
                        title={t('public.contact.heroTitle')}
                        size="sm"
                        className="content-start lg:sticky lg:top-[calc(var(--as-header-h)+32px)] lg:self-start"
                    />
                    <div className="grid gap-10">
                        <WordsReveal text={t('public.contact.heroCopy')} className="!text-[clamp(22px,2.6vw,38px)]" />
                        <ul className="as-steps">
                            {whyItems.map((item, i) => (
                                <li key={item} data-reveal style={{ '--d': `${i * 70}ms` } as CSSProperties}>
                                    <span className="as-step-n">{String(i + 1).padStart(2, '0')}</span>
                                    <h3 className="as-h3 self-center">{item}</h3>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Contact;
