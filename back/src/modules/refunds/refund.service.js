'use strict';
const repo = require('./refund.repository');
const orderRepo = require('../orders/order.repository');
const AppError = require('../../shared/errors/AppError');
const { createAuditLog } = require('../../shared/helpers/audit');
const { AUDIT_ACTIONS } = require('../../constants');

let stripe = null;
if (process.env.STRIPE_SECRET_KEY) stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const requestRefund = async (userId, orderId, reason) => {
  const order = await orderRepo.findByIdAndUser(orderId, userId);
  if (!order) throw new AppError('Order not found', 404, 'NOT_FOUND');
  if (order.status !== 'paid' && order.status !== 'delivered')
    throw new AppError('Order is not eligible for refund', 400, 'REFUND_NOT_ELIGIBLE');
  return repo.create({ order: orderId, user: userId, amount: order.total, reason });
};

const approveRefund = async (refundId, adminId, adminNote, req) => {
  const refund = await repo.findById(refundId);
  if (!refund) throw new AppError('Refund not found', 404, 'NOT_FOUND');
  if (refund.status !== 'pending') throw new AppError('Refund already processed', 400, 'ALREADY_PROCESSED');

  let stripeRefundId = null;
  if (stripe && refund.order?.paymentIntentId) {
    const stripeRefund = await stripe.refunds.create({
      payment_intent: refund.order.paymentIntentId,
      amount: Math.round(refund.amount * 100),
    });
    stripeRefundId = stripeRefund.id;
  }

  const updated = await repo.update(refundId, {
    status: 'approved', adminNote, reviewedBy: adminId, reviewedAt: new Date(),
    stripeRefundId,
  });
  if (refund.order?._id) {
    await orderRepo.updateStatus(refund.order._id, 'refunded', adminId, 'Refund approved');
  }
  await createAuditLog({ userId: adminId, action: AUDIT_ACTIONS.REFUND_APPROVE, entity: 'Refund', entityId: refundId, req });
  return updated;
};

const rejectRefund = async (refundId, adminId, adminNote, req) => {
  const refund = await repo.findById(refundId);
  if (!refund) throw new AppError('Refund not found', 404, 'NOT_FOUND');
  if (refund.status !== 'pending') throw new AppError('Refund already processed', 400, 'ALREADY_PROCESSED');
  const updated = await repo.update(refundId, { status: 'rejected', adminNote, reviewedBy: adminId, reviewedAt: new Date() });
  await createAuditLog({ userId: adminId, action: AUDIT_ACTIONS.REFUND_REJECT, entity: 'Refund', entityId: refundId, req });
  return updated;
};

const getMyRefunds = (userId) => repo.findByUser(userId);
const getAllRefunds = () => repo.findAll();

module.exports = { requestRefund, approveRefund, rejectRefund, getMyRefunds, getAllRefunds };
