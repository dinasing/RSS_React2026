import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { renderWithIntl } from '../../test-utils/renderWithIntl';
import GoHome from './GoHome.component';

describe('GoHome', () => {
  it('renders a link to the home page', () => {
    renderWithIntl(
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
