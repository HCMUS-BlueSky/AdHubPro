const express = require("express");
const utilsController = require("../controllers/utilsController");
const router = express.Router();

router.get("/districts", utilsController.getDistricts);
router.get("/districts/:id/wards", utilsController.getWards);

module.exports = router;
