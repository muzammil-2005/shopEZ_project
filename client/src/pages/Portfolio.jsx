import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = async () => {
    try {
      const res = await API.get('/portfolio');
      if (res.success) setPortfolio(res.data);
    } catch (err) {
      console.error('Failed to load portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  if (loading) return <LoadingSpinner label="Fetching portfolio holdings..." />;

  const holdings = portfolio?.holdings || [];
  const cash = portfolio?.availableBalance || 0;
  const totalInvestment = portfolio?.totalInvestment || 0;
  const currentValue = portfolio?.currentValue || 0;
  const pnl = portfolio?.profitLoss || 0;

  return (
    <div className="d-flex flex-column gap-4">
      {/* Portfolio Header */}
      <div className="glass-card p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h2 className="fw-bold text-white mb-1">My Investment Portfolio</h2>
          <p className="text-muted mb-0">Track stock holdings, cost basis, and total unrealized returns</p>
        </div>
        <Link to="/market" className="btn btn-primary-gradient btn-sm rounded-pill px-4">
          <i className="bi bi-cart-plus me-1"></i> Browse Markets
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-card p-3">
            <small className="text-muted text-uppercase fw-semibold fs-8">Holdings Valuation</small>
            <h3 className="fw-bold text-white mb-0">${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-card p-3">
            <small className="text-muted text-uppercase fw-semibold fs-8">Total Capital Invested</small>
            <h3 className="fw-bold text-white mb-0">${totalInvestment.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-card p-3">
            <small className="text-muted text-uppercase fw-semibold fs-8">Available Cash</small>
            <h3 className="fw-bold text-info mb-0">${cash.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-card p-3">
            <small className="text-muted text-uppercase fw-semibold fs-8">Total Profit / Loss</small>
            <h3 className={`fw-bold mb-0 ${pnl >= 0 ? 'text-gain' : 'text-loss'}`}>
              {pnl >= 0 ? '+' : ''}${pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="glass-card p-4">
        <h5 className="fw-bold text-white mb-3">
          <i className="bi bi-collection text-info me-2"></i>Active Asset Holdings
        </h5>

        {holdings.length === 0 ? (
          <div className="text-center p-5 text-muted">
            <i className="bi bi-wallet-fill fs-1 text-secondary mb-3 d-block"></i>
            <h5>Your portfolio is currently empty</h5>
            <p>Explore the market catalog and buy stocks to start building your wealth.</p>
            <Link to="/market" className="btn btn-outline-info rounded-pill px-4 mt-2">Go to Market</Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-custom align-middle">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Company</th>
                  <th>Quantity</th>
                  <th>Avg Cost</th>
                  <th>Current Price</th>
                  <th>Market Value</th>
                  <th>Return ($)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => {
                  const currPrice = h.stock?.currentPrice || h.averagePrice;
                  const marketValue = h.quantity * currPrice;
                  const itemPnl = marketValue - h.totalInvested;

                  return (
                    <tr key={h.symbol}>
                      <td>
                        <span className="badge bg-dark text-info border border-info-subtle px-3 py-2 fw-bold fs-7">
                          {h.symbol}
                        </span>
                      </td>
                      <td className="fw-semibold text-white">{h.companyName}</td>
                      <td className="fw-bold">{h.quantity}</td>
                      <td className="text-muted">${h.averagePrice.toFixed(2)}</td>
                      <td className="fw-semibold text-white">${currPrice.toFixed(2)}</td>
                      <td className="fw-bold text-white">${marketValue.toFixed(2)}</td>
                      <td className={itemPnl >= 0 ? 'text-gain' : 'text-loss'}>
                        {itemPnl >= 0 ? '+' : ''}${itemPnl.toFixed(2)}
                      </td>
                      <td>
                        <Link to={`/stock/${h.symbol}`} className="btn btn-outline-warning btn-sm rounded-pill px-3">
                          Trade
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
