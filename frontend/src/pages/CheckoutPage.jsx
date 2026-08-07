import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import AlertMessage from '../components/AlertMessage';

const CheckoutPage = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.address?.fullName || user?.name || '');
  const [phone, setPhone] = useState(user?.address?.phone || user?.phone || '');
  const [address, setAddress] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [pincode, setPincode] = useState(user?.address?.pincode || '');

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const items = cart.items || [];
  const subtotal = cart.totalPrice || 0;
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 50;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !address || !city || !state || !pincode) {
      setError('Please fill in all shipping address fields.');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);
    setError(null);

    const orderPayload = {
      orderItems: items.map((item) => ({
        product: item.product._id || item.product,
        name: item.product.name,
        image: item.product.image,
        price: item.price,
        quantity: item.quantity,
      })),
      shippingAddress: {
        fullName,
        phone,
        address,
        city,
        state,
        pincode,
      },
      paymentMethod,
    };

    try {
      const { data } = await API.post('/orders', orderPayload);
      clearCart();
      setLoading(false);
      navigate(`/order-confirmation/${data._id}`, { state: { order: data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-4">Checkout</h2>

      {error && <AlertMessage variant="danger">{error}</AlertMessage>}

      <form onSubmit={handlePlaceOrder}>
        <div className="row g-4">
          {/* Shipping Address Form */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-geo-alt-fill text-primary"></i> 1. Shipping Address
              </h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Full Name</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Phone Number</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold text-muted">Street Address</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="House/Flat No., Building Name, Street"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">City</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">State</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">Pincode / ZIP</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-credit-card-2-front-fill text-primary"></i> 2. Payment Option
              </h5>

              <div className="d-flex flex-column gap-3">
                <div className="form-check p-3 rounded-3 border bg-light">
                  <input
                    className="form-check-input ms-0 me-2"
                    type="radio"
                    name="paymentOption"
                    id="cod"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label fw-bold" htmlFor="cod">
                    💵 Cash on Delivery (COD)
                    <span className="d-block text-muted font-normal small mt-1">
                      Pay ₹{total.toLocaleString('en-IN')} cash upon delivery at your doorstep.
                    </span>
                  </label>
                </div>

                <div className="form-check p-3 rounded-3 border bg-light">
                  <input
                    className="form-check-input ms-0 me-2"
                    type="radio"
                    name="paymentOption"
                    id="demoOnline"
                    value="Demo Online Payment"
                    checked={paymentMethod === 'Demo Online Payment'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label fw-bold" htmlFor="demoOnline">
                    💳 Online UPI / Card Payment (INR ₹)
                    <span className="d-block text-muted font-normal small mt-1">
                      Instant simulated payment in Indian Rupees (₹{total.toLocaleString('en-IN')}).
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary & Place Order */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: '90px' }}>
              <h5 className="fw-bold mb-3">Order Review ({items.length} items)</h5>

              <div className="d-flex flex-column gap-3 mb-3 max-h-60 overflow-auto pe-1" style={{ maxHeight: '240px' }}>
                {items.map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center justify-content-between text-sm">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="rounded border"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                      <div>
                        <span className="fw-bold text-dark d-block text-truncate" style={{ maxWidth: '160px' }}>
                          {item.product.name}
                        </span>
                        <span className="text-muted small">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="fw-semibold text-dark">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-2 text-secondary">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 text-secondary">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4 fs-5 fw-bold">
                <span>Total Amount Payable</span>
                <span className="text-primary">₹{total.toLocaleString('en-IN')}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary-custom btn-lg w-100 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow"
              >
                {loading ? 'Processing Order...' : `Pay ₹${total.toLocaleString('en-IN')} & Place Order`}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
