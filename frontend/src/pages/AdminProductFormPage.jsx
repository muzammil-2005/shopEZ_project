import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

const AdminProductFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [brand, setBrand] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('');

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const { data } = await API.get(`/products/${id}`);
          setName(data.name || '');
          setDescription(data.description || '');
          setPrice(data.price || '');
          setOriginalPrice(data.originalPrice || '');
          setDiscount(data.discount || '');
          setCategory(data.category || 'Electronics');
          setBrand(data.brand || '');
          setImage(data.image || '');
          setStock(data.stock || '');
          setLoading(false);
        } catch (err) {
          setError('Could not fetch product details.');
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      name,
      description,
      price: Number(price),
      originalPrice: Number(originalPrice || price),
      discount: Number(discount || 0),
      category,
      brand,
      image,
      stock: Number(stock),
    };

    try {
      if (isEdit) {
        await API.put(`/products/${id}`, payload);
      } else {
        await API.post('/products', payload);
      }
      setSubmitting(false);
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product.');
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading product data..." />;

  return (
    <div className="container py-4 max-w-2xl" style={{ maxWidth: '780px' }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold m-0">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
        <Link to="/admin/products" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
          <i className="bi bi-arrow-left me-1"></i> Cancel
        </Link>
      </div>

      {error && <AlertMessage variant="danger">{error}</AlertMessage>}

      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small fw-semibold text-muted">Product Name</label>
              <input
                type="text"
                className="form-control rounded-3"
                placeholder="e.g. Wireless Headphones"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Category</label>
              <select
                className="form-select rounded-3"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Beauty">Beauty</option>
                <option value="Sports">Sports</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Brand</label>
              <input
                type="text"
                className="form-control rounded-3"
                placeholder="e.g. AudioTech"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Price (₹)</label>
              <input
                type="number"
                step="0.01"
                className="form-control rounded-3"
                placeholder="199.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Original Price (₹)</label>
              <input
                type="number"
                step="0.01"
                className="form-control rounded-3"
                placeholder="249.99"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Discount (%)</label>
              <input
                type="number"
                className="form-control rounded-3"
                placeholder="20"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Stock Quantity</label>
              <input
                type="number"
                className="form-control rounded-3"
                placeholder="25"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Image URL</label>
              <input
                type="url"
                className="form-control rounded-3"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label small fw-semibold text-muted">Description</label>
              <textarea
                rows="4"
                className="form-control rounded-3"
                placeholder="Enter detailed product description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
          </div>

          <div className="mt-4 text-end">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary-custom rounded-pill px-5 fw-bold"
            >
              {submitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductFormPage;
