import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container my-5 text-center py-5">
      <div className="card border-0 shadow-lg rounded-4 p-5 max-w-md mx-auto bg-white" style={{ maxWidth: '500px' }}>
        <h1 className="display-1 fw-extrabold brand-gradient mb-0">404</h1>
        <h3 className="fw-bold mb-3">Page Not Found</h3>
        <p className="text-muted mb-4">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <div>
          <Link to="/" className="btn btn-primary-custom rounded-pill px-4 fw-bold">
            <i className="bi bi-house me-2"></i>Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
