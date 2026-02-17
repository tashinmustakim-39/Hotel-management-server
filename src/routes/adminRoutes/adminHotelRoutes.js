const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middleware/auth.middleware');
const adminMiddleware = require('../../middleware/admin.middleware');
const bookingController = require('../../controllers/receptionistControllers/checkout');
const roomController = require('../../controllers/managerControllers/roomsController');


router.get(
  '/admin-test',
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.json({
      success: true,
      message: 'Welcome Admin',
      user: req.user
    });
  }
);

router.get(
  '/',
  authMiddleware,
  adminMiddleware,
  bookingController.getAllBookings
);

router.post(
  '/rooms/:id/occupy',
  authMiddleware,
  adminMiddleware,
  roomController.markRoomOccupied
);


module.exports = router;
