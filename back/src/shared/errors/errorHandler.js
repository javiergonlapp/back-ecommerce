'use strict';
const logger = require('../logger');
const AppError = require('./AppError');

const handleCastError = (err) => new AppError(`Invalid ${err.path}: ${err.value}`, 400, 'INVALID_ID');
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(`${field} already exists`, 409, 'DUPLICATE_FIELD');
};
const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(messages.join('. '), 400, 'VALIDATION_ERROR');
};
const handleJWTError = () => new AppError('Invalid token', 401, 'INVALID_TOKEN');
const handleJWTExpiredError = () => new AppError('Token expired', 401, 'TOKEN_EXPIRED');

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (err.name === 'CastError') error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateKeyError(err);
  if (err.name === 'ValidationError') error = handleValidationError(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  if (!error.isOperational) logger.error('UNHANDLED ERROR:', err);

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: error.code || 'ERROR',
    message: process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal Server Error'
      : error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
