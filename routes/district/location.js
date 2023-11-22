const express = require("express");
const router = express.Router();
const locationController = require("../../controllers/district/locationController");

router.get("/", locationController.view);

router.get("/view/:id", locationController.getDetail);

router.get("/update-info/:id", locationController.updateInfo);

module.exports = router;

