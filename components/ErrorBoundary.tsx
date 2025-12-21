import React, { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary - Catches and displays React component errors gracefully
 * Prevents entire app from crashing if a component fails to render
 * 
 * @example
 * <ErrorBoundary fallback={<ErrorFallback />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-slate-900 p-6">
            <div className="max-w-md space-y-6 text-center">
              <div className="flex justify-center">
                <AlertCircle className="w-16 h-16 text-red-500" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Oops! Something went wrong
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  We encountered an unexpected error. Please try refreshing the page.
                </p>
              </div>
              <details className="text-left bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <summary className="cursor-pointer font-semibold text-slate-900 dark:text-white mb-2">
                  Error details
                </summary>
                <pre className="text-xs text-slate-600 dark:text-slate-400 overflow-auto max-h-32">
                  {this.state.error?.message || 'Unknown error'}
                  {'\n\n'}
                  {this.state.error?.stack}
                </pre>
              </details>
              <button
                onClick={this.resetError}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Try again
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
