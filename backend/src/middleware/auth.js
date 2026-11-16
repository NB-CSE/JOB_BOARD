const jwt = require('jsonwebtoken');
const User = require('../models/User');
const store = require('../config/inMemoryStore');
const { getDbStatus } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'elevate_careers_jwt_secret_token_2026_super_secure_key'
      );

      let user;
      if (getDbStatus()) {
        user = await User.findById(decoded.id).select('-passwordHash');
      } else {
        const found = store.findUserById(decoded.id);
        if (found) {
          const { passwordHash, ...safeUser } = found;
          user = safeUser;
        }
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists or token is invalid',
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('JWT auth error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed or expired',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized to access this resource`,
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
