const express = require("express");
const utilsController = require("../controllers/utilsController");
const router = express.Router();

router.get("/districts", utilsController.getDistricts);
router.get("/districts/:id/wards", utilsController.getWards);
router.get("/reports/count", utilsController.getReports);
router.get("/reports/monthlyCount", utilsController.getReportsByMonth);

module.exports = router;
