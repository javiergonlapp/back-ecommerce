'use strict';
const svc = require('./checkout.service');
const { success } = require('../../shared/utils/response');

const createSession = async (req, res, next) => {
  try {
    const result = await svc.createCheckoutSession(req.user._id, req.body);
    success(res, result, 'Checkout session created');
  } catch (err) { next(err); }
};
module.exports = { createSession };
