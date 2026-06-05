'use strict';
const Refund = require('./refund.model');
const findByUser = (userId) => Refund.find({ user: userId }).populate('order').lean();
const findById = (id) => Refund.findById(id).populate('order').populate('user', 'name email').lean();
const findAll = () => Refund.find().populate('order').populate('user', 'name email').lean();
const create = (data) => Refund.create(data);
const update = (id, data) => Refund.findByIdAndUpdate(id, data, { new: true });
module.exports = { findByUser, findById, findAll, create, update };
