'use strict';
const Product = require('./product.model');

const findAll = (filter = {}, options = {}) => {
  const { page = 1, limit = 12, sort = '-createdAt', populate = '' } = options;
  const skip = (page - 1) * limit;
  return Promise.all([
    Product.find(filter).populate(populate).sort(sort).skip(skip).limit(Number(limit)).lean(),
    Product.countDocuments(filter),
  ]);
};

const findById = (id) => Product.findById(id).populate('category').lean();
const findByExternalId = (externalId) => Product.findOne({ externalId });
const create = (data) => Product.create(data);
const update = (id, data) => Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
const remove = (id) => Product.findByIdAndDelete(id);
const searchText = (query, filter = {}, options = {}) => {
  const { page = 1, limit = 12 } = options;
  const skip = (page - 1) * limit;
  const searchFilter = { ...filter, $text: { $search: query } };
  return Promise.all([
    Product.find(searchFilter, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } }).skip(skip).limit(Number(limit)).lean(),
    Product.countDocuments(searchFilter),
  ]);
};

module.exports = { findAll, findById, findByExternalId, create, update, remove, searchText };
