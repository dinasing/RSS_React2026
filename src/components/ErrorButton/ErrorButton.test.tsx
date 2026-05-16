import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundaryComponent from '../ErrorBoundary/ErrorBoundary.component';
import ErrorButtonComponent from './ErrorButton.component';

describe('ErrorButtonComponent', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throws on click and the boundary shows fallback UI', async () => {
    const user = userEvent.setup();
    render(
      <ErrorBoundaryComponent>
        <ErrorButtonComponent />
      </ErrorBoundaryComponent>
    );

    await user.click(
      screen.getByRole('button', { name: /click to see the error/i })
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      /oops! something went wrong/i
    );
    expect(
      screen.getByText(/you clicked the button to see the error/i)
    ).toBeInTheDocument();
    expect(console.error).toHaveBeenCalled();
  });
});
