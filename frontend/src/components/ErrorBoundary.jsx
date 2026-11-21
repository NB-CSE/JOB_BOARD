import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Elevate Careers caught an uncaught render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center p-6 text-center">
          <div className="bg-white rounded-3xl border border-zinc-200 p-8 sm:p-10 max-w-lg shadow-xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl font-black">
              !
            </div>
            <h2 className="text-2xl font-extrabold text-[#242424]">Something went wrong</h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              We encountered an issue rendering this section. You can refresh or return to the home page.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="bg-[#242424] text-[#C5F36A] font-bold text-sm px-6 py-2.5 rounded-xl shadow-md hover:bg-black transition-colors"
              >
                Reload Page
              </button>
              <a
                href="#/"
                onClick={() => this.setState({ hasError: false, error: null })}
                className="bg-zinc-100 text-zinc-800 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-zinc-200 transition-colors"
              >
                Go to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
