const upload = require('../middlewares/avatarMulter');
const express = require('express');
const {
  register,
  login,
  verifyEmail,
  changePassword,
  forgot,
  admin
} = require('../controllers/authController');
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/register', upload, register);
router.post('/admin/login', admin);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.put('/change_password', authenticateToken, changePassword);
router.put('/forgot_password', forgot);

module.exports = router;
