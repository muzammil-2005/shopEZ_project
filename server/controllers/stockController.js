const Stock = require('../models/Stock');

// @desc    Get all stocks with search & pagination
// @route   GET /api/stocks
// @access  Public
const getAllStocks = async (req, res) => {
  try {
    const { search, sort } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { symbol: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } },
        ],
      };
    }

    let sortOptions = { symbol: 1 };
    if (sort === 'price_asc') sortOptions = { currentPrice: 1 };
    if (sort === 'price_desc') sortOptions = { currentPrice: -1 };
    if (sort === 'marketCap_desc') sortOptions = { marketCap: -1 };

    const stocks = await Stock.find(query).sort(sortOptions);
    res.json({ success: true, count: stocks.length, data: stocks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get stock details by Symbol or ID
// @route   GET /api/stocks/:symbolOrId
// @access  Public
const getStockBySymbol = async (req, res) => {
  try {
    const param = req.params.symbolOrId;
    let stock;

    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      stock = await Stock.findById(param);
    } else {
      stock = await Stock.findOne({ symbol: param.toUpperCase() });
    }

    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }

    res.json({ success: true, data: stock });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new stock (Admin only)
// @route   POST /api/stocks
// @access  Private/Admin
const createStock = async (req, res) => {
  try {
    const { symbol, companyName, currentPrice, dailyHigh, dailyLow, marketCap, historicalData } = req.body;

    if (!symbol || !companyName || currentPrice === undefined) {
      return res.status(400).json({ success: false, message: 'Symbol, Company Name, and Current Price are required' });
    }

    const exists = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Stock symbol already exists' });
    }

    // Default 7-day historical prices if not provided
    const defaultHistory = historicalData || [
      { date: 'Day 1', price: currentPrice * 0.95 },
      { date: 'Day 2', price: currentPrice * 0.97 },
      { date: 'Day 3', price: currentPrice * 0.96 },
      { date: 'Day 4', price: currentPrice * 0.99 },
      { date: 'Day 5', price: currentPrice * 1.01 },
      { date: 'Day 6', price: currentPrice * 1.02 },
      { date: 'Today', price: currentPrice },
    ];

    const stock = await Stock.create({
      symbol: symbol.toUpperCase(),
      companyName,
      currentPrice: Number(currentPrice),
      dailyHigh: Number(dailyHigh || currentPrice * 1.05),
      dailyLow: Number(dailyLow || currentPrice * 0.94),
      marketCap: marketCap || '$10B',
      historicalData: defaultHistory,
    });

    res.status(201).json({ success: true, data: stock });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update stock details (Admin only)
// @route   PUT /api/stocks/:id
// @access  Private/Admin
const updateStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }

    const { companyName, currentPrice, dailyHigh, dailyLow, marketCap } = req.body;

    if (companyName) stock.companyName = companyName;
    if (currentPrice !== undefined) {
      stock.currentPrice = Number(currentPrice);
      // Append new price to historicalData
      stock.historicalData.push({
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: Number(currentPrice),
      });
      if (stock.historicalData.length > 10) stock.historicalData.shift();
    }
    if (dailyHigh !== undefined) stock.dailyHigh = Number(dailyHigh);
    if (dailyLow !== undefined) stock.dailyLow = Number(dailyLow);
    if (marketCap) stock.marketCap = marketCap;

    const updatedStock = await stock.save();
    res.json({ success: true, data: updatedStock });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete stock (Admin only)
// @route   DELETE /api/stocks/:id
// @access  Private/Admin
const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }

    await Stock.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Stock deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllStocks,
  getStockBySymbol,
  createStock,
  updateStock,
  deleteStock,
};
