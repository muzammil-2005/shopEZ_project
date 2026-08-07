import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AlertMessage from '../components/AlertMessage';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      if (res.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  };

  const handleDemoUserFill = () => {
    setEmail('user@shopez.com');
    setPassword('user123');
  };

  const handleDemoAdminFill = () => {
    setEmail('admin@shopez.com');
    setPassword('admin123');
  };

  return (
    <div className="container my-5 max-w-md" style={{ maxWidth: '460px' }}>
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white p-4 p-md-5">
        <div className="text-center mb-4">
          <div className="bg-primary text-white rounded-3 p-2 d-inline-flex mb-2">
            <i className="bi bi-bag-heart-fill fs-3"></i>
          </div>
          <h3 className="fw-extrabold text-dark">Welcome Back</h3>
          <p className="text-muted small">Sign in to continue your shopping on ShopEZ</p>
        </div>

        {error && <AlertMessage variant="danger">{error}</AlertMessage>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 rounded-start-3"><i className="bi bi-envelope"></i></span>
              <input
                type="email"
                className="form-control border-start-0 rounded-end-3"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-muted">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 rounded-start-3"><i className="bi bi-lock"></i></span>
              <input
                type="password"
                className="form-control border-start-0 rounded-end-3"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary-custom btn-lg w-100 rounded-3 fw-bold mb-3">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Accounts Helper */}
        <div className="bg-light p-3 rounded-3 border text-center my-3">
          <span className="small fw-bold text-muted d-block mb-2">⚡ Quick Fill Demo Credentials</span>
          <div className="d-flex gap-2 justify-content-center">
            <button onClick={handleDemoUserFill} className="btn btn-outline-secondary btn-sm rounded-pill fw-semibold">
              Demo User
            </button>
            <button onClick={handleDemoAdminFill} className="btn btn-outline-primary btn-sm rounded-pill fw-semibold">
              Demo Admin
            </button>
          </div>
        </div>

        <div className="text-center mt-3 small text-muted">
          Don't have an account?{' '}
          <Link to="/register" className="fw-bold text-primary text-decoration-none">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
