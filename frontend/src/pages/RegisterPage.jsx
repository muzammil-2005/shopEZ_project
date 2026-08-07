import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AlertMessage from '../components/AlertMessage';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const { register, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(name, email, password, phone, {});
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div className="container my-5 max-w-md" style={{ maxWidth: '480px' }}>
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white p-4 p-md-5">
        <div className="text-center mb-4">
          <div className="bg-primary text-white rounded-3 p-2 d-inline-flex mb-2">
            <i className="bi bi-person-plus-fill fs-3"></i>
          </div>
          <h3 className="fw-extrabold text-dark">Create Your Account</h3>
          <p className="text-muted small">Join ShopEZ today for exclusive deals & easy shopping</p>
        </div>

        {error && <AlertMessage variant="danger">{error}</AlertMessage>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Full Name</label>
            <input
              type="text"
              className="form-control rounded-3"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Email Address</label>
            <input
              type="email"
              className="form-control rounded-3"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Phone Number</label>
            <input
              type="text"
              className="form-control rounded-3"
              placeholder="+1 555-0199"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-muted">Password (min 6 characters)</label>
            <input
              type="password"
              className="form-control rounded-3"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary-custom btn-lg w-100 rounded-3 fw-bold mb-3">
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-3 small text-muted">
          Already have an account?{' '}
          <Link to="/login" className="fw-bold text-primary text-decoration-none">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
