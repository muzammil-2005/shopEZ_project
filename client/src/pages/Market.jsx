import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Market = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '';

  const fetchStocks = async () => {
    setLoading(true);
    try {
      let queryStr = [];
      if (search) queryStr.push(`search=${encodeURIComponent(search)}`);
      if (sort) queryStr.push(`sort=${encodeURIComponent(sort)}`);
      
      const res = await API.get(`/stocks?${queryStr.join('&')}`);
      if (res.success) setStocks(res.data);
    } catch (err) {
      console.error('Failed to load market listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, [search, sort]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (val) {
      searchParams.set('search', val);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    if (val) {
      searchParams.set('sort', val);
    } else {
      searchParams.delete('sort');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header Banner */}
      <div className="glass-card p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h2 className="fw-bold text-white mb-1">Stock Market Catalog</h2>
          <p className="text-muted mb-0">Browse real-time equity prices, market capitalization, and historical charts</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-3 d-flex flex-column flex-md-row gap-3">
        <div className="flex-grow-1">
          <div className="input-group">
            <span className="input-group-text bg-dark border-secondary text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control form-control-glass border-start-0"
              placeholder="Search by company name or ticker (e.g. AAPL, Microsoft)..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div style={{ minWidth: '200px' }}>
          <select
            className="form-select form-control-glass"
            value={sort}
            onChange={handleSortChange}
          >
            <option value="">Sort By: Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="marketCap_desc">Market Cap</option>
          </select>
        </div>
      </div>

      {/* Stock List Grid */}
      {loading ? (
        <LoadingSpinner label="Fetching live market listings..." />
      ) : stocks.length === 0 ? (
        <div className="glass-card p-5 text-center text-muted">
          <i className="bi bi-search fs-1 mb-3 text-secondary d-block"></i>
          <h4>No stocks found matching "{search}"</h4>
          <p>Try clearing your search query or adjusting your filters.</p>
        </div>
      ) : (
        <div className="row g-3">
          {stocks.map((stock) => (
            <div key={stock._id} className="col-12 col-md-6 col-lg-4">
              <div className="glass-card p-4 d-flex flex-column justify-content-between h-100">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="badge bg-primary text-white fs-6 fw-bold px-3 py-1 mb-2 d-inline-block">
                        {stock.symbol}
                      </span>
                      <h5 className="fw-bold text-white mb-0">{stock.companyName}</h5>
                    </div>
                    <span className="fs-5 fw-bold text-white">${stock.currentPrice.toFixed(2)}</span>
                  </div>

                  <div className="d-flex justify-content-between text-muted fs-7 border-top border-secondary pt-3 mt-3">
                    <div>
                      <small className="d-block">Daily Range</small>
                      <span className="text-gain fw-semibold">${stock.dailyLow}</span> - <span className="text-gain fw-semibold">${stock.dailyHigh}</span>
                    </div>
                    <div className="text-end">
                      <small className="d-block">Market Cap</small>
                      <span className="text-light fw-semibold">{stock.marketCap}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2">
                  <Link
                    to={`/stock/${stock.symbol}`}
                    className="btn btn-outline-info w-100 rounded-pill fw-semibold"
                  >
                    <i className="bi bi-graph-up me-1"></i> Inspect & Trade
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
