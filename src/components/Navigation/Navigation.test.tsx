import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ThemeProvider } from '../../context/Theme/Theme.context';
import { renderWithIntl } from '../../test-utils/renderWithIntl';
import Navigation from './Navigation.component';

describe('Navigation', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark');
  });

  it('renders home and about links', () => {
    renderWithIntl(
      <ThemeProvider>
        <MemoryRouter>
          <Navigation />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute(
      'href',
      '/'
    );
    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute(
      'href',
      '/about'
    );
    expect(
      screen.getByRole('button', { name: /theme: light/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /language/i })
    ).toBeInTheDocument();
  });
});
