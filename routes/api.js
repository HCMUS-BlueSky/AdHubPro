const express = require("express");
const router = express.Router();
const adsAPI = require("./api/ads");
const mapAPI = require("./api/map");

router.use("/ads", adsAPI);
router.use("/map", mapAPI);

module.exports = router;
