const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middleware/auth.middleware');
const bookingController = require('../../controllers/receptionistControllers/checkout');

// Book a room (logged-in users)
router.post('/', authMiddleware, bookingController.createBooking);

// Get logged-in user's bookings
router.get('/me', authMiddleware, bookingController.getMyBookings);

router.post(
  '/:id/cancel',
  authMiddleware,
  bookingController.cancelBooking
);

router.post('/check-availability', authMiddleware, bookingController.checkAvailability);


// Get all bookings (for Receptionist/Manager to manage)
router.get('/all', authMiddleware, bookingController.getAllBookings);

module.exports = router;
