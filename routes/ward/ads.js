const express = require("express");
const router = express.Router();
const adsController = require("../../controllers/ward/adsController");

router.get("/", adsController.view);

module.exports = router;
