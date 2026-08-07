import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const ToastNotification = () => {
  const { toastInfo, hideToast } = useContext(CartContext);

  if (!toastInfo || !toastInfo.show) return null;

  return (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{ zIndex: 9999, marginTop: '70px', maxWidth: '380px', width: '90%' }}
    >
      <div className="toast show align-items-center text-white bg-dark border-0 shadow-lg rounded-4 overflow-hidden animate-fade-in-up" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="p-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <span className="bg-success text-white rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
                <i className="bi bi-check-lg small"></i>
              </span>
              <span className="fw-bold text-success small">Added to Cart!</span>
            </div>
            <button type="button" className="btn-close btn-close-white small" onClick={hideToast}></button>
          </div>

          <div className="d-flex align-items-center gap-3 my-2">
            {toastInfo.product?.image && (
              <img
                src={toastInfo.product.image}
                alt={toastInfo.product.name}
                className="rounded-3 border border-secondary"
                style={{ width: '48px', height: '48px', objectFit: 'cover' }}
              />
            )}
            <div className="flex-grow-1 overflow-hidden">
              <h6 className="fw-bold text-white small m-0 text-truncate">
                {toastInfo.product?.name || 'Product'}
              </h6>
              <span className="text-warning fw-bold small">
                ₹{toastInfo.product?.price ? toastInfo.product.price.toLocaleString('en-IN') : '0'}
              </span>
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            <Link
              to="/cart"
              onClick={hideToast}
              className="btn btn-warning btn-sm w-100 rounded-pill fw-bold text-dark shadow-sm"
            >
              View Cart & Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastNotification;
