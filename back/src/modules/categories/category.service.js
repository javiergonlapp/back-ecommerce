'use strict';
const repo = require('./category.repository');
const AppError = require('../../shared/errors/AppError');

const getCategories = (activeOnly = true) => repo.findAll(activeOnly ? { isActive: true } : {});
const getCategoryById = async (id) => {
  const cat = await repo.findById(id);
  if (!cat) throw new AppError('Category not found', 404, 'NOT_FOUND');
  return cat;
};
const createCategory = (data) => repo.create(data);
const updateCategory = async (id, data) => {
  const cat = await repo.update(id, data);
  if (!cat) throw new AppError('Category not found', 404, 'NOT_FOUND');
  return cat;
};
const deleteCategory = async (id) => {
  const cat = await repo.remove(id);
  if (!cat) throw new AppError('Category not found', 404, 'NOT_FOUND');
};
module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
