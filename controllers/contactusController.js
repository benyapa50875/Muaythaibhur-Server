const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs').promises;

// Get all contact us entries
exports.getAllContactUsEntries = async (req, res) => {
  try {
    const contactUsEntries = await prisma.contact_us.findMany();
    res.json(contactUsEntries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update contact us entry by ID
exports.updateContactUsEntry = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch current contact us entry to get old img filename
    const currentEntry = await prisma.contact_us.findUnique({
      where: { id: parseInt(id) }
    });

    // Update contact us entry
    const updatedEntry = await prisma.contact_us.update({
      where: { id: parseInt(id) },
      data: {
        img: req.files['img'][0].filename // Assuming multer stores file info in req.files
      }
    });

    // Unlink (delete) old img file if it exists
    if (currentEntry.img) {
      const oldImagePath = path.join(__dirname, '../uploads/contact_us', currentEntry.img);
      await fs.unlink(oldImagePath);
    }

    res.json(updatedEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
