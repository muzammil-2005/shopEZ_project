import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import AlertMessage from '../components/AlertMessage';

const ProfilePage = () => {
  const { user, updateProfile } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [pincode, setPincode] = useState(user?.address?.pincode || '');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [profileMsg, setProfileMsg] = useState(null);
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProfileMsg(null);

    const res = await updateProfile({
      name,
      phone,
      address: {
        street,
        city,
        state,
        pincode,
      },
    });

    setLoading(false);
    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } else {
      setProfileMsg({ type: 'danger', text: res.message || 'Profile update failed.' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    setLoading(true);
    setPasswordMsg(null);

    try {
      await API.put('/users/password', { currentPassword, newPassword });
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordMsg({
        type: 'danger',
        text: err.response?.data?.message || 'Password update failed.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-4">User Profile</h2>

      <div className="row g-4">
        {/* Personal Details & Shipping Address */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-person-circle text-primary"></i> Personal Details & Address
            </h5>

            {profileMsg && <AlertMessage variant={profileMsg.type}>{profileMsg.text}</AlertMessage>}

            <form onSubmit={handleProfileSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Full Name</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Email Address (Read-Only)</label>
                  <input
                    type="email"
                    className="form-control rounded-3 bg-light"
                    value={email}
                    disabled
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Phone Number</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Account Role</label>
                  <input
                    type="text"
                    className="form-control rounded-3 bg-light fw-bold text-primary"
                    value={user?.role || 'USER'}
                    disabled
                  />
                </div>

                <div className="col-12 mt-4">
                  <h6 className="fw-bold text-muted small text-uppercase">Default Shipping Address</h6>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-muted">Street Address</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">City</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">State</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">Pincode</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4">
                <button type="submit" disabled={loading} className="btn btn-primary-custom rounded-pill px-4 fw-bold">
                  {loading ? 'Saving Changes...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-shield-lock text-primary"></i> Change Password
            </h5>

            {passwordMsg && <AlertMessage variant={passwordMsg.type}>{passwordMsg.text}</AlertMessage>}

            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Current Password</label>
                <input
                  type="password"
                  className="form-control rounded-3"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted">New Password (min 6 chars)</label>
                <input
                  type="password"
                  className="form-control rounded-3"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-outline-primary rounded-pill w-100 fw-bold">
                {loading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
