import type { CSSProperties } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';
import { builtInProjectImage } from '@/lib/siteContent';
import { Pill, SectionHead, useReveal } from '../blocks';
import { hostOf, PROJECTS } from './projects';
import { ProjectCover } from './ProjectCover';
import './work.css';

/**
 * Screenshot grid of live sites: each shot wipes in from the left and settles
 * from a slight zoom, then zooms gently on hover.
 */
export function ProjectsGrid({ limit, showAll }: { limit?: number; showAll?: boolean } = {}) {
  const { t } = useI18n();
  const { content } = useContent();
  const ref = useReveal();

  // Projects managed in the admin panel win; the built-in set shows until there are any.
  const cms = content?.projects ?? [];
  const items = cms.length
    ? cms.map((p) => ({
        key: p.id,
        link: p.link || '#',
        image: p.image || builtInProjectImage(p.link) || '',
        name: p.title,
        description: p.summary,
      }))
    : PROJECTS.map((p) => ({
        key: p.key,
        link: p.link,
        image: p.image as string,
        name: t(`public.home.projects.items.${p.key}.name`),
        description: t(`public.home.projects.items.${p.key}.description`),
      }));

  const shown = limit ? items.slice(0, limit) : items;

  return (
    <section className="as-section" aria-labelledby="work-projects-title">
      <div className="as-wrap">
        <SectionHead
          id="work-projects-title"
          eyebrow={t('site.work.cases.projectsEyebrow')}
          title={t('public.home.projects.title')}
          lead={t('public.home.projects.copy')}
          size="md"
        />
        <div ref={ref} className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12 md:mt-16 lg:grid-cols-3">
          {shown.map((p, i) => {
            const name = p.name;
            const host = hostOf(p.link);
            const delay = { '--d': `${(i % 3) * 110}ms` } as CSSProperties;
            return (
              <article key={p.key} className={i % 3 === 1 ? 'lg:translate-y-14' : undefined}>
                <a href={p.link} target="_blank" rel="noopener noreferrer" className="wk-proj group">
                  <div className="wk-wipe" data-reveal style={delay}>
                    <div className="wk-shot wk-wipe__in">
                      {p.image ? <img src={p.image} alt={name} loading="lazy" decoding="async" width={1900} height={938} /> : <ProjectCover name={name} />}
                      <span className="wk-shot__host">{host}</span>
                    </div>
                  </div>
                  <div className="grid gap-1 sm:gap-2" data-reveal style={delay}>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="wk-proj__name as-h3 !text-[clamp(15px,1.8vw,26px)]">{name}</h3>
                      <span className="as-mono hidden shrink-0 text-[var(--as-fg-soft)] sm:inline">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <p className="line-clamp-2 text-[12px] leading-snug text-[var(--as-fg-soft)] sm:line-clamp-none sm:text-[15px] sm:leading-relaxed">{p.description}</p>
                    <span className="as-mono mt-0.5 inline-flex items-center gap-2 sm:mt-1 text-[var(--as-accent)]">
                      {t('ui.openSite')}
                      <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
                        ↗
                      </span>
                    </span>
                  </div>
                </a>
              </article>
            );
          })}
        </div>
        {showAll && (
          <div className="mt-12 flex justify-center md:mt-20">
            <Pill to="/case-studies" variant="ink">
              {t('nav.caseStudies')}
            </Pill>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProjectsGrid;
