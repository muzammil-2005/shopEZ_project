import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { AuthContext } from '../context/AuthContext';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const { user: currentUser } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
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
      setMessage({ type: 'success', text: `User role updated to ${newRole}` });
      fetchUsers();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to update user role.' });
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        await API.delete(`/admin/users/${userId}`);
        setMessage({ type: 'success', text: `User "${userName}" deleted successfully.` });
        fetchUsers();
      } catch (err) {
        setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to delete user.' });
      }
    }
  };

  if (loading) return <LoadingSpinner message="Fetching user accounts..." />;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-1">Manage Users</h2>
      <p className="text-muted small mb-4">View user profiles, assign admin privileges, or delete accounts ({users.length} registered users)</p>

      {message && <AlertMessage variant={message.type}>{message.text}</AlertMessage>}

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white p-3 p-md-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle border-0">
            <thead className="table-light">
              <tr className="small text-muted text-uppercase">
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Registered Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="fw-bold text-dark">{u.name}</td>
                  <td className="small">{u.email}</td>
                  <td className="small text-muted">{u.phone || 'N/A'}</td>
                  <td>
                    <span className={`badge ${u.role === 'ADMIN' ? 'bg-primary' : 'bg-secondary'} rounded-pill`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="small text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="text-end">
                    {u._id !== currentUser?._id && (
                      <div className="d-flex gap-2 justify-content-end">
                        <button
                          onClick={() => handleRoleToggle(u._id, u.role)}
                          className="btn btn-sm btn-outline-primary rounded-pill px-3"
                        >
                          Make {u.role === 'ADMIN' ? 'User' : 'Admin'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        >
                          Delete
                        </button>
                      </div>
                    )}
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

export default AdminUsersPage;
