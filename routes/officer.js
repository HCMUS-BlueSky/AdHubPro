const express = require("express");
const pathFor = require("../middleware/pathFor");
const router = express.Router();

router.get('/', (req, res) => {
  // login
  return res.redirect(302, '/');
});

router.get('/ward', pathFor('ward_officer'), (req, res) => {
  res.render('officer/officerWard');
});

router.get('/district', pathFor('district_officer'), (req, res) => {
  res.render('officer/officerDistrict');
});

router.get("/department", pathFor('department_officer'), (req, res) => {
  res.render("officer/officerHeadquarter");
});

module.exports = router;
