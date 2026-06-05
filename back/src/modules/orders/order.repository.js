'use strict';
const Order = require('./order.model');

const findByUser = (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return Promise.all([
    Order.find({ user: userId }).sort('-createdAt').skip(skip).limit(Number(limit)).lean(),
    Order.countDocuments({ user: userId }),
  ]);
};
const findById = (id) => Order.findById(id).populate('user', 'name email').lean();
const findByIdAndUser = (id, userId) => Order.findOne({ _id: id, user: userId }).lean();
const findAll = (filter = {}, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  return Promise.all([
    Order.find(filter).populate('user', 'name email').sort('-createdAt').skip(skip).limit(Number(limit)).lean(),
    Order.countDocuments(filter),
  ]);
};
const create = (data) => Order.create(data);
const updateStatus = (id, status, userId, note) =>
  Order.findByIdAndUpdate(id, {
    status,
    $push: { statusHistory: { status, changedBy: userId, note } },
  }, { new: true });
const findByStripeSession = (sessionId) => Order.findOne({ stripeSessionId: sessionId });

module.exports = { findByUser, findById, findByIdAndUser, findAll, create, updateStatus, findByStripeSession };
