const path = require('path');
const dotenv = require('dotenv');

// Load env vars at top of file with path resolution
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { autoSeedIfEmpty } = require('./seeder');

// Connect Database and auto-seed initial data if collections are empty
connectDB().then(() => {
  autoSeedIfEmpty();
});

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || 
        origin === process.env.CLIENT_URL || 
        origin.endsWith('.vercel.app') || 
        origin.endsWith('.loca.lt') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'ShopEZ REST API Server is running...', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'ShopEZ REST API Server is running...' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
