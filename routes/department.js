const express = require('express');
const pathFor = require('../middleware/pathFor');
const router = express.Router();

const locationAPI = require('./department/location');
const requestAPI = require('./department/request');
const accountAPI = require('./department/account');
const statisticAPI = require('./department/statistic');

router.use(pathFor('department_officer'));

router.get('/', (req, res) => {
  return res.render('officer/officerWard');
});

router.use('/location', locationAPI);
router.use('/request', requestAPI);
router.use('/account', accountAPI);
router.use('/statistic', statisticAPI);

module.exports = router;
