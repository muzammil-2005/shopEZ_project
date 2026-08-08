import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItemCount, setIsCartOpen } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const [keyword, setKeyword] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const wishlistCount = wishlist.products ? wishlist.products.length : 0;

  return (
    <nav className="navbar navbar-expand-lg glass-navbar sticky-top shadow-sm py-2">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-extrabold fs-3" to="/">
          <div
            className="bg-primary bg-gradient text-white rounded-3 d-flex align-items-center justify-content-center shadow-sm"
            style={{ width: '42px', height: '42px' }}
          >
            <i className="bi bi-bag-heart-fill fs-5"></i>
          </div>
          <span className="brand-gradient fw-bold">ShopEZ</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#shopezNavbar"
          aria-controls="shopezNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Content */}
        <div className="collapse navbar-collapse" id="shopezNavbar">
          {/* Navigation Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-1">
            <li className="nav-item">
              <Link
                className={`nav-link fw-semibold px-3 rounded-pill ${location.pathname === '/' ? 'active text-primary fw-bold' : ''}`}
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link fw-semibold px-3 rounded-pill ${location.pathname === '/products' ? 'active text-primary fw-bold' : ''}`}
                to="/products"
              >
                Explore Products
              </Link>
            </li>
          </ul>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="d-flex me-lg-3 my-2 my-lg-0 flex-grow-1" style={{ maxWidth: '380px' }}>
            <div className="input-group rounded-pill overflow-hidden border shadow-sm">
              <input
                type="text"
                className="form-control border-0 ps-3 bg-transparent"
                placeholder="Search electronics, fashion, home..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              {keyword && (
                <button
                  type="button"
                  className="btn border-0 bg-transparent text-muted px-2"
                  onClick={() => setKeyword('')}
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}
              <button className="btn btn-primary-custom px-3 border-0" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>

          {/* Right Action Icons & User Dropdown */}
          <div className="d-flex align-items-center gap-2">
            {/* Dark/Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="btn btn-light rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px' }}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              <i className={`bi ${theme === 'light' ? 'bi-moon-stars-fill text-dark' : 'bi-sun-fill text-warning'} fs-5`}></i>
            </button>

            {/* Wishlist Icon */}
            <Link to="/wishlist" className="btn btn-light rounded-circle position-relative p-2 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }} title="Wishlist">
              <i className="bi bi-heart fs-5 text-danger"></i>
              {wishlistCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger animate-badge-pop">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Quick Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="btn btn-light rounded-circle position-relative p-2 shadow-sm d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px' }}
              title="Cart Drawer"
            >
              <i className="bi bi-cart3 fs-5 text-primary"></i>
              {cartItemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary animate-badge-pop">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Buttons */}
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary rounded-pill d-flex align-items-center gap-2 px-3 fw-semibold shadow-sm"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle fs-5"></i>
                  <span>{user.name.split(' ')[0]}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg rounded-4 mt-2 border-0" aria-labelledby="userDropdown">
                  <li className="px-3 py-2 border-bottom">
                    <p className="fw-bold mb-0 text-truncate">{user.name}</p>
                    <small className="text-muted">{user.email}</small>
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/profile">
                      <i className="bi bi-person text-primary"></i> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/orders">
                      <i className="bi bi-box-seam text-success"></i> My Orders
                    </Link>
                  </li>
                  {user.role === 'ADMIN' && (
                    <>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item d-flex align-items-center gap-2 py-2 text-primary fw-bold" to="/admin/dashboard">
                          <i className="bi bi-speedometer2"></i> Admin Dashboard
                        </Link>
                      </li>
                    </>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button onClick={logout} className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger">
                      <i className="bi bi-box-arrow-right"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-primary rounded-pill px-3 fw-semibold">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary-custom rounded-pill px-3 fw-semibold">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
