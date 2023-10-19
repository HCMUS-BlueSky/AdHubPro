const express = require("express");
const router = express.Router();

router.get("/ward", (req, res) => {
  res.render("officer/officerWard");
});

router.get("/district", (req, res) => {
  res.render("officer/officerDistrict");
});

router.get("/headquarter", (req, res) => {
  res.render("officer/officerHeadquarter");
});

module.exports = router;
