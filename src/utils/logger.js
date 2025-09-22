const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { combine, timestamp, printf, colorize, json } = format;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Pretty format for dev
const devFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
  levels,
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    process.env.NODE_ENV === 'development'
      ? combine(colorize(), devFormat) // dev: pretty
      : json() // prod: JSON
  ),
  transports: [
    new transports.Console(),

    // Only in production: rotate files daily
    ...(process.env.NODE_ENV === 'production'
      ? [
          new DailyRotateFile({
            dirname: 'logs',            // folder for logs
            filename: 'error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            zippedArchive: true,        // compress old logs
            maxSize: '20m',             // max file size
            maxFiles: '14d',            // keep 14 days
          }),
          new DailyRotateFile({
            dirname: 'logs',
            filename: 'combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
          }),
        ]
      : []),
  ],
});

// Handle uncaught exceptions & rejections with rotation
if (process.env.NODE_ENV === 'production') {
  logger.exceptions.handle(
    new DailyRotateFile({
      dirname: 'logs',
      filename: 'exceptions-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    })
  );

  logger.rejections.handle(
    new DailyRotateFile({
      dirname: 'logs',
      filename: 'rejections-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    })
  );
} else {
  // In dev, just log to console
  logger.exceptions.handle(new transports.Console());
  logger.rejections.handle(new transports.Console());
}

module.exports = logger;
