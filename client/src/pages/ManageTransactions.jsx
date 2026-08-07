import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';

export const ManageTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchTransactions = async () => {
    try {
      const res = await API.get('/transactions');
      if (res.success) setTransactions(res.data);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await API.put(`/transactions/${id}/status`, { status });
      if (res.success) {
        addToast(res.message, 'success');
        fetchTransactions();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update status', 'error');
    }
  };

  if (loading) return <LoadingSpinner label="Loading all trade records..." />;

  return (
    <div className="d-flex flex-column gap-4">
      <div className="glass-card p-4">
        <h2 className="fw-bold text-white mb-1"><i className="bi bi-check2-square text-success me-2"></i>Trade Audit & Approval Desk</h2>
        <p className="text-muted mb-0">Review user trade orders, verify compliance, and approve/reject pending operations</p>
      </div>

      <div className="glass-card p-4">
        <div className="table-responsive">
          <table className="table table-custom align-middle">
            <thead>
              <tr>
                <th>User Account</th>
                <th>Order Type</th>
                <th>Ticker Symbol</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id}>
                  <td>
                    <div className="fw-bold text-white">{t.user?.name || 'User'}</div>
                    <small className="text-muted">{t.user?.email}</small>
                  </td>
                  <td>
                    <span className={`badge bg-${t.buyOrSell === 'BUY' ? 'success' : 'danger'} px-3 py-1 fw-bold`}>
                      {t.buyOrSell}
                    </span>
                  </td>
                  <td className="fw-bold text-info">{t.stock?.symbol || 'STOCK'}</td>
                  <td className="fw-bold">{t.quantity}</td>
                  <td className="text-muted">${t.price.toFixed(2)}</td>
                  <td className="fw-bold text-white">${t.totalAmount.toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        t.status === 'APPROVED' ? 'success-subtle text-success' : t.status === 'PENDING' ? 'warning-subtle text-warning' : 'danger-subtle text-danger'
                      } border border-current px-2.5 py-1`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td>
                    {t.status === 'PENDING' ? (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success btn-sm rounded-pill px-3"
                          onClick={() => handleUpdateStatus(t._id, 'APPROVED')}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm rounded-pill px-3"
                          onClick={() => handleUpdateStatus(t._id, 'REJECTED')}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted fs-7">Completed</span>
                    )}
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
