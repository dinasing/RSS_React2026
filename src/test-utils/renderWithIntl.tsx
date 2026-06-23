import { render, type RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactElement } from 'react';
import enMessages from '../../messages/en.json';

type RenderWithIntlOptions = Omit<RenderOptions, 'wrapper'>;

export function renderWithIntl(
  ui: ReactElement,
  options?: RenderWithIntlOptions
) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      {ui}
    </NextIntlClientProvider>,
    options
  );
}
