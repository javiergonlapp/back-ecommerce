'use strict';
const Category = require('./category.model');

const findAll = (filter = {}) => Category.find(filter).lean();
const findById = (id) => Category.findById(id).lean();
const findBySlug = (slug) => Category.findOne({ slug }).lean();
const create = (data) => Category.create(data);
const update = (id, data) => Category.findByIdAndUpdate(id, data, { new: true });
const remove = (id) => Category.findByIdAndDelete(id);
module.exports = { findAll, findById, findBySlug, create, update, remove };
