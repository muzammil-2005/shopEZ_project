import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItemCount } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

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
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top shadow-sm py-2">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-extrabold fs-3" to="/">
          <div
            className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center"
            style={{ width: '40px', height: '40px' }}
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
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            <li className="nav-item">
              <Link
                className={`nav-link nav-link-custom ${location.pathname === '/' ? 'active' : ''}`}
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link nav-link-custom ${location.pathname === '/products' ? 'active' : ''}`}
                to="/products"
              >
                Products
              </Link>
            </li>
          </ul>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="d-flex me-lg-3 my-2 my-lg-0 flex-grow-1 max-w-md" style={{ maxWidth: '380px' }}>
            <div className="input-group">
              <input
                type="text"
                className="form-control bg-light border-end-0 rounded-start-pill ps-3"
                placeholder="Search electronics, fashion, home..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button className="btn btn-outline-secondary border-start-0 rounded-end-pill bg-light text-primary px-3" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>

          {/* Actions & User Profile */}
          <div className="d-flex align-items-center gap-3">
            {/* Wishlist Icon */}
            <Link to="/wishlist" className="btn btn-light rounded-circle position-relative p-2" title="Wishlist">
              <i className="bi bi-heart fs-5 text-dark"></i>
              {wishlistCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="btn btn-light rounded-circle position-relative p-2" title="Cart">
              <i className="bi bi-cart3 fs-5 text-dark"></i>
              {cartItemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Dropdown or Login Button */}
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary dropdown-toggle rounded-pill d-flex align-items-center gap-2 px-3 fw-semibold"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle fs-5"></i>
                  <span>{user.name.split(' ')[0]}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm rounded-3 mt-2 border-0" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to="/profile">
                      <i className="bi bi-person"></i> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to="/orders">
                      <i className="bi bi-box-seam"></i> My Orders
                    </Link>
                  </li>
                  {user.role === 'ADMIN' && (
                    <>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item d-flex align-items-center gap-2 text-primary fw-bold" to="/admin/dashboard">
                          <i className="bi bi-speedometer2"></i> Admin Dashboard
                        </Link>
                      </li>
                    </>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button onClick={logout} className="dropdown-item d-flex align-items-center gap-2 text-danger">
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
