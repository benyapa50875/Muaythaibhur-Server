const express = require('express');
const router = express.Router();
const contactUsController = require('../controllers/contactusController');
const upload = require('../middlewares/contactusMulter');

// Get all contact us entries
router.get('/', contactUsController.getAllContactUsEntries);

// Update contact us entry by ID
router.put('/:id', upload, contactUsController.updateContactUsEntry);

module.exports = router;
