const express = require("express");
const router = express.Router();
const authAPI = require("./api/auth");
const locationAPI = require("./api/location");
const adsAPI = require("./api/ads");
const reportAPI = require("./api/report");
const mapAPI = require("./api/map");

router.use("/auth", authAPI);
router.use("/location", locationAPI);
router.use("/ads", adsAPI);
router.use("/report", reportAPI);
router.use("/map", mapAPI);

module.exports = router;
