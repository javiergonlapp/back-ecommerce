'use strict';
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../modules/users/user.model');

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@admin.com' });
  if (existing) {
    console.log('⚠️  Admin already exists, skipping...');
    return existing;
  }
  const admin = await User.create({
    name: 'Super Admin',
    email: process.env.ADMIN_EMAIL || 'admin@admin.com',
    password: process.env.ADMIN_PASSWORD || 'Password123*',
    role: 'SUPER_ADMIN',
    isEmailVerified: true,
    isActive: true,
  });
  console.log(`✅ Admin created: ${admin.email}`);
  return admin;
};

if (require.main === module) {
  seedAdmin().then(() => { mongoose.disconnect(); process.exit(0); }).catch((err) => { console.error(err); process.exit(1); });
}
module.exports = { seedAdmin };
