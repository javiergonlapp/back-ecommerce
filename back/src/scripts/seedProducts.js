'use strict';
const mongoose = require('mongoose');
const https = require('https');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('../modules/products/product.model');
const Category = require('../modules/categories/category.model');

const fetchJSON = (url) =>
  new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

const slugMap = {
  smartphones: 'smartphones', laptops: 'laptops', fragrances: 'fragrances',
  skincare: 'skincare', groceries: 'groceries', 'home-decoration': 'home-decoration',
  furniture: 'furniture', tops: 'tops', 'womens-dresses': 'womens-dresses',
  'womens-shoes': 'womens-shoes', 'mens-shirts': 'mens-shirts', 'mens-shoes': 'mens-shoes',
  'mens-watches': 'mens-watches', 'womens-watches': 'womens-watches', 'womens-bags': 'womens-bags',
  'womens-jewellery': 'womens-jewellery', sunglasses: 'sunglasses', automotive: 'automotive',
  motorcycle: 'motorcycle', lighting: 'lighting',
};

const seedProducts = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  }

  const existing = await Product.countDocuments();
  if (existing > 0) {
    console.log(`⚠️  Products already seeded (${existing} found), skipping...`);
    return;
  }

  const categories = await Category.find().lean();
  if (!categories.length) throw new Error('Run seedCategories first!');
  const catMap = {};
  categories.forEach((c) => (catMap[c.slug] = c._id));

  const data = await fetchJSON('https://dummyjson.com/products?limit=100&skip=0');
  const dummyProducts = data.products;
  console.log(`Fetched ${dummyProducts.length} products from DummyJSON`);

  const fallbackCatId = categories[0]._id;
  const products = dummyProducts.map((p) => ({
    title: p.title,
    description: p.description,
    price: p.price,
    originalPrice: p.price + (p.price * (p.discountPercentage || 0)) / 100,
    stock: p.stock,
    category: catMap[slugMap[p.category] || p.category] || fallbackCatId,
    images: p.images || [],
    thumbnail: p.thumbnail,
    brand: p.brand || '',
    sku: `SKU-${p.id}`,
    rating: p.rating || 0,
    reviewCount: p.reviews?.length || 0,
    isActive: true,
    tags: p.tags || [],
    externalId: p.id,
  }));

  const created = await Product.insertMany(products);
  console.log(`✅ Seeded ${created.length} products`);
  return created;
};

if (require.main === module) {
  seedProducts().then(() => { mongoose.disconnect(); process.exit(0); }).catch((err) => { console.error(err); process.exit(1); });
}
module.exports = { seedProducts };
