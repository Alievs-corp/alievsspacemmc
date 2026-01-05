import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getLocale, setLocale, t as tLib, type Locale, SUPPORTED_LOCALES } from '@/lib/i18n';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string) => string;
  supportedLocales: typeof SUPPORTED_LOCALES;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getLocale());

  useEffect(() => {
    setLocale(locale);
    document.documentElement.lang = locale;
    const event = new CustomEvent('localechange', { detail: locale });
    window.dispatchEvent(event);
  }, [locale]);

  const handleSetLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setLocale(newLocale);
  };

  const t = (key: string, fallback = ''): string => {
    return tLib(key, fallback);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t, supportedLocales: SUPPORTED_LOCALES }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

