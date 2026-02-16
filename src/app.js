const express = require('express');
const cors = require('cors');
const dbTestRoutes = require('./routes/dbTest.routes');
const testRoutes = require('./routes/test.routes');
const authRoutes = require('./routes/auth.routes');
const protectedRoutes = require('./routes/protected.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const roomRoutes = require('./routes/room.routes');
const bookingRoutes = require('./routes/booking.routes');
const hotelRoutes = require('./routes/hotel.routes');
const expenseRoutes = require('./routes/expense.routes');
const employeeRoutes = require('./routes/employee.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const managementRoutes = require('./routes/management.routes');


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
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/management', managementRoutes);


module.exports = app;
