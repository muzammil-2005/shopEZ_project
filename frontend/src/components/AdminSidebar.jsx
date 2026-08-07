import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar px-3">
      <div className="d-flex align-items-center gap-2 px-3 mb-4">
        <i className="bi bi-shield-lock-fill text-warning fs-4"></i>
        <h5 className="text-light m-0 fw-bold">Admin Panel</h5>
      </div>

      <nav className="nav flex-column">
        <NavLink to="/admin" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-speedometer2"></i> Dashboard
        </NavLink>
        <NavLink to="/admin/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-box-seam"></i> Manage Products
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-cart-check"></i> Manage Orders
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-people"></i> Manage Users
        </NavLink>
        <NavLink to="/admin/reviews" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-star"></i> Customer Reviews
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
