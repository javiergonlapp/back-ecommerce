'use strict';
const router = require('express').Router();
const { handleWebhook } = require('./webhook.controller');

// Stripe requires raw body for webhook signature verification
router.post('/webhook', handleWebhook);
module.exports = router;
