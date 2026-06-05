'use strict';
const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  stripeRefundId: { type: String, default: null },
  adminNote: { type: String, default: '' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  reviewedAt: { type: Date, default: null },
}, { timestamps: true });

refundSchema.index({ order: 1 });
refundSchema.index({ user: 1 });
refundSchema.index({ status: 1 });

module.exports = mongoose.model('Refund', refundSchema);
