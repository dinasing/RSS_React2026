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

    expect(
      screen.getByRole('radiogroup', { name: /language/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /english/i })).toHaveAttribute(
      'aria-checked',
      'true'
    );
    expect(screen.getByRole('radio', { name: /русский/i })).toHaveAttribute(
      'aria-checked',
      'false'
    );
  });

  it('persists selected locale to localStorage', async () => {
    const user = userEvent.setup();
    render(
      <Providers>
        <LocaleSwitcher />
      </Providers>
    );

    await user.click(screen.getByRole('radio', { name: /русский/i }));

    expect(localStorage.getItem('locale')).toBe('ru');
  });
});
