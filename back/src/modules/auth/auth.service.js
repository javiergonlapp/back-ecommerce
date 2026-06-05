'use strict';
const crypto = require('crypto');
const AppError = require('../../shared/errors/AppError');
const { generateAccessToken, generateRefreshToken } = require('../../shared/utils/jwt');
const { createAuditLog } = require('../../shared/helpers/audit');
const { AUDIT_ACTIONS } = require('../../constants');
const repo = require('./auth.repository');

const register = async ({ name, email, password }) => {
  const exists = await repo.findUserByEmail(email);
  if (exists) throw new AppError('Email already registered', 409, 'DUPLICATE_FIELD');
  const user = await repo.createUser({ name, email, password, role: 'USER' });
  return user.toPublicJSON();
};

const login = async ({ email, password }, ip, userAgent) => {
  const user = await repo.findUserByEmail(email);
  if (!user || !user.password) throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  if (!user.isActive) throw new AppError('Account disabled', 403, 'ACCOUNT_DISABLED');

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = await generateRefreshToken(user._id, ip, userAgent);

  await createAuditLog({ userId: user._id, action: AUDIT_ACTIONS.LOGIN, entity: 'User', entityId: user._id });

  return { accessToken, refreshToken, user: user.toPublicJSON() };
};

const refresh = async (token) => {
  const stored = await repo.findRefreshToken(token);
  if (!stored || new Date() > stored.expiresAt)
    throw new AppError('Invalid or expired refresh token', 401, 'INVALID_TOKEN');
  await repo.revokeRefreshToken(token);
  const accessToken = generateAccessToken(stored.user._id, stored.user.role);
  const newRefreshToken = await generateRefreshToken(stored.user._id);
  return { accessToken, refreshToken: newRefreshToken };
};

const logout = async (token, userId, req) => {
  await repo.revokeRefreshToken(token);
  await createAuditLog({ userId, action: AUDIT_ACTIONS.LOGOUT, entity: 'User', entityId: userId, req });
};

const googleCallback = async (user, ip, userAgent) => {
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = await generateRefreshToken(user._id, ip, userAgent);
  return { accessToken, refreshToken, user: user.toPublicJSON() };
};

module.exports = { register, login, refresh, logout, googleCallback };
