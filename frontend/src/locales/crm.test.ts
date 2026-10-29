import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CRM } from './crm';

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
