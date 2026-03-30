const request = require('supertest');
const app = require('../src/server');

describe('DevOps Dashboard API', () => {
  
  describe('GET /health', () => {
    it('should return 200 with healthy status', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);
      
      expect(res.body.status).toBe('healthy');
      expect(res.body.timestamp).toBeDefined();
      expect(res.body.uptime).toBeDefined();
    });
  });

  describe('GET /api', () => {
    it('should return API information', async () => {
      const res = await request(app)
        .get('/api')
        .expect(200);
      
      expect(res.body.name).toBe('DevOps Dashboard API');
      expect(res.body.endpoints).toBeDefined();
    });
  });
});
