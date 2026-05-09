process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');

describe('Auth API', () =>
{
   it('should fail login with empty data', async () =>
   {
      const res = await request(app).post('/api/auth/login').send({});
      expect(res.statusCode).toBe(400);
   });
});