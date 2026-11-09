import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CRM } from './crm';
import az from './az';
import ru from './ru';
import { EXTRA } from './extra/index';
import { PANEL } from './panel';

// Every CRM string used in the code needs a Russian and an Azerbaijani
// translation; English is the fallback written next to each t() call.

const SRC = join(__dirname, '..');

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.tsx?$/.test(name) && !name.endsWith('.test.ts') ? [path] : [];
  });
}

function lookup(lang: string, key: string): unknown {
  return key.split('.').reduce<unknown>((node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined), CRM[lang].crm);
}

const sources = files(SRC).map((f) => readFileSync(f, 'utf8'));

describe('CRM translations', () => {
  const keys = new Set<string>();
  for (const s of sources) {
    for (const m of s.matchAll(/\bt\(\s*'crm\.([A-Za-z0-9_.]+)'/g)) keys.add(m[1]);
  }

  it('finds the CRM keys in the code', () => {
    expect(keys.size).toBeGreaterThan(300);
  });

  for (const lang of ['ru', 'az']) {
    it(`has every key in ${lang}`, () => {
      const missing = [...keys].filter((k) => typeof lookup(lang, k) !== 'string');
      expect(missing).toEqual([]);
    });
  }

  // Shared keys (ui.*, admin.*, panel.*…) used on CRM pages. Looked up in the
  // language's own bundles, without the English fallback t() would apply.
  const crmSources = files(SRC)
    .filter((f) => /[\\/](pages|components)[\\/]crm[\\/]|CrmContext|[\\/]admin[\\/]ui\.tsx$/.test(f))
    .map((f) => readFileSync(f, 'utf8'));
  const shared = new Set<string>();
  for (const s of crmSources) {
    for (const m of s.matchAll(/\bt\(\s*'((?!crm\.)[A-Za-z0-9_.]+)'/g)) shared.add(m[1]);
  }
  const bundles: Record<string, unknown[]> = { az: [az, EXTRA.az, PANEL.az], ru: [ru, EXTRA.ru, PANEL.ru] };
  const path = (o: unknown, k: string) => k.split('.').reduce<unknown>((n, p) => (n && typeof n === 'object' ? (n as Record<string, unknown>)[p] : undefined), o);

  for (const lang of ['ru', 'az']) {
    it(`has every shared key used on CRM pages in ${lang}`, () => {
      expect(shared.size).toBeGreaterThan(5);
      const missing = [...shared].filter((k) => !bundles[lang].some((b) => typeof path(b, k) === 'string'));
      expect(missing).toEqual([]);
    });
  }

  it('has the plural forms used by plural()', () => {
    const names = new Set<string>();
    for (const s of sources) {
      for (const m of s.matchAll(/\bplural\([^,]+,\s*'([A-Za-z]+)'/g)) names.add(m[1]);
    }
    expect(names.size).toBeGreaterThan(0);
    const missing: string[] = [];
    for (const name of names) {
      for (const form of ['one', 'few', 'many', 'other']) if (typeof lookup('ru', `plural.${name}.${form}`) !== 'string') missing.push(`ru ${name}.${form}`);
      for (const form of ['one', 'other']) if (typeof lookup('az', `plural.${name}.${form}`) !== 'string') missing.push(`az ${name}.${form}`);
    }
    expect(missing).toEqual([]);
  });
});
