const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/db-test', (req, res) => {
  db.query('SELECT 1', (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }

    res.json({
      success: true,
      message: 'Database connected successfully',
      result
    });
  });
});

module.exports = router;
