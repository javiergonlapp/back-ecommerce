'use strict';
const authService = require('./auth.service');
const { success } = require('../../shared/utils/response');

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    success(res, { user }, 'Account created successfully', 201);
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const ip = req.ip;
    const ua = req.get('user-agent');
    const result = await authService.login(req.body, ip, ua);
    success(res, result, 'Login successful');
  } catch (err) { next(err); }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(new (require('../../shared/errors/AppError'))('Refresh token required', 400));
    const tokens = await authService.refresh(refreshToken);
    success(res, tokens, 'Token refreshed');
  } catch (err) { next(err); }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken, req.user._id, req);
    success(res, {}, 'Logged out successfully');
  } catch (err) { next(err); }
};

const me = async (req, res, next) => {
  try {
    success(res, { user: req.user.toPublicJSON() }, 'User profile');
  } catch (err) { next(err); }
};

const googleCallback = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await authService.googleCallback(req.user, req.ip, req.get('user-agent'));
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/auth/oauth-callback?token=${accessToken}&refresh=${refreshToken}`);
  } catch (err) { next(err); }
};

module.exports = { register, login, refresh, logout, me, googleCallback };
