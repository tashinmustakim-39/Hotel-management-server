const express = require('express');
const cors = require('cors');
const dbTestRoutes = require('./routes/dbTest.routes');
const testRoutes = require('./routes/test.routes');
const authRoutes = require('./routes/auth.routes');
const protectedRoutes = require('./routes/protected.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');


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
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/users', userRoutes);
app.use('/api', adminRoutes);


module.exports = app;
