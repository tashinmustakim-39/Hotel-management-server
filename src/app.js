const express = require('express');
const cors = require('cors');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test routes
app.get('/', (req, res) => {
  res.json({
    message: 'Hotel Management API is running',
    env: process.env.NODE_ENV
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Test route is working'
  });
});

module.exports = app;
