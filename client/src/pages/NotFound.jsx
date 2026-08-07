import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4 text-center">
      <div className="glass-card p-5" style={{ maxWidth: '500px', width: '100%' }}>
        <h1 className="display-1 fw-bold text-cyan mb-0">404</h1>
        <h3 className="fw-bold text-white mb-3">Page Not Found</h3>
        <p className="text-muted mb-4">
          The market page or equity symbol you are attempting to access does not exist or has been moved.
        </p>
        <Link to="/dashboard" className="btn btn-primary-gradient px-4 py-2 rounded-pill">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};
