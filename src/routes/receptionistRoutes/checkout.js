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


module.exports = router;
