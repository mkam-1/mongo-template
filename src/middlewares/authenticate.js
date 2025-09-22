const { verifyAccessToken } = require('../utils/token');

module.exports = (req, res, next) => {
  try {
    const auth = req.headers?.authorization;

    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({
        ok: false,
        error: 'Unauthorized',
        message: "You are not authorized to perform this action",
      });
    }

    const token = auth.split(' ')[1];

    try {
      const payload = verifyAccessToken(token);
      req.user = payload; // { id, role, iat, exp }
      next();
    } catch (err) {
      return res.status(401).json({
        ok: false,
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: 'InternalServerError',
      message: 'Authentication middleware failed',
    });
  }
};
