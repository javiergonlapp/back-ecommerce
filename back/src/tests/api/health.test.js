'use strict';
const request = require('supertest');

// We don't connect DB for this test
jest.mock('../../database/connection', () => ({ connectDB: jest.fn() }));

const app = require('../../app');

describe('GET /health', () => {
  test('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
