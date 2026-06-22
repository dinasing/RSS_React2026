import { screen } from '@testing-library/react';
import { renderWithIntl } from '../../test-utils/renderWithIntl';
import NoRoute from './NoRoute.page';

describe('NoRoutePage', () => {
  it('renders not found message and go home link', () => {
    renderWithIntl(<NoRoute />);

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
