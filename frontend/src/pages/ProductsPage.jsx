import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filters state
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [brand, setBrand] = useState(searchParams.get('brand') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [rating, setRating] = useState(searchParams.get('rating') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (keyword) queryParams.set('keyword', keyword);
      if (category && category !== 'All') queryParams.set('category', category);
      if (brand && brand !== 'All') queryParams.set('brand', brand);
      if (minPrice) queryParams.set('minPrice', minPrice);
      if (maxPrice) queryParams.set('maxPrice', maxPrice);
      if (rating) queryParams.set('rating', rating);
      if (sortBy) queryParams.set('sortBy', sortBy);
      queryParams.set('page', page);
      queryParams.set('limit', 12);

      const { data } = await API.get(`/products?${queryParams.toString()}`);
      setProducts(data.products || []);
      setPages(data.pages || 1);
      setTotalProducts(data.totalProducts || 0);

      if (data.categories) setCategories(['All', ...data.categories]);
      if (data.brands) setBrands(['All', ...data.brands]);

      setLoading(false);
    } catch (err) {
      console.error('Fetch products error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, category, brand, rating, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleResetFilters = () => {
    setKeyword('');
    setCategory('All');
    setBrand('All');
    setMinPrice('');
    setMaxPrice('');
    setRating('');
    setSortBy('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="container my-4">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold m-0">Explore Products</h2>
          <p className="text-muted small m-0">Showing {totalProducts} items matching your criteria</p>
        </div>
        <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
          <label className="fw-semibold small text-muted text-nowrap">Sort By:</label>
          <select
            className="form-select form-select-sm rounded-pill shadow-sm"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            style={{ width: '180px' }}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="row g-4">
        {/* Filter Sidebar */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold m-0"><i className="bi bi-funnel text-primary me-2"></i>Filters</h5>
              <button onClick={handleResetFilters} className="btn btn-sm btn-link text-decoration-none text-danger p-0 fw-semibold">
                Reset All
              </button>
            </div>

            {/* Keyword Search */}
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <label className="form-label fw-semibold small text-muted">Search Keyword</label>
              <div className="input-group input-group-sm">
                <input
                  type="text"
                  className="form-control rounded-start-pill ps-3"
                  placeholder="e.g. Headphones"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <button className="btn btn-primary rounded-end-pill px-3" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>

            {/* Category Filter */}
            <div className="mb-4">
              <label className="form-label fw-semibold small text-muted">Category</label>
              <select
                className="form-select form-select-sm rounded-3"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div className="mb-4">
              <label className="form-label fw-semibold small text-muted">Brand</label>
              <select
                className="form-select form-select-sm rounded-3"
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  setPage(1);
                }}
              >
                {brands.map((b, idx) => (
                  <option key={idx} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="mb-4">
              <label className="form-label fw-semibold small text-muted">Price Range (₹)</label>
              <div className="d-flex gap-2 align-items-center">
                <input
                  type="number"
                  placeholder="Min"
                  className="form-control form-control-sm rounded-3"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="form-control form-control-sm rounded-3"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <button
                onClick={() => { setPage(1); fetchProducts(); }}
                className="btn btn-sm btn-outline-primary w-100 mt-2 rounded-pill fw-semibold"
              >
                Apply Price
              </button>
            </div>

            {/* Rating Filter */}
            <div className="mb-3">
              <label className="form-label fw-semibold small text-muted">Minimum Rating</label>
              <div className="d-flex flex-column gap-1">
                {[4, 3, 2, 1].map((r) => (
                  <div key={r} className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="ratingFilter"
                      id={`rating-${r}`}
                      checked={Number(rating) === r}
                      onChange={() => {
                        setRating(r);
                        setPage(1);
                      }}
                    />
                    <label className="form-check-label small d-flex align-items-center gap-1" htmlFor={`rating-${r}`}>
                      <span className="text-warning"><i className="bi bi-star-fill"></i></span> {r} Stars & Above
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="col-lg-9">
          {loading ? (
            <LoadingSpinner message="Fetching products..." />
          ) : products.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center my-4">
              <i className="bi bi-search-heart fs-1 text-muted mb-3"></i>
              <h4 className="fw-bold">No Products Found</h4>
              <p className="text-muted">Try adjusting your filters or search keywords to find what you are looking for.</p>
              <div>
                <button onClick={handleResetFilters} className="btn btn-primary rounded-pill px-4">
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {products.map((product) => (
                  <div key={product._id} className="col-12 col-sm-6 col-md-4">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <nav className="d-flex justify-content-center mt-5">
                  <ul className="pagination pagination-md shadow-sm">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                      <button className="page-item page-link" onClick={() => setPage(page - 1)}>
                        Previous
                      </button>
                    </li>
                    {[...Array(pages).keys()].map((x) => (
                      <li key={x + 1} className={`page-item ${page === x + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setPage(x + 1)}>
                          {x + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${page === pages ? 'disabled' : ''}`}>
                      <button className="page-item page-link" onClick={() => setPage(page + 1)}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
