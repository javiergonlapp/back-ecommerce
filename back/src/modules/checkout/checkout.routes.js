'use strict';
const router = require('express').Router();
const ctrl = require('./checkout.controller');
const { authenticate } = require('../../middleware/auth');

router.post('/session', authenticate, ctrl.createSession);
module.exports = router;
