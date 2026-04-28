const request = require('supertest');
const nock = require('nock');
const app = require('./index');

describe('API Endpoints', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('GET /health', () => {
    it('should return 200 and healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'ok');
    });
  });

  describe('POST /api/search', () => {
    it('should return 400 if query is missing', async () => {
      const res = await request(app).post('/api/search').send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Search query is required');
    });

    it('should return provider data for a valid NPI', async () => {
      const mockResult = [{ number: '1234567890', basic: { name: 'Test Provider' } }];
      
      nock('https://npiregistry.cms.hhs.gov')
        .get('/api/')
        .query(true) // match any query params
        .reply(200, { results: mockResult });

      const res = await request(app)
        .post('/api/search')
        .send({ query: '1234567890' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockResult);
    });

    it('should return 404 if no providers are found', async () => {
      nock('https://npiregistry.cms.hhs.gov')
        .get('/api/')
        .query(true)
        .reply(200, { results: [] });

      const res = await request(app)
        .post('/api/search')
        .send({ query: 'Unknown' });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', 'No providers found');
    });
  });
});
