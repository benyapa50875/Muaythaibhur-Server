// middleware/webinfoMiddleware.js

const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Set up Multer storage and file renaming
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/web_info'));
  },
  filename: function (req, file, cb) {
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
}).fields([{name: 'feature_img', maxCount: 1}, {name: 'favicon', maxCount: 1}]);

module.exports = upload;
