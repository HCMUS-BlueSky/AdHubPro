const express = require("express");
const reportController = require('../../controllers/district/reportController');
const router = express.Router();

router.get('/', reportController.view);

router.get('/view/:id', reportController.getDetail);

router.get('/process/:id', reportController.processReport);

module.exports = router;
