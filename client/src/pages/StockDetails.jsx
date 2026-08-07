import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { StockChart } from '../components/StockChart';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';

export const StockDetails = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [stock, setStock] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  const [buyOrSell, setBuyOrSell] = useState('BUY');
  const [quantity, setQuantity] = useState(1);
  const [submittingTrade, setSubmittingTrade] = useState(false);

  const fetchData = async () => {
    try {
      const [stockRes, portRes] = await Promise.all([
        API.get(`/stocks/${symbol}`),
        API.get('/portfolio'),
      ]);

      if (stockRes.success) setStock(stockRes.data);
      if (portRes.success) setPortfolio(portRes.data);
    } catch (err) {
      addToast('Failed to load stock details', 'error');
      navigate('/market');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [symbol]);

  const handleExecuteTrade = async (e) => {
    e.preventDefault();
    if (!quantity || Number(quantity) <= 0) {
      addToast('Please enter a valid share quantity', 'error');
      return;
    }

    setSubmittingTrade(true);
    try {
      const res = await API.post('/transactions', {
        stockId: stock._id,
        buyOrSell,
        quantity: Number(quantity),
      });

      if (res.success) {
        addToast(res.message, 'success');
        fetchData(); // Refresh stock & portfolio holdings balance
      }
    } catch (err) {
      addToast(err.message || 'Trade execution failed', 'error');
    } finally {
      setSubmittingTrade(false);
    }
  };

  if (loading) return <LoadingSpinner label={`Loading market data for ${symbol}...`} />;

  const ownedHolding = portfolio?.holdings.find(
    (h) => h.stock?._id === stock?._id || h.symbol === stock?.symbol
  );
  const ownedQty = ownedHolding ? ownedHolding.quantity : 0;
  const cashBalance = portfolio?.availableBalance || 0;
  const price = stock?.currentPrice || 0;
  const totalCost = price * Number(quantity || 0);

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header Info Banner */}
      <div className="glass-card p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-primary text-white rounded-3 px-3 py-2 fs-3 fw-bold">
            {stock.symbol}
          </div>
          <div>
            <h2 className="fw-bold text-white mb-0">{stock.companyName}</h2>
            <span className="text-muted fs-7">Market Equity • NYSE / NASDAQ</span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-4">
          <div>
            <small className="text-muted text-uppercase fs-8 d-block">Current Price</small>
            <span className="fs-3 fw-bold text-white">${price.toFixed(2)}</span>
          </div>
          <div>
            <small className="text-muted text-uppercase fs-8 d-block">Market Cap</small>
            <span className="fs-5 fw-semibold text-info">{stock.marketCap}</span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Interactive Price Chart */}
        <div className="col-12 col-lg-8">
          <div className="glass-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-white mb-0">
                <i className="bi bi-graph-up text-success me-2"></i>Historical Price Trend
              </h5>
              <div className="d-flex gap-2 text-muted fs-7">
                <span>Low: <strong className="text-gain">${stock.dailyLow}</strong></span>
                <span>High: <strong className="text-gain">${stock.dailyHigh}</strong></span>
              </div>
            </div>

            <StockChart historicalData={stock.historicalData} symbol={stock.symbol} />
          </div>
        </div>

        {/* Right Column: Buy / Sell Order Execution Desk */}
        <div className="col-12 col-lg-4">
          <div className="glass-card p-4">
            <h5 className="fw-bold text-white mb-3">
              <i className="bi bi-arrow-left-right text-warning me-2"></i>Trade Execution Desk
            </h5>

            {/* Toggle BUY vs SELL */}
            <div className="btn-group w-100 mb-4" role="group">
              <button
                type="button"
                className={`btn py-2 fw-bold ${buyOrSell === 'BUY' ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={() => setBuyOrSell('BUY')}
              >
                BUY SHARES
              </button>
              <button
                type="button"
                className={`btn py-2 fw-bold ${buyOrSell === 'SELL' ? 'btn-danger' : 'btn-outline-secondary'}`}
                onClick={() => setBuyOrSell('SELL')}
              >
                SELL SHARES
              </button>
            </div>

            {/* Account Quick Info */}
            <div className="bg-dark p-3 rounded-3 mb-3 border border-secondary">
              <div className="d-flex justify-content-between fs-7 text-muted mb-1">
                <span>Available Cash:</span>
                <span className="text-white fw-bold">${cashBalance.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between fs-7 text-muted">
                <span>Currently Owned:</span>
                <span className="text-info fw-bold">{ownedQty} shares</span>
              </div>
            </div>

            {/* Trade Form */}
            <form onSubmit={handleExecuteTrade}>
              <div className="mb-3">
                <label className="form-label text-muted fs-7 fw-semibold">Share Quantity</label>
                <input
                  type="number"
                  className="form-control form-control-glass"
                  min="1"
                  max={buyOrSell === 'SELL' ? ownedQty : 10000}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>

              <div className="border-top border-secondary pt-3 mb-4">
                <div className="d-flex justify-content-between text-muted fs-7 mb-1">
                  <span>Price per Share:</span>
                  <span>${price.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between text-white fw-bold fs-6">
                  <span>Estimated Total:</span>
                  <span className={buyOrSell === 'BUY' ? 'text-gain' : 'text-loss'}>
                    ${totalCost.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className={`btn w-100 py-2.5 fw-bold ${
                  buyOrSell === 'BUY' ? 'btn-success' : 'btn-danger'
                }`}
                disabled={submittingTrade || (buyOrSell === 'SELL' && ownedQty < Number(quantity))}
              >
                {submittingTrade
                  ? 'Executing Trade...'
                  : `${buyOrSell} ${quantity} ${stock.symbol} SHARES`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
