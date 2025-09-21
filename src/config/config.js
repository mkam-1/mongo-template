const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const required = (k) => {
  if (!process.env[k]) throw new Error(`Missing env var ${k}`);
  return process.env[k];
};

module.exports = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: required('MONGO_URI'),
  mongoDb: required('MONGO_DB'),

  // JWT
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m', // access tokens should be short-lived
  refreshSecret: required('REFRESH_SECRET'),
  refreshExpiresIn: process.env.REFRESH_EXPIRES_IN || '7d', // longer-lived

  baseUrl: process.env.BASE_URL || 'http://localhost:4000',

  // SMTP
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  emailFrom: process.env.EMAIL_FROM || 'no-reply@example.com',
  // Retry configs
  db: {
    maxRetries: parseInt(process.env.DB_MAX_RETRIES, 10) || 5,
    retryDelay: parseInt(process.env.DB_RETRY_DELAY, 10) || 2000, // ms
  },
};
