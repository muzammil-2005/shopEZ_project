const User = require('../models/User');
const Stock = require('../models/Stock');
const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');

// @desc    Get Admin analytics dashboard statistics
// @route   GET /api/analytics
// @access  Private/Admin
const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'USER' });
    const totalAdmins = await User.countDocuments({ role: 'ADMIN' });
    const totalStocks = await Stock.countDocuments({});
    const totalTransactions = await Transaction.countDocuments({});

    // Calculate total trading volume & distribution
    const volumeAgg = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalVolume: { $sum: '$totalAmount' },
          totalBuyVolume: {
            $sum: { $cond: [{ $eq: ['$buyOrSell', 'BUY'] }, '$totalAmount', 0] },
          },
          totalSellVolume: {
            $sum: { $cond: [{ $eq: ['$buyOrSell', 'SELL'] }, '$totalAmount', 0] },
          },
        },
      },
    ]);

    const totalVolume = volumeAgg.length > 0 ? volumeAgg[0].totalVolume : 0;
    const buyVolume = volumeAgg.length > 0 ? volumeAgg[0].totalBuyVolume : 0;
    const sellVolume = volumeAgg.length > 0 ? volumeAgg[0].totalSellVolume : 0;

    // Top traded stocks
    const topTraded = await Transaction.aggregate([
      {
        $group: {
          _id: '$stock',
          tradeCount: { $sum: 1 },
          volume: { $sum: '$totalAmount' },
        },
      },
      { $sort: { volume: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'stocks',
          localField: '_id',
          foreignField: '_id',
          as: 'stockDetails',
        },
      },
      { $unwind: '$stockDetails' },
      {
        $project: {
          symbol: '$stockDetails.symbol',
          companyName: '$stockDetails.companyName',
          tradeCount: 1,
          volume: 1,
        },
      },
    ]);

    // Recent activity log
    const recentTransactions = await Transaction.find({})
      .populate('user', 'name email')
      .populate('stock', 'symbol companyName')
      .sort({ timestamp: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        metrics: {
          totalUsers,
          totalAdmins,
          totalStocks,
          totalTransactions,
          totalVolume,
          buyVolume,
          sellVolume,
        },
        topTraded,
        recentTransactions,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminAnalytics,
};
