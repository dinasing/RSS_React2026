'use client';

import { Provider } from 'react-redux';
import { ThemeProvider } from '../context/Theme/Theme.context';
import { store } from '../store/store';

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );
}
