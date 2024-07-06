const express = require('express');
const router = express.Router();
const lessonsController = require('../controllers/lessonsControllers');
const upload = require('../middlewares/lessonsMulter');

// Create lesson
router.post('/', upload, lessonsController.createLesson);

// Retrieve all lessons
router.get('/', lessonsController.getLesson);

// Retrieve lesson by ID
router.get('/:id', lessonsController.getLessonById);

// Update lesson by ID
router.put('/:id', upload, lessonsController.updateLessonById);

// Delete lesson by ID
router.delete('/:id', lessonsController.deleteLessonById);

module.exports = router;
