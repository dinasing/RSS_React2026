import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import GoHome from './GoHome.component';

describe('GoHome', () => {
  it('renders a link to the home page', () => {
    render(
      <MemoryRouter>
        <GoHome />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', {
      name: /go back to the home page/i,
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
