import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StockChart } from '../components/StockChart';
import { PortfolioDonut } from '../components/PortfolioDonut';
import { useToast } from '../context/ToastContext';

export const Dashboard = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [submittingDeposit, setSubmittingDeposit] = useState(false);

  const { addToast } = useToast();

  const fetchData = async () => {
    try {
      const [portRes, stocksRes] = await Promise.all([
        API.get('/portfolio'),
        API.get('/stocks'),
      ]);

      if (portRes.success) setPortfolio(portRes.data);
      if (stocksRes.success) setStocks(stocksRes.data);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!depositAmount || Number(depositAmount) <= 0) {
      addToast('Please enter a valid deposit amount', 'error');
      return;
    }

    setSubmittingDeposit(true);
    try {
      const res = await API.post('/portfolio/deposit', { amount: depositAmount });
      if (res.success) {
        addToast(res.message, 'success');
        setPortfolio(res.data);
        setDepositAmount('');
      }
    } catch (err) {
      addToast(err.message || 'Deposit failed', 'error');
    } finally {
      setSubmittingDeposit(false);
    }
  };

  if (loading) return <LoadingSpinner label="Initializing dashboard metrics..." />;

  const cash = portfolio?.availableBalance || 0;
  const invested = portfolio?.totalInvestment || 0;
  const currentValue = portfolio?.currentValue || 0;
  const totalWealth = cash + currentValue;
  const pnl = portfolio?.profitLoss || 0;

  return (
    <div className="d-flex flex-column gap-4">
      {/* Top Banner Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 glass-card p-4">
        <div>
          <h2 className="fw-bold text-white mb-1">Trading Dashboard</h2>
          <p className="text-muted mb-0">Overview of your holdings, market trends, and available cash</p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-success btn-sm rounded-pill px-3"
            data-bs-toggle="modal"
            data-bs-target="#depositModal"
          >
            <i className="bi bi-plus-circle me-1"></i> Deposit Cash
          </button>
          <Link to="/market" className="btn btn-primary-gradient btn-sm rounded-pill px-3">
            <i className="bi bi-cart-plus me-1"></i> Trade Stocks
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="glass-card p-3 d-flex align-items-center gap-3">
            <div className="bg-primary text-white rounded-3 p-3 fs-4">
              <i className="bi bi-bank"></i>
            </div>
            <div>
              <small className="text-muted text-uppercase fw-semibold fs-8">Total Net Worth</small>
              <h4 className="fw-bold text-white mb-0">${totalWealth.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h4>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="glass-card p-3 d-flex align-items-center gap-3">
            <div className="bg-success text-white rounded-3 p-3 fs-4">
              <i className="bi bi-wallet2"></i>
            </div>
            <div>
              <small className="text-muted text-uppercase fw-semibold fs-8">Available Cash</small>
              <h4 className="fw-bold text-white mb-0">${cash.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h4>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="glass-card p-3 d-flex align-items-center gap-3">
            <div className="bg-info text-white rounded-3 p-3 fs-4">
              <i className="bi bi-pie-chart-fill"></i>
            </div>
            <div>
              <small className="text-muted text-uppercase fw-semibold fs-8">Stock Holdings</small>
              <h4 className="fw-bold text-white mb-0">${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h4>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="glass-card p-3 d-flex align-items-center gap-3">
            <div className={`bg-${pnl >= 0 ? 'success' : 'danger'} text-white rounded-3 p-3 fs-4`}>
              <i className={`bi bi-graph-${pnl >= 0 ? 'up' : 'down'}`}></i>
            </div>
            <div>
              <small className="text-muted text-uppercase fw-semibold fs-8">Unrealized P&L</small>
              <h4 className={`fw-bold mb-0 ${pnl >= 0 ? 'text-gain' : 'text-loss'}`}>
                {pnl >= 0 ? '+' : ''}${pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="glass-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-white mb-0"><i className="bi bi-activity text-primary me-2"></i>Market Index Trend</h5>
              <span className="badge bg-dark border border-secondary text-info">Live Feed</span>
            </div>
            <StockChart
              historicalData={stocks[0]?.historicalData || []}
              symbol={stocks[0]?.symbol || 'INDEX'}
            />
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="glass-card p-4 h-100">
            <h5 className="fw-bold text-white mb-3"><i className="bi bi-pie-chart text-info me-2"></i>Asset Allocation</h5>
            <PortfolioDonut holdings={portfolio?.holdings || []} cashBalance={cash} />
          </div>
        </div>
      </div>

      {/* Top Stocks List */}
      <div className="glass-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-white mb-0"><i className="bi bi-fire text-warning me-2"></i>Popular Market Tickers</h5>
          <Link to="/market" className="btn btn-link text-cyan text-decoration-none p-0 fw-semibold fs-7">View All Markets &rarr;</Link>
        </div>

        <div className="table-responsive">
          <table className="table table-custom align-middle">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Company</th>
                <th>Current Price</th>
                <th>24h Range</th>
                <th>Market Cap</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stocks.slice(0, 5).map((stock) => (
                <tr key={stock._id}>
                  <td>
                    <span className="badge bg-dark text-info border border-info-subtle px-3 py-2 fs-7 fw-bold">
                      {stock.symbol}
                    </span>
                  </td>
                  <td className="fw-semibold">{stock.companyName}</td>
                  <td className="fw-bold text-white">${stock.currentPrice.toFixed(2)}</td>
                  <td className="fs-7 text-muted">
                    <span className="text-gain">${stock.dailyLow}</span> - <span className="text-gain">${stock.dailyHigh}</span>
                  </td>
                  <td className="text-muted">{stock.marketCap}</td>
                  <td>
                    <Link to={`/stock/${stock.symbol}`} className="btn btn-outline-primary btn-sm rounded-pill px-3">
                      Trade
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deposit Cash Modal */}
      <div className="modal fade" id="depositModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content glass-card border-0 text-white">
            <div className="modal-header border-secondary">
              <h5 className="modal-title fw-bold"><i className="bi bi-wallet2 text-success me-2"></i>Add Cash Balance</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleDeposit}>
              <div className="modal-body">
                <p className="text-muted fs-7">Instant virtual deposit for simulated paper trading.</p>
                <div className="mb-3">
                  <label className="form-label text-muted fs-7 fw-semibold">Deposit Amount ($USD)</label>
                  <input
                    type="number"
                    className="form-control form-control-glass"
                    placeholder="e.g. 10000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer border-secondary">
                <button type="button" className="btn btn-dark" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary-gradient" disabled={submittingDeposit}>
                  {submittingDeposit ? 'Processing...' : 'Confirm Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
