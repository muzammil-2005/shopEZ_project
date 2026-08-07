import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products?limit=100');
      setProducts(data.products || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      try {
        await API.delete(`/products/${id}`);
        setMessage({ type: 'success', text: `Product "${name}" deleted successfully.` });
        fetchProducts();
      } catch (err) {
        setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to delete product.' });
      }
    }
  };

  if (loading) return <LoadingSpinner message="Fetching products for admin..." />;

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold m-0">Manage Products</h2>
          <p className="text-muted small m-0">Add, edit, or remove store products ({products.length} total)</p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary-custom rounded-pill btn-sm px-4 fw-bold">
          <i className="bi bi-plus-lg me-1"></i> Add New Product
        </Link>
      </div>

      {message && <AlertMessage variant={message.type}>{message.text}</AlertMessage>}

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white p-3 p-md-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle border-0">
            <thead className="table-light">
              <tr className="small text-muted text-uppercase">
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="rounded border"
                      style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }}
                    />
                  </td>
                  <td className="fw-bold text-dark">{p.name}</td>
                  <td><span className="badge bg-light text-dark border">{p.category}</span></td>
                  <td className="fw-bold text-primary">${p.price.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${p.stock > 0 ? 'bg-success' : 'bg-danger'} rounded-pill`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td>⭐ {p.rating.toFixed(1)}</td>
                  <td className="text-end">
                    <div className="d-flex gap-2 justify-content-end">
                      <Link to={`/admin/products/edit/${p._id}`} className="btn btn-sm btn-outline-primary rounded-pill px-3">
                        <i className="bi bi-pencil me-1"></i> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                      >
                        <i className="bi bi-trash me-1"></i> Delete
                      </button>
                    </div>
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

export default AdminProductsPage;
