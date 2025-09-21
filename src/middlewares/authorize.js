module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        ok: false,
        error: 'Forbidden',
        message: 'You are not authorized to access this resource',
      });
    }
    next();
  };
};
