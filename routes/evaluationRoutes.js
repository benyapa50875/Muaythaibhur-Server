const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const upload = require('../middlewares/evaluationMulter');

// Create a new evaluation entry
router.post('/:lessonId', upload, evaluationController.createEvaluation);

// Get all evaluations
router.get('/', evaluationController.getAllEvaluations);

// Get evaluation by ID
router.get('/:id', evaluationController.getEvaluationById);

router.get('/byuser/:id', evaluationController.getEvaluationUser);

// Update evaluation by ID
router.put('/:id', evaluationController.updateEvaluationById);

// Delete evaluation by ID
router.delete('/:id', evaluationController.deleteEvaluationById);

module.exports = router;
