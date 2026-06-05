'use strict';
const svc = require('./cart.service');
const { success } = require('../../shared/utils/response');

const get = async (req, res, next) => {
  try { success(res, { cart: await svc.getCart(req.user._id) }); } catch (err) { next(err); }
};
const add = async (req, res, next) => {
  try {
    const cart = await svc.addItem(req.user._id, { productId: req.body.productId, quantity: req.body.quantity });
    success(res, { cart }, 'Item added');
  } catch (err) { next(err); }
};
const update = async (req, res, next) => {
  try {
    const cart = await svc.updateItem(req.user._id, req.params.itemId, req.body.quantity);
    success(res, { cart }, 'Item updated');
  } catch (err) { next(err); }
};
const remove = async (req, res, next) => {
  try {
    const cart = await svc.removeItem(req.user._id, req.params.itemId);
    success(res, { cart }, 'Item removed');
  } catch (err) { next(err); }
};
const applyCoupon = async (req, res, next) => {
  try {
    const cart = await svc.applyCoupon(req.user._id, req.body.code);
    success(res, { cart }, 'Coupon applied');
  } catch (err) { next(err); }
};
const clear = async (req, res, next) => {
  try { await svc.clearCart(req.user._id); success(res, {}, 'Cart cleared'); } catch (err) { next(err); }
};
module.exports = { get, add, update, remove, applyCoupon, clear };
