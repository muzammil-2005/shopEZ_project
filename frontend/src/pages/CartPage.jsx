import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

const CartPage = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const items = cart.items || [];
  const subtotal = cart.totalPrice || 0;
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 50;
  const total = subtotal + shipping;

  if (loading) return <LoadingSpinner message="Updating cart..." />;

  if (items.length === 0) {
    return (
      <div className="container my-5 text-center">
        <div className="card border-0 shadow-sm rounded-4 p-5 max-w-lg mx-auto bg-white">
          <div className="bg-primary bg-opacity-10 text-primary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
            <i className="bi bi-cart-x fs-1"></i>
          </div>
          <h3 className="fw-bold">Your Cart is Empty</h3>
          <p className="text-muted mb-4">Looks like you haven't added any products to your shopping cart yet.</p>
          <div>
            <Link to="/products" className="btn btn-primary-custom btn-lg rounded-pill px-4 fw-bold">
              <i className="bi bi-shop me-2"></i>Start Shopping Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-4">Shopping Cart ({items.length} Items)</h2>

      <div className="row g-4">
        {/* Items Table */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white p-3 p-md-4">
            <div className="table-responsive">
              <table className="table align-middle border-0">
                <thead className="table-light">
                  <tr className="small text-muted text-uppercase">
                    <th scope="col" style={{ minWidth: '220px' }}>Product</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Subtotal</th>
                    <th scope="col" className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const p = item.product || {};
                    const prodId = p._id || item.product;
                    const prodName = p.name || 'Product Item';
                    const prodImg = p.image || 'https://via.placeholder.com/150';
                    const prodStock = p.stock !== undefined ? p.stock : 99;

                    return (
                      <tr key={prodId}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={prodImg}
                              alt={prodName}
                              className="rounded-3 border"
                              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            />
                            <div>
                              <Link to={`/products/${prodId}`} className="text-dark fw-bold text-decoration-none small text-truncate d-block" style={{ maxWidth: '180px' }}>
                                {prodName}
                              </Link>
                              <span className="text-muted small">Brand: {p.brand || 'N/A'}</span>
                            </div>
                          </div>
                        </td>

                        <td className="fw-semibold">₹{item.price ? item.price.toLocaleString('en-IN') : 0}</td>

                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <button
                              onClick={() => updateQuantity(prodId, item.quantity - 1)}
                              className="btn btn-sm btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                              style={{ width: '28px', height: '28px' }}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <span className="fw-bold px-2">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(prodId, item.quantity + 1)}
                              disabled={item.quantity >= prodStock}
                              className="btn btn-sm btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                              style={{ width: '28px', height: '28px' }}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                        </td>

                        <td className="fw-bold text-primary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>

                        <td className="text-end">
                          <button
                            onClick={() => removeFromCart(prodId)}
                            className="btn btn-link text-danger p-0 border-0"
                            title="Remove item"
                          >
                            <i className="bi bi-trash fs-5"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="d-flex align-items-center justify-content-between pt-3 border-top">
              <button onClick={clearCart} className="btn btn-outline-danger btn-sm rounded-pill px-3">
                <i className="bi bi-trash me-1"></i> Clear Cart
              </button>
              <Link to="/products" className="btn btn-outline-primary btn-sm rounded-pill px-3">
                <i className="bi bi-arrow-left me-1"></i> Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Order Summary Side Card */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: '90px' }}>
            <h5 className="fw-bold mb-3">Order Summary</h5>

            <div className="d-flex justify-content-between mb-2 text-secondary">
              <span>Items Subtotal</span>
              <span className="fw-semibold text-dark">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="d-flex justify-content-between mb-2 text-secondary">
              <span>Shipping Fee</span>
              {shipping === 0 ? (
                <span className="text-success fw-bold">FREE</span>
              ) : (
                <span className="fw-semibold text-dark">₹{shipping}</span>
              )}
            </div>

            {shipping > 0 && (
              <p className="text-muted small fst-italic">
                💡 Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for FREE shipping!
              </p>
            )}

            <hr className="my-3" />

            <div className="d-flex justify-content-between mb-4 fs-5 fw-bold">
              <span>Total Amount</span>
              <span className="text-primary">₹{total.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary-custom btn-lg w-100 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
            >
              Proceed to Checkout <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
