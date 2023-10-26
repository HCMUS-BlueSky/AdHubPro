const express = require('express');
const router = express.Router();
const locationAPI = require('./api/location');
const adsAPI = require('./api/ads');
const reportAPI = require('./api/report');

router.use('/location', locationAPI);
router.use('/ads', adsAPI);
router.use('/report', reportAPI);

module.exports = router;
