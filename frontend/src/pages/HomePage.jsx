import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import DealsCountdown from '../components/DealsCountdown';

const HomePage = () => {
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [electronicsProducts, setElectronicsProducts] = useState([]);
  const [fashionProducts, setFashionProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryIcons = [
    { name: 'Electronics', icon: 'bi-laptop', color: 'bg-primary' },
    { name: 'Fashion', icon: 'bi-handbag', color: 'bg-danger' },
    { name: 'Home & Kitchen', icon: 'bi-house-heart', color: 'bg-warning' },
    { name: 'Beauty', icon: 'bi-flower2', color: 'bg-info' },
    { name: 'Sports', icon: 'bi-trophy', color: 'bg-success' },
    { name: 'Accessories', icon: 'bi-smartwatch', color: 'bg-purple' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bestRes, elecRes, fashRes] = await Promise.all([
          API.get('/products?page=1'),
          API.get('/products?category=Electronics'),
          API.get('/products?category=Fashion'),
        ]);

        setBestsellerProducts(bestRes.data.products.slice(0, 8));
        setElectronicsProducts(elecRes.data.products.slice(0, 8));
        setFashionProducts(fashRes.data.products.slice(0, 8));
        setLoading(false);
      } catch (err) {
        console.error('Error loading homepage data:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* 1. Flipkart-style Top Category Quick Bar */}
      <div className="bg-white border-bottom shadow-xs py-3 mb-4">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between overflow-auto gap-4 py-1 text-center no-scrollbar">
            {categoryIcons.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="text-decoration-none text-dark d-flex flex-column align-items-center group flex-shrink-0"
                style={{ minWidth: '85px' }}
              >
                <div
                  className={`rounded-circle text-white d-flex align-items-center justify-content-center mb-2 shadow-sm transition-transform ${cat.color}`}
                  style={{ width: '56px', height: '56px' }}
                >
                  <i className={`bi ${cat.icon} fs-4`}></i>
                </div>
                <span className="fw-semibold small text-truncate max-w-xs">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        {/* 2. Hero Carousel Banner & Deals of the Day */}
        <div className="row g-4 mb-5">
          <div className="col-lg-8">
            <div
              id="shopezHeroCarousel"
              className="carousel slide rounded-4 overflow-hidden shadow-lg"
              data-bs-ride="carousel"
            >
              <div className="carousel-indicators">
                <button type="button" data-bs-target="#shopezHeroCarousel" data-bs-slide-to="0" className="active"></button>
                <button type="button" data-bs-target="#shopezHeroCarousel" data-bs-slide-to="1"></button>
                <button type="button" data-bs-target="#shopezHeroCarousel" data-bs-slide-to="2"></button>
              </div>

              <div className="carousel-inner">
                {/* Slide 1 */}
                <div className="carousel-item active" style={{ minHeight: '340px' }}>
                  <div
                    className="p-5 text-white d-flex flex-column justify-content-center h-100"
                    style={{
                      background: 'linear-gradient(135deg, #2563eb 0%, #1e1b4b 100%)',
                    }}
                  >
                    <span className="badge bg-warning text-dark align-self-start fw-bold mb-2 px-3 py-1.5 rounded-pill">
                      🔥 BIG SAVINGS SALE
                    </span>
                    <h2 className="display-6 fw-extrabold mb-3">Up to 70% OFF Electronics & Gadgets</h2>
                    <p className="lead mb-4 text-white-50">Upgrade your tech setup with top brands & ShopEZ Assured warranty.</p>
                    <div>
                      <Link to="/products?category=Electronics" className="btn btn-warning rounded-pill px-4 py-2 fw-bold text-dark me-2">
                        Shop Electronics <i className="bi bi-arrow-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Slide 2 */}
                <div className="carousel-item" style={{ minHeight: '340px' }}>
                  <div
                    className="p-5 text-white d-flex flex-column justify-content-center h-100"
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed 0%, #311b92 100%)',
                    }}
                  >
                    <span className="badge bg-info text-dark align-self-start fw-bold mb-2 px-3 py-1.5 rounded-pill">
                      ✨ FESTIVE FASHION
                    </span>
                    <h2 className="display-6 fw-extrabold mb-3">Latest Apparel & Accessories</h2>
                    <p className="lead mb-4 text-white-50">Trendsetting jackets, dresses, footwear, and leather gear.</p>
                    <div>
                      <Link to="/products?category=Fashion" className="btn btn-info rounded-pill px-4 py-2 fw-bold text-dark me-2">
                        Explore Fashion <i className="bi bi-arrow-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Slide 3 */}
                <div className="carousel-item" style={{ minHeight: '340px' }}>
                  <div
                    className="p-5 text-white d-flex flex-column justify-content-center h-100"
                    style={{
                      background: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)',
                    }}
                  >
                    <span className="badge bg-light text-dark align-self-start fw-bold mb-2 px-3 py-1.5 rounded-pill">
                      🏠 HOME MAKEOVER
                    </span>
                    <h2 className="display-6 fw-extrabold mb-3">Cookware, Air Fryers & Coffee Makers</h2>
                    <p className="lead mb-4 text-white-50">Transform your kitchen and living space with high quality home essentials.</p>
                    <div>
                      <Link to="/products?category=Home%20%26%20Kitchen" className="btn btn-light rounded-pill px-4 py-2 fw-bold text-dark me-2">
                        Browse Home Items <i className="bi bi-arrow-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <button className="carousel-control-prev" type="button" data-bs-target="#shopezHeroCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon"></span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#shopezHeroCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon"></span>
              </button>
            </div>
          </div>

          {/* Right Banner - Deals of the Day */}
          <div className="col-lg-4">
            <div className="bg-white p-4 rounded-4 shadow-lg border h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="fw-extrabold m-0 text-dark d-flex align-items-center gap-2">
                    <i className="bi bi-lightning-charge-fill text-warning fs-4"></i> Deals of the Day
                  </h5>
                </div>
                <div className="mb-4">
                  <DealsCountdown />
                </div>
                <p className="text-muted small mb-4">
                  Special flash discounts on top categories. Guaranteed 24-hour delivery on select items with ShopEZ Assured.
                </p>
              </div>

              <div className="p-3 bg-light rounded-3 border border-light">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="fw-bold small text-dark">Free Delivery</span>
                  <span className="badge bg-success">Orders Over ₹999</span>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="fw-bold small text-dark">Easy Returns</span>
                  <span className="badge bg-secondary">7-Day Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Section A: Top Bestseller Products */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="fw-extrabold text-dark m-0">🔥 Deals of the Day & Bestsellers</h3>
            <p className="text-muted small m-0">Handpicked bestseller products with ShopEZ Assured quality tag</p>
          </div>
          <Link to="/products" className="btn btn-outline-primary rounded-pill px-4 fw-bold">
            View All Products <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mb-5">
            {bestsellerProducts.map((product) => (
              <div key={product._id} className="col">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* 4. Section B: Electronics Spotlight */}
        {electronicsProducts.length > 0 && (
          <div className="mb-5">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h3 className="fw-extrabold text-dark m-0">💻 Best in Electronics & Gadgets</h3>
                <p className="text-muted small m-0">Headphones, smartwatches, keyboards, action cameras & more</p>
              </div>
              <Link to="/products?category=Electronics" className="btn btn-outline-primary rounded-pill px-4 fw-bold">
                View Electronics <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {electronicsProducts.map((product) => (
                <div key={product._id} className="col">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Section C: Fashion Spotlight */}
        {fashionProducts.length > 0 && (
          <div className="mb-5">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h3 className="fw-extrabold text-dark m-0">👕 Trendy Fashion & Clothing</h3>
                <p className="text-muted small m-0">Denim jackets, leather coats, slim fit blazers, chinos & footwear</p>
              </div>
              <Link to="/products?category=Fashion" className="btn btn-outline-primary rounded-pill px-4 fw-bold">
                View Fashion <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {fashionProducts.map((product) => (
                <div key={product._id} className="col">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
