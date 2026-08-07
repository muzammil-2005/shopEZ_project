import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await API.get('/orders/myorders');
        setOrders(data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  if (loading) return <LoadingSpinner message="Fetching your orders..." />;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-success';
      case 'Shipped': return 'bg-info text-dark';
      case 'Processing': return 'bg-primary';
      case 'Confirmed': return 'bg-warning text-dark';
      case 'Cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <i className="bi bi-box-seam fs-1 text-muted mb-3"></i>
          <h4 className="fw-bold">No Orders Placed Yet</h4>
          <p className="text-muted">You haven't placed any orders with ShopEZ yet.</p>
          <div>
            <Link to="/products" className="btn btn-primary-custom rounded-pill px-4">
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white p-3 p-md-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle border-0">
              <thead className="table-light">
                <tr className="small text-muted text-uppercase">
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Payment Status</th>
                  <th>Order Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="fw-bold font-monospace text-primary small">{order._id}</td>
                    <td className="small">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="fw-bold text-primary">₹{order.totalPrice ? order.totalPrice.toLocaleString('en-IN') : 0}</td>
                    <td>
                      <span className={`badge ${order.paymentStatus === 'Paid' ? 'bg-success' : 'bg-warning text-dark'} rounded-pill`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(order.orderStatus)} rounded-pill`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="text-end">
                      <Link to={`/orders/${order._id}`} className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
