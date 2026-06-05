'use strict';
const Coupon = require('../../modules/coupons/coupon.model');

describe('Coupon model - isValid()', () => {
  const makeCoupon = (overrides = {}) => {
    const c = new Coupon({
      code: 'TEST10',
      discountType: 'percentage',
      discountValue: 10,
      isActive: true,
      ...overrides,
    });
    return c;
  };

  test('valid active coupon returns true', () => {
    const c = makeCoupon();
    expect(c.isValid()).toBe(true);
  });

  test('inactive coupon returns false', () => {
    const c = makeCoupon({ isActive: false });
    expect(c.isValid()).toBe(false);
  });

  test('expired coupon returns false', () => {
    const c = makeCoupon({ expiresAt: new Date('2020-01-01') });
    expect(c.isValid()).toBe(false);
  });

  test('maxUses reached returns false', () => {
    const c = makeCoupon({ maxUses: 5, usedCount: 5 });
    expect(c.isValid()).toBe(false);
  });
});
