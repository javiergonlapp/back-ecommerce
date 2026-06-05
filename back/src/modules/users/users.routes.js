'use strict';
const router = require('express').Router();
const User = require('./user.model');
const { authenticate, requireRole } = require('../../middleware/auth');
const { success, paginated } = require('../../shared/utils/response');

router.get('/', authenticate, requireRole('SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find().sort('-createdAt').skip(skip).limit(Number(limit)).lean(),
      User.countDocuments(),
    ]);
    paginated(res, users, total, page, limit);
  } catch (err) { next(err); }
});

router.get('/profile', authenticate, async (req, res, next) => {
  try { success(res, { user: req.user.toPublicJSON() }); } catch (err) { next(err); }
});

router.patch('/profile', authenticate, async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, avatar }, { new: true });
    success(res, { user: user.toPublicJSON() }, 'Profile updated');
  } catch (err) { next(err); }
});

module.exports = router;
