const express = require('express');
const router = express.Router();
const {
  createContactInfo,
  getAllContactInfo,
  getContactInfoById,
  updateContactInfo,
  deleteContactInfo,
} = require('../controllers/contactinfoController');

// Routes
router.post('/', createContactInfo);
router.get('/', getAllContactInfo);
router.get('/:id', getContactInfoById);
router.put('/:id', updateContactInfo);
router.delete('/:id', deleteContactInfo);

module.exports = router;
