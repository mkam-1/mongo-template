const mongoose = require('mongoose');
const config = require('./config');

async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri, {
      dbName: config.mongoDb,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB connected to ${config.mongoDb}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;