'use client';

import { useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage/useLocalStorage.hook';
import { defaultLocale, isLocale, type Locale } from '../../i18n/config';
import {
  LocaleContext,
  LOCALE_STORAGE_KEY,
  messagesByLocale,
} from './Locale.shared';

type LocaleProviderProps = {
  children: ReactNode;
};

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [storedLocale, setStoredLocale] = useLocalStorage(
    LOCALE_STORAGE_KEY,
    null
  );
  const locale =
    storedLocale && isLocale(storedLocale) ? storedLocale : defaultLocale;
  const messages = messagesByLocale[locale];

  const value = useMemo(
    () => ({
      locale,
      messages,
      setLocale: (nextLocale: Locale) => {
        setStoredLocale(nextLocale);
      },
    }),
    [locale, messages, setStoredLocale]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}
