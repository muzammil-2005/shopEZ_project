import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');

  const fetchTransactions = async () => {
    try {
      const res = await API.get('/transactions/my');
      if (res.success) setTransactions(res.data);
    } catch (err) {
      console.error('Failed to load transaction history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) return <LoadingSpinner label="Retrieving transaction records..." />;

  const filtered = transactions.filter((t) => {
    if (filterType === 'ALL') return true;
    return t.buyOrSell === filterType;
  });

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="glass-card p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h2 className="fw-bold text-white mb-1">Transaction History</h2>
          <p className="text-muted mb-0">Complete audit log of executed stock buy and sell orders</p>
        </div>

        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn btn-sm ${filterType === 'ALL' ? 'btn-primary' : 'btn-dark'}`}
            onClick={() => setFilterType('ALL')}
          >
            All Trades
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterType === 'BUY' ? 'btn-success' : 'btn-dark'}`}
            onClick={() => setFilterType('BUY')}
          >
            BUY Only
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterType === 'SELL' ? 'btn-danger' : 'btn-dark'}`}
            onClick={() => setFilterType('SELL')}
          >
            SELL Only
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card p-4">
        {filtered.length === 0 ? (
          <div className="text-center p-5 text-muted">
            <i className="bi bi-clock-history fs-1 mb-3 text-secondary d-block"></i>
            <h5>No transactions found</h5>
            <p>You haven't performed any trades matching this filter yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-custom align-middle">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Stock Ticker</th>
                  <th>Company</th>
                  <th>Quantity</th>
                  <th>Execution Price</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t._id}>
                    <td>
                      <span className={`badge bg-${t.buyOrSell === 'BUY' ? 'success' : 'danger'} px-3 py-1 fw-bold`}>
                        {t.buyOrSell}
                      </span>
                    </td>
                    <td>
                      <span className="fw-bold text-info">{t.stock?.symbol || 'STOCK'}</span>
                    </td>
                    <td className="fw-semibold text-white">{t.stock?.companyName || 'Company'}</td>
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
                    <td className="fs-7 text-muted">
                      {new Date(t.timestamp || t.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
