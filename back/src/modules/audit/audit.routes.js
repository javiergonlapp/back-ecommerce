'use strict';
const router = require('express').Router();
const AuditLog = require('./auditLog.model');
const { authenticate, requireRole } = require('../../middleware/auth');
const { paginated } = require('../../shared/utils/response');

router.get('/', authenticate, requireRole('SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { page = 1, limit = 50, action, entity } = req.query;
    const filter = {};
    if (action) filter.action = action;
    if (entity) filter.entity = entity;
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      AuditLog.find(filter).populate('userId', 'name email').sort('-createdAt').skip(skip).limit(Number(limit)).lean(),
      AuditLog.countDocuments(filter),
    ]);
    paginated(res, logs, total, page, limit);
  } catch (err) { next(err); }
});

module.exports = router;
