import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-primary text-white rounded-3 p-2 d-inline-flex">
                <i className="bi bi-bag-heart-fill fs-5"></i>
              </div>
              <span className="fs-3 fw-bold text-white">ShopEZ</span>
            </div>
            <p className="text-secondary small">
              Shop Smart. Shop Easy. ShopEZ provides high quality products across electronics, fashion, home essentials, and beauty with fast delivery and guaranteed satisfaction.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#facebook" className="text-secondary fs-5 hover-white"><i className="bi bi-facebook"></i></a>
              <a href="#twitter" className="text-secondary fs-5 hover-white"><i className="bi bi-twitter-x"></i></a>
              <a href="#instagram" className="text-secondary fs-5 hover-white"><i className="bi bi-instagram"></i></a>
              <a href="#linkedin" className="text-secondary fs-5 hover-white"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li><Link to="/" className="text-secondary text-decoration-none hover-white">Home</Link></li>
              <li><Link to="/products" className="text-secondary text-decoration-none hover-white">All Products</Link></li>
              <li><Link to="/wishlist" className="text-secondary text-decoration-none hover-white">My Wishlist</Link></li>
              <li><Link to="/cart" className="text-secondary text-decoration-none hover-white">Shopping Cart</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Customer Service</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li><a href="#contact" className="text-secondary text-decoration-none hover-white">Contact Us</a></li>
              <li><a href="#faq" className="text-secondary text-decoration-none hover-white">Shipping Policy & Returns</a></li>
              <li><a href="#privacy" className="text-secondary text-decoration-none hover-white">Privacy Policy</a></li>
              <li><a href="#terms" className="text-secondary text-decoration-none hover-white">Terms & Conditions</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Support & Help</h6>
            <p className="text-secondary small mb-2"><i className="bi bi-geo-alt me-2"></i>100 Commerce Way, New York, NY 10001</p>
            <p className="text-secondary small mb-2"><i className="bi bi-envelope me-2"></i>support@shopez.com</p>
            <p className="text-secondary small mb-2"><i className="bi bi-telephone me-2"></i>+1 800-555-0199 (24/7)</p>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between text-secondary small">
          <p className="mb-0">&copy; {new Date().getFullYear()} ShopEZ Inc. All rights reserved.</p>
          <p className="mb-0">Designed for college evaluation & production demonstration.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
