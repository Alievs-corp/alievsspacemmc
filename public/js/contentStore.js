/**
 * Durable client-side store:
 * - Uses schemaVersion + migration hook
 * - Public site reads: localStorage override -> defaults from /data/content.default.json
 * - Admin writes to localStorage, exports/imports JSON, resets safely
 */
import { DEFAULT_LOCALE, getLocale } from "./i18n.js";

const KEY = "alievs_space_content_v1";

function normalize(data) {
  if (!data) return null;
  if (data.locales) return data;
  const { leads = [], meta = {}, ...legacyLocales } = data;
  return {
    meta,
    leads,
    defaultLocale: data.defaultLocale || DEFAULT_LOCALE,
    locales: {
      [data.defaultLocale || DEFAULT_LOCALE]: legacyLocales
    }
  };
}

function mergeDeep(base = {}, overlay = {}) {
  const out = Array.isArray(base) ? [...base] : { ...base };
  Object.entries(overlay || {}).forEach(([key, val]) => {
    if (
      val &&
      typeof val === "object" &&
      !Array.isArray(val) &&
      typeof out[key] === "object" &&
      !Array.isArray(out[key])
    ) {
      out[key] = mergeDeep(out[key], val);
    } else {
      out[key] = Array.isArray(val) ? [...val] : val;
    }
  });
  return out;
}

export async function loadDefaultContent() {
  const res = await fetch("../data/content.default.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("Failed to load default content");
  const raw = await res.json();
  return normalize(raw);
}

export function getStoredContent() {
  try{
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return normalize(parsed);
  }catch(e){
    console.warn("Bad localStorage content, ignoring.", e);
    return null;
  }
}

export function saveStoredContent(content) {
  const safe = structuredClone(content);
  safe.meta = safe.meta || {};
  safe.meta.schemaVersion = 1;
  safe.meta.updatedAt = new Date().toISOString();
  localStorage.setItem(KEY, JSON.stringify(safe));
  return safe;
}

export function clearStoredContent() {
  localStorage.removeItem(KEY);
}

function resolveLocaleData(raw, locale) {
  const data = normalize(raw);
  if (!data) return null;
  const locales = data.locales || {};
  const baseKey = data.defaultLocale || DEFAULT_LOCALE;
  const targetKey = locales[locale] ? locale : baseKey;
  const base = locales[baseKey] || {};
  const target = locales[targetKey] || {};
  return {
    ...mergeDeep(base, target),
    leads: data.leads || [],
    meta: data.meta || {},
    locale: targetKey
  };
}

export async function getContent(locale = getLocale()) {
  const stored = getStoredContent();
  const normalizedStored = stored ? resolveLocaleData(stored, locale) : null;
  if (normalizedStored) return normalizedStored;
  const defaults = await loadDefaultContent();
  return resolveLocaleData(defaults, locale);
}

export function upsertLead(lead) {
  const content = getStoredContent();
  const safe = content || { defaultLocale: DEFAULT_LOCALE, locales: { [DEFAULT_LOCALE]: {} }, leads: [] };
  safe.leads = safe.leads || [];
  safe.leads.unshift(lead);
  saveStoredContent(safe);
  return lead;
}

export function ensureAdminBootstrap() {
  // If no content exists in localStorage yet, bootstrap defaults for admin editing.
  if (getStoredContent()) return;
  // Admin is under /admin, so default file is at ../public/data/...
  // But some browsers block file:// fetch. We'll use an inline fallback if fetch fails.
}

export function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url), 250);
}

export async function importJSONFile(file) {
  const text = await file.text();
  const data = JSON.parse(text);
  return data;
}
