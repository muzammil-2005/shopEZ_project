import React, { useEffect, useState } from 'react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/admin/orders');
      setOrders(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, orderStatus) => {
    try {
      await API.put(`/admin/orders/${orderId}`, { orderStatus });
      setMessage({ type: 'success', text: `Order status updated to "${orderStatus}"` });
      fetchOrders();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to update order status.' });
    }
  };

  if (loading) return <LoadingSpinner message="Fetching customer orders..." />;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-1">Manage Orders</h2>
      <p className="text-muted small mb-4">View and update customer order fulfillment status ({orders.length} total orders)</p>

      {message && <AlertMessage variant={message.type}>{message.text}</AlertMessage>}

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white p-3 p-md-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle border-0">
            <thead className="table-light">
              <tr className="small text-muted text-uppercase">
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Order Status</th>
                <th className="text-end">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="fw-bold font-monospace text-primary small">{o._id}</td>
                  <td>
                    <span className="fw-bold text-dark d-block small">{o.user?.name || 'Customer'}</span>
                    <span className="text-muted small">{o.user?.email}</span>
                  </td>
                  <td className="small">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="fw-bold">${o.totalPrice.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${o.paymentStatus === 'Paid' ? 'bg-success' : 'bg-warning text-dark'} rounded-pill`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-primary rounded-pill">{o.orderStatus}</span>
                  </td>
                  <td className="text-end">
                    <select
                      className="form-select form-select-sm rounded-pill d-inline-block"
                      style={{ width: '150px' }}
                      value={o.orderStatus}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
