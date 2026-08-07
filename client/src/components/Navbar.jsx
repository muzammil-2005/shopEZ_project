import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/market?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-glass sticky-top py-2 px-3">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-white fs-4" to="/">
          <div className="bg-primary text-white rounded-3 px-2 py-1 fs-5">
            <i className="bi bi-graph-up-arrow"></i>
          </div>
          <span>Shop<span className="text-info">EZ</span></span>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle fs-7 ms-1">PRO</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Quick Search */}
          <form className="d-flex mx-auto my-2 my-lg-0" style={{ maxWidth: '400px', width: '100%' }} onSubmit={handleSearchSubmit}>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control form-control-glass border-start-0"
                placeholder="Search stocks (e.g. AAPL, TSLA)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* User Status / Quick Actions */}
          <div className="d-flex align-items-center gap-3 ms-auto">
            {user ? (
              <>
                <div className="d-none d-md-flex align-items-center gap-2 px-3 py-1 glass-card rounded-pill">
                  <i className="bi bi-person-circle text-info fs-5"></i>
                  <div>
                    <div className="fw-semibold text-white fs-7">{user.name}</div>
                    <small className="badge bg-secondary-subtle text-light">{user.role}</small>
                  </div>
                </div>

                <Link to="/profile" className="btn btn-outline-light btn-sm rounded-circle p-2" title="Profile Settings">
                  <i className="bi bi-gear-fill"></i>
                </Link>

                <button onClick={logout} className="btn btn-outline-danger btn-sm px-3 rounded-pill">
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm px-3 rounded-pill">Login</Link>
                <Link to="/register" className="btn btn-primary-gradient btn-sm px-3 rounded-pill">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
