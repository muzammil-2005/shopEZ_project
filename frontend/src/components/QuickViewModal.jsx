import React, { useContext } from 'react';
import Rating from './Rating';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const DEFAULT_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='100%25' height='100%25' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='16' fill='%2364748b'%3EShopEZ Product%3C/text%3E%3C/svg%3E";

const QuickViewModal = ({ product, onClose }) => {
  const { addToCart, isInCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

  if (!product) return null;

  const inWishlist = isInWishlist(product._id);
  const inCart = isInCart(product._id);

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header border-0 pb-0">
            <button type="button" className="btn-close ms-auto" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body p-4 pt-1">
            <div className="row g-4 align-items-center">
              <div className="col-md-6 text-center">
                <div className="product-img-wrapper rounded-4 overflow-hidden border shadow-sm p-3 bg-light" style={{ height: '320px' }}>
                  <img
                    src={product.image || DEFAULT_IMAGE}
                    alt={product.name}
                    className="img-fluid max-h-100 object-fit-contain"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge bg-primary-subtle text-primary fw-bold text-uppercase px-2.5 py-1 rounded-pill small">
                    {product.category}
                  </span>
                  <span className="text-muted small fw-semibold">Brand: {product.brand}</span>
                </div>

                <h4 className="fw-bold mb-2">{product.name}</h4>

                <div className="d-flex align-items-center gap-2 mb-3">
                  <Rating value={product.rating} text={`(${product.numReviews || 0} customer reviews)`} />
                </div>

                <div className="d-flex align-items-baseline gap-3 mb-3">
                  <span className="display-6 fw-bold text-primary">₹{product.price?.toLocaleString('en-IN')}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-muted text-decoration-line-through fs-5">
                      ₹{product.originalPrice?.toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="badge bg-danger rounded-pill px-2.5 py-1">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                <p className="text-muted small mb-4 line-clamp-3">
                  {product.description}
                </p>

                <div className="mb-4">
                  {product.stock > 0 ? (
                    <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1.5 fw-semibold">
                      <i className="bi bi-check-circle-fill me-1"></i> In Stock ({product.stock} units available)
                    </span>
                  ) : (
                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-3 py-1.5 fw-semibold">
                      <i className="bi bi-x-circle-fill me-1"></i> Currently Out of Stock
                    </span>
                  )}
                </div>

                <div className="d-flex gap-3">
                  <button
                    onClick={() => {
                      if (!inCart) addToCart(product._id, 1, product);
                    }}
                    disabled={product.stock === 0}
                    className="btn btn-primary-custom flex-grow-1 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  >
                    <i className="bi bi-cart-plus fs-5"></i>
                    {inCart ? 'ADDED TO CART' : 'ADD TO CART'}
                  </button>

                  <button
                    onClick={() => {
                      if (inWishlist) removeFromWishlist(product._id);
                      else addToWishlist(product);
                    }}
                    className={`btn btn-outline-secondary rounded-3 px-3.5 d-flex align-items-center justify-content-center ${
                      inWishlist ? 'text-danger border-danger' : ''
                    }`}
                    title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <i className={inWishlist ? 'bi bi-heart-fill fs-5' : 'bi bi-heart fs-5'}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
