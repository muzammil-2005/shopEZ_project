import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Sidebar = () => {
  const { isAdmin } = useAuth();

  return (
    <aside className="sidebar-glass p-3 d-flex flex-column gap-2">
      <div className="text-uppercase fs-8 text-muted fw-bold px-3 pt-2 mb-1">
        General
      </div>

      <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <i className="bi bi-speedometer2 text-primary"></i>
        <span>Dashboard</span>
      </NavLink>

      <NavLink to="/market" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <i className="bi bi-graph-up text-cyan"></i>
        <span>Market Browse</span>
      </NavLink>

      <NavLink to="/portfolio" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <i className="bi bi-wallet2 text-success"></i>
        <span>My Portfolio</span>
      </NavLink>

      <NavLink to="/transactions" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <i className="bi bi-receipt text-warning"></i>
        <span>Transactions</span>
      </NavLink>

      <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <i className="bi bi-person-badge text-info"></i>
        <span>Profile</span>
      </NavLink>

      {isAdmin && (
        <>
          <hr className="border-secondary my-2 opacity-25" />
          <div className="text-uppercase fs-8 text-danger fw-bold px-3 pt-2 mb-1">
            Admin Suite
          </div>

          <NavLink to="/admin" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-shield-lock-fill text-danger"></i>
            <span>Admin Overview</span>
          </NavLink>

          <NavLink to="/admin/stocks" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-cpu-fill text-warning"></i>
            <span>Manage Stocks</span>
          </NavLink>

          <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-people-fill text-info"></i>
            <span>Manage Users</span>
          </NavLink>

          <NavLink to="/admin/transactions" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-check2-square text-success"></i>
            <span>Trade Approvals</span>
          </NavLink>
        </>
      )}
    </aside>
  );
};
