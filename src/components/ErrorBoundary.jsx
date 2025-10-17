import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-400 mb-6">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-red-400 font-mono text-sm mb-2 hover:text-red-300">
                  Error Details (Development Only)
                </summary>
                <div className="bg-gray-900 p-4 rounded overflow-auto max-h-60">
                  <pre className="text-red-400 text-xs font-mono whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
