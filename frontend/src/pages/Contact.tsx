import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export function Contact() {
  const { t } = useI18n();
  const { content } = useContent();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    interest: '',
    topic: searchParams.get('topic') || '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const topic = searchParams.get('topic');
    if (topic) {
      setFormData((prev) => ({ ...prev, topic }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || (!formData.email && !formData.phone)) {
      alert(t('public.contactValidation'));
      return;
    }

    setSubmitting(true);
    try {
      await api.createInquiry({
        name: formData.name,
        company: formData.company || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        interest: formData.interest || undefined,
        topic: formData.topic || undefined,
        message: formData.message || undefined,
      });
      setSuccess(true);
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        interest: '',
        topic: '',
        message: '',
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      alert('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-[var(--color-background)] to-[var(--color-muted)]/20 py-16">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 text-sm text-[var(--color-muted-foreground)]">
              {t('nav.home')} / {t('nav.contact')}
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t('nav.contact')}
            </h1>
            <p className="mt-6 text-lg leading-8 text-[var(--color-muted-foreground)]">
              {t('public.contactIntro')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="nameInput" className="mb-2 block text-sm font-medium">
                      {t('public.contactName')}
                    </label>
                    <input
                      id="nameInput"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Emin"
                      className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                    />
                  </div>

                  <div>
                    <label htmlFor="companyInput" className="mb-2 block text-sm font-medium">
                      {t('public.contactCompany')}
                    </label>
                    <input
                      id="companyInput"
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder={t('public.contactCompanyPlaceholder')}
                      className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="emailInput" className="mb-2 block text-sm font-medium">
                        {t('public.contactEmail')}
                      </label>
                      <input
                        id="emailInput"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@company.com"
                        className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                      />
                    </div>
                    <div>
                      <label htmlFor="phoneInput" className="mb-2 block text-sm font-medium">
                        {t('public.contactPhone')}
                      </label>
                      <input
                        id="phoneInput"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+994 ..."
                        className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="interestSelect" className="mb-2 block text-sm font-medium">
                      {t('public.contactInterest')}
                    </label>
                    <select
                      id="interestSelect"
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                    >
                      <option value="">Select...</option>
                      <option value="soft">{t('public.contactInterestSoftware')}</option>
                      <option value="commerce">{t('public.contactInterestCommerce')}</option>
                      <option value="banking">{t('public.contactInterestBanking')}</option>
                      <option value="design">{t('public.contactInterestDesign')}</option>
                      <option value="support">{t('public.contactInterestSupport')}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="topic" className="mb-2 block text-sm font-medium">
                      {t('public.contactTopic')}
                    </label>
                    <input
                      id="topic"
                      type="text"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      placeholder={t('public.contactTopicPlaceholder')}
                      className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                    />
                  </div>

                  <div>
                    <label htmlFor="messageInput" className="mb-2 block text-sm font-medium">
                      {t('public.contactMessage')}
                    </label>
                    <textarea
                      id="messageInput"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t('public.contactMessagePlaceholder')}
                      className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                    />
                  </div>

                  <div className="text-sm text-[var(--color-muted-foreground)]">{t('public.contactHelper')}</div>

                  {success && (
                    <div className="rounded-md bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                      {t('public.contactThanks')}
                    </div>
                  )}

                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? 'Sending...' : t('public.contactSubmit')}
                  </Button>
                </form>
              </div>

              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                <h3 className="text-xl font-semibold">{t('public.companyDetails')}</h3>
                <p className="mt-4 text-sm text-[var(--color-muted-foreground)]">{t('public.companyDetailsCopy')}</p>
                <div className="mt-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[var(--color-primary)]"></div>
                    <span className="text-sm font-medium">{t('public.noteBadge')}</span>
                  </div>
                  <p className="text-xs text-[var(--color-muted-foreground)]">{t('public.noteCopy')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

