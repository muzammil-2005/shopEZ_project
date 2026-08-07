const Portfolio = require('../models/Portfolio');
const { recalculatePortfolioMetrics } = require('../services/tradeService');

// @desc    Get current user portfolio
// @route   GET /api/portfolio
// @access  Private
const getMyPortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ user: req.user._id }).populate('holdings.stock');
    
    if (!portfolio) {
      portfolio = await Portfolio.create({
        user: req.user._id,
        availableBalance: 50000,
        holdings: [],
      });
    }

    portfolio = await recalculatePortfolioMetrics(portfolio);

    res.json({ success: true, data: portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Deposit / Add cash funds to available balance
// @route   POST /api/portfolio/deposit
// @access  Private
const addFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    const depositAmount = Number(amount);

    if (!depositAmount || depositAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid deposit amount' });
    }

    let portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) {
      portfolio = await Portfolio.create({
        user: req.user._id,
        availableBalance: 50000,
        holdings: [],
      });
    }

    portfolio.availableBalance += depositAmount;
    await portfolio.save();

    res.json({
      success: true,
      message: `Successfully added $${depositAmount.toFixed(2)} to your balance`,
      data: portfolio,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyPortfolio,
  addFunds,
};
