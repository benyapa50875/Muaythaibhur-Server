const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');
const { jwtDecode } = require('jwt-decode')
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    // Get the token from the request header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    // Decode the token payload (without verifying the signature)
    const decodedToken = jwtDecode(token);

    const userId = decodedToken.userId; // Assuming your token payload has an 'id' field

    // Fetch user data using the decoded user ID
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

exports.createUser = async (req, res) => {
  const { email, password, firstname, lastname, isVerify } = req.body;
  const avatar = req.files["avatar"][0].filename;
  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        firstname,
        lastname,
        avatar,
        isVerify: isVerify || 1,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.user.id; // The user ID should be set by the authenticateToken middleware
  const { email, firstname, lastname, isVerify } = req.body;
  const avatar = req.file ? req.file.filename : null;

  try {
    // Find existing user
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete old avatar file if a new one is uploaded
    if (avatar && existingUser.avatar) {
      const oldAvatarPath = path.join(__dirname, '..', 'uploads', existingUser.avatar);
      fs.unlink(oldAvatarPath, (err) => {
        if (err) {
          console.error('Error deleting old avatar:', err);
        } else {
          console.log('Old avatar deleted:', existingUser.avatar);
        }
      });
    }

    // Update user with new data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { email, firstname, lastname, avatar, isVerify: parseInt(isVerify) },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id: parseInt(id, 10) } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
