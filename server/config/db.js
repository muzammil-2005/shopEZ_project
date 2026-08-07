const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopez_db';
    console.log(`Connecting to MongoDB... Target: ${mongoUri}`);

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}:${conn.connection.port}`);
  } catch (error) {
    console.warn(`Primary MongoDB Connection failed: ${error.message}`);
    console.log('Attempting to initialize MongoMemoryServer fallback for seamless standalone execution...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(memoryUri);
      console.log(`In-Memory MongoDB Started & Connected: ${conn.connection.host}`);
    } catch (memErr) {
      console.error(`In-Memory Database Initialization Error: ${memErr.message}`);
      console.error('Please ensure MongoDB service is running locally on port 27017 or provide a valid MONGO_URI in .env');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
