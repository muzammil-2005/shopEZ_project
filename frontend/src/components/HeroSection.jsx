import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="hero-banner p-4 p-md-5 my-4 position-relative shadow-lg rounded-4 text-white overflow-hidden">
      <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
        <div className="col-lg-7 mb-4 mb-lg-0">
          <span className="badge bg-warning text-dark fw-extrabold px-3 py-1.5 rounded-pill uppercase tracking-wider mb-3 shadow-sm">
            🔥 MEGA MONSOON SALE — UP TO 60% OFF
          </span>
          <h1 className="display-4 fw-extrabold text-white mb-3 leading-tight">
            Next-Gen Tech & Premium Lifestyle Gear
          </h1>
          <p className="lead text-light opacity-90 mb-4 me-lg-4">
            Discover cutting-edge audio, smart wearables, barista coffee makers, and ergonomic home essentials with express free delivery.
          </p>
          <div className="d-flex flex-wrap gap-3">
            <Link to="/products" className="btn btn-warning btn-lg px-4 py-3 fw-bold rounded-pill text-dark shadow-sm">
              EXPLORE STORE <i className="bi bi-arrow-right ms-2"></i>
            </Link>
            <a href="#featured-deals" className="btn btn-outline-light btn-lg px-4 py-3 fw-semibold rounded-pill">
              View Flash Deals
            </a>
          </div>
        </div>

        <div className="col-lg-5 text-center">
          <div className="position-relative d-inline-block animate-float">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
              alt="Featured Hero Product"
              className="img-fluid rounded-4 shadow-lg border border-white border-2"
              style={{ maxHeight: '300px', objectFit: 'cover' }}
            />
            <div className="position-absolute bottom-0 start-50 translate-middle-x bg-white text-dark p-3 rounded-4 shadow-lg d-flex align-items-center gap-3 w-80">
              <div className="bg-success text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-shield-check fs-5"></i>
              </div>
              <div className="text-start">
                <p className="fw-bold mb-0 small">Verified Official Warranty</p>
                <small className="text-muted">100% Genuine Guaranteed</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row pt-4 mt-4 border-top border-white border-opacity-25 text-light text-center small position-relative" style={{ zIndex: 2 }}>
        <div className="col-4 col-md-4 mb-2 mb-md-0">
          <i className="bi bi-truck fs-4 text-warning mb-1 d-block"></i>
          <span className="fw-bold">Free Express Shipping</span>
        </div>
        <div className="col-4 col-md-4 mb-2 mb-md-0">
          <i className="bi bi-arrow-counterclockwise fs-4 text-warning mb-1 d-block"></i>
          <span className="fw-bold">30-Day Hassle-Free Returns</span>
        </div>
        <div className="col-4 col-md-4">
          <i className="bi bi-headset fs-4 text-warning mb-1 d-block"></i>
          <span className="fw-bold">24/7 Dedicated Support</span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
