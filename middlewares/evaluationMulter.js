const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Set up Multer storage and file renaming
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/evaluation'));
  },
  filename: function (req, file, cb) {
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
}).fields([{ name: 'vdo', maxCount: 1 }]); // 'vdo' should match the field name in your form

module.exports = upload;
