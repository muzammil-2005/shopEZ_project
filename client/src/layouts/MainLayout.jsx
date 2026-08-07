import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { ToastContainer } from '../components/ToastContainer';

export const MainLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container-fluid flex-grow-1 p-0">
        <div className="row g-0 min-vh-100">
          <div className="col-lg-2 col-md-3 d-none d-md-block p-0">
            <Sidebar />
          </div>
          <main className="col-lg-10 col-md-9 col-12 p-3 p-md-4">
            <Outlet />
          </main>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
