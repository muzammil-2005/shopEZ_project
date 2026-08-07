import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/reviews');
      setReviews(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Fetch admin reviews error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this customer review?')) return;
    try {
      await API.delete(`/reviews/${reviewId}`);
      showToast('Review removed successfully', 'success');
      fetchReviews();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete review', 'danger');
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
            <h3 className="fw-bold mb-1">Customer Reviews Moderation</h3>
            <p className="text-muted small mb-0">Inspect user product ratings and clean inappropriate content</p>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : reviews.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <h5 className="fw-bold text-muted">No Customer Reviews Yet</h5>
          </div>
        ) : (
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">Product</th>
                    <th scope="col">Reviewer</th>
                    <th scope="col">Rating</th>
                    <th scope="col">Comment</th>
                    <th scope="col">Date</th>
                    <th scope="col" className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((rev) => (
                    <tr key={rev._id}>
                      <td className="ps-4 py-3">
                        <span className="fw-bold text-dark d-block" style={{ maxWidth: '180px' }}>
                          {rev.product?.name || 'Product'}
                        </span>
                      </td>
                      <td>
                        <span className="fw-semibold d-block">{rev.user?.name || 'Customer'}</span>
                        <small className="text-muted">{rev.user?.email}</small>
                      </td>
                      <td>
                        <span className="text-warning fw-bold">★ {rev.rating}</span>
                      </td>
                      <td style={{ maxWidth: '300px' }}>
                        <p className="text-secondary small mb-0 text-truncate">{rev.comment}</p>
                      </td>
                      <td className="text-muted small">{new Date(rev.createdAt).toLocaleDateString()}</td>
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-sm btn-outline-danger rounded-circle"
                          onClick={() => handleDeleteReview(rev._id)}
                          title="Delete Review"
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
        )}
      </div>
    </div>
  );
};

export default AdminReviewsPage;
