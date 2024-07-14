const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllPages = async (req, res) => {
  try {
    const pages = await prisma.pages.findMany();
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
};

exports.getPageById = async (req, res) => {
  const { id } = req.params;
  try {
    const page = await prisma.pages.findUnique({ where: { id: parseInt(id, 10) } });
    if (page) {
      res.json(page);
    } else {
      res.status(404).json({ error: 'Page not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch page' });
  }
};

exports.updatePage = async (req, res) => {
  const { id } = req.params;
  const { page_name } = req.body;
  try {
    const updatedPage = await prisma.pages.update({
      where: { id: parseInt(id, 10) },
      data: { page_name },
    });
    res.json(updatedPage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update page' });
  }
};

