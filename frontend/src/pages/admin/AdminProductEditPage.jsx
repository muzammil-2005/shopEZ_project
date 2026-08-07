import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminProductEditPage = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discount, setDiscount] = useState('0');
  const [category, setCategory] = useState('Electronics');
  const [brand, setBrand] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('10');

  const [loading, setLoading] = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isNew) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const { data } = await API.get(`/products/${id}`);
          setName(data.name || '');
          setDescription(data.description || '');
          setPrice(data.price || '');
          setOriginalPrice(data.originalPrice || '');
          setDiscount(data.discount || 0);
          setCategory(data.category || 'Electronics');
          setBrand(data.brand || '');
          setImage(data.image || '');
          setStock(data.stock || 0);
          setLoading(false);
        } catch (error) {
          console.error('Fetch product error:', error);
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isNew]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const payload = {
      name,
      description,
      price: Number(price),
      originalPrice: Number(originalPrice || price),
      discount: Number(discount),
      category,
      brand,
      image: image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      stock: Number(stock),
    };

    try {
      setSubmitting(true);
      if (isNew) {
        await API.post('/products', payload);
      } else {
        await API.put(`/products/${id}`, payload);
      }
      setSubmitting(false);
      navigate('/admin/products');
    } catch (error) {
      setSubmitting(false);
      setErrorMessage(error.response?.data?.message || 'Failed to save product details.');
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      <AdminSidebar />

      <div className="flex-grow-1 p-4 bg-light">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">{isNew ? 'Create New Product' : 'Edit Product'}</h3>
            <p className="text-muted small mb-0">{isNew ? 'Add a new product to ShopEZ catalog' : `Update product #${id}`}</p>
          </div>
          <Link to="/admin/products" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
            <i className="bi bi-arrow-left me-1"></i> Back to Products
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white" style={{ maxWidth: '800px' }}>
            {errorMessage && (
              <div className="alert alert-danger border-0 rounded-3 small mb-4">
                <i className="bi bi-exclamation-triangle-fill me-2"></i> {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-semibold">Product Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Wireless Noise Cancelling Headphones"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Category *</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
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
                  <label className="form-label small fw-semibold">Brand *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Sony, Nike, Apple"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    placeholder="99.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Original Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    placeholder="129.99"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Discount (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="15"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Stock Quantity *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="25"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Description *</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Detailed specs and key selling features..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="mt-4 text-end">
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill px-4 shadow-sm"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : isNew ? 'Create Product' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductEditPage;
