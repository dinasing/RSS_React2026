import { Component, type ErrorInfo } from 'react';

type ErrorBoundaryComponentProps = {
  children: React.ReactNode;
};

type ErrorBoundaryComponentState = {
  hasError: boolean;
  errorMessage: string | null;
};

class ErrorBoundaryComponent extends Component<
  ErrorBoundaryComponentProps,
  ErrorBoundaryComponentState
> {
  private resetTimerId: number | null = null;

  state: ErrorBoundaryComponentState = { hasError: false, errorMessage: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryComponentState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(error, errorInfo);
    this.startResetTimer();
  }

  componentWillUnmount(): void {
    if (this.resetTimerId !== null) {
      window.clearTimeout(this.resetTimerId);
    }
  }

  private startResetTimer(): void {
    if (this.resetTimerId !== null) {
      window.clearTimeout(this.resetTimerId);
    }

    this.resetTimerId = window.setTimeout(() => {
      this.setState({ hasError: false, errorMessage: null });
      this.resetTimerId = null;
    }, 3000);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 p-4 text-red-900"
        >
          <strong className="block font-semibold">
            Oops! Something went wrong.
          </strong>

          {this.state.errorMessage ? (
            <pre className="mt-2 overflow-x-auto rounded bg-red-100/80 p-2 text-xs">
              {this.state.errorMessage}
            </pre>
          ) : null}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundaryComponent;
