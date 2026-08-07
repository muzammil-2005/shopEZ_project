import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import OrderProgressStepper from '../components/OrderProgressStepper';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order) {
      const fetchOrder = async () => {
        try {
          const { data } = await API.get(`/orders/${id}`);
          setOrder(data);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  if (loading) return <LoadingSpinner message="Retrieving order confirmation..." />;

  return (
    <div className="container my-5 max-w-2xl" style={{ maxWidth: '850px' }}>
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white p-4 p-md-5 text-center">
        <div className="bg-success bg-opacity-10 text-success rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
          <i className="bi bi-check-circle-fill fs-1"></i>
        </div>

        <h2 className="fw-extrabold text-dark mb-2">Order Placed Successfully!</h2>
        <p className="text-muted mb-4">Thank you for shopping with ShopEZ. Your order has been placed and is being processed.</p>

        {order && (
          <>
            {/* Visual Order Progress Stepper */}
            <OrderProgressStepper status={order.orderStatus || 'Processing'} />

            <div className="card border bg-light text-start p-4 rounded-3 mb-4">
              <div className="d-flex flex-column flex-sm-row justify-content-between mb-3 pb-3 border-bottom">
                <div>
                  <span className="text-muted small d-block">Order ID</span>
                  <span className="fw-bold font-monospace text-primary">{order._id}</span>
                </div>
                <div className="mt-2 mt-sm-0 text-sm-end">
                  <span className="text-muted small d-block">Date</span>
                  <span className="fw-semibold">{new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <h6 className="fw-bold small text-muted text-uppercase mb-2">Shipping Address</h6>
                  <p className="small mb-0 fw-semibold text-dark">{order.shippingAddress.fullName}</p>
                  <p className="small mb-0 text-secondary">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                  <p className="small mb-0 text-secondary">{order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                  <p className="small mb-0 text-secondary">Phone: {order.shippingAddress.phone}</p>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold small text-muted text-uppercase mb-2">Payment Info</h6>
                  <p className="small mb-1"><span className="fw-semibold">Method:</span> {order.paymentMethod}</p>
                  <p className="small mb-1"><span className="fw-semibold">Payment Status:</span> <span className="badge bg-success">{order.paymentStatus}</span></p>
                  <p className="small mb-1"><span className="fw-semibold">Order Status:</span> <span className="badge bg-warning text-dark">{order.orderStatus}</span></p>
                </div>
              </div>

              <h6 className="fw-bold small text-muted text-uppercase mb-2">Items Ordered</h6>
              <div className="d-flex flex-column gap-2 border-top pt-2">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <img src={item.image} alt={item.name} className="rounded border" style={{ width: '36px', height: '36px', objectFit: 'cover' }} />
                      <span className="small fw-semibold">{item.name} x {item.quantity}</span>
                    </div>
                    <span className="small fw-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between border-top pt-3 mt-3 fw-bold fs-5 text-dark">
                <span>Total Amount Paid</span>
                <span className="text-primary">₹{order.totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </>
        )}

        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link to={`/orders/${order?._id || id}`} className="btn btn-outline-primary rounded-pill px-4 fw-bold">
            <i className="bi bi-eye me-2"></i>Track Order Details
          </Link>
          <Link to="/products" className="btn btn-primary-custom rounded-pill px-4 fw-bold">
            <i className="bi bi-shop me-2"></i>Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
