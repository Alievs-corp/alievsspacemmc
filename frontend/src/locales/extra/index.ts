/* eslint-disable @typescript-eslint/no-explicit-any */
import enExtra from './en';
import azExtra from './az';
import ruExtra from './ru';
import deExtra from './de';
import frExtra from './fr';
import kaExtra from './ka';
import zhExtra from './zh';
import jaExtra from './ja';
import koExtra from './ko';
import viExtra from './vi';
import COMPARE_LABELS from './compare';

/**
 * Marketing/SEO content that lives outside the original page bundles.
 * Merged over the base locale in `@/lib/i18n`; anything missing here falls
 * back to English, so a partially translated locale still renders fully.
 */
const BUNDLES: Record<string, Record<string, any>> = {
  en: enExtra,
  az: azExtra,
  ru: ruExtra,
  de: deExtra,
  fr: frExtra,
  ka: kaExtra,
  zh: zhExtra,
  ja: jaExtra,
  ko: koExtra,
  vi: viExtra,
};

export const EXTRA: Record<string, Record<string, any>> = Object.fromEntries(
  Object.entries(BUNDLES).map(([code, bundle]) => [
    code,
    // Comparison-table labels live in their own file; graft them onto `packages`.
    { ...bundle, packages: { ...bundle.packages, compareLabels: COMPARE_LABELS[code] } },
  ]),
);

export default EXTRA;
