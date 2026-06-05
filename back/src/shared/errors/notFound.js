'use strict';
const AppError = require('./AppError');
const notFound = (req, res, next) => next(new AppError(`Route ${req.originalUrl} not found`, 404, 'NOT_FOUND'));
module.exports = { notFound };
