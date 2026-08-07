const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }

  res.json(wishlist);
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = new Wishlist({
      user: req.user._id,
      products: [productId],
    });
  } else {
    const exists = wishlist.products.some(
      (p) => p.toString() === productId
    );
    if (!exists) {
      wishlist.products.push(productId);
    }
  }

  await wishlist.save();
  const populatedWishlist = await Wishlist.findById(wishlist._id).populate('products');
  res.status(200).json(populatedWishlist);
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (wishlist) {
    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== productId
    );
    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate('products');
    return res.json(populatedWishlist);
  }

  res.status(404);
  throw new Error('Wishlist not found');
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
