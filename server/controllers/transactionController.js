const Transaction = require('../models/Transaction');
const Stock = require('../models/Stock');
const { processTrade } = require('../services/tradeService');

// @desc    Execute a new Buy or Sell transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const { stockId, buyOrSell, quantity } = req.body;
    const userId = req.user._id;

    if (!stockId || !buyOrSell || !quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Stock ID, Buy/Sell type, and valid quantity are required' });
    }

    if (!['BUY', 'SELL'].includes(buyOrSell)) {
      return res.status(400).json({ success: false, message: 'Type must be BUY or SELL' });
    }

    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }

    const price = stock.currentPrice;
    const totalAmount = price * Number(quantity);

    // Process trade on user portfolio first (validates cash & holdings)
    await processTrade(userId, stockId, buyOrSell, Number(quantity), price);

    // Record the completed transaction
    const transaction = await Transaction.create({
      user: userId,
      stock: stockId,
      buyOrSell,
      quantity: Number(quantity),
      price,
      totalAmount,
      status: 'APPROVED',
      timestamp: new Date(),
    });

    const populatedTx = await Transaction.findById(transaction._id)
      .populate('stock', 'symbol companyName currentPrice')
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: `Successfully executed ${buyOrSell} order for ${quantity} shares of ${stock.symbol}`,
      data: populatedTx,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get current user transaction history
// @route   GET /api/transactions/my
// @access  Private
const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .populate('stock', 'symbol companyName currentPrice')
      .sort({ timestamp: -1 });

    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all transactions (Admin only)
// @route   GET /api/transactions
// @access  Private/Admin
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({})
      .populate('user', 'name email role')
      .populate('stock', 'symbol companyName currentPrice')
      .sort({ timestamp: -1 });

    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or Reject pending transaction (Admin only)
// @route   PUT /api/transactions/:id/status
// @access  Private/Admin
const updateTransactionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be APPROVED or REJECTED' });
    }

    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (transaction.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: `Transaction is already ${transaction.status}` });
    }

    if (status === 'APPROVED') {
      await processTrade(
        transaction.user,
        transaction.stock,
        transaction.buyOrSell,
        transaction.quantity,
        transaction.price
      );
    }

    transaction.status = status;
    await transaction.save();

    res.json({
      success: true,
      message: `Transaction ${status.toLowerCase()} successfully`,
      data: transaction,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTransaction,
  getMyTransactions,
  getAllTransactions,
  updateTransactionStatus,
};
