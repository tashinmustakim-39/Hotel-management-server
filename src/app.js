const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
// Routes
const dbTestRoutes = require('./routes/dbTest.routes');
const testRoutes = require('./routes/test.routes');
const authRoutes = require('./routes/auth.routes');
const protectedRoutes = require('./routes/protected.routes');
const userRoutes = require('./routes/user.routes');

// Admin Routes
const adminRoutes = require('./routes/adminRoutes/adminHotelRoutes');
const hotelRoutes = require('./routes/adminRoutes/hotel.routes');
const expenseRoutes = require('./routes/adminRoutes/expenseRoutes');
const dashboardRoutes = require('./routes/adminRoutes/dashboard.routes');

// Manager Routes
const roomRoutes = require('./routes/managerRoutes/roomsRoute');
const employeeRoutes = require('./routes/managerRoutes/employeeRoute');
const inventoryRoutes = require('./routes/managerRoutes/inventoryRoutes');
const managementRoutes = require('./routes/managerRoutes/ManExpensesRoute');

// Receptionist Routes
const bookingRoutes = require('./routes/receptionistRoutes/checkout');
const guestRoutes = require('./routes/receptionistRoutes/realCheckoutRoute');
const receptionistGuestRoutes = require('./routes/receptionistRoutes/guests');

const app = express();

app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.JWT_SECRET || 'hotel_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

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

// Admin
app.use('/api', adminRoutes); // Kept as /api because admin.routes likely has /admin prefix
app.use('/api/hotels', hotelRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);

// Manager
app.use('/api/rooms', roomRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/manager/expenses', managementRoutes);

// Receptionist
app.use('/api/bookings', bookingRoutes);
app.use('/api/guests-checkout', guestRoutes); // Renamed to avoid conflict if needed, or keep as is if different intent
app.use('/api/guests', receptionistGuestRoutes);


module.exports = app;
