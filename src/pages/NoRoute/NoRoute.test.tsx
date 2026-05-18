import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import NoRoute from './NoRoute.page';

describe('NoRoutePage', () => {
  it('renders not found message and go home link', () => {
    render(
      <MemoryRouter>
        <NoRoute />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /nothing on this route/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/the page you are looking for does not exist/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /go back to the home page/i })
    ).toHaveAttribute('href', '/');
  });
});
