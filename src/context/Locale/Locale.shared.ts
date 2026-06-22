import { createContext, useContext } from 'react';
import type { AbstractIntlMessages } from 'use-intl';
import enMessages from '../../../messages/en.json';
import ruMessages from '../../../messages/ru.json';
import { type Locale } from '../../i18n/config';

export type LocaleContextValue = {
  locale: Locale;
  messages: AbstractIntlMessages;
  setLocale: (locale: Locale) => void;
};

export const LocaleContext = createContext<LocaleContextValue | undefined>(
  undefined
);

export const LOCALE_STORAGE_KEY = 'locale';

export const messagesByLocale: Record<Locale, AbstractIntlMessages> = {
  en: enMessages,
  ru: ruMessages,
};

export const useLocaleContext = () => {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error('useLocaleContext must be used within LocaleProvider');
  }

  return context;
};
