import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/products?pageSize=100');
      setProducts(data.products || []);
      setLoading(false);
    } catch (error) {
      console.error('Fetch products error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await API.delete(`/products/${deleteId}`);
      showToast('Product deleted successfully', 'success');
      setDeleteId(null);
      fetchProducts();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete product', 'danger');
      setDeleteId(null);
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
            <h3 className="fw-bold mb-1">Manage Products</h3>
            <p className="text-muted small mb-0">Add, update, or remove inventory items</p>
          </div>
          <Link to="/admin/products/edit/new" className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm">
            <i className="bi bi-plus-lg me-1"></i> Add Product
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">Product</th>
                    <th scope="col">Category</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Price</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Rating</th>
                    <th scope="col" className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod._id}>
                      <td className="ps-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={prod.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'}
                            alt={prod.name}
                            className="rounded-3"
                            style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';
                            }}
                          />
                          <span className="fw-bold text-dark">{prod.name}</span>
                        </div>
                      </td>
                      <td><span className="badge bg-secondary-subtle text-secondary">{prod.category}</span></td>
                      <td className="text-muted small">{prod.brand}</td>
                      <td className="fw-bold">${prod.price?.toFixed(2)}</td>
                      <td>
                        <span className={`badge ${prod.stock > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                          {prod.stock} in stock
                        </span>
                      </td>
                      <td>
                        <span className="text-warning fw-semibold">
                          ★ {prod.rating?.toFixed(1)} <small className="text-muted">({prod.numReviews})</small>
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2">
                          <Link
                            to={`/admin/products/edit/${prod._id}`}
                            className="btn btn-sm btn-outline-primary rounded-circle"
                            title="Edit product"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-circle"
                            onClick={() => setDeleteId(prod._id)}
                            title="Delete product"
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

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 border-0 shadow">
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold text-danger">Confirm Deletion</h5>
                  <button type="button" className="btn-close" onClick={() => setDeleteId(null)}></button>
                </div>
                <div className="modal-body text-secondary">
                  Are you sure you want to permanently delete this product? This action cannot be undone.
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light rounded-pill" onClick={() => setDeleteId(null)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-danger rounded-pill px-4" onClick={handleDeleteConfirm}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
