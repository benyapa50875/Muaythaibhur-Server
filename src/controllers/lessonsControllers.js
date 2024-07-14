const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');

// Create lesson
exports.createLesson = async (req, res) => {
  try {
    const { lesson_name, type_id, excerpt, yt_url, paragraph1, paragraph2, paragraph3 } = req.body;
    const lesson = await prisma.lessons.create({
      data: {
        lesson_name,
        type_id: parseInt(type_id),
        excerpt,
        feature_img: req.files['feature_img'][0].filename, // assuming multer stores file info in req.files
      }
    });
    const lessondetails = await prisma.lesson_detail.create({
      data: {
        lesson_id: parseInt(lesson.id),
        lesson_name,
        yt_url,
        paragraph1,
        paragraph2,
        paragraph3,
      }
    });
    res.status(201).json({ message: 'Lesson Created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Retrieve lesson
exports.getLesson = async (req, res) => {
  try {
    const lesson = await prisma.lessons.findMany({
      include: {
        lesson_detail: true,
        lesson_types: true,
      },
    });
    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Retrieve lesson by ID
exports.getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await prisma.lessons.findUnique({
      where: { id: parseInt(id) },
      include: { lesson_detail: true, lesson_types: true }
    });
    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Update lesson by ID
exports.updateLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const { lesson_name, excerpt, type_id, yt_url, paragraph1, paragraph2, paragraph3 } = req.body;
    const lessonDetailUpdates = {
      lesson_name,
      yt_url,
      paragraph1,
      paragraph2,
      paragraph3
    };

    const feature_img = req.files['feature_img'] && req.files['feature_img'][0] ? req.files['feature_img'][0].filename : null;

    // Fetch current lesson detail to get old feature_img filename
    const currentLessonDetail = await prisma.lessons.findUnique({
      where: { id: parseInt(id) },
      include: { lesson_detail: true }
    });
    if (!currentLessonDetail) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Use old data if new files are not uploaded
    const updatedFeatureImg = feature_img || currentLessonDetail.feature_img;

    // Delete old feature_img if a new one is uploaded

    if (feature_img && currentLessonDetail.feature_img) {
      const oldFeatureImgPath = path.join(__dirname, '../uploads/lessons', currentLessonDetail.feature_img);
      fs.unlink(oldFeatureImgPath, (err) => {
        if (err) console.error('Error deleting feature image:', err);
      });
    }

    // Update lesson
    await prisma.lessons.update({
      where: { id: parseInt(id) },
      data: {
        lesson_name,
        type_id: parseInt(type_id),
        excerpt,
        feature_img: updatedFeatureImg
      }
    });

    // Update lesson detail
    await prisma.lesson_detail.updateMany({
      where: { lesson_id: parseInt(id) },
      data: lessonDetailUpdates,
    });

    res.status(201).json({ message: 'Lesson Updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteLessonById = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete lesson_detail records associated with the lesson
    await prisma.lesson_detail.deleteMany({
      where: { lesson_id: parseInt(id) }
    });

    // Delete the lesson itself
    await prisma.lessons.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Lesson and related details deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.deleteLessonById = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete lesson_detail records associated with the lesson
    await prisma.lesson_detail.deleteMany({
      where: { lesson_id: parseInt(id) }
    });

    const getEvaluation = await prisma.evaluation.findMany({
      where: { lesson_id: parseInt(id) }
    });

    const evaluationFile = getEvaluation.vdo;

    if (evaluationFile) {
      const evaluationPath = path.join(__dirname, '../uploads/evaluation', evaluationFile);
      fs.unlink(evaluationPath, (err) => {
        if (err) console.error('Error deleting old icon 1:', err);
      });
    }

    await prisma.evaluation.deleteMany({
      where: { lesson_id: parseInt(id) }
    });

    // Delete the lesson itself
    await prisma.lessons.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Lesson and related details deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

