import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Rating from './Rating';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const DEFAULT_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='100%25' height='100%25' fill='%23f1f5f9'/%3E%3Cpath d='M160 110 L240 110 L260 210 L140 210 Z' fill='none' stroke='%234f46e5' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M180 110 A 20 20 0 0 1 220 110' fill='none' stroke='%234f46e5' stroke-width='6'/%3E%3Ctext x='50%25' y='82%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='16' fill='%2364748b'%3EShopEZ Product%3C/text%3E%3C/svg%3E";

const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const inWishlist = isInWishlist(product._id);
  const inCart = isInCart(product._id);
  const isAssured = product.rating >= 4.5;

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) {
      navigate('/cart');
    } else {
      addToCart(product._id, 1, product);
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="card h-100 border-0 shadow-sm card-hover-effect rounded-4 overflow-hidden bg-white">
      <div className="product-img-wrapper position-relative">
        <Link to={`/products/${product._id}`}>
          <img
            src={product.image || DEFAULT_IMAGE}
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_IMAGE;
            }}
          />
        </Link>
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <span className="position-absolute top-0 start-0 m-3 badge badge-discount shadow-sm">
            {product.discount}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          type="button"
          className={`btn btn-sm btn-light position-absolute top-0 end-0 m-3 rounded-circle shadow-sm d-flex align-items-center justify-content-center ${
            inWishlist ? 'text-danger' : 'text-muted'
          }`}
          style={{ width: '36px', height: '36px', zIndex: 10 }}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <i className={inWishlist ? 'bi bi-heart-fill fs-6' : 'bi bi-heart fs-6'}></i>
        </button>
      </div>

      <div className="card-body d-flex flex-column p-3">
        <div className="d-flex align-items-center justify-content-between mb-1">
          <span className="text-uppercase text-muted fw-bold small" style={{ fontSize: '0.75rem' }}>
            {product.category} • {product.brand}
          </span>
          
          {/* ShopEZ Assured Badge */}
          {isAssured && (
            <span className="badge bg-primary bg-gradient text-white rounded-pill px-2 py-0.5 extra-small fw-bold d-flex align-items-center gap-1 shadow-sm">
              <i className="bi bi-patch-check-fill text-warning"></i> Assured
            </span>
          )}
        </div>

        <Link
          to={`/products/${product._id}`}
          className="text-decoration-none text-dark fw-bold text-truncate mb-2"
          title={product.name}
        >
          {product.name}
        </Link>

        <div className="mb-2">
          <Rating value={product.rating} text={`(${product.numReviews || 0})`} />
        </div>

        <div className="mt-auto d-flex align-items-baseline gap-2 mb-3">
          <span className="fs-5 fw-bold text-primary">₹{product.price ? product.price.toLocaleString('en-IN') : 0}</span>
          {product.originalPrice > product.price && (
            <span className="text-muted text-decoration-line-through small">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Flipkart Dynamic Button: ADD TO CART vs GO TO CART */}
        <div className="d-grid gap-2">
          {inCart ? (
            <button
              onClick={handleCartClick}
              type="button"
              className="btn btn-warning btn-sm w-100 d-flex align-items-center justify-content-center gap-2 py-2 fw-bold text-dark shadow-sm"
            >
              <i className="bi bi-cart-check-fill fs-6"></i>
              GO TO CART <i className="bi bi-arrow-right"></i>
            </button>
          ) : (
            <button
              onClick={handleCartClick}
              type="button"
              disabled={product.stock === 0}
              className="btn btn-primary-custom btn-sm w-100 d-flex align-items-center justify-content-center gap-2 py-2 fw-semibold"
            >
              <i className="bi bi-cart-plus fs-6"></i>
              {product.stock > 0 ? 'ADD TO CART' : 'Out of Stock'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
