import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/admin/dashboard-stats');
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error('Fetch dashboard stats error:', error);
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex">
        <AdminSidebar />
        <div className="flex-grow-1 p-4"><LoadingSpinner /></div>
      </div>
    );
  }

  // Chart 1: Monthly Sales Trend Line Chart
  const salesChartData = {
    labels: stats?.salesTrend?.map((s) => s.month) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: stats?.salesTrend?.map((s) => s.revenue) || [1200, 1900, 3000, 5000, 4200, 6800],
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Chart 2: Category Distribution Bar Chart
  const categoryChartData = {
    labels: stats?.categoryStats?.map((c) => c._id) || ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'],
    datasets: [
      {
        label: 'Product Count',
        data: stats?.categoryStats?.map((c) => c.count) || [5, 4, 3, 2, 2],
        backgroundColor: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      <AdminSidebar />

      <div className="flex-grow-1 p-4 bg-light">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">Admin Dashboard Overview</h3>
            <p className="text-muted small mb-0">Live platform performance and analytics metrics</p>
          </div>
          <Link to="/admin/products" className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm">
            <i className="bi bi-plus-lg me-1"></i> Add New Product
          </Link>
        </div>

        {/* 4 Key Stat Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-3 p-3 bg-primary-subtle text-primary fs-3">
                  <i className="bi bi-people"></i>
                </div>
                <div>
                  <span className="text-muted small d-block">Total Users</span>
                  <h4 className="fw-extrabold mb-0">{stats?.totalUsers || 0}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-3 p-3 bg-info-subtle text-info fs-3">
                  <i className="bi bi-box-seam"></i>
                </div>
                <div>
                  <span className="text-muted small d-block">Total Products</span>
                  <h4 className="fw-extrabold mb-0">{stats?.totalProducts || 0}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-3 p-3 bg-warning-subtle text-warning fs-3">
                  <i className="bi bi-cart-check"></i>
                </div>
                <div>
                  <span className="text-muted small d-block">Total Orders</span>
                  <h4 className="fw-extrabold mb-0">{stats?.totalOrders || 0}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-3 p-3 bg-success-subtle text-success fs-3">
                  <i className="bi bi-currency-dollar"></i>
                </div>
                <div>
                  <span className="text-muted small d-block">Total Revenue</span>
                  <h4 className="fw-extrabold mb-0">₹{stats?.totalRevenue?.toFixed(2) || '0.00'}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="row g-4 mb-4">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <h5 className="fw-bold mb-3">Sales & Revenue Performance</h5>
              <div style={{ minHeight: '280px' }}>
                <Line data={salesChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <h5 className="fw-bold mb-3">Products by Category</h5>
              <div style={{ minHeight: '280px' }}>
                <Bar data={categoryChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
