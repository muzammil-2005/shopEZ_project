const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');

/**
 * Recalculate portfolio total investment, current value, and profit/loss
 */
const recalculatePortfolioMetrics = async (portfolio) => {
  let totalInvested = 0;
  let currentValue = 0;

  for (let holding of portfolio.holdings) {
    if (holding.quantity > 0) {
      totalInvested += holding.totalInvested;
      // Fetch latest stock price if possible
      const stock = await Stock.findById(holding.stock);
      const price = stock ? stock.currentPrice : holding.averagePrice;
      currentValue += holding.quantity * price;
    }
  }

  portfolio.totalInvestment = totalInvested;
  portfolio.currentValue = currentValue;
  portfolio.profitLoss = currentValue - totalInvested;
  
  await portfolio.save();
  return portfolio;
};

/**
 * Process a trade transaction (BUY or SELL) on user portfolio
 */
const processTrade = async (userId, stockId, buyOrSell, quantity, price) => {
  const stock = await Stock.findById(stockId);
  if (!stock) {
    throw new Error('Stock not found');
  }

  let portfolio = await Portfolio.findOne({ user: userId });
  if (!portfolio) {
    portfolio = await Portfolio.create({
      user: userId,
      availableBalance: 50000,
      holdings: [],
    });
  }

  const totalAmount = quantity * price;

  if (buyOrSell === 'BUY') {
    if (portfolio.availableBalance < totalAmount) {
      throw new Error(`Insufficient cash balance ($${portfolio.availableBalance.toFixed(2)} available, $${totalAmount.toFixed(2)} required)`);
    }

    portfolio.availableBalance -= totalAmount;

    const existingIndex = portfolio.holdings.findIndex(
      (h) => h.stock.toString() === stockId.toString()
    );

    if (existingIndex > -1) {
      const existing = portfolio.holdings[existingIndex];
      const newQty = existing.quantity + quantity;
      const newInvested = existing.totalInvested + totalAmount;
      const newAvg = newInvested / newQty;

      portfolio.holdings[existingIndex].quantity = newQty;
      portfolio.holdings[existingIndex].averagePrice = newAvg;
      portfolio.holdings[existingIndex].totalInvested = newInvested;
    } else {
      portfolio.holdings.push({
        stock: stock._id,
        symbol: stock.symbol,
        companyName: stock.companyName,
        quantity: quantity,
        averagePrice: price,
        totalInvested: totalAmount,
      });
    }
  } else if (buyOrSell === 'SELL') {
    const existingIndex = portfolio.holdings.findIndex(
      (h) => h.stock.toString() === stockId.toString()
    );

    if (existingIndex === -1 || portfolio.holdings[existingIndex].quantity < quantity) {
      const ownedQty = existingIndex > -1 ? portfolio.holdings[existingIndex].quantity : 0;
      throw new Error(`Insufficient share holdings (${ownedQty} owned, ${quantity} requested)`);
    }

    const existing = portfolio.holdings[existingIndex];
    const newQty = existing.quantity - quantity;

    portfolio.availableBalance += totalAmount;

    if (newQty === 0) {
      portfolio.holdings.splice(existingIndex, 1);
    } else {
      const costBasisPerShare = existing.averagePrice;
      existing.quantity = newQty;
      existing.totalInvested = newQty * costBasisPerShare;
    }
  }

  await recalculatePortfolioMetrics(portfolio);
  return portfolio;
};

module.exports = {
  recalculatePortfolioMetrics,
  processTrade,
};
