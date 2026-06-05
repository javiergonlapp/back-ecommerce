'use strict';
const passport = require('passport');
const AppError = require('../shared/errors/AppError');

const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    req.user = user;
    next();
  })(req, res, next);
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
  if (!roles.includes(req.user.role)) return next(new AppError('Insufficient permissions', 403, 'FORBIDDEN'));
  next();
};

const optionalAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (user) req.user = user;
    next();
  })(req, res, next);
};

module.exports = { authenticate, requireRole, optionalAuth };
