'use strict';
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Category = require('../modules/categories/category.model');

const categories = [
  { name: 'Smartphones', slug: 'smartphones', description: 'Mobile phones and accessories' },
  { name: 'Laptops', slug: 'laptops', description: 'Portable computers' },
  { name: 'Fragrances', slug: 'fragrances', description: 'Perfumes and colognes' },
  { name: 'Skincare', slug: 'skincare', description: 'Skin care products' },
  { name: 'Groceries', slug: 'groceries', description: 'Food and beverages' },
  { name: 'Home Decoration', slug: 'home-decoration', description: 'Home decor items' },
  { name: 'Furniture', slug: 'furniture', description: 'Home and office furniture' },
  { name: 'Tops', slug: 'tops', description: 'T-shirts and tops' },
  { name: 'Womens Dresses', slug: 'womens-dresses', description: 'Dresses for women' },
  { name: 'Womens Shoes', slug: 'womens-shoes', description: 'Footwear for women' },
  { name: 'Mens Shirts', slug: 'mens-shirts', description: 'Shirts for men' },
  { name: 'Mens Shoes', slug: 'mens-shoes', description: 'Footwear for men' },
  { name: 'Mens Watches', slug: 'mens-watches', description: 'Watches for men' },
  { name: 'Womens Watches', slug: 'womens-watches', description: 'Watches for women' },
  { name: 'Womens Bags', slug: 'womens-bags', description: 'Bags for women' },
  { name: 'Womens Jewellery', slug: 'womens-jewellery', description: 'Jewellery for women' },
  { name: 'Sunglasses', slug: 'sunglasses', description: 'Sunglasses for all' },
  { name: 'Automotive', slug: 'automotive', description: 'Car accessories' },
  { name: 'Motorcycle', slug: 'motorcycle', description: 'Motorcycle accessories' },
  { name: 'Lighting', slug: 'lighting', description: 'Light fixtures' },
];

const seedCategories = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  await Category.deleteMany({});
  const created = await Category.insertMany(categories);
  console.log(`✅ Seeded ${created.length} categories`);
  return created;
};

if (require.main === module) {
  seedCategories().then(() => { mongoose.disconnect(); process.exit(0); }).catch((err) => { console.error(err); process.exit(1); });
}

module.exports = { seedCategories };
