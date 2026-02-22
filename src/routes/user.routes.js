const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const userController = require('../controllers/user.controller');

// Profile
router.get('/me', authMiddleware, userController.getProfile);

// Admin User Management
router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);
router.post('/add-user', authMiddleware, adminMiddleware, userController.createUser);
router.put('/update-user/:id', authMiddleware, adminMiddleware, userController.updateUser);
router.delete('/delete-user/:id', authMiddleware, adminMiddleware, userController.deleteUser);

module.exports = router;
