const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopez';
    
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log(`MongoDB connected successfully to host: ${conn.connection.host} (DB: ${conn.connection.name})`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
  }
};

mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB connection disconnected');
});

module.exports = connectDB;


