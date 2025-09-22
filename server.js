// server.js
require('dotenv').config();
const config = require('./src/config/config');
const connectDB = require('./src/config/db'); // new mongoose connection file
const mongoose = require('mongoose');
const app = require('./src/app');
const logger = require('./src/utils/logger'); // <-- import logger

async function start() {
  try {
    await connectDB();

    const server = app.listen(config.port, () => {
      logger.info(`🚀 Server running on http://localhost:${config.port}`);
    });

    // Graceful shutdown
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    async function shutdown() {
      logger.warn('🛑 Shutting down gracefully...');
      server.close(async () => {
        await mongoose.connection.close(false);
        logger.info('🛑 MongoDB connection closed');
        process.exit(0);
      });
    }
  } catch (err) {
    logger.error(`❌ Failed to start server: ${err.message}`);
    process.exit(1);
  }
}

start();
