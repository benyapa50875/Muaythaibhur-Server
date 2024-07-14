const express = require('express');
const router = express.Router();
const pagesController = require('../controllers/pagesController');

router.get('/pages', pagesController.getAllPages);
router.get('/pages/:id', pagesController.getPageById);
router.put('/pages/:id', pagesController.updatePage);

module.exports = router;
