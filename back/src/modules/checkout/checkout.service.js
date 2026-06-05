'use strict';
const getIO = () => { try { return require('../../server').io; } catch { return null; } };
const AppError = require('../../shared/errors/AppError');
const cartSvc = require('../cart/cart.service');
const Order = require('../orders/order.model');
const Payment = require('../payments/payment.model');
const couponRepo = require('../coupons/coupon.repository');

let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

const createCheckoutSession = async (userId, { shippingAddress } = {}) => {
  const cart = await cartSvc.getCart(userId);
  if (!cart || !cart.items || cart.items.length === 0) {
    throw new AppError('Cart is empty', 400, 'CART_EMPTY');
  }

  const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = cart.discount || 0;
  const total = Math.max(0, subtotal - discount);

  const orderItems = cart.items.map((i) => ({
    product: i.product._id,
    title: i.product.title,
    price: i.price,
    quantity: i.quantity,
    thumbnail: i.product.thumbnail,
  }));

  // Create pending order
  const order = await Order.create({
    user: userId,
    items: orderItems,
    subtotal,
    discount,
    total,
    couponCode: cart.couponCode || null,
    shippingAddress: shippingAddress || {},
    status: 'pending',
  });

  if (!stripe) {
    // Mock mode
    order.status = 'paid';
    await order.save();
    await Payment.create({
      order: order._id, user: userId, amount: total, status: 'completed',
      stripePaymentIntentId: `mock_${Date.now()}`,
    });
    await cartSvc.clearCart(userId);
    if (cart.coupon) await couponRepo.incrementUsage(cart.coupon._id || cart.coupon);
    const io = getIO();
    if (io) io.emit('newOrder', { orderId: order._id, userId, total, status: 'paid' });
    return {
      url: `${process.env.CLIENT_URL}/checkout/success?orderId=${order._id}&mock=true`,
      orderId: order._id,
      warning: 'Running in mock mode - configure STRIPE_SECRET_KEY',
    };
  }

  const lineItems = cart.items.map((i) => ({
    price_data: {
      currency: 'usd',
      product_data: { name: i.product.title, images: i.product.thumbnail ? [i.product.thumbnail] : [] },
      unit_amount: Math.round(i.price * 100),
    },
    quantity: i.quantity,
  }));

  // Apply coupon as discount
  const sessionParams = {
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&orderId=${order._id}`,
    cancel_url: `${process.env.CLIENT_URL}/checkout/cancel?orderId=${order._id}`,
    metadata: { orderId: order._id.toString(), userId: userId.toString() },
  };

  if (discount > 0) {
    const couponObj = await stripe.coupons.create({
      amount_off: Math.round(discount * 100),
      currency: 'usd',
      duration: 'once',
    });
    sessionParams.discounts = [{ coupon: couponObj.id }];
  }

  const session = await stripe.checkout.sessions.create(sessionParams);
  order.stripeSessionId = session.id;
  await order.save();

  return { url: session.url, orderId: order._id, sessionId: session.id };
};

module.exports = { createCheckoutSession };
