import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { api, type Content, type Locale } from '@/lib/api';
import { getLocale } from '@/lib/i18n';

interface ContentContextType {
  content: Content | null;
  loading: boolean;
  error: string | null;
  refresh: (locale?: Locale) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getLocale());
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async (currentLocale: Locale) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getContent(currentLocale);
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentLocale = getLocale();
    setLocaleState(currentLocale);
    fetchContent(currentLocale);
  }, []);

  useEffect(() => {
    const handleLocaleChange = (e: CustomEvent) => {
      const newLocale = e.detail as Locale;
      if (newLocale !== locale) {
        setLocaleState(newLocale);
        fetchContent(newLocale);
      }
    };
    window.addEventListener('localechange', handleLocaleChange as EventListener);
    return () => {
      window.removeEventListener('localechange', handleLocaleChange as EventListener);
    };
  }, [locale]);

  const refresh = async (newLocale?: Locale) => {
    await fetchContent(newLocale || locale);
  };

  return (
    <ContentContext.Provider value={{ content, loading, error, refresh }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within ContentProvider');
  }
  return context;
}

