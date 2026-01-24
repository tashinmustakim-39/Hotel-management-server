const express = require('express');
const cors = require('cors');
const dbTestRoutes = require('./routes/dbTest.routes');
const testRoutes = require('./routes/test.routes');


const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hotel Management API is running'
  });
});

// use routes
app.use('/api', testRoutes);
app.use('/api', dbTestRoutes);

module.exports = app;
