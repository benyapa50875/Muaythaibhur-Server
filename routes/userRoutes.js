const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/avatarMulter');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', userController.getAllUsers);
router.get('/me', authenticateToken, userController.getUserById);
router.post('/', upload, userController.createUser);
router.put('/me', authenticateToken, upload, userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
