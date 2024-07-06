const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a lesson type
exports.createLessonType = async (req, res) => {
  const { type_name } = req.body;
  try {
    const lessonType = await prisma.lesson_types.create({
      data: {
        type_name,
      },
    });
    res.status(201).json(lessonType);
  } catch (error) {
    res.status(500).json({ error: 'Error creating lesson type' });
  }
};

// Get all lesson types
exports.getAllLessonTypes = async (req, res) => {
  try {
    const lessonTypes = await prisma.lesson_types.findMany({
      include: {
        lessons: true,
      },
    });
    res.status(200).json(lessonTypes);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving lesson types' });
  }
};

// Get lesson type by ID
exports.getLessonTypeById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const lessonType = await prisma.lesson_types.findUnique({
      where: {
        id,
      },
      include: {
        lessons: true,
      },
    });
    if (!lessonType) {
      res.status(404).json({ error: `Lesson type with ID ${id} not found` });
    } else {
      res.status(200).json(lessonType);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving lesson type' });
  }
};

// Update lesson type
exports.updateLessonType = async (req, res) => {
  const id = parseInt(req.params.id);
  const { type_name } = req.body;
  try {
    const updatedLessonType = await prisma.lesson_types.update({
      where: {
        id,
      },
      data: {
        type_name,
      },
    });
    res.status(200).json(updatedLessonType);
  } catch (error) {
    res.status(500).json({ error: 'Error updating lesson type' });
  }
};

// Delete lesson type
exports.deleteLessonType = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.lesson_types.delete({
      where: {
        id,
      },
    });
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: 'Error deleting lesson type' });
  }
};
