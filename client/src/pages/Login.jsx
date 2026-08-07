import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please fill in all fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      addToast('Welcome back to ShopEZ Trading Platform!', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const fillQuickDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
      <div className="glass-card p-4 p-sm-5" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="bg-primary text-white d-inline-flex rounded-3 p-3 fs-3 mb-2">
            <i className="bi bi-graph-up-arrow"></i>
          </div>
          <h2 className="fw-bold text-white mb-1">Sign In to ShopEZ</h2>
          <p className="text-muted fs-7">Access real-time stock trading & portfolio tracking</p>
        </div>

        {/* Demo Credentials Quick Switcher */}
        <div className="alert bg-dark border-secondary p-3 mb-4 rounded-3 text-start">
          <div className="text-info fw-bold fs-7 mb-1"><i className="bi bi-key-fill me-1"></i> Quick Demo Login:</div>
          <div className="d-flex gap-2 mt-2">
            <button
              type="button"
              className="btn btn-outline-info btn-sm flex-fill rounded-2"
              onClick={() => fillQuickDemo('user@shopez.com', 'User@123')}
            >
              Demo User
            </button>
            <button
              type="button"
              className="btn btn-outline-warning btn-sm flex-fill rounded-2"
              onClick={() => fillQuickDemo('admin@shopez.com', 'Admin@123')}
            >
              Demo Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label text-muted fs-7 fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control form-control-glass"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 text-start">
            <label className="form-label text-muted fs-7 fw-semibold">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control form-control-glass border-end-0"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-dark border-start-0 border-secondary text-muted"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi bi-${showPassword ? 'eye-slash' : 'eye'}`}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary-gradient w-100 py-2.5 fs-6 mb-3"
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-muted fs-7">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan text-decoration-none fw-semibold">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};
