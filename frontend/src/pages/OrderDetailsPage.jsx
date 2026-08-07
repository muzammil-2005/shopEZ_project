import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import OrderProgressStepper from '../components/OrderProgressStepper';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not fetch order details');
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <AlertMessage type="danger" message={error} />;
  if (!order) return null;

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-extrabold text-dark m-0">Order #{order._id}</h2>
          <span className="text-muted small">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <Link to="/my-orders" className="btn btn-outline-primary rounded-pill px-3">
          <i className="bi bi-arrow-left me-1"></i> Back to Orders
        </Link>
      </div>

      {/* Flipkart 5-Stage Order Progress Stepper */}
      <OrderProgressStepper status={order.orderStatus || 'Processing'} />

      <div className="row g-4">
        {/* Left Items Column */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <div className="card-header bg-white py-3 border-bottom">
              <h5 className="fw-bold m-0 text-dark">Order Items ({order.orderItems.length})</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="list-group-item p-3 d-flex align-items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="rounded-3 border"
                      style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1 overflow-hidden">
                      <Link to={`/products/${item.product}`} className="fw-bold text-dark text-decoration-none text-truncate d-block">
                        {item.name}
                      </Link>
                      <span className="text-muted small">Quantity: {item.quantity}</span>
                    </div>
                    <div className="text-end">
                      <span className="fw-bold text-primary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      <div className="text-muted extra-small">₹{item.price.toLocaleString('en-IN')} each</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary Column */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <div className="card-header bg-white py-3 border-bottom">
              <h5 className="fw-bold m-0 text-dark">Shipping & Payment</h5>
            </div>
            <div className="card-body p-4">
              <div className="mb-3">
                <span className="fw-bold small text-muted text-uppercase d-block mb-1">Shipping Address</span>
                <p className="small mb-0 text-dark fw-semibold">{order.shippingAddress.fullName}</p>
                <p className="small mb-0 text-muted">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                <p className="small mb-0 text-muted">{order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                <p className="small mb-0 text-muted">Phone: {order.shippingAddress.phone}</p>
              </div>

              <hr />

              <div className="mb-3">
                <span className="fw-bold small text-muted text-uppercase d-block mb-1">Payment Method</span>
                <span className="badge bg-light text-dark border px-3 py-2 fw-semibold">
                  <i className="bi bi-credit-card me-1 text-primary"></i> {order.paymentMethod}
                </span>
              </div>

              <hr />

              <div className="d-flex flex-column gap-2 mb-3">
                <div className="d-flex justify-content-between text-muted small">
                  <span>Items Price</span>
                  <span>₹{order.itemsPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="d-flex justify-content-between text-muted small">
                  <span>Shipping Fee</span>
                  <span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span>
                </div>
                <hr className="my-1" />
                <div className="d-flex justify-content-between fs-5 fw-extrabold text-dark">
                  <span>Total Amount</span>
                  <span className="text-primary">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
