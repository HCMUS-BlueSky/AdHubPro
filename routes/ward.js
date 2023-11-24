const express = require("express");
const pathFor = require("../middleware/pathFor");
const adsController = require("../controllers/ward/adsController");
const locationController = require("../controllers/ward/locationController");
const reportController = require("../controllers/ward/reportController");
const requestController = require("../controllers/ward/requestController");
const router = express.Router();

// router.use(pathFor('ward_officer'));

// Ads
router.get("/ads", adsController.view);

router.get("/ads/view/:id", adsController.getDetail);

router.get("/ads/update-info/:id", adsController.updateInfo);

// Location
router.get("/location", locationController.view);

router.get("/location/view/:id", locationController.getDetail);

router.get("/location/update-info/:id", locationController.updateInfo);

// Report
router.get("/report", reportController.view);

router.get("/report/view/:id", reportController.getDetail);

router.get("/report/process/:id", reportController.processReport);

// Request
router.get("/request", requestController.view);

router.get("/request/view/:id", requestController.getDetail);

router.get("/request/create", requestController.createNew);

module.exports = router;
