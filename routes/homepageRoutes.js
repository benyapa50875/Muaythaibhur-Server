const express = require('express');
const router = express.Router();
const homepageController = require('../controllers/hompageController');
const upload = require('../middlewares/homepageMulter');

router.get('/', homepageController.getAllHomepages);
router.get('/:id', homepageController.getHomepage);
router.put('/:id', upload, homepageController.updateHomepage);

module.exports = router;
