import type { WallTone } from '../blocks';

/**
 * The delivered case studies, in reading order. `key` addresses the card copy
 * under `public.caseStudies.items.*`, `ns` the detail page copy under
 * `public.<ns>.*`.
 */
export interface CaseEntry {
  slug: string;
  key: 'marketplace' | 'fintech' | 'operations';
  ns: 'marketplaceMvp' | 'fintechDashboard' | 'inventory';
  tone: WallTone;
}

export const CASES: CaseEntry[] = [
  { slug: 'marketplace-mvp', key: 'marketplace', ns: 'marketplaceMvp', tone: 'amber' },
  { slug: 'fintech-reporting-dashboard', key: 'fintech', ns: 'fintechDashboard', tone: 'rust' },
  { slug: 'operations-inventory-system', key: 'operations', ns: 'inventory', tone: 'mustard' },
];

/** Splits "Industry: E-commerce" into its label and value (no colon → value only). */
export function splitFact(text: string): { label: string; value: string } {
  const i = text.search(/[:：]/);
  if (i <= 0) return { label: '', value: text };
  return { label: text.slice(0, i).trim(), value: text.slice(i + 1).trim() };
}
