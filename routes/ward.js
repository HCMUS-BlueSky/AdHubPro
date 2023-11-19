const express = require("express");
const pathFor = require("../middleware/pathFor");
const router = express.Router();

const adsAPI = require("./ward/ads");
const locationAPI = require("./ward/location");
const reportAPI = require("./ward/report");
const requestAPI = require("./ward/request");

// router.use(pathFor('ward_officer'));

router.get("/", (req, res) => {
  return res.render("officer/officerWard");
});

router.use("/ads", adsAPI);
router.use("/location", locationAPI);
router.use("/report", reportAPI);
router.use("/request", requestAPI);

module.exports = router;
