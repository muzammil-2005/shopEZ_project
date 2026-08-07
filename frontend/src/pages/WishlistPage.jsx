import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

const WishlistPage = () => {
  const { wishlist, loading, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const products = wishlist.products || [];

  const handleMoveToCart = (product) => {
    addToCart(product._id, 1, product);
    removeFromWishlist(product._id);
  };

  if (loading) return <LoadingSpinner message="Fetching your wishlist..." />;

  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-4">My Wishlist ({products.length} Items)</h2>

      {products.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <i className="bi bi-heart fs-1 text-muted mb-3"></i>
          <h4 className="fw-bold">Your Wishlist is Empty</h4>
          <p className="text-muted">Save items you like to your wishlist and revisit them anytime.</p>
          <div>
            <Link to="/products" className="btn btn-primary-custom rounded-pill px-4">
              Explore Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {products.map((product) => {
            const pId = product._id || product;
            return (
              <div key={pId} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                  <div className="product-img-wrapper position-relative">
                    <img src={product.image} alt={product.name} />
                    <button
                      onClick={() => removeFromWishlist(pId)}
                      className="btn btn-sm btn-light position-absolute top-0 end-0 m-3 rounded-circle text-danger shadow-sm"
                      title="Remove from Wishlist"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                  <div className="card-body d-flex flex-column p-3">
                    <span className="small text-uppercase text-muted fw-bold mb-1">{product.category}</span>
                    <Link to={`/products/${pId}`} className="fw-bold text-dark text-decoration-none text-truncate mb-2">
                      {product.name}
                    </Link>
                    <div className="mt-auto d-flex align-items-baseline justify-content-between mb-3">
                      <span className="fs-5 fw-bold text-primary">${product.price?.toFixed(2)}</span>
                      {product.stock > 0 ? (
                        <span className="badge bg-success rounded-pill">In Stock</span>
                      ) : (
                        <span className="badge bg-danger rounded-pill">Out of Stock</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleMoveToCart(product)}
                      disabled={product.stock === 0}
                      className="btn btn-primary-custom btn-sm w-100 rounded-3 d-flex align-items-center justify-content-center gap-2"
                    >
                      <i className="bi bi-cart-plus"></i> Move to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
