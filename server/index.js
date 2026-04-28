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

// Search Route Scaffold
app.post('/api/search', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  // Basic validation: Check if it's likely an NPI (10 digits) or a Name
  const isNpi = /^\d{10}$/.test(query);
  
  res.json({ 
    message: 'Search received', 
    query, 
    type: isNpi ? 'npi' : 'name' 
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
