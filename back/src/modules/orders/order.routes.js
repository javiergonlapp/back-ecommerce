'use strict';
const router = require('express').Router();
const ctrl = require('./order.controller');
const { authenticate, requireRole } = require('../../middleware/auth');

router.use(authenticate);
router.get('/my', ctrl.myOrders);
router.get('/:id', ctrl.detail);
router.get('/', requireRole('SUPER_ADMIN'), ctrl.adminList);
router.patch('/:id/status', requireRole('SUPER_ADMIN'), ctrl.updateStatus);

module.exports = router;
