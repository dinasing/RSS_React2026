import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Providers } from '../../app/providers';
import LocaleSwitcher from './LocaleSwitcher.component';

describe('LocaleSwitcher', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders language selector with English and Russian options', () => {
    render(
      <Providers>
        <LocaleSwitcher />
      </Providers>
    );

    const select = screen.getByRole('combobox', { name: /language/i });
    expect(select).toHaveValue('en');
    expect(
      screen.getByRole('option', { name: /english/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: /русский/i })
    ).toBeInTheDocument();
  });

  it('persists selected locale to localStorage', async () => {
    const user = userEvent.setup();
    render(
      <Providers>
        <LocaleSwitcher />
      </Providers>
    );

    await user.selectOptions(
      screen.getByRole('combobox', { name: /language/i }),
      'ru'
    );

    expect(localStorage.getItem('locale')).toBe('ru');
  });
});
