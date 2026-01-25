const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'You are authenticated',
    user: req.user
  });
});

module.exports = router;
