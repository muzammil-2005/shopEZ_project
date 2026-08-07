const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }

  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
    res.status(400);
    throw new Error('Please provide complete shipping address details');
  }

  // Validate stock and compute item totals securely on backend
  let itemsPrice = 0;
  const verifiedOrderItems = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product ${item.name || item.product} not found`);
    }

    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for product "${product.name}". Available stock: ${product.stock}`);
    }

    itemsPrice += product.price * item.quantity;
    verifiedOrderItems.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: item.quantity,
    });
  }

  const shippingPrice = itemsPrice > 500 ? 0 : 50; // Free shipping over 500
  const totalPrice = itemsPrice + shippingPrice;

  const order = new Order({
    user: req.user._id,
    orderItems: verifiedOrderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'Cash on Delivery',
    itemsPrice,
    shippingPrice,
    totalPrice,
    orderStatus: 'Pending',
    paymentStatus: paymentMethod === 'Demo Online Payment' ? 'Paid' : 'Pending',
  });

  const createdOrder = await order.save();

  // Deduct product stock
  for (const item of verifiedOrderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  // Clear user's cart after order is successfully placed
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $set: { items: [], totalPrice: 0 } }
  );

  res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email phone');

  if (order) {
    // Make sure logged in user owns order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
};
