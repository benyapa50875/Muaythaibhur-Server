const express = require('express');
const router = express.Router();
const webInfoController = require('../controllers/webinfoController');
const upload = require('../middlewares/webinfoMulter');

router.get('/', webInfoController.getWebInfo);
router.put('/', upload, webInfoController.updateWebInfo);

module.exports = router;
