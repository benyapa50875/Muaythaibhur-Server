const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const morgan = require('morgan'); // Import morgan

// Load environment variables from .env file
dotenv.config();

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;
app.get("/", (req, res) => res.json("Hello World"));

// Middleware
app.use(morgan('dev')); // Add morgan middleware
app.use(express.json()); // Replace bodyParser.json() with express.json()
app.use(express.urlencoded({ extended: true })); // Add URL-encoded middleware
app.use(cors());

// Database connection check
async function checkDatabaseConnection() {
  try {
    console.log('Checking database connection...');
    await prisma.$connect();
    console.log('Database connection successful.');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1); // Exit the application if the database connection fails
  }
}

checkDatabaseConnection();

// Routes
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const contactformRoutes = require('./routes/contactformRoutes');
const contactinfoRoutes = require('./routes/contactinfoRoutes');
const contactusRoutes = require('./routes/contactusRoutes');
const lessonsRoutes = require('./routes/lessonsRoutes');
const lessonTypesRoutes = require('./routes/lessonTypesRoutes');
const pagesRoutes = require('./routes/pagesRoutes');
const userRoutes = require('./routes/userRoutes');
const webinfoRoutes = require('./routes/webinfoRoutes');

// Use Routes
const routes = [
  { path: '/api/auth', route: './routes/authRoutes' },//
  { path: '/api/admin', route: './routes/adminRoutes' },//
  { path: '/api/blogs', route: './routes/blogRoutes' },//
  { path: '/api/evaluation', route: './routes/evaluationRoutes' },//
  { path: '/api/contactform', route: './routes/contactformRoutes' }, //
  { path: '/api/contactinfo', route: './routes/contactinfoRoutes' },//
  { path: '/api/contactus', route: './routes/contactusRoutes' },
  { path: '/api/lessons', route: './routes/lessonsRoutes' },//
  { path: '/api/lessontypes', route: './routes/lessonTypesRoutes' },//
  { path: '/api/user', route: './routes/userRoutes' },//
  { path: '/api/homepage', route: './routes/homepageRoutes' },//
  { path: '/api/webinfo', route: './routes/webinfoRoutes' },//
];

// Use Routes
routes.forEach(route => {
  app.use(route.path, require(route.route));
});

// Serve static files (e.g., index.html) from the root directory
/* app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
}); */

app.use('/uploads', express.static('uploads'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
