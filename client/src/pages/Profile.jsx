import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { name };
      if (password) payload.password = password;

      await updateProfile(payload);
      addToast('Profile updated successfully', 'success');
      setPassword('');
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-4" style={{ maxWidth: '700px' }}>
      <div className="glass-card p-4">
        <h3 className="fw-bold text-white mb-1"><i className="bi bi-person-badge text-info me-2"></i>Account Profile</h3>
        <p className="text-muted">Manage your credentials, security settings, and role permissions</p>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label className="form-label text-muted fs-7 fw-semibold">Email Address (Read-only)</label>
            <input
              type="email"
              className="form-control form-control-glass text-muted"
              value={user?.email || ''}
              disabled
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-muted fs-7 fw-semibold">Role Level</label>
            <div>
              <span className="badge bg-primary fs-6 px-3 py-2">{user?.role}</span>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-muted fs-7 fw-semibold">Full Name</label>
            <input
              type="text"
              className="form-control form-control-glass"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-muted fs-7 fw-semibold">New Password (Leave blank to keep current)</label>
            <input
              type="password"
              className="form-control form-control-glass"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="6"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary-gradient py-2.5 px-4"
            disabled={submitting}
          >
            {submitting ? 'Saving Changes...' : 'Update Account Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};
