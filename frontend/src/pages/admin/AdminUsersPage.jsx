import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/users');
      setUsers(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Fetch users error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await API.put(`/admin/users/${userId}`, { role: newRole });
      showToast(`User role updated to ${newRole}`, 'success');
      fetchUsers();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update user role', 'danger');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      showToast('User removed successfully', 'success');
      fetchUsers();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete user', 'danger');
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      <AdminSidebar />

      <div className="flex-grow-1 p-4 bg-light">
        {/* Toast Notification */}
        {notification && (
          <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
            <div className={`toast show align-items-center text-white bg-${notification.type} border-0 shadow-lg`}>
              <div className="d-flex">
                <div className="toast-body fw-semibold">
                  <i className="bi bi-info-circle-fill me-2"></i>
                  {notification.message}
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white me-2 m-auto"
                  onClick={() => setNotification(null)}
                ></button>
              </div>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">User Accounts Management</h3>
            <p className="text-muted small mb-0">View registered accounts and adjust permission roles</p>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">User</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Registered</th>
                    <th scope="col">Role</th>
                    <th scope="col" className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((usr) => (
                    <tr key={usr._id}>
                      <td className="ps-4 py-3">
                        <span className="fw-bold text-dark d-block">{usr.name}</span>
                        <small className="text-muted">{usr.email}</small>
                      </td>
                      <td className="text-muted small">{usr.phone || 'N/A'}</td>
                      <td className="text-muted small">{new Date(usr.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${usr.role === 'ADMIN' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            className="btn btn-sm btn-outline-warning rounded-pill"
                            onClick={() => handleRoleToggle(usr._id, usr.role)}
                          >
                            Toggle Role
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-circle"
                            onClick={() => handleDeleteUser(usr._id)}
                            title="Delete User"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
