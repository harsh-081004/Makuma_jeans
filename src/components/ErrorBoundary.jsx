import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Frontend Error Caught by Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: '#000' }}>Oops!</h1>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#666' }}>Something went wrong.</h2>
          <p style={{ color: 'red', marginBottom: '30px', maxWidth: '500px' }}>
            {this.state.error?.message || 'An unexpected error occurred in the application.'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn" 
            style={{ background: '#000', color: '#fff', padding: '12px 24px', border: 'none', cursor: 'pointer', marginBottom: '16px' }}
          >
            Refresh Page
          </button>
          <Link to="/" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
            Return to Home
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
