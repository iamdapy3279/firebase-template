import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-lg p-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-danger-100 dark:bg-danger-900/20 mb-4">
                <AlertTriangle className="h-6 w-6 text-danger-600 dark:text-danger-400" />
              </div>
              
              <h1 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                Something went wrong
              </h1>
              
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={this.handleRetry}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="btn-secondary w-full"
                >
                  Refresh Page
                </button>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-sm font-medium text-secondary-700 dark:text-secondary-300 cursor-pointer">
                    Error Details (Development)
                  </summary>
                  <div className="mt-2 p-3 bg-secondary-100 dark:bg-secondary-700 rounded text-xs text-secondary-800 dark:text-secondary-200 overflow-auto">
                    <pre>{this.state.error && this.state.error.toString()}</pre>
                    <pre>{this.state.errorInfo.componentStack}</pre>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;