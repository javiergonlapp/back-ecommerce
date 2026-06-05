'use strict';
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const { seedCategories } = require('./seedCategories');
const { seedCoupons } = require('./seedCoupons');
const { seedAdmin } = require('./seedAdmin');
const { seedUser } = require('./seedUser');
const { seedProducts } = require('./seedProducts');

async function runAll() {
  console.log('🌱 Starting full seed...\n');
  try {
    // Connect once — individual scripts also connect but won't fail if already connected
    await mongoose.connect(process.env.MONGODB_URI);
    await seedCategories();
    await seedProducts();
    await seedCoupons();
    await seedAdmin();
    await seedUser();
    console.log('\n✅ All seeds completed successfully!');
    console.log(`   Admin: ${process.env.ADMIN_EMAIL} / ${process.env.ADMIN_PASSWORD}`);
    console.log(`   User:  ${process.env.TEST_USER_EMAIL} / ${process.env.TEST_USER_PASSWORD}`);
    console.log('   Coupon: JAVIER15 (15% off)');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runAll();