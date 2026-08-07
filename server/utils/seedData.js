const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Stock = require('../models/Stock');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');

const initialStocks = [
  {
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    currentPrice: 185.50,
    dailyHigh: 187.20,
    dailyLow: 184.10,
    marketCap: '$2.85 Trillion',
    historicalData: [
      { date: 'Day 1', price: 178.20 },
      { date: 'Day 2', price: 180.50 },
      { date: 'Day 3', price: 181.10 },
      { date: 'Day 4', price: 183.40 },
      { date: 'Day 5', price: 182.90 },
      { date: 'Day 6', price: 184.60 },
      { date: 'Today', price: 185.50 },
    ],
  },
  {
    symbol: 'GOOGL',
    companyName: 'Alphabet Inc.',
    currentPrice: 165.75,
    dailyHigh: 168.00,
    dailyLow: 164.20,
    marketCap: '$2.08 Trillion',
    historicalData: [
      { date: 'Day 1', price: 159.00 },
      { date: 'Day 2', price: 161.20 },
      { date: 'Day 3', price: 163.50 },
      { date: 'Day 4', price: 162.80 },
      { date: 'Day 5', price: 164.40 },
      { date: 'Day 6', price: 166.10 },
      { date: 'Today', price: 165.75 },
    ],
  },
  {
    symbol: 'MSFT',
    companyName: 'Microsoft Corporation',
    currentPrice: 420.30,
    dailyHigh: 424.50,
    dailyLow: 418.00,
    marketCap: '$3.12 Trillion',
    historicalData: [
      { date: 'Day 1', price: 405.00 },
      { date: 'Day 2', price: 410.20 },
      { date: 'Day 3', price: 414.80 },
      { date: 'Day 4', price: 412.50 },
      { date: 'Day 5', price: 418.00 },
      { date: 'Day 6', price: 419.50 },
      { date: 'Today', price: 420.30 },
    ],
  },
  {
    symbol: 'NVDA',
    companyName: 'NVIDIA Corporation',
    currentPrice: 125.40,
    dailyHigh: 128.90,
    dailyLow: 122.10,
    marketCap: '$3.08 Trillion',
    historicalData: [
      { date: 'Day 1', price: 112.00 },
      { date: 'Day 2', price: 115.50 },
      { date: 'Day 3', price: 118.90 },
      { date: 'Day 4', price: 122.40 },
      { date: 'Day 5', price: 120.80 },
      { date: 'Day 6', price: 124.10 },
      { date: 'Today', price: 125.40 },
    ],
  },
  {
    symbol: 'AMZN',
    companyName: 'Amazon.com Inc.',
    currentPrice: 182.20,
    dailyHigh: 185.00,
    dailyLow: 180.50,
    marketCap: '$1.89 Trillion',
    historicalData: [
      { date: 'Day 1', price: 175.00 },
      { date: 'Day 2', price: 176.80 },
      { date: 'Day 3', price: 178.40 },
      { date: 'Day 4', price: 179.90 },
      { date: 'Day 5', price: 181.20 },
      { date: 'Day 6', price: 180.80 },
      { date: 'Today', price: 182.20 },
    ],
  },
  {
    symbol: 'TSLA',
    companyName: 'Tesla, Inc.',
    currentPrice: 215.80,
    dailyHigh: 222.00,
    dailyLow: 210.40,
    marketCap: '$688 Billion',
    historicalData: [
      { date: 'Day 1', price: 198.00 },
      { date: 'Day 2', price: 202.50 },
      { date: 'Day 3', price: 207.10 },
      { date: 'Day 4', price: 205.80 },
      { date: 'Day 5', price: 212.40 },
      { date: 'Day 6', price: 214.90 },
      { date: 'Today', price: 215.80 },
    ],
  },
  {
    symbol: 'META',
    companyName: 'Meta Platforms, Inc.',
    currentPrice: 495.60,
    dailyHigh: 502.10,
    dailyLow: 490.00,
    marketCap: '$1.25 Trillion',
    historicalData: [
      { date: 'Day 1', price: 470.00 },
      { date: 'Day 2', price: 478.20 },
      { date: 'Day 3', price: 485.40 },
      { date: 'Day 4', price: 489.10 },
      { date: 'Day 5', price: 492.50 },
      { date: 'Day 6', price: 491.00 },
      { date: 'Today', price: 495.60 },
    ],
  },
];

const seedDatabase = async () => {
  try {
    const stockCount = await Stock.countDocuments();
    if (stockCount > 0) {
      console.log('Database already contains stock records. Skipping seed.');
      return;
    }

    console.log('Seeding initial database content...');

    // Clear existing data
    await User.deleteMany({});
    await Stock.deleteMany({});
    await Portfolio.deleteMany({});
    await Transaction.deleteMany({});

    // Create Default Admin User
    const adminSalt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@123', adminSalt);
    const adminUser = await User.create({
      name: 'ShopEZ Admin',
      email: 'admin@shopez.com',
      password: adminPassword,
      role: 'ADMIN',
    });

    // Create Default Standard User
    const userSalt = await bcrypt.genSalt(10);
    const userPassword = await bcrypt.hash('User@123', userSalt);
    const standardUser = await User.create({
      name: 'Trader Alex',
      email: 'user@shopez.com',
      password: userPassword,
      role: 'USER',
    });

    // Seed Stocks
    const createdStocks = await Stock.insertMany(initialStocks);
    console.log(`Created ${createdStocks.length} initial stock listings.`);

    // Create Portfolios
    const aaplStock = createdStocks.find((s) => s.symbol === 'AAPL');
    const msftStock = createdStocks.find((s) => s.symbol === 'MSFT');
    const nvdaStock = createdStocks.find((s) => s.symbol === 'NVDA');

    await Portfolio.create({
      user: adminUser._id,
      availableBalance: 100000,
      holdings: [],
    });

    const userPortfolio = await Portfolio.create({
      user: standardUser._id,
      availableBalance: 42500,
      holdings: [
        {
          stock: aaplStock._id,
          symbol: 'AAPL',
          companyName: aaplStock.companyName,
          quantity: 20,
          averagePrice: 180.00,
          totalInvested: 3600,
        },
        {
          stock: msftStock._id,
          symbol: 'MSFT',
          companyName: msftStock.companyName,
          quantity: 5,
          averagePrice: 410.00,
          totalInvested: 2050,
        },
        {
          stock: nvdaStock._id,
          symbol: 'NVDA',
          companyName: nvdaStock.companyName,
          quantity: 15,
          averagePrice: 120.00,
          totalInvested: 1800,
        },
      ],
      totalInvestment: 7450,
      currentValue: 7691,
      profitLoss: 241,
    });

    // Create Sample Transactions
    await Transaction.create([
      {
        user: standardUser._id,
        stock: aaplStock._id,
        buyOrSell: 'BUY',
        quantity: 20,
        price: 180.00,
        totalAmount: 3600,
        status: 'APPROVED',
        timestamp: new Date(Date.now() - 86400000 * 3),
      },
      {
        user: standardUser._id,
        stock: msftStock._id,
        buyOrSell: 'BUY',
        quantity: 5,
        price: 410.00,
        totalAmount: 2050,
        status: 'APPROVED',
        timestamp: new Date(Date.now() - 86400000 * 2),
      },
      {
        user: standardUser._id,
        stock: nvdaStock._id,
        buyOrSell: 'BUY',
        quantity: 15,
        price: 120.00,
        totalAmount: 1800,
        status: 'APPROVED',
        timestamp: new Date(Date.now() - 86400000 * 1),
      },
    ]);

    console.log('Database Seeding Completed Successfully!');
    console.log('--------------------------------------------------');
    console.log('Admin Account : admin@shopez.com / Admin@123');
    console.log('User Account  : user@shopez.com  / User@123');
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
  }
};

module.exports = { seedDatabase };
