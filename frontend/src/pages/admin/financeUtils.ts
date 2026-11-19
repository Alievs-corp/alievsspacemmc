/** Small helpers shared by the finance sheet components. */

/** Parses what a user typed ("12,5", "1 200") into a number; anything else is 0. */
export const num = (s: string) => {
  const n = parseFloat(String(s).replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};

export const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/** Stable id for rows created in the browser. */
export const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
