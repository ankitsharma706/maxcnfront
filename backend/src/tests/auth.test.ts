import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { User } from '../models/User';

// Mock the database connection for testing
beforeAll(async () => {
  // Use in-memory MongoDB URI for testing or skip DB-dependent tests
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/commodity-greeks-test';
  try {
    await mongoose.connect(mongoUri);
  } catch {
    console.warn('MongoDB not available for testing, skipping DB-dependent tests');
  }
});

afterAll(async () => {
  // Clean up test data
  if (mongoose.connection.readyState === 1) {
    await User.deleteMany({ email: /test@/i });
    await mongoose.connection.close();
  }
});

describe('Auth API', () => {
  const testUser = {
    name: 'Test User',
    email: `test_${Date.now()}@example.com`,
    password: 'TestPassword123',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      // Password should not be in response
      expect(res.body.data.user.password).toBeUndefined();
    });

    it('should reject duplicate email', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test',
          email: 'invalid-email',
          password: 'TestPassword123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test',
          email: 'new@example.com',
          password: '123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject missing name', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test2@example.com',
          password: 'TestPassword123',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
    });

    it('should reject invalid password', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject non-existent email', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'SomePassword123',
        });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh tokens', async () => {
      if (mongoose.connection.readyState !== 1) return;

      // First login to get tokens
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      const refreshToken = loginRes.body.data.refreshToken;

      const res = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
    });

    it('should reject missing refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({});

      expect(res.status).toBe(400);
    });
  });
});

describe('Health Check', () => {
  it('GET /api/health should return 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('running');
  });
});

describe('404 Handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
