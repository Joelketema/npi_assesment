const request = require('supertest');
const nock = require('nock');
const axios = require('axios');
const { db } = require('./db');
const app = require('./index');

// Mock the database
jest.mock('./db', () => ({
  db: {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockResolvedValue(true),
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    $dynamic: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue([]),
  },
  lookups: {
    query: 'query',
    result: 'result',
    timestamp: 'timestamp'
  }
}));

describe('API Endpoints & Persistence', () => {
  afterEach(() => {
    nock.cleanAll();
    jest.clearAllMocks();
  });

  describe('POST /api/search with Persistence', () => {
    it('should save search results to the database', async () => {
      const mockResult = [{ number: '1234567890', basic: { name: 'Test Provider' } }];
      
      nock('https://npiregistry.cms.hhs.gov')
        .get('/api/')
        .query(true)
        .reply(200, { results: mockResult });

      const res = await request(app)
        .post('/api/search')
        .send({ query: '1234567890' });

      expect(res.statusCode).toEqual(200);
      
      // Verify persistence call
      expect(db.insert).toHaveBeenCalled();
      expect(db.values).toHaveBeenCalledWith(
        expect.objectContaining({
          query: '1234567890',
          result: JSON.stringify(mockResult[0])
        })
      );
    });
  });

  describe('GET /api/history', () => {
    it('should fetch history from the database', async () => {
      const mockHistory = [
        { id: 1, query: '1234567890', result: '{}', timestamp: new Date() }
      ];
      db.limit.mockResolvedValue(mockHistory);

      const res = await request(app).get('/api/history');

      expect(res.statusCode).toEqual(200);
      expect(db.select).toHaveBeenCalled();
      expect(res.body).toHaveLength(1);
      expect(res.body[0].query).toBe('1234567890');
    });

    it('should filter history when search query is provided', async () => {
      await request(app).get('/api/history').query({ search: 'John' });
      
      expect(db.where).toHaveBeenCalled();
    });
  });
});
