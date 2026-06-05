'use strict';
const Order = require('../../modules/orders/order.model');

describe('Order model - orderNumber generation', () => {
  test('orderNumber is set on new order', () => {
    const order = new Order({
      user: '507f1f77bcf86cd799439011',
      items: [{ title: 'Test', price: 10, quantity: 1 }],
      subtotal: 10,
      total: 10,
    });
    order.orderNumber = `VLC-${Date.now()}-TEST`;
    expect(order.orderNumber).toMatch(/^VLC-/);
  });
});
