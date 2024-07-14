const express = require('express');
const router = express.Router();
const {
  createLessonType,
  getAllLessonTypes,
  getLessonTypeById,
  updateLessonType,
  deleteLessonType,
} = require('../controllers/lessonTypesController');

// Routes
router.post('/', createLessonType);       // Create a new lesson type
router.get('/', getAllLessonTypes);       // Retrieve all lesson types
router.get('/:id', getLessonTypeById);   // Retrieve lesson type by ID
router.put('/:id', updateLessonType);    // Update lesson type by ID
router.delete('/:id', deleteLessonType); // Delete lesson type by ID

module.exports = router;
