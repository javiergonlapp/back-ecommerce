'use strict';
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Coupon = require('../modules/coupons/coupon.model');

const seedCoupons = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  await Coupon.deleteMany({});
  const coupons = [
    {
      code: 'JAVIER15',
      discountType: 'percentage',
      discountValue: 15,
      description: '15% off on all orders',
      isActive: true,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    },
    {
      code: 'WELCOME10',
      discountType: 'percentage',
      discountValue: 10,
      description: 'Welcome discount 10%',
      isActive: true,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
    {
      code: 'SAVE20',
      discountType: 'fixed',
      discountValue: 20,
      description: '$20 off on orders over $100',
      minOrderAmount: 100,
      isActive: true,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  ];
  const created = await Coupon.insertMany(coupons);
  console.log(`✅ Seeded ${created.length} coupons (including JAVIER15)`);
  return created;
};

if (require.main === module) {
  seedCoupons().then(() => { mongoose.disconnect(); process.exit(0); }).catch((err) => { console.error(err); process.exit(1); });
}
module.exports = { seedCoupons };
