import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';
import { Seo } from '@/components/Seo';
import { CtaWalk, PageHero, Pill, Ticker, WordsReveal } from '@/components/site/blocks';
import { CaseList } from '@/components/site/work/CaseList';
import { ProjectsGrid } from '@/components/site/work/ProjectsGrid';
import { projectNames } from '@/components/site/work/projects';
import { accentLast } from '@/components/site/work/text';

const CaseStudies = () => {
  const { t } = useI18n();
  const { loading } = useContent();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="as-mono text-[var(--as-fg-soft)]">{t('admin.loading')}</p>
      </div>
    );
  }

  const heading = t('public.caseStudies.heading', t('nav.caseStudies'));

  return (
    <>
      <Seo page="caseStudies" breadcrumbs={[{ name: t('nav.caseStudies'), path: '/case-studies' }]} />

      <PageHero
        word={t('site.work.cases.word')}
        num="03"
        tone="burnt"
        eyebrow={t('public.caseStudies.eyebrow', 'Selected work')}
        title={heading}
        accent={heading.split(/\s+/).slice(-1)}
        lead={t('public.projectsIntro')}
        crumbs={[{ label: t('nav.home'), to: '/' }, { label: t('nav.caseStudies') }]}
        actions={
          <>
            <Pill href="#work-cases" variant="light">
              {t('site.work.cases.listEyebrow')}
            </Pill>
            <Pill to="/contact" variant="ghost">
              {t('nav.getQuote')}
            </Pill>
          </>
        }
      />

      <section className="as-section">
        <div className="as-wrap grid gap-6">
          <p className="as-eyebrow">{t('public.caseStudies.eyebrow', 'Selected work')}</p>
          <WordsReveal text={t('public.caseStudiesIntro')} className="max-w-[34ch] !text-[clamp(24px,3.3vw,50px)] !leading-[1.12]" />
        </div>
      </section>

      <div id="work-cases" className="as-bg-cream">
        <CaseList />
      </div>

      <Ticker items={projectNames(t)} duration={40} />

      <ProjectsGrid />

      <CtaWalk
        eyebrow={t('public.caseStudies.eyebrow', 'Selected work')}
        title={accentLast(t('public.caseStudies.requestTitle'))}
        lead={t('public.caseStudies.requestCopy')}
        actions={
          <Pill to="/contact" variant="light">
            {t('nav.getQuote')}
          </Pill>
        }
      />
    </>
  );
};

export default CaseStudies;
