'use strict';
const svc = require('./analytics.service');
const { success } = require('../../shared/utils/response');

const dashboard = async (req, res, next) => {
  try { success(res, await svc.getDashboardStats(), 'Dashboard stats'); } catch (err) { next(err); }
};
module.exports = { dashboard };
