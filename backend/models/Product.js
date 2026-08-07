const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      default: 0.0,
    },
    originalPrice: {
      type: Number,
      default: 0.0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
    },
    brand: {
      type: String,
      required: [true, 'Please specify a brand'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    stock: {
      type: Number,
      required: [true, 'Please specify stock quantity'],
      default: 0,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
