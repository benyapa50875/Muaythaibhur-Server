const express = require('express');
const router = express.Router();
const contactUsFormController = require('../controllers/contactformController');

// Create a new contact us form entry
router.post('/', contactUsFormController.createContactUsFormEntry);

// Get all contact us form entries
router.get('/', contactUsFormController.getAllContactUsFormEntries);

// Get contact us form entry by ID
router.get('/:id', contactUsFormController.getContactUsFormEntryById);

// Update contact us form entry by ID
router.put('/:id', contactUsFormController.updateContactUsFormEntry);

// Delete contact us form entry by ID
router.delete('/:id', contactUsFormController.deleteContactUsFormEntry);

module.exports = router;
