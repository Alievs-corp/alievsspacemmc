import { describe, expect, it } from 'vitest';
import { isoDay, presetRange } from './crmAnalytics';
import { qs } from './crm';

describe('presetRange', () => {
  it('covers the previous month, across the year end', () => {
    expect(presetRange('lastMonth', new Date(2026, 0, 15))).toEqual({ from: '2025-12-01', to: '2025-12-31' });
    expect(presetRange('lastMonth', new Date(2024, 2, 31))).toEqual({ from: '2024-02-01', to: '2024-02-29' });
  });

  it('starts the quarter on its first month', () => {
    expect(presetRange('quarter', new Date(2026, 4, 20))).toEqual({ from: '2026-04-01', to: '2026-05-20' });
    expect(presetRange('quarter', new Date(2026, 0, 1))).toEqual({ from: '2026-01-01', to: '2026-01-01' });
  });

  it('counts rolling periods inclusively', () => {
    expect(presetRange('7d', new Date(2026, 2, 3))).toEqual({ from: '2026-02-25', to: '2026-03-03' });
    expect(presetRange('30d', new Date(2026, 0, 10)).from).toBe('2025-12-12');
    expect(presetRange('year', new Date(2026, 9, 30))).toEqual({ from: '2026-01-01', to: '2026-10-30' });
  });
});

describe('isoDay', () => {
  it('uses the local date with padding', () => {
    expect(isoDay(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });
});

describe('qs', () => {
  it('drops empty values but keeps zero', () => {
    expect(qs({ a: '', b: false, c: 0, d: null, e: undefined })).toBe('?c=0');
    expect(qs({})).toBe('');
    expect(qs({ q: 'a b&c', mine: true })).toBe('?q=a+b%26c&mine=true');
  });
});
