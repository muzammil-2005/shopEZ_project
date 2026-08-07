import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      addToast('Please complete all required fields', 'error');
      return;
    }

    if (password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password, role);
      addToast('Account created successfully! Welcome to ShopEZ.', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
      <div className="glass-card p-4 p-sm-5" style={{ maxWidth: '460px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="bg-success text-white d-inline-flex rounded-3 p-3 fs-3 mb-2">
            <i className="bi bi-person-plus-fill"></i>
          </div>
          <h2 className="fw-bold text-white mb-1">Create Account</h2>
          <p className="text-muted fs-7">Get $50,000 virtual cash to start trading instantly</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label text-muted fs-7 fw-semibold">Full Name</label>
            <input
              type="text"
              className="form-control form-control-glass"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label text-muted fs-7 fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control form-control-glass"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label text-muted fs-7 fw-semibold">Password</label>
            <input
              type="password"
              className="form-control form-control-glass"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 text-start">
            <label className="form-label text-muted fs-7 fw-semibold">Account Type</label>
            <select
              className="form-select form-control-glass"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="USER">Standard Trader Account</option>
              <option value="ADMIN">Administrator Account</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary-gradient w-100 py-2.5 fs-6 mb-3"
            disabled={submitting}
          >
            {submitting ? 'Creating Account...' : 'Register & Claim $50,000'}
          </button>
        </form>

        <div className="text-center text-muted fs-7">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan text-decoration-none fw-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
