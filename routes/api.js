const express = require('express');
const router = express.Router();
const locationAPI = require('./api/location');

router.use('/location', locationAPI);

module.exports = router;
