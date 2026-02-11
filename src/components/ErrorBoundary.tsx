import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // You can log to an error reporting service here
    this.setState({
      error,
      errorInfo,
    });

    // Example: Send to error tracking service
    // logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    this.handleReset();
    window.location.href = '/';
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Custom fallback UI if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 text-center mb-4">
              Что-то пошло не так
            </h1>

            <p className="text-slate-600 text-center mb-6">
              Произошла непредвиденная ошибка. Пожалуйста, попробуйте обновить страницу или вернуться на главную.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                aria-label="Обновить страницу"
              >
                <RefreshCw className="w-5 h-5" />
                Попробовать снова
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                aria-label="Перейти на главную страницу"
              >
                <Home className="w-5 h-5" />
                На главную
              </button>
            </div>

            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && error && (
              <details className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <summary className="cursor-pointer font-semibold text-slate-700 mb-2">
                  Детали ошибки (только в режиме разработки)
                </summary>

                <div className="space-y-4 mt-4">
                  <div>
                    <h3 className="font-semibold text-red-600 mb-2">Ошибка:</h3>
                    <pre className="text-sm bg-white p-3 rounded border border-slate-200 overflow-x-auto">
                      <code>{error.toString()}</code>
                    </pre>
                  </div>

                  {errorInfo && (
                    <div>
                      <h3 className="font-semibold text-red-600 mb-2">Стек вызовов:</h3>
                      <pre className="text-sm bg-white p-3 rounded border border-slate-200 overflow-x-auto">
                        <code>{errorInfo.componentStack}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
