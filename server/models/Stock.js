const mongoose = require('mongoose');

const historicalPointSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: [true, 'Stock symbol is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    currentPrice: {
      type: Number,
      required: [true, 'Current price is required'],
      min: 0,
    },
    dailyHigh: {
      type: Number,
      required: true,
      min: 0,
    },
    dailyLow: {
      type: Number,
      required: true,
      min: 0,
    },
    marketCap: {
      type: String,
      required: true,
    },
    historicalData: [historicalPointSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Stock', stockSchema);
