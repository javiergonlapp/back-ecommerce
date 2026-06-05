'use strict';
const svc = require('./order.service');
const { success, paginated } = require('../../shared/utils/response');

const myOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await svc.getMyOrders(req.user._id, page, limit);
    paginated(res, result.orders, result.total, result.page, result.limit);
  } catch (err) { next(err); }
};

const detail = async (req, res, next) => {
  try {
    const order = await svc.getOrderById(req.params.id, req.user._id, req.user.role === 'SUPER_ADMIN');
    success(res, { order });
  } catch (err) { next(err); }
};

const adminList = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = status ? { status } : {};
    const result = await svc.getAllOrders(filter, page, limit);
    paginated(res, result.orders, result.total, result.page, result.limit);
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    const order = await svc.updateOrderStatus(req.params.id, req.body.status, req.user._id, req.body.note, req);
    success(res, { order }, 'Status updated');
  } catch (err) { next(err); }
};

module.exports = { myOrders, detail, adminList, updateStatus };
