const morgan = require('morgan');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');

// Define custom stream for Winston
const stream = {
  write: (message) => {
    logger.http(message.trim()); // Winston logs with http level
  },
};

// Skip function to reduce noise in prod (optional)
const skip = () => {
  return process.env.NODE_ENV === 'production';
};

// In dev → colorful concise logging (console only)
let morganMiddleware = morgan('dev', { stream });

// In prod → write to rotated log files AND Winston
if (process.env.NODE_ENV === 'production') {
  // Ensure logs dir exists
  const logDirectory = path.join(__dirname, '../../logs');
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

  // Rotate access logs separately
  const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory,
    maxFiles: 14, // keep 14 days
    size: '20M', // max size per file
    compress: 'gzip',
  });

  morganMiddleware = morgan('combined', {
    stream: accessLogStream, // access.log rotation
  });

  // Also send to Winston
  app.use(morgan('combined', { stream }));
}

module.exports = morganMiddleware;
