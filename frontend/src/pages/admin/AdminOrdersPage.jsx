import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/orders');
      setOrders(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Fetch admin orders error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/admin/orders/${orderId}`, { orderStatus: newStatus });
      showToast(`Order status updated to ${newStatus}`, 'success');
      fetchOrders();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update order status', 'danger');
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      <AdminSidebar />

      <div className="flex-grow-1 p-4 bg-light">
        {/* Toast Notification */}
        {notification && (
          <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
            <div className={`toast show align-items-center text-white bg-${notification.type} border-0 shadow-lg`}>
              <div className="d-flex">
                <div className="toast-body fw-semibold">
                  <i className="bi bi-info-circle-fill me-2"></i>
                  {notification.message}
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white me-2 m-auto"
                  onClick={() => setNotification(null)}
                ></button>
              </div>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">Manage Customer Orders</h3>
            <p className="text-muted small mb-0">Monitor and update delivery statuses across all customer purchases</p>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : orders.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <h5 className="fw-bold text-muted">No Orders Found</h5>
          </div>
        ) : (
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">Order ID</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Date</th>
                    <th scope="col">Total</th>
                    <th scope="col">Payment</th>
                    <th scope="col">Order Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord._id}>
                      <td className="ps-4 py-3 fw-bold text-primary">{ord._id}</td>
                      <td>
                        <span className="fw-semibold d-block">{ord.user?.name || 'Customer'}</span>
                        <small className="text-muted">{ord.user?.email}</small>
                      </td>
                      <td className="text-muted small">{new Date(ord.createdAt).toLocaleDateString()}</td>
                      <td className="fw-bold">${ord.totalPrice?.toFixed(2)}</td>
                      <td>
                        <span className={`badge ${ord.paymentStatus === 'Completed' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                          {ord.paymentStatus || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm fw-semibold rounded-pill"
                          value={ord.orderStatus}
                          onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                          style={{ maxWidth: '160px' }}
                        >
                          <option value="Pending">Pending</option>
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
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
