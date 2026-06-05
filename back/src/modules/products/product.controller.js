'use strict';
const svc = require('./product.service');
const { success, paginated } = require('../../shared/utils/response');

const list = async (req, res, next) => {
  try {
    const { products, total, page, limit } = await svc.getProducts(req.query);
    paginated(res, products, total, page, limit);
  } catch (err) { next(err); }
};

const detail = async (req, res, next) => {
  try {
    const product = await svc.getProductById(req.params.id);
    success(res, { product });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const product = await svc.createProduct(req.body, req.user._id, req);
    success(res, { product }, 'Product created', 201);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const product = await svc.updateProduct(req.params.id, req.body, req.user._id, req);
    success(res, { product }, 'Product updated');
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await svc.deleteProduct(req.params.id, req.user._id, req);
    success(res, {}, 'Product deleted');
  } catch (err) { next(err); }
};

const updateStock = async (req, res, next) => {
  try {
    const product = await svc.updateStock(req.params.id, req.body.stock, req.user._id, req);
    success(res, { product }, 'Stock updated');
  } catch (err) { next(err); }
};

const updatePrice = async (req, res, next) => {
  try {
    const product = await svc.updatePrice(req.params.id, req.body.price, req.user._id, req);
    success(res, { product }, 'Price updated');
  } catch (err) { next(err); }
};

module.exports = { list, detail, create, update, remove, updateStock, updatePrice };
