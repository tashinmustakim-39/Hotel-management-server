const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const roomController = require('../controllers/room.controller');

// Admin-only: create room
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  roomController.createRoom
);

// Public: list rooms
router.get('/', roomController.getAllRooms);

module.exports = router;
