const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middleware/auth.middleware');
const adminMiddleware = require('../../middleware/admin.middleware');
const roomController = require('../../controllers/managerControllers/roomsController');

const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

// Get Available Rooms
router.get("/get-available-rooms/:hotelID", roomController.getAvailableRooms);

// Get Room Classes
router.get("/get-room-classes", roomController.getRoomClasses);

// Add New Room
router.post('/add-room', upload.single('roomImage'), roomController.addRoom);

// Update Room
router.put("/update-room/:roomID", upload.single("roomImage"), roomController.updateRoom);

module.exports = router;
