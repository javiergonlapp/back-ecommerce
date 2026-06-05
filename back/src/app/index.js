'use strict';
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const routes = require('../routes');
const { errorHandler } = require('../shared/errors/errorHandler');
const { notFound } = require('../shared/errors/notFound');
const logger = require('../shared/logger');

require('../config/passport');

const app = express();

// ── Seguridad ──────────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ───────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ── Body Parser ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Sessions con MongoDB (cubre competencia del sílabo) ────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'javier_shop_session_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 7 * 24 * 60 * 60, // 7 días
    autoRemove: 'native',
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
  name: 'javier.shop.sid',
}));

// ── HTTP Logger ────────────────────────────────────────────────────────────
app.use(morgan('combined', {
  stream: { write: (msg) => logger.http(msg.trim()) },
  skip: (req) => req.path === '/health',
}));

// ── Rate Limiting ──────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Demasiadas peticiones. Intenta más tarde.' },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: 'Demasiados intentos de autenticación.' },
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ── Passport ──────────────────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

// ── Health ─────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'JAVIER SHOP', timestamp: new Date().toISOString(), version: '2.0.0' });
});

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api', routes);

// ── Error Handling ─────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
