'use strict';
const svc = require('./refund.service');
const { success } = require('../../shared/utils/response');

const request = async (req, res, next) => {
  try {
    const refund = await svc.requestRefund(req.user._id, req.body.orderId, req.body.reason);
    success(res, { refund }, 'Refund requested', 201);
  } catch (err) { next(err); }
};
const myRefunds = async (req, res, next) => {
  try { success(res, { refunds: await svc.getMyRefunds(req.user._id) }); } catch (err) { next(err); }
};
const adminList = async (req, res, next) => {
  try { success(res, { refunds: await svc.getAllRefunds() }); } catch (err) { next(err); }
};
const approve = async (req, res, next) => {
  try {
    const refund = await svc.approveRefund(req.params.id, req.user._id, req.body.adminNote, req);
    success(res, { refund }, 'Refund approved');
  } catch (err) { next(err); }
};
const reject = async (req, res, next) => {
  try {
    const refund = await svc.rejectRefund(req.params.id, req.user._id, req.body.adminNote, req);
    success(res, { refund }, 'Refund rejected');
  } catch (err) { next(err); }
};
module.exports = { request, myRefunds, adminList, approve, reject };
