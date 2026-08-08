import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const DEFAULT_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100%25' height='100%25' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='10' fill='%2364748b'%3EShopEZ%3C/text%3E%3C/svg%3E";

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal } = useContext(CartContext);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    if (promoCode.trim().toUpperCase() === 'SHOPEZ20') {
      setDiscount(subtotal * 0.2);
      setPromoSuccess('20% Discount applied successfully!');
    } else {
      setPromoError('Invalid Coupon Code. Try "SHOPEZ20"');
    }
  };

  const finalTotal = Math.max(0, subtotal - discount);
  const freeShippingThreshold = 2000;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (!isCartOpen) return null;

  return (
    <div className="offcanvas offcanvas-end show" tabIndex="-1" style={{ visibility: 'visible', zIndex: 1055, width: '420px', maxWidth: '100vw' }}>
      <div className="offcanvas-header border-bottom py-3">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-cart3 fs-4 text-primary"></i>
          <h5 className="offcanvas-title fw-bold m-0">Your Shopping Cart ({cart.items?.length || 0})</h5>
        </div>
        <button
          type="button"
          className="btn-close text-reset"
          onClick={() => setIsCartOpen(false)}
          aria-label="Close"
        ></button>
      </div>

      <div className="offcanvas-body d-flex flex-column p-0">
        {/* Free Shipping Progress Bar */}
        <div className="bg-light p-3 border-bottom">
          <div className="d-flex justify-content-between small fw-bold mb-1">
            <span>
              {subtotal >= freeShippingThreshold ? (
                <span className="text-success"><i className="bi bi-check-circle-fill me-1"></i> You unlocked Free Express Shipping!</span>
              ) : (
                <span>Add ₹{(freeShippingThreshold - subtotal).toLocaleString('en-IN')} more for FREE Shipping</span>
              )}
            </span>
            <span className="text-muted">{Math.round(progressPercent)}%</span>
          </div>
          <div className="progress" style={{ height: '6px' }}>
            <div
              className={`progress-bar ${subtotal >= freeShippingThreshold ? 'bg-success' : 'bg-primary'} progress-bar-striped progress-bar-animated`}
              role="progressbar"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-grow-1 overflow-auto p-3">
          {!cart.items || cart.items.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3 text-muted display-4">
                <i className="bi bi-cart-x"></i>
              </div>
              <h6 className="fw-bold">Your cart is currently empty</h6>
              <p className="text-muted small">Explore products and add items to your cart!</p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/products');
                }}
                className="btn btn-primary-custom btn-sm rounded-pill mt-2"
              >
                Shop Now
              </button>
            </div>
          ) : (
            cart.items.map((item) => {
              const product = item.product || {};
              const pId = product._id || item.product;
              return (
                <div key={pId} className="d-flex gap-3 mb-3 p-2 rounded-3 border bg-body-tertiary align-items-center">
                  <img
                    src={product.image || DEFAULT_IMAGE}
                    alt={product.name}
                    className="rounded"
                    style={{ width: '65px', height: '65px', objectFit: 'cover' }}
                  />
                  <div className="flex-grow-1 min-w-0">
                    <h6 className="mb-1 fw-bold text-truncate small" title={product.name}>
                      {product.name || 'Product'}
                    </h6>
                    <div className="text-primary fw-bold small">
                      ₹{product.price ? product.price.toLocaleString('en-IN') : item.price?.toLocaleString('en-IN')}
                    </div>
                    {/* Quantity Controls */}
                    <div className="d-flex align-items-center gap-2 mt-2">
                      <div className="btn-group btn-group-sm border rounded-pill">
                        <button
                          onClick={() => updateQuantity(pId, item.quantity - 1)}
                          className="btn btn-light btn-sm border-0 px-2"
                        >
                          -
                        </button>
                        <span className="px-2 fw-semibold align-self-center small">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(pId, item.quantity + 1)}
                          className="btn btn-light btn-sm border-0 px-2"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(pId)}
                        className="btn btn-link text-danger p-0 ms-auto text-decoration-none small"
                        title="Remove item"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Promo Code & Subtotal Footer */}
        {cart.items && cart.items.length > 0 && (
          <div className="border-top p-3 bg-body-tertiary">
            <form onSubmit={handleApplyPromo} className="mb-3">
              <div className="input-group input-group-sm">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Promo Code (e.g. SHOPEZ20)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button type="submit" className="btn btn-outline-primary fw-semibold">
                  Apply
                </button>
              </div>
              {promoSuccess && <small className="text-success fw-bold d-block mt-1">{promoSuccess}</small>}
              {promoError && <small className="text-danger fw-bold d-block mt-1">{promoError}</small>}
            </form>

            <div className="d-flex justify-content-between mb-1 small text-muted">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discount > 0 && (
              <div className="d-flex justify-content-between mb-1 small text-success fw-bold">
                <span>Promo Discount (20%)</span>
                <span>-₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="d-flex justify-content-between mb-3 fs-5 fw-extrabold text-primary">
              <span>Total Amount</span>
              <span>₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="d-grid gap-2">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="btn btn-primary-custom py-2 fw-bold shadow"
              >
                PROCEED TO CHECKOUT <i className="bi bi-arrow-right ms-1"></i>
              </button>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/cart');
                }}
                className="btn btn-outline-secondary btn-sm py-1.5 fw-semibold"
              >
                View Full Cart
              </button>
            </div>
          </div>
        )}
      </div>
      <div
        className="offcanvas-backdrop fade show"
        onClick={() => setIsCartOpen(false)}
        style={{ zIndex: 1050 }}
      ></div>
    </div>
  );
};

export default CartDrawer;
