'use strict';
const dotenv = require('dotenv');
dotenv.config();

const http = require('http');
const app = require('./app');
const { connectDB } = require('./database/connection');
const { initSocket } = require('./socket');
const logger = require('./shared/logger');

const PORT = process.env.PORT || 3000;

// Crear httpServer — necesario para Socket.io (igual que en la hackathon)
const httpServer = http.createServer(app);

// Inicializar Socket.io sobre el mismo servidor HTTP
const io = initSocket(httpServer);

// Exportar io para usarlo en otros módulos (notificaciones de pedidos, etc.)
module.exports.io = io;

async function bootstrap() {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      logger.info(`🚀 JAVIER SHOP Backend corriendo en puerto ${PORT}`);
      logger.info(`   ENV: ${process.env.NODE_ENV}`);
      logger.info(`   Cliente: ${process.env.CLIENT_URL}`);
      logger.info(`   Socket.io: activo`);
    });
  } catch (err) {
    logger.error('Error al iniciar el servidor:', err);
    process.exit(1);
  }
}

bootstrap();
