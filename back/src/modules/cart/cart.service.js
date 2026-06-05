'use strict';
const repo = require('./cart.repository');
const productRepo = require('../products/product.repository');
const couponSvc = require('../coupons/coupon.service');
const AppError = require('../../shared/errors/AppError');

const getCart = async (userId) => {
  const cart = await repo.findByUser(userId);
  if (!cart) return { items: [], subtotal: 0, discount: 0, total: 0 };
  return cart;
};

const addItem = async (userId, { productId, quantity = 1 }) => {
  const product = await productRepo.findById(productId);
  if (!product) throw new AppError('Product not found', 404, 'NOT_FOUND');
  if (product.stock < quantity) throw new AppError('Insufficient stock', 400, 'INSUFFICIENT_STOCK');

  let cart = await repo.findByUser(userId);
  if (!cart) {
    cart = await repo.upsertCart(userId, {
      user: userId,
      items: [{ product: productId, quantity, price: product.price }],
    });
  } else {
    const existingIdx = cart.items.findIndex((i) => i.product._id.toString() === productId);
    if (existingIdx > -1) {
      cart.items[existingIdx].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, price: product.price });
    }
    await cart.save();
  }
  return repo.findByUser(userId);
};

const updateItem = async (userId, itemId, quantity) => {
  const cart = await repo.findByUser(userId);
  if (!cart) throw new AppError('Cart not found', 404, 'NOT_FOUND');
  const item = cart.items.id(itemId);
  if (!item) throw new AppError('Item not found in cart', 404, 'NOT_FOUND');
  if (quantity <= 0) {
    cart.items.pull(itemId);
  } else {
    item.quantity = quantity;
  }
  await cart.save();
  return repo.findByUser(userId);
};

const removeItem = async (userId, itemId) => {
  const cart = await repo.findByUser(userId);
  if (!cart) throw new AppError('Cart not found', 404, 'NOT_FOUND');
  cart.items.pull(itemId);
  await cart.save();
  return repo.findByUser(userId);
};

const applyCoupon = async (userId, code) => {
  const cart = await repo.findByUser(userId);
  if (!cart || !cart.items.length) throw new AppError('Cart is empty', 400, 'CART_EMPTY');
  const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const { coupon, discount } = await couponSvc.validateCoupon(code, subtotal);
  cart.coupon = coupon._id;
  cart.couponCode = coupon.code;
  cart.discount = discount;
  await cart.save();
  return repo.findByUser(userId);
};

const clearCart = (userId) => repo.clearCart(userId);

module.exports = { getCart, addItem, updateItem, removeItem, applyCoupon, clearCart };
