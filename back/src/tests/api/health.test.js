'use strict';
const request = require('supertest');

jest.mock('../../database/connection', () => ({ connectDB: jest.fn() }));
jest.mock('connect-mongo', () => ({
  create: jest.fn(() => ({
    on: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    destroy: jest.fn(),
  }))
}));

const app = require('../../app');

describe('GET /health', () => {
  test('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});