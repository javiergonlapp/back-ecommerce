'use strict';
const repo = require('./coupon.repository');
const AppError = require('../../shared/errors/AppError');

const getCoupons = () => repo.findAll();

const validateCoupon = async (code, orderAmount) => {
  const coupon = await repo.findByCode(code);
  if (!coupon || !coupon.isValid()) throw new AppError('Invalid or expired coupon', 400, 'INVALID_COUPON');
  if (orderAmount < coupon.minOrderAmount)
    throw new AppError(`Minimum order amount is $${coupon.minOrderAmount}`, 400, 'MIN_ORDER_NOT_MET');
  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (orderAmount * coupon.discountValue) / 100;
  } else {
    discount = Math.min(coupon.discountValue, orderAmount);
  }
  return { coupon, discount: Math.round(discount * 100) / 100 };
};

const createCoupon = (data) => repo.create(data);
const updateCoupon = async (id, data) => {
  const coupon = await repo.update(id, data);
  if (!coupon) throw new AppError('Coupon not found', 404, 'NOT_FOUND');
  return coupon;
};
const deleteCoupon = async (id) => {
  const coupon = await repo.remove(id);
  if (!coupon) throw new AppError('Coupon not found', 404, 'NOT_FOUND');
};

module.exports = { getCoupons, validateCoupon, createCoupon, updateCoupon, deleteCoupon };
