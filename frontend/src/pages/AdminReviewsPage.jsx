import React, { useEffect, useState } from 'react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import Rating from '../components/Rating';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchReviews = async () => {
    try {
      const { data } = await API.get('/admin/reviews');
      setReviews(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer review?')) {
      try {
        await API.delete(`/reviews/${id}`);
        setMessage({ type: 'success', text: 'Review removed successfully.' });
        fetchReviews();
      } catch (err) {
        setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to delete review.' });
      }
    }
  };

  if (loading) return <LoadingSpinner message="Fetching customer reviews..." />;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-1">Moderated Reviews</h2>
      <p className="text-muted small mb-4">View and delete inappropriate customer reviews across all products ({reviews.length} total reviews)</p>

      {message && <AlertMessage variant={message.type}>{message.text}</AlertMessage>}

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white p-3 p-md-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle border-0">
            <thead className="table-light">
              <tr className="small text-muted text-uppercase">
                <th>Product</th>
                <th>User</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {r.product?.image && (
                        <img src={r.product.image} alt={r.product.name} className="rounded border" style={{ width: '36px', height: '36px', objectFit: 'cover' }} />
                      )}
                      <span className="fw-bold text-dark small">{r.product?.name || 'Deleted Product'}</span>
                    </div>
                  </td>
                  <td>
                    <span className="fw-semibold text-dark small d-block">{r.user?.name || 'Anonymous'}</span>
                    <span className="text-muted small">{r.user?.email}</span>
                  </td>
                  <td><Rating value={r.rating} /></td>
                  <td className="small text-secondary" style={{ maxWidth: '300px' }}>{r.comment}</td>
                  <td className="small text-muted">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="text-end">
                    <button
                      onClick={() => handleDeleteReview(r._id)}
                      className="btn btn-sm btn-outline-danger rounded-pill px-3"
                    >
                      <i className="bi bi-trash me-1"></i> Delete
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

export default AdminReviewsPage;
