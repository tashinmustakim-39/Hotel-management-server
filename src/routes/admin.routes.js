const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

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

module.exports = router;
