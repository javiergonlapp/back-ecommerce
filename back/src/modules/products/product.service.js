'use strict';
const repo = require('./product.repository');
const categoryRepo = require('../categories/category.repository');
const AppError = require('../../shared/errors/AppError');
const { createAuditLog } = require('../../shared/helpers/audit');
const { AUDIT_ACTIONS } = require('../../constants');

const getProducts = async (query) => {
  const { page = 1, limit = 12, category, minPrice, maxPrice, search, sort } = query;
  const filter = { isActive: true };
  if (category) {
    const cat = await categoryRepo.findBySlug(category);
    if (cat) filter.category = cat._id;
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (search) {
    const [products, total] = await repo.searchText(search, filter, { page, limit });
    return { products, total, page, limit };
  }
  const sortMap = { price_asc: 'price', price_desc: '-price', newest: '-createdAt', rating: '-rating' };
  const [products, total] = await repo.findAll(filter, { page, limit, sort: sortMap[sort] || '-createdAt', populate: 'category' });
  return { products, total, page, limit };
};

const getProductById = async (id) => {
  const product = await repo.findById(id);
  if (!product) throw new AppError('Product not found', 404, 'NOT_FOUND');
  return product;
};

const createProduct = async (data, userId, req) => {
  const product = await repo.create(data);
  await createAuditLog({ userId, action: AUDIT_ACTIONS.PRODUCT_CREATE, entity: 'Product', entityId: product._id, newValue: data, req });
  return product;
};

const updateProduct = async (id, data, userId, req) => {
  const existing = await repo.findById(id);
  if (!existing) throw new AppError('Product not found', 404, 'NOT_FOUND');
  const updated = await repo.update(id, data);
  await createAuditLog({ userId, action: AUDIT_ACTIONS.PRODUCT_UPDATE, entity: 'Product', entityId: id, oldValue: existing, newValue: data, req });
  return updated;
};

const deleteProduct = async (id, userId, req) => {
  const existing = await repo.findById(id);
  if (!existing) throw new AppError('Product not found', 404, 'NOT_FOUND');
  await repo.remove(id);
  await createAuditLog({ userId, action: AUDIT_ACTIONS.PRODUCT_DELETE, entity: 'Product', entityId: id, oldValue: existing, req });
};

const updateStock = async (id, stock, userId, req) => {
  const existing = await repo.findById(id);
  if (!existing) throw new AppError('Product not found', 404, 'NOT_FOUND');
  const updated = await repo.update(id, { stock });
  await createAuditLog({ userId, action: AUDIT_ACTIONS.STOCK_UPDATE, entity: 'Product', entityId: id, oldValue: { stock: existing.stock }, newValue: { stock }, req });
  return updated;
};

const updatePrice = async (id, price, userId, req) => {
  const existing = await repo.findById(id);
  if (!existing) throw new AppError('Product not found', 404, 'NOT_FOUND');
  const updated = await repo.update(id, { price });
  await createAuditLog({ userId, action: AUDIT_ACTIONS.PRICE_UPDATE, entity: 'Product', entityId: id, oldValue: { price: existing.price }, newValue: { price }, req });
  return updated;
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, updateStock, updatePrice };
