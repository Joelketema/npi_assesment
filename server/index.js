const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const { db, lookups } = require('./db');
const { desc, asc, like, or } = require('drizzle-orm');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiter for search endpoint: 10 requests per minute
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'Too many search requests, please try again after a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const path = require('path');

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
}));
app.use(express.json());

// API Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Search Route with API Integration
app.post('/api/search', searchLimiter, async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const isNpi = /^\d{10}$/.test(query);
    const params = {
      version: '2.1',
    };

    if (isNpi) {
      params.number = query;
    } else {
      // Split name into first and last if possible
      const parts = query.trim().split(/\s+/);
      if (parts.length > 1) {
        params.first_name = parts[0];
        params.last_name = parts.slice(1).join(' ');
      } else {
        params.last_name = query;
      }
    }

    const response = await axios.get('https://npiregistry.cms.hhs.gov/api/', { params });
    
    if (!response.data.results || response.data.results.length === 0) {
      // Still persist the failed lookup? Requirements say "Store every lookup".
      // I'll store it even if results are empty to show the attempt.
      await db.insert(lookups).values({
        query,
        result: JSON.stringify({ error: 'No results found' }),
      });
      return res.status(404).json({ error: 'No providers found' });
    }

    // Save success to DB
    await db.insert(lookups).values({
      query,
      result: JSON.stringify(response.data.results[0]), // Store the top result
    });

    res.json(response.data.results);
  } catch (error) {
    console.error('NPPES API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch provider data' });
  }
});


// History Route
app.get('/api/history', async (req, res) => {
  const { search, sort = 'desc' } = req.query;
  
  try {
    let query = db.select().from(lookups).$dynamic();
    
    // Only apply filter if search is a non-empty string
    if (search && search.trim() !== '') {
      const searchPattern = `%${search}%`;
      query = query.where(
        or(
          like(lookups.query, searchPattern),
          like(lookups.result, searchPattern)
        )
      );
    }

    if (sort === 'asc') {
      query = query.orderBy(asc(lookups.timestamp));
    } else {
      query = query.orderBy(desc(lookups.timestamp));
    }

    const history = await query.limit(50);
    res.json(history);
  } catch (error) {
    console.error('DB Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
