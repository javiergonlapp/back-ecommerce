'use strict';
const mongoose = require('mongoose');

// Basado en el modelo de la Hackathon 13 — adaptado a CommonJS
const messageSchema = new mongoose.Schema({
  from:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:      { type: String, required: true, trim: true, maxlength: 1000 },
  read:      { type: Boolean, default: false },
  edited:    { type: Boolean, default: false },
}, { timestamps: true });

messageSchema.index({ from: 1, to: 1 });
messageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
