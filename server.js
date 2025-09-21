// server.js
require('dotenv').config();
const config = require('./src/config/config');
const connectDB = require('./src/config/db'); // new mongoose connection file
const mongoose = require('mongoose');
const app = require('./src/app');

async function start() {
  try {
    await connectDB();

    const server = app.listen(config.port, () => {
      console.log(`🚀 Server running on http://localhost:${config.port}`);
    });

    // Graceful shutdown
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    async function shutdown() {
      console.log('🛑 Shutting down gracefully...');
      server.close(async () => {
        await mongoose.connection.close(false);
        console.log('🛑 MongoDB connection closed');
        process.exit(0);
      });
    }
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
