const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Search Route with API Integration
app.post('/api/search', async (req, res) => {
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
      return res.status(404).json({ error: 'No providers found' });
    }

    res.json(response.data.results);
  } catch (error) {
    console.error('NPPES API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch provider data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
