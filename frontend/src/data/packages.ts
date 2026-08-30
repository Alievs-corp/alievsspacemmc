/**
 * Single source of truth for package pricing.
 *
 * Prices are in AZN — the currency switcher converts them at display time.
 * Copy (names, feature lists, taglines) lives in the locale bundles under
 * `packages.tiers.*`, so editing a price here never touches a translation.
 */
export interface PackageTier {
  id: 'landing' | 'business' | 'ecommerce' | 'platform';
  /** Base price in AZN. */
  price: number;
  /** true → render as "from X" rather than an exact figure. */
  startingAt: boolean;
  featured?: boolean;
  /** Number of feature bullets in `packages.tiers.<id>.features`. */
  accent: string;
}

/**
 * Positioned against the Baku market (reviewed August 2026): local studios
 * advertise corporate sites from ~350-1,000 AZN and online stores from
 * ~1,500 AZN, mostly template-based. These sit above that floor because every
 * tier is custom-designed and carries a warranty, but well inside reach for a
 * local SMB — the average monthly wage in Baku is roughly 1,375 AZN.
 */
export const PACKAGE_TIERS: PackageTier[] = [
  { id: 'landing', price: 690, startingAt: false, accent: 'from-ink-700 to-ink-800' },
  { id: 'business', price: 1490, startingAt: false, featured: true, accent: 'from-orange-600 to-orange-800' },
  { id: 'ecommerce', price: 2990, startingAt: false, accent: 'from-ink-700 to-ink-800' },
  { id: 'platform', price: 6900, startingAt: true, accent: 'from-ink-700 to-ink-800' },
];

/**
 * Add-on prices in AZN. Names and descriptions stay in the locale bundles
 * under `packages.addons.items`, matched to this list by position — prices
 * must not live in ten translation files that can drift apart.
 */
export interface Addon {
  /** Index into `packages.addons.items` in the locale bundle. */
  price: number;
  recurring?: boolean;
}

export const ADDONS: Addon[] = [
  { price: 190 },                    // extra language
  { price: 3900 },                   // mobile app (iOS + Android)
  { price: 390, recurring: true },   // monthly SEO programme
  { price: 120, recurring: true },   // care & hosting plan
  { price: 590 },                    // brand identity
  { price: 290 },                    // copywriting
];

/** Rows of the comparison table; values map tier id → cell content. */
export interface ComparisonRow {
  labelKey: string;
  values: Record<PackageTier['id'], string | boolean>;
}

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    labelKey: 'compareLabels.pages',
    values: { landing: '1', business: '12', ecommerce: '∞', platform: '∞' },
  },
  {
    labelKey: 'compareLabels.languages',
    values: { landing: '1', business: '3', ecommerce: '3+', platform: '10' },
  },
  {
    labelKey: 'compareLabels.admin',
    values: { landing: false, business: true, ecommerce: true, platform: true },
  },
  {
    labelKey: 'compareLabels.blog',
    values: { landing: false, business: true, ecommerce: true, platform: true },
  },
  {
    labelKey: 'compareLabels.payments',
    values: { landing: false, business: false, ecommerce: true, platform: true },
  },
  {
    labelKey: 'compareLabels.inventory',
    values: { landing: false, business: false, ecommerce: true, platform: true },
  },
  {
    labelKey: 'compareLabels.rbac',
    values: { landing: false, business: false, ecommerce: false, platform: true },
  },
  {
    labelKey: 'compareLabels.integrations',
    values: { landing: false, business: false, ecommerce: true, platform: true },
  },
  {
    labelKey: 'compareLabels.mobileApp',
    values: { landing: false, business: false, ecommerce: false, platform: true },
  },
  {
    labelKey: 'compareLabels.seo',
    values: { landing: 'compareLabels.basic', business: 'compareLabels.advanced', ecommerce: 'compareLabels.advanced', platform: 'compareLabels.advanced' },
  },
  {
    labelKey: 'compareLabels.warranty',
    values: {
      landing: 'compareLabels.warranty30',
      business: 'compareLabels.warranty90',
      ecommerce: 'compareLabels.warranty6m',
      platform: 'compareLabels.warranty12m',
    },
  },
  {
    labelKey: 'compareLabels.manager',
    values: { landing: false, business: false, ecommerce: false, platform: true },
  },
];
