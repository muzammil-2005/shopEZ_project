const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Fetch all products with search, category, brand, price, rating, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;

  const query = {};

  // Search keyword
  if (req.query.keyword) {
    query.name = { $regex: req.query.keyword, $options: 'i' };
  }

  // Category filter
  if (req.query.category && req.query.category !== 'All') {
    query.category = req.query.category;
  }

  // Brand filter
  if (req.query.brand && req.query.brand !== 'All') {
    query.brand = req.query.brand;
  }

  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
  }

  // Minimum rating filter
  if (req.query.rating) {
    query.rating = { $gte: Number(req.query.rating) };
  }

  // Sorting
  let sort = {};
  if (req.query.sortBy === 'price-asc') sort = { price: 1 };
  else if (req.query.sortBy === 'price-desc') sort = { price: -1 };
  else if (req.query.sortBy === 'rating') sort = { rating: -1 };
  else if (req.query.sortBy === 'newest') sort = { createdAt: -1 };
  else sort = { createdAt: -1 };

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // Get distinct categories & brands for filters
  const categories = await Product.distinct('category');
  const brands = await Product.distinct('brand');

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    totalProducts: count,
    categories,
    brands,
  });
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, originalPrice, discount, category, brand, image, stock } = req.body;

  if (!name || !price || !category || !brand || !image) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  const calcOriginalPrice = originalPrice || price;
  const calcDiscount = discount || (calcOriginalPrice > price ? Math.round(((calcOriginalPrice - price) / calcOriginalPrice) * 100) : 0);

  const product = new Product({
    name,
    description: description || '',
    price: Number(price),
    originalPrice: Number(calcOriginalPrice),
    discount: Number(calcDiscount),
    category,
    brand,
    image,
    stock: Number(stock) || 0,
    rating: 0,
    numReviews: 0,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, originalPrice, discount, category, brand, image, stock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.description = description !== undefined ? description : product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.originalPrice = originalPrice !== undefined ? Number(originalPrice) : product.originalPrice;
    product.discount = discount !== undefined ? Number(discount) : product.discount;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.image = image || product.image;
    product.stock = stock !== undefined ? Number(stock) : product.stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
