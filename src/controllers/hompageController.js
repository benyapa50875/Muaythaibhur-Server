// controllers/homepageController.js

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

// Get all homepage entries
exports.getAllHomepages = async (req, res) => {
  try {
    const homepages = await prisma.homepage.findMany();
    res.json(homepages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch homepages' });
  }
};
exports.getHomepage = async (req, res) => {
  const dataId = req.params.id
  try {
    const homepages = await prisma.homepage.findMany({
      where: {
        id: parseInt(dataId)
      }
    });
    res.json(homepages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch homepages' });
  }
};

// Update an existing homepage entry
exports.updateHomepage = async (req, res) => {
  const { id } = req.params;
  const {
    header1,
    paragraph1,
    button1_1,
    button1_2,
    header2,
    subheader2,
    list1,
    list1_detail,
    list2,
    list2_detail,
  } = req.body;
  
  const hero_img = req.files['hero_img'] && req.files['hero_img'][0] ? req.files['hero_img'][0].filename : null;
  const icon1 = req.files['icon1'] && req.files['icon1'][0] ? req.files['icon1'][0].filename : null;
  const icon2 = req.files['icon2'] && req.files['icon2'][0] ? req.files['icon2'][0].filename : null;

  try {
    const existingHomepage = await prisma.homepage.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!existingHomepage) {
      return res.status(404).json({ error: 'Homepage not found' });
    }

    const updatedFeatureImg = hero_img || existingHomepage.hero_img;
    const updatedIcon1 = icon1 || existingHomepage.icon1;
    const updatedIcon2 = icon2 || existingHomepage.icon2;

    // Delete old images if new ones are uploaded
    if (hero_img && existingHomepage.hero_img) {
      const oldHeroImgPath = path.join(__dirname, '../uploads/homepage', existingHomepage.hero_img);
      fs.unlink(oldHeroImgPath, (err) => {
        if (err) console.error('Error deleting old hero image:', err);
      });
    }
    if (icon1 && existingHomepage.icon1) {
      const oldIcon1Path = path.join(__dirname, '../uploads/homepage', existingHomepage.icon1);
      fs.unlink(oldIcon1Path, (err) => {
        if (err) console.error('Error deleting old icon 1:', err);
      });
    }
    if (icon2 && existingHomepage.icon2) {
      const oldIcon2Path = path.join(__dirname, '../uploads/homepage', existingHomepage.icon2);
      fs.unlink(oldIcon2Path, (err) => {
        if (err) console.error('Error deleting old icon 2:', err);
      });
    }

    const updatedHomepage = await prisma.homepage.update({
      where: { id: parseInt(id, 10) },
      data: {
        header1,
        paragraph1,
        button1_1,
        button1_2,
        header2,
        subheader2,
        icon1: updatedIcon1,
        icon2: updatedIcon2,
        list1,
        list1_detail,
        list2,
        list2_detail,
        hero_img: updatedFeatureImg,
      },
    });

    res.json(updatedHomepage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update homepage entry' });
  }
};
