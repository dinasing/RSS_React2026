import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Navigation from './Navigation.component';

describe('Navigation', () => {
  it('renders home and about links', () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute(
      'href',
      '/'
    );
    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute(
      'href',
      '/about'
    );
  });
});
