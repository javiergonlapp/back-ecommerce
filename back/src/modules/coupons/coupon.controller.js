'use strict';
const svc = require('./coupon.service');
const { success } = require('../../shared/utils/response');

const list = async (req, res, next) => {
  try { success(res, { coupons: await svc.getCoupons() }); } catch (err) { next(err); }
};
const validate = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;
    const result = await svc.validateCoupon(code, Number(orderAmount));
    success(res, result, 'Coupon valid');
  } catch (err) { next(err); }
};
const create = async (req, res, next) => {
  try { success(res, { coupon: await svc.createCoupon(req.body) }, 'Coupon created', 201); } catch (err) { next(err); }
};
const update = async (req, res, next) => {
  try { success(res, { coupon: await svc.updateCoupon(req.params.id, req.body) }, 'Coupon updated'); } catch (err) { next(err); }
};
const remove = async (req, res, next) => {
  try { await svc.deleteCoupon(req.params.id); success(res, {}, 'Coupon deleted'); } catch (err) { next(err); }
};
module.exports = { list, validate, create, update, remove };
