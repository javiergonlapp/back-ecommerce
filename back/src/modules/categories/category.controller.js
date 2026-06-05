'use strict';
const svc = require('./category.service');
const { success } = require('../../shared/utils/response');

const list = async (req, res, next) => {
  try {
    const cats = await svc.getCategories();
    success(res, { categories: cats });
  } catch (err) { next(err); }
};
const detail = async (req, res, next) => {
  try {
    success(res, { category: await svc.getCategoryById(req.params.id) });
  } catch (err) { next(err); }
};
const create = async (req, res, next) => {
  try {
    success(res, { category: await svc.createCategory(req.body) }, 'Category created', 201);
  } catch (err) { next(err); }
};
const update = async (req, res, next) => {
  try {
    success(res, { category: await svc.updateCategory(req.params.id, req.body) }, 'Category updated');
  } catch (err) { next(err); }
};
const remove = async (req, res, next) => {
  try {
    await svc.deleteCategory(req.params.id);
    success(res, {}, 'Category deleted');
  } catch (err) { next(err); }
};
module.exports = { list, detail, create, update, remove };
