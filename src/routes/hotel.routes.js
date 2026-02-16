const express = require('express');
const router = express.Router();
const multer = require('multer');
const hotelController = require('../controllers/hotel.controller');

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Get all hotels
router.get('/get-hotels', hotelController.getHotels);

// Add a new hotel
router.post('/add-hotel', upload.single('hotelImage'), hotelController.addHotel);

// Update a hotel
router.put('/update-hotel/:id', upload.single('hotelImage'), hotelController.updateHotel);

// Deactivate a hotel
router.put('/deactivate-hotel/:id', hotelController.deactivateHotel);

module.exports = router;
