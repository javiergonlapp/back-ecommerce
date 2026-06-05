'use strict';
const User = require('../users/user.model');
const RefreshToken = require('./refreshToken.model');

const findUserByEmail = (email) => User.findOne({ email }).select('+password');
const findUserById = (id) => User.findById(id);
const createUser = (data) => User.create(data);
const updateUser = (id, data) => User.findByIdAndUpdate(id, data, { new: true });

const findRefreshToken = (token) =>
  RefreshToken.findOne({ token, isRevoked: false }).populate('user');
const revokeRefreshToken = (token) =>
  RefreshToken.findOneAndUpdate({ token }, { isRevoked: true });
const revokeAllUserTokens = (userId) =>
  RefreshToken.updateMany({ user: userId }, { isRevoked: true });

module.exports = {
  findUserByEmail, findUserById, createUser, updateUser,
  findRefreshToken, revokeRefreshToken, revokeAllUserTokens,
};
