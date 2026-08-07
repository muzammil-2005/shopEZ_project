import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/stats');
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Loading admin dashboard analytics..." />;

  // Chart data setup
  const monthlyLabels = stats?.monthlyRevenue ? Object.keys(stats.monthlyRevenue) : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const monthlyData = stats?.monthlyRevenue ? Object.values(stats.monthlyRevenue) : [120000, 190000, 300000, 500000, 240000, 420000];

  const salesLineChart = {
    labels: monthlyLabels.length > 0 ? monthlyLabels : ['Recent Month'],
    datasets: [
      {
        label: 'Monthly Revenue (₹)',
        data: monthlyData.length > 0 ? monthlyData : [stats?.totalRevenue || 0],
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const categoryLabels = stats?.categoryStats ? stats.categoryStats.map((c) => c._id) : ['Electronics', 'Fashion', 'Home'];
  const categoryCounts = stats?.categoryStats ? stats.categoryStats.map((c) => c.count) : [5, 4, 6];

  const categoryDoughnutChart = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryCounts,
        backgroundColor: ['#4f46e5', '#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#6b7280'],
      },
    ],
  };

  const orderStatusLabels = stats?.orderStatusStats ? stats.orderStatusStats.map((s) => s._id) : ['Pending', 'Processing', 'Delivered'];
  const orderStatusCounts = stats?.orderStatusStats ? stats.orderStatusStats.map((s) => s.count) : [2, 3, 5];

  const orderStatusBarChart = {
    labels: orderStatusLabels,
    datasets: [
      {
        label: 'Orders Count',
        data: orderStatusCounts,
        backgroundColor: '#06b6d4',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex align-items-center justify-content-between mb-4 px-lg-3">
        <div>
          <h2 className="fw-bold m-0">Admin Dashboard</h2>
          <p className="text-muted small m-0">Overview performance, sales charts, and platform statistics</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/products/new" className="btn btn-primary-custom rounded-pill btn-sm px-3 fw-bold">
            <i className="bi bi-plus-lg me-1"></i> Add Product
          </Link>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="row g-4 px-lg-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white card-hover-effect">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">Total Revenue</span>
                <h3 className="fw-extrabold text-success mt-1 mb-0">₹{stats?.totalRevenue ? stats.totalRevenue.toLocaleString('en-IN') : '0'}</h3>
              </div>
              <div className="bg-success bg-opacity-10 text-success rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                <i className="bi bi-currency-rupee fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white card-hover-effect">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">Total Orders</span>
                <h3 className="fw-extrabold text-primary mt-1 mb-0">{stats?.totalOrders || 0}</h3>
              </div>
              <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                <i className="bi bi-cart-check fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white card-hover-effect">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">Total Products</span>
                <h3 className="fw-extrabold text-info mt-1 mb-0">{stats?.totalProducts || 0}</h3>
              </div>
              <div className="bg-info bg-opacity-10 text-info rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                <i className="bi bi-box-seam fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white card-hover-effect">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">Total Users</span>
                <h3 className="fw-extrabold text-warning mt-1 mb-0">{stats?.totalUsers || 0}</h3>
              </div>
              <div className="bg-warning bg-opacity-10 text-warning rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                <i className="bi bi-people fs-3"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="row g-4 px-lg-3 mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold mb-3">Sales Overview & Monthly Revenue (₹)</h5>
            <div style={{ minHeight: '280px' }}>
              <Line data={salesLineChart} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold mb-3">Products by Category</h5>
            <div style={{ minHeight: '280px' }}>
              <Doughnut data={categoryDoughnutChart} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 px-lg-3">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold mb-3">Order Status Distribution</h5>
            <div style={{ minHeight: '240px' }}>
              <Bar data={orderStatusBarChart} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold m-0">Recent Orders</h5>
              <Link to="/admin/orders" className="btn btn-sm btn-link text-decoration-none fw-bold">
                View All
              </Link>
            </div>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr className="small text-muted text-uppercase">
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.recentOrders || []).map((ord) => (
                    <tr key={ord._id}>
                      <td>
                        <span className="fw-bold text-dark small d-block">{ord.user?.name || 'Customer'}</span>
                        <span className="text-muted small">{new Date(ord.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="fw-bold text-primary">₹{ord.totalPrice ? ord.totalPrice.toLocaleString('en-IN') : 0}</td>
                      <td>
                        <span className="badge bg-warning text-dark rounded-pill">{ord.orderStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
