'use strict';
const router = require('express').Router();
const ctrl = require('./refund.controller');
const { authenticate, requireRole } = require('../../middleware/auth');

router.use(authenticate);
router.post('/', ctrl.request);
router.get('/my', ctrl.myRefunds);
router.get('/', requireRole('SUPER_ADMIN'), ctrl.adminList);
router.patch('/:id/approve', requireRole('SUPER_ADMIN'), ctrl.approve);
router.patch('/:id/reject', requireRole('SUPER_ADMIN'), ctrl.reject);

module.exports = router;
