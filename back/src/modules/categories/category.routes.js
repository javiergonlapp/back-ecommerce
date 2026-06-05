'use strict';
const router = require('express').Router();
const ctrl = require('./category.controller');
const { authenticate, requireRole } = require('../../middleware/auth');

router.get('/', ctrl.list);
router.get('/:id', ctrl.detail);
router.post('/', authenticate, requireRole('SUPER_ADMIN'), ctrl.create);
router.put('/:id', authenticate, requireRole('SUPER_ADMIN'), ctrl.update);
router.delete('/:id', authenticate, requireRole('SUPER_ADMIN'), ctrl.remove);

module.exports = router;
