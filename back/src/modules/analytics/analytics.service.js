'use strict';
const Order = require('../orders/order.model');
const User = require('../users/user.model');
const Product = require('../products/product.model');
const AuditLog = require('../audit/auditLog.model');

const getDashboardStats = async () => {
  const [
    totalOrders, totalUsers, totalProducts,
    revenueAgg, recentOrders, topProducts,
    ordersByStatus, salesLast7Days,
  ] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: 'USER' }),
    Product.countDocuments({ isActive: true }),
    Order.aggregate([
      { $match: { status: { $in: ['paid', 'shipped', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.find().sort('-createdAt').limit(5).populate('user', 'name email').lean(),
    Order.aggregate([
      { $match: { status: { $in: ['paid', 'shipped', 'delivered'] } } },
      { $unwind: '$items' },
      { $group: { _id: '$items.product', title: { $first: '$items.title' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }, units: { $sum: '$items.quantity' } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: { status: { $in: ['paid', 'shipped', 'delivered'] }, createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
  ]);

  return {
    totalOrders,
    totalUsers,
    totalProducts,
    totalRevenue: revenueAgg[0]?.total || 0,
    recentOrders,
    topProducts,
    ordersByStatus,
    salesLast7Days,
  };
};

module.exports = { getDashboardStats };
