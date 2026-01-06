/**
 * Error Boundary Component
 * Catches React errors and displays user-friendly error messages
 */

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught an error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg bg-red-50 p-6 text-red-700">
          <h2 className="mb-2 text-lg font-bold">發生錯誤</h2>
          <p className="mb-4 text-sm">
            {this.state.error?.message ||
              '發生未預期的錯誤，請重新整理頁面'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            重新整理
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
