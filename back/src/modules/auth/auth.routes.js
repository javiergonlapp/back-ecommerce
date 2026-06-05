'use strict';
const router = require('express').Router();
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const ctrl = require('./auth.controller');
const { authenticate } = require('../../middleware/auth');
const AppError = require('../../shared/errors/AppError');

// Middleware para manejar errores de validación
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400, 'VALIDATION_ERROR'));
  }
  next();
};

// Validaciones de registro
const registerRules = [
  body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('El email no es válido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener mínimo 6 caracteres'),
];

// Validaciones de login
const loginRules = [
  body('email').isEmail().withMessage('El email no es válido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];

router.post('/register', registerRules, validate, ctrl.register);
router.post('/login', loginRules, validate, ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', authenticate, ctrl.logout);
router.get('/me', authenticate, ctrl.me);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  ctrl.googleCallback,
);

module.exports = router;
