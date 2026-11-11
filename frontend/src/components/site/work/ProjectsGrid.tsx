import type { CSSProperties } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { SectionHead, useReveal } from '../blocks';
import { hostOf, PROJECTS } from './projects';
import './work.css';

/**
 * Screenshot grid of live sites: each shot wipes in from the left and settles
 * from a slight zoom, then zooms gently on hover.
 */
export function ProjectsGrid() {
  const { t } = useI18n();
  const ref = useReveal();

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
        <div ref={ref} className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {PROJECTS.map((p, i) => {
            const name = t(`public.home.projects.items.${p.key}.name`);
            const host = hostOf(p.link);
            const delay = { '--d': `${(i % 3) * 110}ms` } as CSSProperties;
            return (
              <article key={p.key} className={i % 3 === 1 ? 'lg:translate-y-14' : undefined}>
                <a href={p.link} target="_blank" rel="noopener noreferrer" className="wk-proj group">
                  <div className="wk-wipe" data-reveal style={delay}>
                    <div className="wk-shot wk-wipe__in">
                      <img src={p.image} alt={name} loading="lazy" decoding="async" width={1900} height={938} />
                      <span className="wk-shot__host">{host}</span>
                    </div>
                  </div>
                  <div className="grid gap-2" data-reveal style={delay}>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="wk-proj__name as-h3 !text-[clamp(20px,1.8vw,26px)]">{name}</h3>
                      <span className="as-mono shrink-0 text-[var(--as-fg-soft)]">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <p className="text-[15px] leading-relaxed text-[var(--as-fg-soft)]">{t(`public.home.projects.items.${p.key}.description`)}</p>
                    <span className="as-mono mt-1 inline-flex items-center gap-2 text-[var(--as-accent)]">
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
      </div>
    </section>
  );
}

export default ProjectsGrid;
