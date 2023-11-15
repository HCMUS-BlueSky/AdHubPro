const express = require("express");
const router = express.Router();
const adsController = require("../../controllers/ward/adsController");

router.get("/", adsController.view);

router.get("/view/:id", adsController.getDetail);

router.get("/update-info/:id", adsController.updateInfo);

module.exports = router;
