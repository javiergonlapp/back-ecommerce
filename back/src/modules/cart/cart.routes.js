'use strict';
const router = require('express').Router();
const ctrl = require('./cart.controller');
const { authenticate } = require('../../middleware/auth');

router.use(authenticate);
router.get('/', ctrl.get);
router.post('/items', ctrl.add);
router.patch('/items/:itemId', ctrl.update);
router.delete('/items/:itemId', ctrl.remove);
router.post('/coupon', ctrl.applyCoupon);
router.delete('/', ctrl.clear);

module.exports = router;
