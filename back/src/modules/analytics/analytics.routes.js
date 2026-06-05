'use strict';
const router = require('express').Router();
const ctrl = require('./analytics.controller');
const { authenticate, requireRole } = require('../../middleware/auth');

router.get('/dashboard', authenticate, requireRole('SUPER_ADMIN'), ctrl.dashboard);
module.exports = router;
