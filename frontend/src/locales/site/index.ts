/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Copy written for the "walk" redesign of the public site. Every file in this
 * folder default-exports `{ en: {...}, az: {...}, ru: {...}, ... }` and is
 * merged over the base bundles, so each page group owns its own file and no
 * two groups ever edit the same locale module.
 */
const modules = import.meta.glob<{ default: Record<string, Record<string, any>> }>(
  ['./*.ts', '!./index.ts'],
  { eager: true },
);

function deepMerge(base: Record<string, any>, extra: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = { ...base };
  for (const [key, value] of Object.entries(extra || {})) {
    const cur = out[key];
    out[key] =
      value && typeof value === 'object' && !Array.isArray(value) && cur && typeof cur === 'object' && !Array.isArray(cur)
        ? deepMerge(cur, value)
        : value;
  }
  return out;
}

export const SITE: Record<string, Record<string, any>> = Object.values(modules).reduce(
  (acc, mod) => {
    for (const [code, bundle] of Object.entries(mod.default || {})) {
      acc[code] = deepMerge(acc[code] || {}, bundle);
    }
    return acc;
  },
  {} as Record<string, Record<string, any>>,
);

export default SITE;
