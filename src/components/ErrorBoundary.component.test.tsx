import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ErrorBoundaryComponent from './ErrorBoundary.component';

function ThrowOnce({ message }: { message: string }): never {
  throw new Error(message);
}

function Host({ mode }: { mode: 'throw' | 'ok' }) {
  return (
    <ErrorBoundaryComponent>
      {mode === 'throw' ? (
        <ThrowOnce message="Recoverable" />
      ) : (
        <div>Child ok</div>
      )}
    </ErrorBoundaryComponent>
  );
}

describe('ErrorBoundaryComponent', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundaryComponent>
        <div>Safe content</div>
      </ErrorBoundaryComponent>
    );

    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('shows fallback UI and logs when a child throws', () => {
    render(
      <ErrorBoundaryComponent>
        <ThrowOnce message="Boundary test error" />
      </ErrorBoundaryComponent>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/oops! something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/boundary test error/i)).toBeInTheDocument();
    expect(console.error).toHaveBeenCalled();
  });

  it('resets after the timeout when children no longer throw', () => {
    vi.useFakeTimers();

    const { rerender } = render(<Host mode="throw" />);

    expect(screen.getByRole('alert')).toBeInTheDocument();

    rerender(<Host mode="ok" />);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Child ok')).toBeInTheDocument();
  });

  it('clears the reset timer on unmount', () => {
    vi.useFakeTimers();
    const { unmount } = render(
      <ErrorBoundaryComponent>
        <ThrowOnce message="Unmount me" />
      </ErrorBoundaryComponent>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    unmount();

    expect(() => {
      vi.advanceTimersByTime(3000);
    }).not.toThrow();
  });
});
