const express = require("express");
const pathFor = require("../middleware/pathFor");
const router = express.Router();

const adsController = require("../controllers/district/adsController");
// const locationController = require("../controllers/district/locationController");
const reportController = require("../controllers/district/reportController");
const requestController = require("../controllers/district/requestController");

// router.use(pathFor("district_officer"));

// Ads
router.get("/ads", adsController.view);

router.get("/ads/view/:id", adsController.getDetail);

router.get("/ads/update-info/:id", adsController.updateInfo);

// Location
// router.get("/", locationController.view);

// router.get("/view/:id", locationController.getDetail);

// router.get("/update-info/:id", locationController.updateInfo);

// Report
router.get("/report", reportController.view);

router.get("/report/view/:id", reportController.getDetail);

router.get("/report/process/:id", reportController.processReport);

// Request
router.get("/request", requestController.view);

router.get("/request/view/:id", requestController.getDetail);

router.get("/request/create", requestController.createNew);

module.exports = router;
