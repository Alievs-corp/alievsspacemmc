/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import {
  getLocale,
  getLocaleMeta,
  setLocale,
  setScopedLocale,
  t as tLib,
  tRaw as tRawLib,
  type Locale,
  type LocaleMeta,
  SUPPORTED_LOCALES,
} from '@/lib/i18n';

interface I18nContextType {
  locale: Locale;
  /** BCP-47 tag for <html lang>, hreflang and Intl formatting. */
  localeTag: string;
  localeMeta: LocaleMeta;
  setLocale: (locale: Locale) => void;
  /**
   * Gives one section (the CRM) its own language on top of the site choice;
   * `null` returns to the site language. The site choice is left untouched.
   */
  setScope: (locale: Locale | null) => void;
  t: (key: string, fallback?: string) => string;
  /** Raw lookup for lists and objects (feature arrays, FAQ items, steps). */
  tRaw: <T = any>(key: string, fallback?: T) => T;
  supportedLocales: LocaleMeta[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [siteLocale, setSiteLocale] = useState<Locale>(getLocale());
  const [scope, setScopeState] = useState<Locale | null>(null);
  const locale = scope ?? siteLocale;

  useEffect(() => {
    setLocale(siteLocale);
  }, [siteLocale]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('localechange', { detail: locale }));
  }, [locale]);

  const handleSetLocale = useCallback((newLocale: Locale) => {
    setSiteLocale(newLocale);
    setLocale(newLocale);
  }, []);

  const handleSetScope = useCallback((code: Locale | null) => {
    // The lib is updated first so the re-render this triggers already reads it.
    setScopedLocale(code);
    setScopeState(code);
  }, []);

  const value = useMemo<I18nContextType>(() => {
    const meta = getLocaleMeta(locale);
    return {
      locale,
      localeTag: meta.tag,
      localeMeta: meta,
      setLocale: handleSetLocale,
      setScope: handleSetScope,
      // `locale` is in the dep list so every consumer re-renders on a switch.
      t: (key: string, fallback = '') => tLib(key, fallback),
      tRaw: <T,>(key: string, fallback?: T) => tRawLib<T>(key, fallback),
      supportedLocales: SUPPORTED_LOCALES,
    };
  }, [locale, handleSetLocale, handleSetScope]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
