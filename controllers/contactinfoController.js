const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create contact info
exports.createContactInfo = async (req, res) => {
  const { phone, facebook, instagram, x_twitter } = req.body;
  try {
    const contactInfo = await prisma.contact_info.create({
      data: {
        phone,
        facebook,
        instagram,
        x_twitter,
      },
    });
    res.status(201).json(contactInfo);
  } catch (error) {
    res.status(500).json({ error: 'Error creating contact info' });
  }
};

// Get all contact info
exports.getAllContactInfo = async (req, res) => {
  try {
    const contactInfo = await prisma.contact_info.findMany();
    res.status(200).json(contactInfo);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving contact info' });
  }
};

// Get contact info by ID
exports.getContactInfoById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const contactInfo = await prisma.contact_info.findUnique({
      where: {
        id,
      },
    });
    if (!contactInfo) {
      res.status(404).json({ error: `Contact info with ID ${id} not found` });
    } else {
      res.status(200).json(contactInfo);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving contact info' });
  }
};

// Update contact info
exports.updateContactInfo = async (req, res) => {
  const id = parseInt(req.params.id);
  const { phone, facebook, instagram, x_twitter } = req.body;
  try {
    const updatedContactInfo = await prisma.contact_info.update({
      where: {
        id,
      },
      data: {
        phone,
        facebook,
        instagram,
        x_twitter,
      },
    });
    res.status(200).json(updatedContactInfo);
  } catch (error) {
    res.status(500).json({ error: 'Error updating contact info' });
  }
};

// Delete contact info
exports.deleteContactInfo = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.contact_info.delete({
      where: {
        id,
      },
    });
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: 'Error deleting contact info' });
  }
};
