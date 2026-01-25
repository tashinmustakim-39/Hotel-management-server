const db = require('../config/db');

exports.getProfile = (req, res) => {
  const userId = req.user.id;

  db.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        user: result[0]
      });
    }
  );
};
