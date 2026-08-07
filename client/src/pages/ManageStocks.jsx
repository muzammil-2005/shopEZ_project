import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';

export const ManageStocks = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Create Form State
  const [symbol, setSymbol] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [marketCap, setMarketCap] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit State
  const [editingStock, setEditingStock] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  const fetchStocks = async () => {
    try {
      const res = await API.get('/stocks');
      if (res.success) setStocks(res.data);
    } catch (err) {
      console.error('Failed to load stocks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleCreateStock = async (e) => {
    e.preventDefault();
    if (!symbol || !companyName || !currentPrice) {
      addToast('Symbol, Company Name, and Price are required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/stocks', {
        symbol,
        companyName,
        currentPrice: Number(currentPrice),
        marketCap: marketCap || '$10B',
      });

      if (res.success) {
        addToast(`Successfully created stock ${res.data.symbol}`, 'success');
        setSymbol('');
        setCompanyName('');
        setCurrentPrice('');
        setMarketCap('');
        fetchStocks();
      }
    } catch (err) {
      addToast(err.message || 'Failed to create stock', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    if (!editingStock || !editPrice) return;

    try {
      const res = await API.put(`/stocks/${editingStock._id}`, {
        currentPrice: Number(editPrice),
      });

      if (res.success) {
        addToast(`Updated ${editingStock.symbol} price to $${editPrice}`, 'success');
        setEditingStock(null);
        fetchStocks();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update stock', 'error');
    }
  };

  const handleDeleteStock = async (id, ticker) => {
    if (!window.confirm(`Are you sure you want to delete ${ticker}?`)) return;

    try {
      const res = await API.delete(`/stocks/${id}`);
      if (res.success) {
        addToast(`Stock ${ticker} deleted`, 'info');
        fetchStocks();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete stock', 'error');
    }
  };

  if (loading) return <LoadingSpinner label="Loading stock directory..." />;

  return (
    <div className="d-flex flex-column gap-4">
      <div className="glass-card p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h2 className="fw-bold text-white mb-1"><i className="bi bi-cpu-fill text-warning me-2"></i>Equity Catalog Management</h2>
          <p className="text-muted mb-0">Create new market tickers, re-price existing securities, or remove listings</p>
        </div>

        <button
          className="btn btn-primary-gradient rounded-pill px-4"
          data-bs-toggle="modal"
          data-bs-target="#createStockModal"
        >
          <i className="bi bi-plus-lg me-1"></i> Add New Stock Ticker
        </button>
      </div>

      {/* Stocks Table */}
      <div className="glass-card p-4">
        <div className="table-responsive">
          <table className="table table-custom align-middle">
            <thead>
              <tr>
                <th>Ticker Symbol</th>
                <th>Company Name</th>
                <th>Current Price</th>
                <th>Market Cap</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock._id}>
                  <td>
                    <span className="badge bg-primary fs-7 fw-bold px-3 py-2">{stock.symbol}</span>
                  </td>
                  <td className="fw-semibold text-white">{stock.companyName}</td>
                  <td className="fw-bold text-white">${stock.currentPrice.toFixed(2)}</td>
                  <td className="text-muted">{stock.marketCap}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-info btn-sm rounded-pill px-3"
                        onClick={() => {
                          setEditingStock(stock);
                          setEditPrice(stock.currentPrice);
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#editStockModal"
                      >
                        Edit Price
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm rounded-circle p-1.5"
                        onClick={() => handleDeleteStock(stock._id, stock.symbol)}
                        title="Delete Stock"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Stock Modal */}
      <div className="modal fade" id="createStockModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content glass-card border-0 text-white">
            <div className="modal-header border-secondary">
              <h5 className="modal-title fw-bold">List New Stock Ticker</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <form onSubmit={handleCreateStock}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label text-muted fs-7 fw-semibold">Ticker Symbol (e.g. NVDA)</label>
                  <input
                    type="text"
                    className="form-control form-control-glass"
                    placeholder="AAPL"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted fs-7 fw-semibold">Company Name</label>
                  <input
                    type="text"
                    className="form-control form-control-glass"
                    placeholder="Apple Inc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted fs-7 fw-semibold">Initial Current Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control form-control-glass"
                    placeholder="150.00"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted fs-7 fw-semibold">Market Cap (e.g. $2.5 Trillion)</label>
                  <input
                    type="text"
                    className="form-control form-control-glass"
                    placeholder="$1.5 Trillion"
                    value={marketCap}
                    onChange={(e) => setMarketCap(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer border-secondary">
                <button type="button" className="btn btn-dark" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary-gradient" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Stock Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Stock Modal */}
      <div className="modal fade" id="editStockModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content glass-card border-0 text-white">
            <div className="modal-header border-secondary">
              <h5 className="modal-title fw-bold">Update Price: {editingStock?.symbol}</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <form onSubmit={handleUpdateStock}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label text-muted fs-7 fw-semibold">New Stock Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control form-control-glass"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer border-secondary">
                <button type="button" className="btn btn-dark" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary-gradient" data-bs-dismiss="modal">
                  Save Price
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
