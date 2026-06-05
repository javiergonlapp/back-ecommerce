'use strict';
const Coupon = require('./coupon.model');

const findAll = () => Coupon.find().lean();
const findByCode = (code) => Coupon.findOne({ code: code.toUpperCase() });
const create = (data) => Coupon.create(data);
const update = (id, data) => Coupon.findByIdAndUpdate(id, data, { new: true });
const remove = (id) => Coupon.findByIdAndDelete(id);
const incrementUsage = (id) => Coupon.findByIdAndUpdate(id, { $inc: { usedCount: 1 } });

module.exports = { findAll, findByCode, create, update, remove, incrementUsage };
