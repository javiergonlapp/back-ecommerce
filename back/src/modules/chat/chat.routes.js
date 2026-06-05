'use strict';
const router = require('express').Router();
const Message = require('./chat.model');
const User = require('../users/user.model');
const { authenticate, requireRole } = require('../../middleware/auth');
const { success } = require('../../shared/utils/response');
const AppError = require('../../shared/errors/AppError');

// GET /api/chat/history?with=<userId>
// Obtener historial de conversación entre el usuario actual y otro
router.get('/history', authenticate, async (req, res, next) => {
  try {
    const me = req.user._id;
    const { with: withUser } = req.query;
    if (!withUser) throw new AppError('Parámetro "with" requerido', 400);

    const messages = await Message.find({
      $or: [
        { from: me, to: withUser },
        { from: withUser, to: me },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('from', 'name role')
      .populate('to', 'name role')
      .lean();

    // Marcar como leídos
    await Message.updateMany(
      { from: withUser, to: me, read: false },
      { read: true }
    );

    success(res, { messages });
  } catch (err) { next(err); }
});

// GET /api/chat/conversations
// ADMIN: lista de usuarios que tienen mensajes con el admin
// CLIENT: solo devuelve info del admin
router.get('/conversations', authenticate, async (req, res, next) => {
  try {
    const me = req.user._id;

    if (req.user.role === 'SUPER_ADMIN') {
      // Buscar todos los usuarios únicos que han escrito al admin
      const fromUsers = await Message.distinct('from', { to: me });
      const toUsers = await Message.distinct('to', { from: me });
      const allIds = [...new Set([...fromUsers.map(String), ...toUsers.map(String)])]
        .filter(id => id !== String(me));

      const users = await User.find({ _id: { $in: allIds }, role: 'USER' })
        .select('name email role').lean();

      // Contar no leídos por usuario
      const unreadCounts = await Message.aggregate([
        { $match: { to: me, read: false } },
        { $group: { _id: '$from', count: { $sum: 1 } } },
      ]);
      const unreadMap = {};
      unreadCounts.forEach(u => { unreadMap[u._id.toString()] = u.count; });

      const conversations = users.map(u => ({
        ...u,
        unread: unreadMap[u._id.toString()] || 0,
      }));

      success(res, { conversations });
    } else {
      // CLIENT: devuelve el primer SUPER_ADMIN disponible
      const admin = await User.findOne({ role: 'SUPER_ADMIN' })
        .select('name email role').lean();
      if (!admin) throw new AppError('No hay administrador disponible', 404);

      const unread = await Message.countDocuments({ from: admin._id, to: me, read: false });
      success(res, { conversations: [{ ...admin, unread }] });
    }
  } catch (err) { next(err); }
});

// DELETE /api/chat/history?with=<userId>  (solo ADMIN)
router.delete('/history', authenticate, requireRole('SUPER_ADMIN'), async (req, res, next) => {
  try {
    const me = req.user._id;
    const { with: withUser } = req.query;
    if (!withUser) throw new AppError('Parámetro "with" requerido', 400);
    await Message.deleteMany({
      $or: [{ from: me, to: withUser }, { from: withUser, to: me }],
    });
    success(res, {}, 'Historial eliminado');
  } catch (err) { next(err); }
});

module.exports = router;
