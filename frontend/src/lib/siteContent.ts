import { api, CMS_LOCALES, type About, type Locale, type MultiLocale, type Project, type Service } from '@/lib/api';
import { tFor } from '@/lib/i18n';
import { PROJECTS } from '@/components/site/work/projects';

/**
 * The public site ships with built-in copy (translation files). The admin
 * panel manages the same content in the CMS: this module describes the
 * built-in set, copies it into the CMS once, and lets pages prefer CMS data
 * whenever it exists.
 */

/** Service lines shown on /services; `reqs` are leaf names under `<baseKey>.reqs`. */
export const SERVICE_DEFS = [
  { id: 'web-development', baseKey: 'public.services.items.web', reqs: ['premiumUi', 'performancePages', 'analyticsReady', 'cleanDocs'] },
  { id: 'ecommerce', baseKey: 'public.services.items.ecommerce', reqs: ['catalogFiltersSearch', 'cartCheckout', 'commissionPayout', 'ownerDashboards'] },
  { id: 'banking-fintech', baseKey: 'public.services.items.banking', reqs: ['rbac', 'auditReporting', 'secureWorkflow', 'complianceFriendly'] },
] as const;

export const ABOUT_VALUE_KEYS = ['responsibility', 'transparency', 'premiumQuality', 'securityReliability', 'longTermPartnership'] as const;
export const ABOUT_STAGE_KEYS = ['analysis', 'uxui', 'development', 'quality', 'launch', 'support'] as const;

export function builtInService(lang: Locale, def: (typeof SERVICE_DEFS)[number]): Partial<Service> {
  return {
    category: tFor(lang, `${def.baseKey}.category`),
    title: tFor(lang, `${def.baseKey}.title`),
    desc: tFor(lang, `${def.baseKey}.description`),
    bullets: def.reqs.map((r) => tFor(lang, `${def.baseKey}.reqs.${r}`)).filter(Boolean),
  };
}

export function builtInProject(lang: Locale, p: (typeof PROJECTS)[number]): Partial<Project> {
  return {
    title: tFor(lang, `public.home.projects.items.${p.key}.name`),
    industry: '',
    summary: tFor(lang, `public.home.projects.items.${p.key}.description`),
    tags: [],
    link: p.link,
  };
}

export function builtInAbout(lang: Locale): Partial<About> {
  return {
    headline: tFor(lang, 'public.about.headerTitle'),
    paragraphs: [tFor(lang, 'public.about.whoCopy')].filter(Boolean),
    values: ABOUT_VALUE_KEYS.map((k) => tFor(lang, `public.about.who.values.${k}`)),
    process: ABOUT_STAGE_KEYS.map((k) => ({
      title: tFor(lang, `public.about.deliver.items.${k}.title`),
      desc: tFor(lang, `public.about.deliver.items.${k}.text`),
      image: '',
    })),
  };
}

/** Built-in screenshot for a CMS project that has no uploaded image of its own. */
export function builtInProjectImage(link?: string): string | undefined {
  if (!link) return undefined;
  const norm = (u: string) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  return PROJECTS.find((p) => norm(p.link) === norm(link))?.image;
}

export type ImportKind = 'services' | 'projects' | 'about';

/**
 * Copies the site's built-in content into the CMS in every CMS language.
 * Each item is created once, with all languages in a single request.
 */
export async function importBuiltInContent(kind: ImportKind): Promise<number> {
  if (kind === 'about') {
    for (const lang of CMS_LOCALES) await api.admin.updateAbout(lang, builtInAbout(lang));
    return 1;
  }

  // One create request per item, carrying every CMS language.
  const items = kind === 'services' ? [...SERVICE_DEFS] : [...PROJECTS];
  for (const item of items) {
    const body: Record<string, Partial<Service> | Partial<Project>> = {};
    for (const lang of CMS_LOCALES) {
      body[lang] =
        kind === 'services'
          ? builtInService(lang, item as (typeof SERVICE_DEFS)[number])
          : builtInProject(lang, item as (typeof PROJECTS)[number]);
    }
    if (kind === 'services') await api.admin.createService(body as MultiLocale<Service>);
    else await api.admin.createProject(body as MultiLocale<Project>);
  }
  return items.length;
}

/** True when the CMS holds real About content (not an empty shell). */
export function hasAbout(about?: Partial<About> | null): about is About {
  return !!about && !!(about.headline || about.paragraphs?.length || about.values?.length || about.process?.length);
}
