const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new contact us form entry
exports.createContactUsFormEntry = async (req, res) => {
  const { sender, email, msg } = req.body;

  try {
    const newEntry = await prisma.contact_us_form.create({
      data: {
        sender,
        email,
        msg
      }
    });
    res.json(newEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all contact us form entries
exports.getAllContactUsFormEntries = async (req, res) => {
  try {
    const entries = await prisma.contact_us_form.findMany();
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get contact us form entry by ID
exports.getContactUsFormEntryById = async (req, res) => {
  const { id } = req.params;
  try {
    const entry = await prisma.contact_us_form.findUnique({
      where: { id: parseInt(id) }
    });
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update contact us form entry by ID
exports.updateContactUsFormEntry = async (req, res) => {
  const { id } = req.params;
  const { sender, email, msg } = req.body;

  try {
    const updatedEntry = await prisma.contact_us_form.update({
      where: { id: parseInt(id) },
      data: {
        sender,
        email,
        msg
      }
    });
    res.json(updatedEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete contact us form entry by ID
exports.deleteContactUsFormEntry = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.contact_us_form.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Entry deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
