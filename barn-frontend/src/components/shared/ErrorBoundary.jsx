import React from 'react';
import { DESIGN_TOKENS } from '../../constants/designTokens';
import Button, { SecondaryButton } from './Button';

/**
 * ErrorBoundary Component
 * Implements Nielsen's Heuristic 9: Help Users Recognize, Diagnose, and Recover from Errors
 * Provides graceful error handling with clear recovery options
 */

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
  };

  toggleDetails = () => {
    this.setState({ showDetails: !this.state.showDetails });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={`min-h-screen ${DESIGN_TOKENS.layout.flex.center} ${DESIGN_TOKENS.spacing.section.paddingX} bg-gray-50`}>
          <div className={`text-center max-w-lg ${DESIGN_TOKENS.spacing.card.padding} ${DESIGN_TOKENS.borders.radius.xl} ${DESIGN_TOKENS.shadows['2xl']} bg-white border border-gray-200`}>
            {/* Error Icon */}
            <div className={`w-20 h-20 ${DESIGN_TOKENS.borders.radius.full} bg-red-100 ${DESIGN_TOKENS.layout.flex.center} mx-auto mb-6`}>
              <span className="text-3xl text-red-600">⚠️</span>
            </div>
            
            {/* Error Message */}
            <h1 className={`${DESIGN_TOKENS.typography.fontSize['2xl']} ${DESIGN_TOKENS.typography.fontWeight.bold} text-gray-800 mb-4`}>
              Oops! Something went wrong
            </h1>
            
            <p className={`${DESIGN_TOKENS.typography.fontSize.base} text-gray-600 mb-6 leading-relaxed`}>
              We encountered an unexpected error. Don't worry, your data is safe. 
              Please try one of the options below to continue.
            </p>
            
            {/* Recovery Actions */}
            <div className="space-y-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="primary"
                  onClick={this.handleRetry}
                  className="min-w-32"
                >
                  Try Again
                </Button>
                
                <SecondaryButton
                  onClick={this.handleGoHome}
                  className="min-w-32"
                >
                  Go to Home
                </SecondaryButton>
              </div>
              
              <button
                onClick={this.handleReload}
                className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
              >
                Reload Page
              </button>
            </div>
            
            {/* Error Details (Developer/Debug Info) */}
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={this.toggleDetails}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                {this.state.showDetails ? 'Hide' : 'Show'} Error Details
              </button>
              
              {this.state.showDetails && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Error Information:</h3>
                  <pre className="text-xs text-gray-600 overflow-auto max-h-32">
                    {this.state.error?.message || 'Unknown error'}
                    {this.state.errorInfo?.componentStack && (
                      '\n\nComponent Stack:' + this.state.errorInfo.componentStack
                    )}
                  </pre>
                </div>
              )}
            </div>
            
            {/* Support Contact */}
            <p className="text-xs text-gray-500 mt-4">
              If this problem persists, please{' '}
              <a 
                href="mailto:support@barnaclean.com" 
                className="text-blue-600 hover:text-blue-700 underline"
              >
                contact our support team
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;