'use strict';
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../modules/users/user.model');

const seedUser = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }

  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error('TEST_USER_EMAIL y TEST_USER_PASSWORD deben estar definidos en .env');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('⚠️  Test user already exists, skipping...');
    return existing;
  }

  const user = await User.create({
    name: 'Test User',
    email,
    password,
    role: 'USER',
    isEmailVerified: true,
    isActive: true,
  });

  console.log(`✅ Test user created: ${user.email}`);
  return user;
};

if (require.main === module) {
  seedUser()
    .then(() => { mongoose.disconnect(); process.exit(0); })
    .catch((err) => { console.error(err); process.exit(1); });
}

module.exports = { seedUser };