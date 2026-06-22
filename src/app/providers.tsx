'use client';

import { NextIntlClientProvider } from 'next-intl';
import { Provider } from 'react-redux';
import {
  LocaleProvider,
  useLocaleContext,
} from '../context/Locale/Locale.context';
import { ThemeProvider } from '../context/Theme/Theme.context';
import LocaleSync from '../components/LocaleSync/LocaleSync.component';
import { store } from '../store/store';

type ProvidersProps = {
  children: React.ReactNode;
};

function IntlProvider({ children }: ProvidersProps) {
  const { locale, messages } = useLocaleContext();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleSync />
      {children}
    </NextIntlClientProvider>
  );
}

export function Providers({ children }: ProvidersProps) {
  return (
    <LocaleProvider>
      <IntlProvider>
        <ThemeProvider>
          <Provider store={store}>{children}</Provider>
        </ThemeProvider>
      </IntlProvider>
    </LocaleProvider>
  );
}
