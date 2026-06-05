'use strict';
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, default: null },
  stock: { type: Number, required: true, default: 0, min: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{ type: String }],
  thumbnail: { type: String },
  brand: { type: String, default: '' },
  sku: { type: String, unique: true, sparse: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  tags: [{ type: String }],
  externalId: { type: Number, default: null },
}, { timestamps: true });

productSchema.index({ title: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
