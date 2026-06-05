'use strict';
const AuditLog = require('../../modules/audit/auditLog.model');

const createAuditLog = async ({ userId, action, entity, entityId, oldValue, newValue, req }) => {
  try {
    await AuditLog.create({
      userId,
      action,
      entity,
      entityId: entityId || null,
      oldValue: oldValue || null,
      newValue: newValue || null,
      ip: req?.ip || null,
      userAgent: req?.get('user-agent') || null,
    });
  } catch (err) {
    // audit errors should never crash the app
    console.error('Audit log error:', err.message);
  }
};

module.exports = { createAuditLog };
