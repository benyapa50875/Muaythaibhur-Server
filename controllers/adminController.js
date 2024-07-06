// controllers/AdminController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

module.exports = {
  async createAdmin(req, res) {
    try {
      const { email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await prisma.admin.create({
        data: {
          email,
          password: hashedPassword,
        }
      });
      res.json(admin);
    } catch (error) {
      console.error('Error creating admin:', error);
      res.status(500).json({ error: 'Error creating admin' });
    }
  },

  async getAdmins(req, res) {
    try {
      const admins = await prisma.admin.findMany();
      res.json(admins);
    } catch (error) {
      console.error('Error getting admins:', error);
      res.status(500).json({ error: 'Error getting admins' });
    }
  },


  async deleteAdmin(req, res) {
    try {
      const adminId = parseInt(req.params.id);
      await prisma.admin.delete({
        where: {
          id: adminId,
        },
      });
      res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
      console.error('Error deleting admin:', error);
      res.status(500).json({ error: 'Error deleting admin' });
    }
  },
};
