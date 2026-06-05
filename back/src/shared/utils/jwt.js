'use strict';
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const RefreshToken = require('../../modules/auth/refreshToken.model');

const generateAccessToken = (userId, role) => {
  return jwt.sign({ sub: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
};

const generateRefreshToken = async (userId, ip, userAgent) => {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await RefreshToken.create({ user: userId, token, expiresAt, ip, userAgent });
  return token;
};

const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { generateAccessToken, generateRefreshToken, verifyAccessToken };
