const express = require('express');
const router = express.Router();
const locationAPI = require('./api/location');
const adsAPI = require('./api/ads');

router.use('/location', locationAPI);
router.use('/ads', adsAPI);

module.exports = router;
