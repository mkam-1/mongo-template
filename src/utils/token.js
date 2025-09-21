const jwt = require('jsonwebtoken');
const config = require('../config/config');

function signAccessToken(payload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

function verifyAccessToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

function signRefreshToken(payload) {
  return jwt.sign(payload, config.refreshSecret, { expiresIn: config.refreshExpiresIn });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, config.refreshSecret);
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
