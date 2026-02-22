const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/auth.middleware');
const guestController = require('../../controllers/receptionistControllers/guestController');

// All routes protected by authMiddleware (and ideally role checks in future)
router.get('/', authMiddleware, guestController.getAllGuests);
router.get('/:id', authMiddleware, guestController.getGuestDetails);
router.put('/:id', authMiddleware, guestController.updateGuestProfile);

module.exports = router;
