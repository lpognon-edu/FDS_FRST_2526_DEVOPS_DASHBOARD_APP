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

  describe('GET /api/incidents', () => {
    it('should return incidents list', async () => {
      const res = await request(app)
        .get('/api/incidents')
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBeDefined();
      expect(Array.isArray(res.body.incidents)).toBe(true);
    });
  });

  describe('POST /api/incidents', () => {
    it('should create incident with valid data', async () => {
      const newIncident = {
        title: 'Test incident',
        description: 'Test description',
        severity: 'Medium'
      };

      const res = await request(app)
        .post('/api/incidents')
        .send(newIncident)
        .expect(201);
      
      expect(res.body.success).toBe(true);
      expect(res.body.incident.title).toBe('Test incident');
    });

    it('should reject incident without title', async () => {
      const res = await request(app)
        .post('/api/incidents')
        .send({ description: 'No title', severity: 'High' })
        .expect(400);
      
      expect(res.body.error).toBe('Validation failed');
    });

    it('should reject incident with invalid severity', async () => {
      const res = await request(app)
        .post('/api/incidents')
        .send({
          title: 'Test',
          description: 'Test',
          severity: 'Invalid'
        })
        .expect(400);
      
      expect(res.body.error).toBe('Validation failed');
    });

    it('should trim whitespace from title', async () => {
      const res = await request(app)
        .post('/api/incidents')
        .send({
          title: '  Trimmed incident  ',
          description: 'Test',
          severity: 'Low'
        })
        .expect(201);
      
      expect(res.body.incident.title).toBe('Trimmed incident');
    });
  });

  describe('GET /api/incidents/:id', () => {
    it('should return 404 for non-existent incident', async () => {
      const res = await request(app)
        .get('/api/incidents/99999')
        .expect(404);
      
      expect(res.body.error).toBe('Not found');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app)
        .get('/unknown-route')
        .expect(404);
      
      expect(res.body.error).toBe('Not Found');
    });
  });
});
