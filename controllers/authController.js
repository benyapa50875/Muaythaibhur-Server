const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const {jwtDecode} = require('jwt-decode'); // Corrected import
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Configure Nodemailer
async function sendVerificationEmail(email, token) {
  try {
  
    const url = `https://muaythaibhur-client.onrender.com/verify/${token}`; // Replace with your actual Render URL
    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER, // Sender email address
      to: email,
      subject: 'Verify Your Email Address for MuayThaiBhur',
      html: `
      <p>Thank you for signing up with MuayThaiBhur!</p>
      Please verify your email address by clicking <a href="${url}">here</a>.

      <p>Best regards,</p>
      <p>The MuayThaiBhur Team</p>
      `,
    });

    console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Error sending verification email');
  }
}

const generateRandomPassword = () => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  const randomDigit = Math.floor(Math.random() * 10);
  password += randomDigit.toString();
  return password;
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const createUserToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET);
};

const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};
const findAdminByEmail = async (email) => {
  return await prisma.admin.findUnique({ where: { email } });
};

exports.register = async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  const avatar = req.files["avatar"][0].filename;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'This email is already in use.' });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstname,
        lastname,
        avatar
      },
    });

    const token = createUserToken(user.id);
    await sendVerificationEmail(email, token);

    res.status(201).json({ message: 'Successfully registered! Please Check Email for Account Verification.' });
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Password incorrect.' });
    }

    if (user.isVerify === 1) {
      return res.status(403).json({ message: 'Please verify your email address.' });
    }

    const token = createUserToken(user.id);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const { userId } = jwt.verify(token, JWT_SECRET);
    await prisma.user.update({
      where: { id: userId },
      data: { isVerify: 2 },
    });
    res.redirect('https://muaythaibhur-client.onrender.com/verify/success'); // Replace with your actual React app URL
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

exports.changePassword = async (req, res) => {
  const { old_password, new_password } = req.body;

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(old_password, user.password);
    if (!passwordMatch) {
      return res.status(402).json({ error: 'Old password is incorrect' });
    }

    const hashedPassword = await hashPassword(new_password);
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'There was a system error.' });
  }
};

exports.forgot = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email address is incorrect.' });
    }

    const newPassword = generateRandomPassword();
    const hashedPassword = await hashPassword(newPassword);

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'New password for MuayThaiBhur',
      text: `Your new password is: ${newPassword} For convenience and security, you should change your password.`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email.' });
      } else {
        console.log('Email sent:', info.response);
        await prisma.user.update({
          where: { email },
          data: { password: hashedPassword },
        });
        res.status(200).json({ message: 'The new password has been sent to your email.' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'There was a system error.' });
  }
};
exports.admin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findAdminByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Password incorrect.' });
    }

    if (user.isVerify === 1) {
      return res.status(403).json({ message: 'Please verify your email address.' });
    }

    const token = createUserToken(user.id);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};