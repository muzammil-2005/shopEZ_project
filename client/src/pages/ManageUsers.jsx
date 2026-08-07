import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      if (res.success) setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (id, currentRole, name) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!window.confirm(`Change ${name}'s role from ${currentRole} to ${newRole}?`)) return;

    try {
      const res = await API.put(`/users/${id}/role`, { role: newRole });
      if (res.success) {
        addToast(res.message, 'success');
        fetchUsers();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update role', 'error');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user account "${name}"?`)) return;

    try {
      const res = await API.delete(`/users/${id}`);
      if (res.success) {
        addToast(res.message, 'info');
        fetchUsers();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete user', 'error');
    }
  };

  if (loading) return <LoadingSpinner label="Loading user directory..." />;

  return (
    <div className="d-flex flex-column gap-4">
      <div className="glass-card p-4">
        <h2 className="fw-bold text-white mb-1"><i className="bi bi-people-fill text-info me-2"></i>User Access Management</h2>
        <p className="text-muted mb-0">Audit user accounts, assign administrative roles, or revoke access</p>
      </div>

      <div className="glass-card p-4">
        <div className="table-responsive">
          <table className="table table-custom align-middle">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email Address</th>
                <th>Role Badge</th>
                <th>Registered Date</th>
                <th>Role Controls</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="fw-bold text-white">{u.name}</td>
                  <td className="text-muted">{u.email}</td>
                  <td>
                    <span className={`badge bg-${u.role === 'ADMIN' ? 'danger' : 'primary'} px-3 py-1.5 fw-bold`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="fs-7 text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-outline-warning btn-sm rounded-pill px-3"
                      onClick={() => handleRoleToggle(u._id, u.role, u.name)}
                    >
                      Set as {u.role === 'ADMIN' ? 'USER' : 'ADMIN'}
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm rounded-circle p-1.5"
                      onClick={() => handleDeleteUser(u._id, u.name)}
                      title="Delete User"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
