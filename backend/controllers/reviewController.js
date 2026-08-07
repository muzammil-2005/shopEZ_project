const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.id })
    .populate('user', 'name')
    .sort({ createdAt: -1 });

  res.json(reviews);
});

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = await Review.findOne({
    product: req.params.id,
    user: req.user._id,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed by you');
  }

  const review = await Review.create({
    user: req.user._id,
    product: req.params.id,
    rating: Number(rating),
    comment,
  });

  // Recalculate product overall rating and review count
  const reviews = await Review.find({ product: req.params.id });
  product.numReviews = reviews.length;
  product.rating =
    reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await product.save();

  const populatedReview = await Review.findById(review._id).populate('user', 'name');
  res.status(201).json(populatedReview);
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (review) {
    const productId = review.product;
    await Review.deleteOne({ _id: req.params.id });

    // Recalculate product rating
    const product = await Product.findById(productId);
    if (product) {
      const reviews = await Review.find({ product: productId });
      product.numReviews = reviews.length;
      product.rating =
        reviews.length === 0
          ? 0
          : reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
      await product.save();
    }

    res.json({ message: 'Review removed successfully' });
  } else {
    res.status(404);
    throw new Error('Review not found');
  }
});

module.exports = {
  getProductReviews,
  createProductReview,
  deleteReview,
};
