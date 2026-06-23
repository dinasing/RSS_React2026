'use client';

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { defaultLocale, isLocale, type Locale } from '../../i18n/config';
import {
  LocaleContext,
  LOCALE_STORAGE_KEY,
  messagesByLocale,
} from './Locale.shared';

type LocaleProviderProps = {
  children: ReactNode;
};

const readStoredLocale = (): Locale | null => {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);

    return stored && isLocale(stored) ? stored : null;
  } catch {
    return null;
  }
};

const getInitialLocale = (): Locale => {
  if (typeof window === 'undefined') {
    return defaultLocale;
  }

  return readStoredLocale() ?? defaultLocale;
};

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);

    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    } catch {
      // localStorage may be unavailable
    }
  }, []);

  const messages = messagesByLocale[locale];

  const value = useMemo(
    () => ({
      locale,
      messages,
      setLocale,
    }),
    [locale, messages, setLocale]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}
