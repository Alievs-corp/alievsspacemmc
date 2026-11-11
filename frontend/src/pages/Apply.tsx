import { useLocation } from 'react-router-dom';
import { useState, useEffect, type ChangeEvent, type CSSProperties, type FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '@/contexts/I18nContext';
import { PageHero, Pill, useReveal } from '@/components/site/blocks';
import { fill } from '@/components/site/work/text';
import { cn } from '@/lib/utils';
import '@/components/site/work/work.css';

const Apply = () => {
  const { t } = useI18n();
  const location = useLocation();
  const formRef = useReveal();
  const [position, setPosition] = useState('');
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    profileUrl: string;
    message: string;
    resume: File | null;
  }>({
    name: '',
    email: '',
    profileUrl: '',
    message: '',
    resume: null,
  });
  type PositionKey = 'frontend-developer' | 'backend-developer' | 'ui-ux-designer';

  const positionTitles: Record<PositionKey, string> = {
    'frontend-developer': 'Frontend Developer',
    'backend-developer': 'Backend Developer',
    'ui-ux-designer': 'UX/UI Designer',
  };

  const fullPositionTitles: Record<PositionKey, string> = {
    'frontend-developer': 'Frontend Developer',
    'backend-developer': 'Backend Developer',
    'ui-ux-designer': 'UX/UI Designer',
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const positionFromURL = queryParams.get('position') as PositionKey | null;

    if (positionFromURL && positionFromURL in positionTitles) {
      setPosition(positionFromURL);

      setFormData((prev) => ({
        ...prev,
        position: positionTitles[positionFromURL],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const getPositionTitle = () => {
    if (position && position in fullPositionTitles) {
      return fullPositionTitles[position as PositionKey];
    }
    return '';
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const positionTitle = getPositionTitle();
  const heroTitle = positionTitle ? fill(t('site.work.apply.titleFor'), { position: positionTitle }) : t('site.work.apply.titleGeneric');
  const req = (
    <span className="wk-req" aria-hidden>
      *
    </span>
  );
  const rise = (i: number) => ({ '--d': `${i * 70}ms` }) as CSSProperties;

  return (
    <>
      <Helmet>
        <title>{`${t('public.apply', 'Apply')} | Alievs Space MMC`}</title>
        <meta name="description" content={t('careersIntro')} />
        <meta property="og:title" content={`${t('public.apply', 'Apply')}`} />
        <meta property="og:description" content={t('careersIntro')} />
        <meta property="og:type" content="website" />
      </Helmet>

      <PageHero
        short
        word={t('site.work.apply.word')}
        num="A"
        tone="rust"
        eyebrow={t('nav.careers')}
        title={heroTitle}
        accent={positionTitle ? positionTitle.split(/\s+/) : heroTitle.split(/\s+/).slice(-1)}
        lead={t('site.work.apply.lead')}
        crumbs={[{ label: t('nav.careers'), to: '/careers' }, { label: t('public.apply', 'Apply') }]}
      />

      <section className="as-section">
        <div ref={formRef} className="as-wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Which role this is for, and what happens next. */}
          <aside className="grid content-start gap-6 lg:col-span-4" data-reveal>
            <div className="as-box grid gap-4">
              <p className="as-eyebrow">{t('site.work.apply.positionLabel')}</p>
              <p className="as-h3">{positionTitle || t('site.work.apply.openApplication')}</p>
            </div>
            <Pill to="/careers" variant="ghost" size="sm" arrow={false} className="justify-self-start">
              {t('public.careers.back', '← Back to Careers')}
            </Pill>
          </aside>

          <form onSubmit={handleSubmit} className="grid gap-8 lg:col-span-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="wk-field" data-reveal style={rise(0)}>
                <label htmlFor="apply-name" className="wk-label">
                  {t('site.work.apply.name')} {req}
                  <span className="sr-only">({t('site.work.apply.required')})</span>
                </label>
                <input
                  id="apply-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  autoComplete="name"
                  placeholder={t('site.work.apply.namePh')}
                  className="wk-input placeholder:text-[var(--as-fg-soft)]/60"
                />
                <p id="apply-name-err" className="wk-err">
                  {t('site.work.apply.errRequired')}
                </p>
              </div>

              <div className="wk-field" data-reveal style={rise(1)}>
                <label htmlFor="apply-cv" className="wk-label">
                  {t('site.work.apply.cv')} {req}
                  <span className="sr-only">({t('site.work.apply.required')})</span>
                </label>
                <div className="relative">
                  <input
                    id="apply-cv"
                    type="file"
                    name="resume"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev) => ({
                        ...prev,
                        resume: e.target.files?.[0] ?? null,
                      }))
                    }
                    required
                    accept=".pdf,.doc,.docx"
                    aria-describedby="apply-cv-hint"
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  />
                  <div className={cn('wk-input wk-file', formData.resume && 'is-set')}>
                    <span className="wk-file__icon" aria-hidden>
                      {formData.resume ? '✓' : '↑'}
                    </span>
                    {formData.resume ? (
                      <span className="wk-file__text">
                        <span className="text-[var(--as-fg-soft)]">{t('site.work.apply.cvSelected')}</span> {formData.resume.name}
                      </span>
                    ) : (
                      <span className="wk-file__text text-[var(--as-fg-soft)]">{t('site.work.apply.cvPh')}</span>
                    )}
                  </div>
                </div>
                <p id="apply-cv-hint" className="wk-hint">
                  {t('site.work.apply.cvHint')}
                </p>
                <p id="apply-cv-err" className="wk-err">
                  {t('site.work.apply.errCv')}
                </p>
              </div>

              <div className="wk-field" data-reveal style={rise(2)}>
                <label htmlFor="apply-email" className="wk-label">
                  {t('site.work.apply.email')} {req}
                  <span className="sr-only">({t('site.work.apply.required')})</span>
                </label>
                <input
                  id="apply-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  autoComplete="email"
                  placeholder={t('site.work.apply.emailPh')}
                  className="wk-input placeholder:text-[var(--as-fg-soft)]/60"
                />
                <p id="apply-email-err" className="wk-err">
                  {t('site.work.apply.errEmail')}
                </p>
              </div>

              <div className="wk-field" data-reveal style={rise(3)}>
                <label htmlFor="apply-profile" className="wk-label">
                  {t('site.work.apply.profile')} <span className="wk-opt">({t('site.work.apply.optional')})</span>
                </label>
                <input
                  id="apply-profile"
                  type="url"
                  name="profileUrl"
                  value={formData.profileUrl}
                  onChange={handleInputChange}
                  autoComplete="url"
                  placeholder={t('site.work.apply.profilePh')}
                  className="wk-input placeholder:text-[var(--as-fg-soft)]/60"
                />
                <p id="apply-profile-err" className="wk-err">
                  {t('site.work.apply.errUrl')}
                </p>
              </div>
            </div>

            <div className="wk-field" data-reveal style={rise(4)}>
              <label htmlFor="apply-message" className="wk-label">
                {t('site.work.apply.message')} <span className="wk-opt">({t('site.work.apply.optional')})</span>
              </label>
              <textarea
                id="apply-message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                placeholder={t('site.work.apply.messagePh')}
                className="wk-input placeholder:text-[var(--as-fg-soft)]/60"
              />
            </div>

            <div
              className="flex flex-col gap-4 border-t-[1.5px] border-[var(--as-line-strong)] pt-8 sm:flex-row sm:items-center sm:justify-between"
              data-reveal
              style={rise(5)}
            >
              <p className="max-w-[44ch] text-[14px] leading-relaxed text-[var(--as-fg-soft)]">{t('site.work.apply.note')}</p>
              <button type="submit" className="as-btn as-btn--accent shrink-0">
                <span>{t('site.work.apply.submit')}</span>
                <span className="as-arrow" aria-hidden>
                  →
                </span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Apply;
