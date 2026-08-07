import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Rating from '../components/Rating';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import PincodeChecker from '../components/PincodeChecker';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Review submission form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Product not found');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const inWishlist = product ? isInWishlist(product._id) : false;
  const inCart = product ? isInCart(product._id) : false;
  const isAssured = product && product.rating >= 4.5;

  const handleAddToCart = async () => {
    if (inCart) {
      navigate('/cart');
    } else {
      const res = await addToCart(product._id, quantity, product);
      if (!res?.success && res?.message) {
        alert(res.message);
      }
    }
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setReviewError('Please enter a review comment');
      return;
    }
    try {
      setReviewLoading(true);
      setReviewError('');
      setReviewSuccess('');
      await API.post(`/products/${id}/reviews`, { rating, comment });
      setReviewSuccess('Review submitted successfully!');
      setComment('');
      setRating(5);
      fetchProduct();
      setReviewLoading(false);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Could not submit review');
      setReviewLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <AlertMessage type="danger" message={error} />;
  if (!product) return null;

  return (
    <div className="container py-4">
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
          <li className="breadcrumb-item"><Link to={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      {/* Main Product Info Section */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
        <div className="card-body p-4 p-lg-5">
          <div className="row g-4 align-items-start">
            {/* Left Image Column */}
            <div className="col-md-6 col-lg-5">
              <div className="product-img-large bg-white rounded-4 border p-3 text-center position-relative shadow-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="img-fluid rounded-3"
                  style={{ maxHeight: '420px', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='100%25' height='100%25' fill='%23f1f5f9'/%3E%3Cpath d='M240 200 L360 200 L390 400 L210 400 Z' fill='none' stroke='%234f46e5' stroke-width='8' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M270 200 A 30 30 0 0 1 330 200' fill='none' stroke='%234f46e5' stroke-width='8'/%3E%3Ctext x='50%25' y='82%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='22' fill='%2364748b'%3EShopEZ Product Image%3C/text%3E%3C/svg%3E";
                  }}
                />
                {product.discount > 0 && (
                  <span className="position-absolute top-0 start-0 m-3 badge badge-discount shadow-sm fs-6">
                    {product.discount}% OFF
                  </span>
                )}
                <button
                  onClick={handleWishlistToggle}
                  type="button"
                  className={`btn btn-light position-absolute top-0 end-0 m-3 rounded-circle shadow-sm d-flex align-items-center justify-content-center ${
                    inWishlist ? 'text-danger' : 'text-muted'
                  }`}
                  style={{ width: '44px', height: '44px', zIndex: 2 }}
                >
                  <i className={inWishlist ? 'bi bi-heart-fill fs-5' : 'bi bi-heart fs-5'}></i>
                </button>
              </div>
            </div>

            {/* Right Product Details Column */}
            <div className="col-md-6 col-lg-7">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="badge bg-light text-muted text-uppercase fw-bold border">
                  {product.category} • {product.brand}
                </span>

                {/* ShopEZ Assured Badge */}
                {isAssured && (
                  <span className="badge bg-primary bg-gradient text-white rounded-pill px-3 py-1 fw-bold d-flex align-items-center gap-1 shadow-sm">
                    <i className="bi bi-patch-check-fill text-warning"></i> ShopEZ Assured
                  </span>
                )}
              </div>

              <h2 className="fw-extrabold text-dark mb-3">{product.name}</h2>

              {/* Rating & Reviews */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge bg-success text-white px-2 py-1 fw-bold fs-6">
                  {product.rating} <i className="bi bi-star-fill small"></i>
                </span>
                <span className="text-muted small fw-semibold">
                  ({product.numReviews} Verified Customer Ratings)
                </span>
              </div>

              {/* Price Block */}
              <div className="d-flex align-items-baseline gap-3 mb-4 p-3 bg-light rounded-3">
                <span className="display-6 fw-extrabold text-primary">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="fs-5 text-muted text-decoration-line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="badge bg-danger text-white rounded-pill px-3 py-1">
                    Save {product.discount}%
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-secondary mb-4 leading-relaxed">{product.description}</p>

              {/* Flipkart Pincode Delivery Estimator */}
              <PincodeChecker />

              {/* Quantity Selector & Action Buttons */}
              <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                {!inCart && (
                  <div className="d-flex align-items-center border rounded-pill p-1 bg-light" style={{ width: '130px' }}>
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="btn btn-sm btn-white rounded-circle border-0 text-dark fw-bold"
                    >
                      -
                    </button>
                    <span className="flex-grow-1 text-center fw-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="btn btn-sm btn-white rounded-circle border-0 text-dark fw-bold"
                    >
                      +
                    </button>
                  </div>
                )}

                {/* Flipkart Button: ADD TO CART ➔ GO TO CART */}
                {inCart ? (
                  <button
                    onClick={() => navigate('/cart')}
                    className="btn btn-warning btn-lg rounded-pill px-4 d-flex align-items-center gap-2 flex-grow-1 justify-content-center shadow-sm fw-bold text-dark"
                  >
                    <i className="bi bi-cart-check-fill fs-5"></i>
                    GO TO CART <i className="bi bi-arrow-right"></i>
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="btn btn-primary-custom btn-lg rounded-pill px-4 d-flex align-items-center gap-2 flex-grow-1 justify-content-center shadow-sm fw-bold"
                  >
                    <i className="bi bi-cart-plus fs-5"></i>
                    {product.stock > 0 ? 'ADD TO CART' : 'Out of Stock'}
                  </button>
                )}
              </div>

              {/* Stock Status */}
              <div className="d-flex align-items-center gap-2">
                <span className={`badge ${product.stock > 0 ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger'}`}>
                  <i className={`bi ${product.stock > 0 ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-1`}></i>
                  {product.stock > 0 ? `In Stock (${product.stock} items remaining)` : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings & Customer Reviews Section with Flipkart-style Progress Bars */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
        <div className="card-body p-4 p-lg-5">
          <h4 className="fw-bold mb-4 text-dark">Customer Ratings & Reviews</h4>

          <div className="row g-4 mb-5 align-items-center">
            {/* Left Overall Rating */}
            <div className="col-md-4 text-center p-4 bg-light rounded-4 border">
              <span className="display-4 fw-extrabold text-dark">{product.rating}</span>
              <div className="my-2">
                <Rating value={product.rating} />
              </div>
              <span className="text-muted small fw-semibold">
                Based on {product.numReviews} ratings
              </span>
            </div>

            {/* Right Star Breakdown Distribution Bars */}
            <div className="col-md-8">
              <div className="d-flex flex-column gap-2">
                <div className="d-flex align-items-center gap-3">
                  <span className="small fw-bold text-nowrap" style={{ width: '40px' }}>5 ★</span>
                  <div className="progress flex-grow-1" style={{ height: '10px' }}>
                    <div className="progress-bar bg-success" style={{ width: '75%' }}></div>
                  </div>
                  <span className="small text-muted" style={{ width: '40px' }}>75%</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="small fw-bold text-nowrap" style={{ width: '40px' }}>4 ★</span>
                  <div className="progress flex-grow-1" style={{ height: '10px' }}>
                    <div className="progress-bar bg-info" style={{ width: '18%' }}></div>
                  </div>
                  <span className="small text-muted" style={{ width: '40px' }}>18%</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="small fw-bold text-nowrap" style={{ width: '40px' }}>3 ★</span>
                  <div className="progress flex-grow-1" style={{ height: '10px' }}>
                    <div className="progress-bar bg-warning" style={{ width: '5%' }}></div>
                  </div>
                  <span className="small text-muted" style={{ width: '40px' }}>5%</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="small fw-bold text-nowrap" style={{ width: '40px' }}>2 ★</span>
                  <div className="progress flex-grow-1" style={{ height: '10px' }}>
                    <div className="progress-bar bg-secondary" style={{ width: '1.5%' }}></div>
                  </div>
                  <span className="small text-muted" style={{ width: '40px' }}>1.5%</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="small fw-bold text-nowrap" style={{ width: '40px' }}>1 ★</span>
                  <div className="progress flex-grow-1" style={{ height: '10px' }}>
                    <div className="progress-bar bg-danger" style={{ width: '0.5%' }}></div>
                  </div>
                  <span className="small text-muted" style={{ width: '40px' }}>0.5%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Add Review Form */}
          {user ? (
            <div className="bg-light p-4 rounded-4 mb-5 border">
              <h5 className="fw-bold mb-3">Write a Customer Review</h5>
              {reviewError && <AlertMessage type="danger" message={reviewError} />}
              {reviewSuccess && <AlertMessage type="success" message={reviewSuccess} />}

              <form onSubmit={handleReviewSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Select Rating</label>
                  <select
                    className="form-select rounded-3"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    <option value="5">5 ★ - Excellent</option>
                    <option value="4">4 ★ - Very Good</option>
                    <option value="3">3 ★ - Average</option>
                    <option value="2">2 ★ - Poor</option>
                    <option value="1">1 ★ - Terrible</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Your Review Comment</label>
                  <textarea
                    rows="3"
                    className="form-control rounded-3"
                    placeholder="Describe product quality, shipping, and experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="btn btn-primary rounded-pill px-4 fw-semibold"
                >
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          ) : (
            <div className="alert alert-info rounded-4 mb-4">
              Please <Link to="/login" className="fw-bold text-decoration-underline">log in</Link> to write a customer review.
            </div>
          )}

          {/* Existing Review Comments List */}
          {product.reviews && product.reviews.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {product.reviews.map((rev) => (
                <div key={rev._id} className="p-3 bg-white border rounded-3 shadow-xs">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px' }}>
                        {rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="fw-bold text-dark">{rev.user?.name || 'Verified Customer'}</span>
                      <span className="badge bg-success-subtle text-success extra-small">
                        <i className="bi bi-patch-check-fill me-1"></i> Verified Purchase
                      </span>
                    </div>
                    <span className="text-muted extra-small">
                      {new Date(rev.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <Rating value={rev.rating} />
                  <p className="mt-2 text-secondary mb-0 small">{rev.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted m-0">No reviews written yet. Be the first to review this product!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
