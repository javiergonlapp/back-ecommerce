'use strict';
const Cart = require('./cart.model');

const findByUser = (userId) =>
  Cart.findOne({ user: userId }).populate('items.product').populate('coupon');
const upsertCart = (userId, data) =>
  Cart.findOneAndUpdate({ user: userId }, data, { new: true, upsert: true }).populate('items.product');
const clearCart = (userId) =>
  Cart.findOneAndUpdate({ user: userId }, { items: [], coupon: null, couponCode: null, discount: 0 }, { new: true });

module.exports = { findByUser, upsertCart, clearCart };
