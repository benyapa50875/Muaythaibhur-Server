// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const authenticateToken = require('../middlewares/authMiddleware');

// Create admin
router.post('/', authenticateToken, AdminController.createAdmin);

// Get all admins
router.get('/', authenticateToken, AdminController.getAdmins);

// Delete admin by ID
router.delete('/:id', authenticateToken, AdminController.deleteAdmin);

module.exports = router;
