'use strict';
const { Server } = require('socket.io');
const Message = require('./modules/chat/chat.model');
const User = require('./modules/users/user.model');
const { verifyAccessToken } = require('./shared/utils/jwt');
const logger = require('./shared/logger');

// userId (string) → socketId (string)  — igual que en la hackathon
const onlineUsers = new Map();

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  // ── Middleware: verificar JWT antes de conectar ──────────────────────────
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Token requerido'));
    try {
      const payload = verifyAccessToken(token);
      socket.data.userId = payload.sub;
      socket.data.role   = payload.role;
      next();
    } catch {
      next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId;
    const role   = socket.data.role;

    onlineUsers.set(userId, socket.id);
    User.findByIdAndUpdate(userId, { isOnline: true }).catch(() => {});
    logger.info(`Socket conectado: ${userId} (${role})`);

    // Notificar a todos que hay un usuario conectado
    io.emit('userJoined', userId);

    // ── sendMessage ─────────────────────────────────────────────────────────
    // Regla: solo CLIENT → ADMIN o ADMIN → CLIENT
    socket.on('sendMessage', async (toId, text) => {
      if (!toId || !text?.trim()) return;

      try {
        // Validar que el destino sea válido según el rol
        const recipient = await User.findById(toId).lean();
        if (!recipient) return;

        // Un CLIENT solo puede escribir a un ADMIN
        if (role === 'USER' && recipient.role !== 'SUPER_ADMIN') {
          socket.emit('error', 'Solo puedes chatear con el soporte.');
          return;
        }

        const saved = await Message.create({
          from: userId,
          to: toId,
          text: text.trim(),
        });

        const populated = await Message.findById(saved._id)
          .populate('from', 'name role')
          .populate('to', 'name role')
          .lean();

        // Enviar al remitente
        socket.emit('message', populated);

        // Enviar al destinatario si está conectado
        const toSocketId = onlineUsers.get(toId);
        if (toSocketId) io.to(toSocketId).emit('message', populated);

        // Notificación de nuevo mensaje al admin si es cliente quien escribe
        if (role === 'USER') {
          const adminSocketId = onlineUsers.get(toId);
          if (adminSocketId) {
            io.to(adminSocketId).emit('newMessageNotification', {
              from: userId,
              fromName: populated.from?.name,
              preview: text.trim().substring(0, 60),
            });
          }
        }
      } catch (err) {
        logger.error('Socket sendMessage error:', err);
      }
    });

    // ── editMessage ──────────────────────────────────────────────────────────
    socket.on('editMessage', async (msgId, newText) => {
      if (!msgId || !newText?.trim()) return;
      try {
        const msg = await Message.findById(msgId);
        if (!msg || msg.from.toString() !== userId) return;

        msg.text   = newText.trim();
        msg.edited = true;
        await msg.save();

        const payload = { id: msgId, text: msg.text };
        socket.emit('messageEdited', payload);
        const toSocketId = onlineUsers.get(msg.to.toString());
        if (toSocketId) io.to(toSocketId).emit('messageEdited', payload);
      } catch (err) {
        logger.error('Socket editMessage error:', err);
      }
    });

    // ── deleteMessage ────────────────────────────────────────────────────────
    socket.on('deleteMessage', async (msgId) => {
      try {
        const msg = await Message.findById(msgId);
        if (!msg || msg.from.toString() !== userId) return;

        const toId = msg.to.toString();
        await Message.findByIdAndDelete(msgId);

        socket.emit('messageDeleted', msgId);
        const toSocketId = onlineUsers.get(toId);
        if (toSocketId) io.to(toSocketId).emit('messageDeleted', msgId);
      } catch (err) {
        logger.error('Socket deleteMessage error:', err);
      }
    });

    // ── clearHistory ─────────────────────────────────────────────────────────
    socket.on('clearHistory', async (withUserId) => {
      try {
        await Message.deleteMany({
          $or: [
            { from: userId, to: withUserId },
            { from: withUserId, to: userId },
          ],
        });
        socket.emit('historyCleared', withUserId);
        const toSocketId = onlineUsers.get(withUserId);
        if (toSocketId) io.to(toSocketId).emit('historyCleared', userId);
      } catch (err) {
        logger.error('Socket clearHistory error:', err);
      }
    });

    // ── Notificaciones de sistema (nuevo pedido, cambio estado) ─────────────
    // Se pueden emitir desde otros módulos usando io global (ver exports)

    // ── disconnect ───────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      User.findByIdAndUpdate(userId, { isOnline: false }).catch(() => {});
      io.emit('userLeft', userId);
      logger.info(`Socket desconectado: ${userId}`);
    });
  });

  return io;
};

module.exports = { initSocket, onlineUsers };
