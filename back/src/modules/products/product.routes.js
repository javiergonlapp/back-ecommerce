'use strict';
const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const ctrl = require('./product.controller');
const { authenticate, requireRole } = require('../../middleware/auth');
const AppError = require('../../shared/errors/AppError');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400, 'VALIDATION_ERROR'));
  }
  next();
};

const productRules = [
  body('title').trim().notEmpty().withMessage('El nombre del producto es obligatorio'),
  body('price').isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0'),
  body('stock').isInt({ min: 0 }).withMessage('El stock debe ser mayor o igual a 0'),
];

const stockRule = [
  body('stock').isInt({ min: 0 }).withMessage('El stock debe ser mayor o igual a 0'),
];

const priceRule = [
  body('price').isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0'),
];

// Públicas
router.get('/', ctrl.list);
router.get('/:id', ctrl.detail);

// Solo admin
router.post('/', authenticate, requireRole('SUPER_ADMIN'), productRules, validate, ctrl.create);
router.put('/:id', authenticate, requireRole('SUPER_ADMIN'), productRules, validate, ctrl.update);
router.delete('/:id', authenticate, requireRole('SUPER_ADMIN'), ctrl.remove);
router.patch('/:id/stock', authenticate, requireRole('SUPER_ADMIN'), stockRule, validate, ctrl.updateStock);
router.patch('/:id/price', authenticate, requireRole('SUPER_ADMIN'), priceRule, validate, ctrl.updatePrice);

module.exports = router;
