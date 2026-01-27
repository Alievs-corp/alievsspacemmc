import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';
import Container from './../components/ui/Container';
import { useState } from 'react';
import type React from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';

const CaseStudies = () => {
    const { t } = useI18n();
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        interest: '',
        topic: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const info = [
        {
            id: 'marketplace-mvp',
            category: t('public.caseStudies.items.marketplace.category'),
            title: t('public.caseStudies.items.marketplace.title'),
            description: t('public.caseStudies.items.marketplace.description'),
            focus: [
                t('public.caseStudies.items.marketplace.focus.0'),
                t('public.caseStudies.items.marketplace.focus.1'),
                t('public.caseStudies.items.marketplace.focus.2'),
            ]
        },
        {
            id: 'fintech-reporting-dashboard',
            category: t('public.caseStudies.items.fintech.category'),
            title: t('public.caseStudies.items.fintech.title'),
            description: t('public.caseStudies.items.fintech.description'),
            focus: [
                t('public.caseStudies.items.fintech.focus.0'),
                t('public.caseStudies.items.fintech.focus.1'),
                t('public.caseStudies.items.fintech.focus.2'),
            ]
        },
        {
            id: 'operations-inventory-system',
            category: t('public.caseStudies.items.operations.category'),
            title: t('public.caseStudies.items.operations.title'),
            description: t('public.caseStudies.items.operations.description'),
            focus: [
                t('public.caseStudies.items.operations.focus.0'),
                t('public.caseStudies.items.operations.focus.1'),
                t('public.caseStudies.items.operations.focus.2'),
            ]
        },
    ]

    const { loading } = useContent();

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

        // Validate required fields (backend requires name)
        if (!formData.name.trim()) {
            setSubmitError('Name is required');
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');
        setSubmitSuccess(false);

        try {
            const inquiryData = {
                name: formData.name.trim(),
                company: formData.company.trim() || undefined,
                email: formData.email.trim() || undefined,
                phone: formData.phone.trim() || undefined,
                interest: formData.interest.trim() || undefined,
                topic: formData.topic.trim() || undefined,
                message: formData.message.trim() || undefined,
            };

            await api.createInquiry(inquiryData);

            setSubmitSuccess(true);
            setFormData({
                name: '',
                company: '',
                email: '',
                phone: '',
                interest: '',
                topic: '',
                message: ''
            });

            setTimeout(() => setSubmitSuccess(false), 5000);
        } catch (error: any) {
            console.error('Failed to submit inquiry from CaseStudies:', error);
            setSubmitError(error?.message || 'Failed to submit form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-white">{t('admin.loading')}</div>
            </div>
        );
    }

    return (
        <div className='mt-[60px] flex flex-col justify-center items-center'>
            <Container className="flex flex-col justify-center items-center mb-12">
                <h2 className="font-inter text-[38px] font-bold text-white">{t('nav.caseStudies', 'Case Studies')}</h2>
                <p className="font-inter text-[18px] text-[#C5C5C5] text-center max-w-[800px]">{t('public.caseStudiesIntro')}</p>
            </Container>

            <Container className="w-full mb-24">
                <div className="flex flex-col items-center">
                    <div className="flex flex-col gap-6 md:gap-8 w-full lg:hidden">
                        {info.map((item, index) => (
                            <div 
                                key={index}
                                className="bg-[#13132F] border-b-[1.7px] border-l-[1.7px] border-white rounded-[10px] p-6 flex flex-col w-full max-w-[520px] mx-auto shadow-[0px_10px_20px_0px_#000000] hover:border-[#133FA6] hover:shadow-[0_8px_24px_rgba(19,63,166,0.25)] transition-all duration-300"
                            >
                                <div className="mb-4">
                                    <span className="font-inter text-white text-[13px] font-semibold">
                                        {item.category}
                                    </span>
                                </div>

                                <h3 className="font-inter text-white text-[22px] md:text-[26px] font-semibold mb-4">
                                    {item.title}
                                </h3>

                                <p className="font-inter text-[#C5C5C5] text-[18px] mb-6 leading-relaxed">
                                    {item.description}
                                </p>

                                <div className="mb-8 flex-grow">
                                    <h4 className="font-inter text-white text-[16px] font-semibold mb-4">
                                        {t('public.caseStudies.keyFocusLabel')}
                                    </h4>
                                    <ul className="space-y-3">
                                        {item.focus.map((focusItem, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                                <span className="font-inter text-[#C5C5C5] text-[18px]">{focusItem}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link 
                                    to={`/case-studies/${item.id}`}
                                    className="mt-auto w-full bg-[#133FA6] hover:bg-[#1a4cc0] text-white font-inter font-semibold py-3 px-4 rounded-[6.45px] transition-colors duration-300 cursor-pointer text-center"
                                >
                                    {t('public.caseStudies.viewCta')}
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="hidden lg:flex flex-col items-center w-full">
                        <div className="flex gap-8 w-full max-w-[1080px] mb-8">
                            {info.slice(0, 2).map((item, index) => (
                                <div 
                                    key={index}
                                    className="bg-[#13132F] border-b-[1.7px] border-l-[1.7px] border-white rounded-[10px] p-6 flex flex-col w-[520px] shadow-[0px_10px_20px_0px_#000000] hover:border-[#133FA6] hover:shadow-[0_8px_24px_rgba(19,63,166,0.25)] transition-all duration-300"
                                >
                                    <div className="mb-4">
                                        <span className="font-inter text-white text-[13px] font-semibold">
                                            {item.category}
                                        </span>
                                    </div>

                                    <h3 className="font-inter text-white text-[26px] font-semibold mb-4">
                                        {item.title}
                                    </h3>

                                    <div className="mb-6">
                                        <p className="font-inter text-[#C5C5C5] text-[18px] leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="font-inter text-white text-[16px] font-semibold mb-3">
                                            {t('public.caseStudies.keyFocusLabel')}
                                        </h4>
                                        <ul className="space-y-2">
                                            {item.focus.map((focusItem, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                                    <span className="font-inter text-[#C5C5C5] text-[18px] line-clamp-1">{focusItem}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Link 
                                        to={`/case-studies/${item.id}`}
                                        className="mt-auto w-full bg-[#133FA6] hover:bg-[#1a4cc0] text-white font-inter font-semibold py-3 px-4 rounded-[6.45px] transition-colors duration-300 cursor-pointer text-center"
                                    >
                                        {t('public.caseStudies.viewCta')}
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {info[2] && (
                            <div className="flex justify-center w-full">
                                <div 
                                    className="bg-[#13132F] border-b-[1.7px] border-l-[1.7px] border-white rounded-[10px] p-6 flex flex-col w-[520px] shadow-[0px_10px_20px_0px_#000000] hover:border-[#133FA6] hover:shadow-[0_8px_24px_rgba(19,63,166,0.25)] transition-all duration-300"
                                >
                                    <div className="mb-4">
                                        <span className="font-inter text-white text-[13px] font-semibold">
                                            {info[2].category}
                                        </span>
                                    </div>
                                    
                                    <h3 className="font-inter text-white text-[26px] font-semibold mb-4">
                                        {info[2].title}
                                    </h3>
                                    
                                    <div className="mb-6">
                                        <p className="font-inter text-[#C5C5C5] text-[18px] leading-relaxed">
                                            {info[2].description}
                                        </p>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <h4 className="font-inter text-white text-[16px] font-semibold mb-3">
                                            {t('public.caseStudies.keyFocusLabel')}
                                        </h4>
                                        <ul className="space-y-2">
                                            {info[2].focus.map((focusItem, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                                    <span className="font-inter text-[#C5C5C5] text-[18px]">{focusItem}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <Link 
                                        to={`/case-studies/${info[2].id}`}
                                        className="mt-auto w-full bg-[#133FA6] hover:bg-[#1a4cc0] text-white font-inter font-semibold py-3 px-4 rounded-[6.45px] transition-colors duration-300 cursor-pointer text-center"
                                    >
                                        {t('public.caseStudies.viewCta')}
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
            <Container className="w-full">
                <div className="max-w-[800px] mx-auto">
                    <div className="mb-10 text-center">
                        <h2 className="font-inter text-[26px] font-bold text-white mb-4">{t('public.caseStudies.requestTitle')}</h2>
                        <p className="font-inter text-[18px] text-[#C5C5C5]">{t('public.caseStudies.requestCopy')}</p>
                    </div>
                    {submitSuccess && (
                        <div className="mb-6 p-4 bg-green-900/20 border border-green-500 rounded-lg">
                            <p className="text-green-400 font-inter text-center">
                                ✅ {t('public.contact.form.success') || 'Thank you! Your inquiry has been submitted successfully.'}
                            </p>
                        </div>
                    )}
                    {submitError && (
                        <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
                            <p className="text-red-400 font-inter text-center">❌ {submitError}</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="font-inter text-white text-[16px] font-semibold mb-2 block">{t('public.contact.form.labels.name')} *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isSubmitting}
                                        placeholder={t('public.contact.form.placeholders.name')}
                                        className="w-full bg-[#0F0F23] border border-[#808087] rounded-[10px] px-4 py-3 font-inter text-white font-bold text-[13px] placeholder:text-[#808087] focus:outline-none focus:border-[#133FA6] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="font-inter text-white text-[16px] font-semibold mb-2 block">{t('public.contact.form.labels.company')}</label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        placeholder={t('public.contact.form.placeholders.company')}
                                        className="w-full bg-[#0F0F23] border border-[#808087] rounded-[10px] px-4 py-3 font-inter text-white font-bold text-[13px] placeholder:text-[#808087] focus:outline-none focus:border-[#133FA6] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="font-inter text-white text-[16px] font-semibold mb-2 block">{t('public.contact.form.labels.email')}</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        placeholder={t('public.contact.form.placeholders.email')}
                                        className="w-full bg-[#0F0F23] border border-[#808087] rounded-[10px] px-4 py-3 font-inter text-white font-bold text-[13px] placeholder:text-[#808087] focus:outline-none focus:border-[#133FA6] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="font-inter text-white text-[16px] font-semibold mb-2 block">{t('public.contact.form.labels.phone')}</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        placeholder={t('public.contact.form.placeholders.phone')}
                                        className="w-full bg-[#0F0F23] border border-[#808087] rounded-[10px] px-4 py-3 font-inter text-white font-bold text-[13px] placeholder:text-[#808087] focus:outline-none focus:border-[#133FA6] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="font-inter text-white text-[16px] font-semibold mb-2 block">{t('public.contact.form.labels.industry') || 'Interest'}</label>
                                    <select
                                        name="interest"
                                        value={formData.interest}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        className="w-full bg-[#0F0F23] border border-[#808087] rounded-[10px] px-4 py-3 font-inter text-white font-bold text-[13px] placeholder:text-[#808087] focus:outline-none focus:border-[#133FA6] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="" className="bg-[#0F0F23] text-[#808087]">{t('public.contact.form.options.choose') || 'Select...'}</option>
                                        <option value="banking" className="bg-[#0F0F23]">{t('public.contact.form.options.banking') || 'Banking & Fintech'}</option>
                                        <option value="ecommerce" className="bg-[#0F0F23]">{t('public.contact.form.options.ecommerce') || 'E-commerce'}</option>
                                        <option value="software" className="bg-[#0F0F23]">{t('public.contact.form.options.software') || 'Web & Software Development'}</option>
                                        <option value="other" className="bg-[#0F0F23]">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-inter text-white text-[16px] font-semibold mb-2 block">{t('public.contact.form.labels.projectOverview') || 'Topic'}</label>
                                    <input
                                        type="text"
                                        name="topic"
                                        value={formData.topic}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        placeholder={t('public.contact.form.placeholders.projectOverview') || 'Project topic or brief overview...'}
                                        className="w-full bg-[#0F0F23] border border-[#808087] rounded-[10px] px-4 py-3 font-inter text-white font-bold text-[13px] placeholder:text-[#808087] focus:outline-none focus:border-[#133FA6] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-inter text-white text-[16px] font-semibold mb-2 block">{t('public.contact.form.labels.message')}</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    rows={6}
                                    placeholder={t('public.contact.form.placeholders.message') || 'Tell us more about your project...'}
                                    className="w-full bg-[#0F0F23] border border-[#808087] rounded-[10px] px-4 py-3 font-inter text-white font-bold text-[13px] placeholder:text-[#808087] focus:outline-none focus:border-[#133FA6] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <p className='font-inter text-[10px] text-[#808087] font-bold'>{t('public.caseStudies.tip')}</p>
                        </div>

                        <div className="flex flex-col items-end gap-2 pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting || !formData.name.trim()}
                                className={`bg-[#133FA6] border-b border-white hover:bg-[#1a4cc0] text-white font-inter py-3 px-8 rounded-[6.45px] transition-colors duration-300 cursor-pointer text-[18px] whitespace-nowrap ${(isSubmitting || !formData.name.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (t('public.contact.form.submitting') || 'Submitting...') : t('public.contactSubmit')}
                            </button>
                            <p className="font-inter text-[#808087] text-[10px] text-right">
                                {t('public.caseStudies.privacy')}
                            </p>
                        </div>
                    </form>
                </div>
            </Container>
        </div>
    );
}

export default CaseStudies;