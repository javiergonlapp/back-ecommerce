'use strict';
const router = require('express').Router();
const ctrl = require('./coupon.controller');
const { authenticate, requireRole } = require('../../middleware/auth');

router.post('/validate', authenticate, ctrl.validate);
router.get('/', authenticate, requireRole('SUPER_ADMIN'), ctrl.list);
router.post('/', authenticate, requireRole('SUPER_ADMIN'), ctrl.create);
router.put('/:id', authenticate, requireRole('SUPER_ADMIN'), ctrl.update);
router.delete('/:id', authenticate, requireRole('SUPER_ADMIN'), ctrl.remove);

module.exports = router;
