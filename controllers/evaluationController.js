const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { jwtDecode } = require('jwt-decode'); // Make sure you import jwt-decode correctly

// Function to decode JWT token and extract userId
const getUserIdFromToken = (token) => {
  const decodedToken = jwtDecode(token);
  return decodedToken.userId;
};

// Create a new evaluation entry
exports.createEvaluation = async (req, res) => {
    const { lessonId } = req.params; // Assuming lessonId is passed as a parameter
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  const vdo = req.files['vdo'] && req.files['vdo'][0] ? req.files['vdo'][0].filename : null;
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const userId = getUserIdFromToken(token);

  try {
    const newEvaluation = await prisma.evaluation.create({
      data: {
        lesson_id: parseInt(lessonId), // Ensure lesson_id is an integer
        userId: parseInt(userId), // Ensure userId is an integer
        vdo,
      },
      include: {
        lessons: true, // Include lessons relation
        user: true // Include user relation
      }
    });
    res.json(newEvaluation);
  } catch (error) {
    console.error('Error creating evaluation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all evaluations
exports.getAllEvaluations = async (req, res) => {
  try {
    const evaluations = await prisma.evaluation.findMany({
      include: {
        lessons: true,
        user: true
      }
    });
    res.json(evaluations);
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get evaluation by ID
exports.getEvaluationById = async (req, res) => {
  const { id } = req.params;
  try {
    const evaluation = await prisma.evaluation.findUnique({
      where: { id: parseInt(id) },
      include: {
        lessons: true,
        user: true
      }
    });
    if (!evaluation) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }
    res.json(evaluation);
  } catch (error) {
    console.error('Error fetching evaluation by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.getEvaluationUser = async (req, res) => {
    const { id } = req.params; // Assuming lessonId is passed as a parameter
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const userId = getUserIdFromToken(token);
  try {
    const evaluation = await prisma.evaluation.findMany({
      where: { lesson_id: parseInt(id), userId: parseInt(userId)},
      include: {
        lessons: true,
        user: true
      }
    });
    if (!evaluation) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }
    res.json(evaluation);
  } catch (error) {
    console.error('Error fetching evaluation by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update evaluation by ID
exports.updateEvaluationById = async (req, res) => {
  const { id } = req.params;
  const { suggestion, score } = req.body;

  try {
    const updatedEvaluation = await prisma.evaluation.update({
      where: { id: parseInt(id) },
      data: {
        score: parseInt(score), // Assuming score is optional and an integer
        suggestion
      },
      include: {
        lessons: true,
        user: true
      }
    });
    res.json(updatedEvaluation);
  } catch (error) {
    console.error('Error updating evaluation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete evaluation by ID
exports.deleteEvaluationById = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.evaluation.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Evaluation deleted successfully' });
  } catch (error) {
    console.error('Error deleting evaluation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
