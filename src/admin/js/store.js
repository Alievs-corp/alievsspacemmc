const KEY = "alievs_space_content_v1";
const LOCALE_KEY = "alievs_space_admin_locale";
const DEFAULT_LOCALE = "en";

function deepMerge(base = {}, overlay = {}) {
  const out = Array.isArray(base) ? [...base] : { ...base };
  Object.entries(overlay || {}).forEach(([key, val]) => {
    if (
      val &&
      typeof val === "object" &&
      !Array.isArray(val) &&
      typeof out[key] === "object" &&
      !Array.isArray(out[key])
    ) {
      out[key] = deepMerge(out[key], val);
    } else {
      out[key] = Array.isArray(val) ? [...val] : val;
    }
  });
  return out;
}

function normalize(data) {
  if (!data) return null;
  if (data.locales) return data;
  const { leads = [], meta = {}, ...legacy } = data;
  const def = data.defaultLocale || DEFAULT_LOCALE;
  return {
    meta,
    leads,
    defaultLocale: def,
    locales: {
      [def]: legacy
    }
  };
}

function persist(data) {
  const safe = structuredClone(data);
  safe.meta = safe.meta || {};
  safe.meta.schemaVersion = 1;
  safe.meta.updatedAt = new Date().toISOString();
  localStorage.setItem(KEY, JSON.stringify(safe));
  return safe;
}

export function getLocale() {
  return localStorage.getItem(LOCALE_KEY) || loadRaw()?.defaultLocale || DEFAULT_LOCALE;
}

export function setLocale(code) {
  if (!code) return;
  localStorage.setItem(LOCALE_KEY, code);
}

export function listLocales() {
  const raw = loadRaw() || { defaultLocale: DEFAULT_LOCALE, locales: { [DEFAULT_LOCALE]: {} } };
  return Object.keys(raw.locales || { [raw.defaultLocale || DEFAULT_LOCALE]: {} });
}

export async function bootstrapIfNeeded() {
  if (localStorage.getItem(KEY)) return;
  try {
    const res = await fetch("../public/data/content.default.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("fetch failed");
    const d = await res.json();
    persist(normalize(d));
  } catch (e) {
    persist(
      normalize({
        meta: { schemaVersion: 1, updatedAt: new Date().toISOString() },
        defaultLocale: DEFAULT_LOCALE,
        settings: {
          brandName: "Alievs Space MMC",
          tagline: "Premium Digital & Commerce Ecosystem",
          email: "hello@alievsspace.com",
          phone: "+994 (00) 000 00 00",
          address: "Azerbaijan",
          social: { instagram: "#", linkedin: "#", youtube: "#" },
          cta: { primaryText: "Request a Proposal", primaryHref: "../public/pages/contact.html" }
        },
        home: { heroTitle: "Build premium digital products that scale.", heroSubtitle: "", highlights: [], proof: [] },
        about: { headline: "About", paragraphs: [], values: [], process: [] },
        services: [],
        projects: [],
        blog: [],
        careers: [],
        leads: []
      })
    );
  }
}

export function loadRaw() {
  const raw = localStorage.getItem(KEY);
  return raw ? normalize(JSON.parse(raw)) : null;
}

export function load(locale = getLocale()) {
  const raw = loadRaw() || normalize({ defaultLocale: DEFAULT_LOCALE, locales: {}, leads: [] });
  const baseKey = raw.defaultLocale || DEFAULT_LOCALE;
  const locales = raw.locales || {};
  const targetKey = locales[locale] ? locale : baseKey;
  const base = locales[baseKey] || {};
  const target = locales[targetKey] || {};
  const merged = deepMerge(base, target);
  return { ...merged, leads: raw.leads || [], defaultLocale: baseKey };
}

export function save(content, locale = getLocale()) {
  if (content && content.locales) {
    return persist(normalize(content));
  }
  const raw = loadRaw() || normalize({ defaultLocale: DEFAULT_LOCALE, locales: {}, leads: [] });
  const { leads = raw.leads || [], ...rest } = content || {};
  raw.defaultLocale = raw.defaultLocale || DEFAULT_LOCALE;
  raw.leads = leads;
  raw.locales = raw.locales || {};
  raw.locales[locale] = deepMerge(raw.locales[locale] || {}, rest);
  return persist(raw);
}

export function reset() {
  localStorage.removeItem(KEY);
}

export function download(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 250);
}

export async function importFile(file) {
  const text = await file.text();
  return normalize(JSON.parse(text));
}

export function uid(prefix = "id") {
  return prefix + "_" + Math.random().toString(16).slice(2);
}
