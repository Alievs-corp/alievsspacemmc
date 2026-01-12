import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';
import Container from './../components/ui/Container';
import phone from "../assets/icons/phone.svg";
import mail from "../assets/icons/mail.svg";
import location from "../assets/icons/location.svg";
import { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        industry: '',
        projectOverview: '',
        message: ''
    });

    const { t } = useI18n();
    const { loading } = useContent();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Form submission logic here
        console.log('Form submitted:', formData);
        // Reset form or show success message
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
            <Container className="flex flex-col justify-center items-center mb-12">
                <h2 className="font-inter text-[38px] font-bold text-white">{t('public.contact.heroTitle')}</h2>
                <p className="font-inter text-[18px] text-[#C5C5C5] text-center max-w-[800px]">
                    {t('public.contact.heroCopy')}
                </p>
                
                <div className="mt-12 flex flex-col md:flex-row gap-12">
                  <div className="md:w-1/2">
                                        <ul className="space-y-4 w-[366px]">
                      <li className="flex items-start">
                         <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                                 <h3 className="font-inter text-[#C5C5C5] text-[18px]">{t('public.contact.hero.items.premiumUi')}</h3>
                      </li>
                      <li className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                                    <h3 className="font-inter text-[#C5C5C5] text-[18px]">{t('public.contact.hero.items.scalableBackend')}</h3>
                      </li>
                      <li className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                                    <h3 className="font-inter text-[#C5C5C5]  text-[18px]">{t('public.contact.hero.items.marketplaceInfra')}</h3>
                      </li>
                      <li className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-[#133FA6] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                                    <h3 className="font-inter text-[#C5C5C5] text-[18px]">{t('public.contact.hero.items.adminDashboards')}</h3>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="md:w-1/2">
                    <div className="space-y-6">
                      <div className='flex items-center gap-[10px]'>
                                                <img src={phone} alt={t('public.contact.alt.phone')} className="w-5 h-5" />
                                                <p className="font-inter text-[#C5C5C5] text-[16px]">{t('public.contact.details.phone')}</p>
                      </div>
                      <div className='flex items-center gap-[10px]'>
                                                <img src={mail} alt={t('public.contact.alt.mail')} className="w-5 h-5" />
                                                <p className="font-inter text-[#C5C5C5] text-[16px]">{t('public.contact.details.email')}</p>
                      </div>
                      <div className='flex items-center gap-[10px]'>
                                                <img src={location} alt={t('public.contact.alt.location')} className="w-5 h-5" />
                                                <p className="font-inter text-[#C5C5C5] text-[16px]">{t('public.contact.details.location')}</p>
                      </div>
                    </div>
                  </div>
                </div>
            </Container>

            <Container >
                <div className="max-w-[800px] mx-auto">
                    <div className="mb-10 text-center">
                        <h2 className="font-inter text-[26px] font-bold text-white mb-4">{t('public.contact.form.title')}</h2>
                        <p className="font-inter text-[18px] text-[#C5C5C5]">
                            {t('public.contact.form.copy')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="font-inter text-white text-[16px] font-semibold mb-2 block">
                                        {t('public.contact.form.labels.name')}
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder={t('public.contact.form.placeholders.name')}
                                        className="w-full bg-[#0F0F23] border border-[#808087] rounded-[10px] px-4 py-3 font-inter text-[#808087] font-bold text-[13px] placeholder:text-[#808087] focus:outline-none focus:border-[#133FA6] transition-colors duration-300"
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
                                        placeholder={t('public.contact.form.placeholders.company')}
                                        className="w-full bg-[#0F0F23] border border-[#808087] rounded-[10px] px-4 py-3 font-inter text-[#808087] font-bold text-[13px] placeholder:text-[#808087] focus:outline-none focus:border-[#133FA6] transition-colors duration-300"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="font-inter text-white text-[16px] font-semibold mb-2 block">
                                        {t('public.contact.form.labels.email')}
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder={t('public.contact.form.placeholders.email')}
                                        className="w-full bg-[#0F0F23] border border-[#808087] rounded-[10px] px-4 py-3 font-inter text-[#808087] font-bold text-[13px] placeholder:text-[#808087] focus:outline-none focus:border-[#133FA6] transition-colors duration-300"
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
                                        placeholder={t('public.contact.form.placeholders.phone')}
                                        className="w-full bg-[#0F0F23] border border-[#808087] rounded-[10px] px-4 py-3 font-inter text-[#808087] font-bold text-[13px] placeholder:text-[#808087] focus:outline-none focus:border-[#133FA6] transition-colors duration-300"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="font-inter text-white text-[16px] font-semibold mb-2 block">
                                        {t('public.contact.form.labels.industry')}
                                    </label>
                                    <select
                                        name="industry"
                                        value={formData.industry}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-[#0F0F23] border border-[#808087] rounded-[10px] px-4 py-3 font-inter text-[#808087] font-bold text-[13px] placeholder:text-[#808087] focus:outline-none focus:border-[#133FA6] transition-colors duration-300"
                                    >
                                        <option value="" className="bg-[#0F0F23]">{t('public.contact.form.options.choose')}</option>
                                        <option value="banking" className="bg-[#0F0F23]">{t('public.contact.form.options.banking')}</option>
                                        <option value="ecommerce" className="bg-[#0F0F23]">{t('public.contact.form.options.ecommerce')}</option>
                                        <option value="software" className="bg-[#0F0F23]">{t('public.contact.form.options.software')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-inter text-white text-[16px] font-semibold mb-2 block">
                                        {t('public.contact.form.labels.projectOverview')}
                                    </label>
                                    <input
                                        type="text"
                                        name="projectOverview"
                                        value={formData.projectOverview}
                                        onChange={handleInputChange}
                                        required
                                        placeholder={t('public.contact.form.placeholders.projectOverview')}
                                        className="w-full bg-[#0F0F23] border border-[#808087] rounded-[10px] px-4 py-3 font-inter text-[#808087] font-bold text-[13px] placeholder:text-[#808087] focus:outline-none focus:border-[#133FA6] transition-colors duration-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-inter text-white text-[16px] font-semibold mb-2 block">
                                    {t('public.contact.form.labels.message')}
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    rows={6}
                                    placeholder={t('public.contact.form.placeholders.message')}
                                    className="w-full bg-[#0F0F23] border border-[#808087] rounded-[10px] px-4 py-3 font-inter text-[#808087] font-bold text-[13px] placeholder:text-[#808087] focus:outline-none focus:border-[#133FA6] transition-colors duration-300"
                                />
                            </div>
                            <p className='font-inter text-[10px] text-[#808087] font-bold'>{t('public.contact.form.tip')}</p>
                        </div>

                        <div className="flex flex-col items-end gap-2 pt-4">
                            <button
                                type="submit"
                                className="bg-[#133FA6] border-b border-white hover:bg-[#1a4cc0] text-white font-inter py-3 px-8 rounded-[6.45px] transition-colors duration-300 cursor-pointer text-[18px] whitespace-nowrap"
                            >
                                {t('public.contact.form.submit')}
                            </button>
                            <p className="font-inter text-[#808087] text-[10px] text-right">
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