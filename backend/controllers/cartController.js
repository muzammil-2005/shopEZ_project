const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to recalculate cart total
const calculateCartTotal = (items) => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

// @desc    Get logged in user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name image price stock originalPrice discount category brand',
  });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [], totalPrice: 0 });
  }

  res.json(cart);
});

// @desc    Add item to cart or update quantity
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const qty = Number(quantity) || 1;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.stock < qty) {
    res.status(400);
    throw new Error(`Only ${product.stock} items available in stock`);
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({
      user: req.user._id,
      items: [{ product: productId, quantity: qty, price: product.price }],
      totalPrice: product.price * qty,
    });
  } else {
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].quantity + qty;
      if (product.stock < newQty) {
        res.status(400);
        throw new Error(`Cannot add more. Stock limit of ${product.stock} reached.`);
      }
      cart.items[itemIndex].quantity = newQty;
      cart.items[itemIndex].price = product.price;
    } else {
      cart.items.push({
        product: productId,
        quantity: qty,
        price: product.price,
      });
    }

    cart.totalPrice = calculateCartTotal(cart.items);
  }

  await cart.save();
  const populatedCart = await Cart.findById(cart._id).populate({
    path: 'items.product',
    select: 'name image price stock originalPrice discount category brand',
  });

  res.status(200).json(populatedCart);
});

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const qty = Number(quantity);

  if (qty <= 0) {
    res.status(400);
    throw new Error('Quantity must be at least 1. Use DELETE to remove item.');
  }

  const product = await Product.findById(productId);
  if (product && product.stock < qty) {
    res.status(400);
    throw new Error(`Only ${product.stock} items available in stock`);
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = qty;
      cart.totalPrice = calculateCartTotal(cart.items);
      await cart.save();

      const populatedCart = await Cart.findById(cart._id).populate({
        path: 'items.product',
        select: 'name image price stock originalPrice discount category brand',
      });
      return res.json(populatedCart);
    }
  }

  res.status(404);
  throw new Error('Item not found in cart');
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  let cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    cart.totalPrice = calculateCartTotal(cart.items);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name image price stock originalPrice discount category brand',
    });
    return res.json(populatedCart);
  }

  res.status(404);
  throw new Error('Cart not found');
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
  }

  res.json({ message: 'Cart cleared', items: [], totalPrice: 0 });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
};
