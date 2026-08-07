import React from 'react';

export const LoadingSpinner = ({ label = 'Loading trading metrics...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-5 min-vh-50">
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted fw-semibold">{label}</p>
    </div>
  );
};
