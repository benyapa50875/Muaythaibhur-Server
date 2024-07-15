const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

exports.getWebInfo = async (req, res) => {
  try {
    const webInfo = await prisma.web_info.findMany();
    res.json(webInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve web info' });
  }
};

exports.updateWebInfo = async (req, res) => {
  const { web_name, meta_description } = req.body;
  const feature_img = req.files['feature_img'] && req.files['feature_img'][0] ? req.files['feature_img'][0].filename : null;
  const favicon = req.files['favicon'] && req.files['favicon'][0] ? req.files['favicon'][0].filename : null;

  try {
    const existingWebInfo = await prisma.web_info.findFirst();

    if (!existingWebInfo) {
      return res.status(404).json({ error: 'Web info not found' });
    }

    // Use old data if new files are not uploaded
    const updatedFeatureImg = feature_img || existingWebInfo.feature_img;
    const updatedFavicon = favicon || existingWebInfo.favicon;

    // Delete old files if new ones are uploaded
    if (feature_img && existingWebInfo.feature_img) {
      const oldFeatureImgPath = path.join(__dirname, '../uploads/web_info', existingWebInfo.feature_img);
      fs.unlink(oldFeatureImgPath, (err) => {
        if (err) console.error('Error deleting old feature image:', err);
      });
    }

    if (favicon && existingWebInfo.favicon) {
      const oldFaviconPath = path.join(__dirname, '../uploads/web_info', existingWebInfo.favicon);
      fs.unlink(oldFaviconPath, (err) => {
        if (err) console.error('Error deleting old favicon:', err);
      });
    }

    const updatedWebInfo = await prisma.web_info.update({
      where: { id: existingWebInfo.id },
      data: {
        web_name,
        meta_description,
        feature_img: updatedFeatureImg,
        favicon: updatedFavicon,
      },
    });

    res.json(updatedWebInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update web info' });
  }
};

