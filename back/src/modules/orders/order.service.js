'use strict';
const repo = require('./order.repository');
const cartSvc = require('../cart/cart.service');
const couponRepo = require('../coupons/coupon.repository');
const AppError = require('../../shared/errors/AppError');
const { createAuditLog } = require('../../shared/helpers/audit');
const { AUDIT_ACTIONS } = require('../../constants');

const getMyOrders = async (userId, page, limit) => {
  const [orders, total] = await repo.findByUser(userId, page, limit);
  return { orders, total, page, limit };
};

const getOrderById = async (id, userId, isAdmin = false) => {
  const order = isAdmin ? await repo.findById(id) : await repo.findByIdAndUser(id, userId);
  if (!order) throw new AppError('Order not found', 404, 'NOT_FOUND');
  return order;
};

const getAllOrders = async (filter, page, limit) => {
  const [orders, total] = await repo.findAll(filter, page, limit);
  return { orders, total, page, limit };
};

const updateOrderStatus = async (id, status, adminId, note, req) => {
  const existing = await repo.findById(id);
  if (!existing) throw new AppError('Order not found', 404, 'NOT_FOUND');
  const updated = await repo.updateStatus(id, status, adminId, note);
  await createAuditLog({
    userId: adminId, action: AUDIT_ACTIONS.ORDER_STATUS_CHANGE, entity: 'Order', entityId: id,
    oldValue: { status: existing.status }, newValue: { status }, req,
  });
  return updated;
};

module.exports = { getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
