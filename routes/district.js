const express = require('express');
const pathFor = require('../middleware/pathFor');
const router = express.Router();

const adsAPI = require('./district/ads');
const locationAPI = require('./district/location');
const reportAPI = require('./district/report');
const requestAPI = require('./district/request');

router.use(pathFor('district_officer'));

router.get('/', (req, res) => {
  return res.render('officer/officerWard');
});

router.use('/ads', adsAPI);
router.use('/location', locationAPI);
router.use('/report', reportAPI);
router.use('/request', requestAPI);

module.exports = router;
