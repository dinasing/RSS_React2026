import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Navigation from '../../components/Navigation/Navigation.component';
import { ThemeProvider } from './Theme.context';

const renderNavigationWithThemeProvider = () =>
  render(
    <ThemeProvider>
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    </ThemeProvider>
  );

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark');
  });

  it('uses light theme by default and syncs it with documentElement', async () => {
    renderNavigationWithThemeProvider();

    expect(
      screen.getByRole('button', { name: /theme: light/i })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    });
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('restores dark theme from localStorage', async () => {
    localStorage.setItem('theme', 'dark');

    renderNavigationWithThemeProvider();

    expect(
      screen.getByRole('button', { name: /theme: dark/i })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    });
    expect(document.documentElement).toHaveClass('dark');
  });

  it('toggles theme and keeps documentElement in sync', async () => {
    const user = userEvent.setup();

    renderNavigationWithThemeProvider();

    await user.click(screen.getByRole('button', { name: /theme: light/i }));

    expect(
      screen.getByRole('button', { name: /theme: dark/i })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    });
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
