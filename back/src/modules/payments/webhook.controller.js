'use strict';
const Order = require('../orders/order.model');
const Payment = require('./payment.model');
const cartSvc = require('../cart/cart.service');
const couponRepo = require('../coupons/coupon.repository');
const logger = require('../../shared/logger');

let stripe = null;
if (process.env.STRIPE_SECRET_KEY) stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const handleWebhook = async (req, res) => {
  if (!stripe) return res.json({ received: true });

  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order && order.status === 'pending') {
          order.status = 'paid';
          order.paymentIntentId = session.payment_intent;
          order.statusHistory.push({ status: 'paid', note: 'Payment confirmed via Stripe webhook' });
          await order.save();
          await Payment.create({
            order: order._id, user: order.user,
            stripePaymentIntentId: session.payment_intent,
            stripeSessionId: session.id,
            amount: session.amount_total / 100,
            status: 'completed',
          });
          await cartSvc.clearCart(order.user);
          logger.info(`Order ${orderId} marked as paid`);
        }
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object;
      const order = await Order.findOne({ paymentIntentId: pi.id });
      if (order) {
        order.status = 'cancelled';
        order.statusHistory.push({ status: 'cancelled', note: 'Payment failed' });
        await order.save();
      }
    }
  } catch (err) {
    logger.error('Webhook handler error:', err);
  }

  res.json({ received: true });
};

module.exports = { handleWebhook };
