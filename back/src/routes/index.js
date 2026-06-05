'use strict';
const router = require('express').Router();

router.use('/auth', require('../modules/auth/auth.routes'));
router.use('/users', require('../modules/users/users.routes'));
router.use('/products', require('../modules/products/product.routes'));
router.use('/categories', require('../modules/categories/category.routes'));
router.use('/coupons', require('../modules/coupons/coupon.routes'));
router.use('/cart', require('../modules/cart/cart.routes'));
router.use('/checkout', require('../modules/checkout/checkout.routes'));
router.use('/payments', require('../modules/payments/payment.routes'));
router.use('/orders', require('../modules/orders/order.routes'));
router.use('/refunds', require('../modules/refunds/refund.routes'));
router.use('/analytics', require('../modules/analytics/analytics.routes'));
router.use('/audit', require('../modules/audit/audit.routes'));
router.use('/chat', require('../modules/chat/chat.routes'));

module.exports = router;
