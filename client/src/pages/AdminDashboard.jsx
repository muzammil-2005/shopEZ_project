import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get('/analytics');
      if (res.success) setAnalytics(res.data);
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner label="Compiling executive platform metrics..." />;

  const { metrics, topTraded, recentTransactions } = analytics || {};

  return (
    <div className="d-flex flex-column gap-4">
      {/* Admin Banner Header */}
      <div className="glass-card p-4 border-start border-4 border-danger">
        <h2 className="fw-bold text-white mb-1"><i className="bi bi-shield-lock-fill text-danger me-2"></i>Executive Administration Suite</h2>
        <p className="text-muted mb-0">Platform analytics, liquidity control, user roles, and order auditing</p>
      </div>

      {/* Analytics KPI Row */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-card p-3 d-flex align-items-center gap-3">
            <div className="bg-info text-white rounded-3 p-3 fs-4">
              <i className="bi bi-people-fill"></i>
            </div>
            <div>
              <small className="text-muted text-uppercase fw-semibold fs-8">Registered Users</small>
              <h3 className="fw-bold text-white mb-0">{metrics?.totalUsers || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-card p-3 d-flex align-items-center gap-3">
            <div className="bg-warning text-white rounded-3 p-3 fs-4">
              <i className="bi bi-cpu-fill"></i>
            </div>
            <div>
              <small className="text-muted text-uppercase fw-semibold fs-8">Active Stocks</small>
              <h3 className="fw-bold text-white mb-0">{metrics?.totalStocks || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-card p-3 d-flex align-items-center gap-3">
            <div className="bg-success text-white rounded-3 p-3 fs-4">
              <i className="bi bi-receipt"></i>
            </div>
            <div>
              <small className="text-muted text-uppercase fw-semibold fs-8">Total Executed Trades</small>
              <h3 className="fw-bold text-white mb-0">{metrics?.totalTransactions || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-card p-3 d-flex align-items-center gap-3">
            <div className="bg-primary text-white rounded-3 p-3 fs-4">
              <i className="bi bi-currency-dollar"></i>
            </div>
            <div>
              <small className="text-muted text-uppercase fw-semibold fs-8">Trading Volume</small>
              <h3 className="fw-bold text-white mb-0">${(metrics?.totalVolume || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Top Traded Stocks & Volume Split */}
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="glass-card p-4 h-100">
            <h5 className="fw-bold text-white mb-3"><i className="bi bi-trophy-fill text-warning me-2"></i>Top Traded Equities</h5>
            <div className="table-responsive">
              <table className="table table-custom align-middle">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Company</th>
                    <th>Orders</th>
                    <th>Total Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {(topTraded || []).map((stk) => (
                    <tr key={stk._id}>
                      <td><span className="badge bg-primary fs-7">{stk.symbol}</span></td>
                      <td className="text-white fw-semibold">{stk.companyName}</td>
                      <td className="fw-bold">{stk.tradeCount}</td>
                      <td className="text-gain fw-bold">${stk.volume.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="glass-card p-4 h-100">
            <h5 className="fw-bold text-white mb-3"><i className="bi bi-clock-history text-info me-2"></i>Recent System Activity</h5>
            <div className="table-responsive">
              <table className="table table-custom align-middle">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Action</th>
                    <th>Ticker</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(recentTransactions || []).map((t) => (
                    <tr key={t._id}>
                      <td className="text-white fw-semibold">{t.user?.name || 'User'}</td>
                      <td>
                        <span className={`badge bg-${t.buyOrSell === 'BUY' ? 'success' : 'danger'}`}>
                          {t.buyOrSell}
                        </span>
                      </td>
                      <td className="text-info fw-bold">{t.stock?.symbol || 'STOCK'}</td>
                      <td className="fw-bold text-white">${t.totalAmount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
