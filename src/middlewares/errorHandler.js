const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Log error (stack if available)
  logger.error(err.stack || message);

  if (process.env.NODE_ENV === 'development') {
    return res.status(status).json({ ok: false, status, message, stack: err.stack });
  }

  res.status(status).json({ ok: false, status, message });
};
