'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type Locale, LOCALES, t } from '@/lib/i18n';

interface LanguageContextType {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  setLocale: (locale: Locale) => void;
  t: (key: Parameters<typeof t>[1]) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ar');

  const dir = LOCALES.find((l) => l.id === locale)?.dir || 'ltr';

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = LOCALES.find((l) => l.id === newLocale)?.dir || 'ltr';
  }, []);

  const translate = useCallback(
    (key: Parameters<typeof t>[1]) => t(locale, key),
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, dir, setLocale, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
