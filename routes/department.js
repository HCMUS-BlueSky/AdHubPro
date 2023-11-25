const express = require("express");
const pathFor = require("../middleware/pathFor");
const router = express.Router();

const accountController = require("../controllers/department/accountController");
const locationController = require("../controllers/department/locationController");
const requestController = require("../controllers/department/requestController");
const statisticController = require("../controllers/department/statisticController");

const upload = require("../middleware/multer");
const path = require("path");

// router.use(pathFor('ward_officer'));

// Home
// router.get("/", (req, res) => {
//   res.render("ward/index", { layout: false });
// });

// Ad

// Location
router.get("/location", locationController.view);

router.get("/location/view/:id", locationController.getDetail);

router.get("/location/update-info/:id", locationController.renderUpdateInfo);

// router.post("/location/search", locationController.search);

// router.post(
//   "/location/update-info/:id",
//   upload.array("images", 5),
//   locationController.updateInfo
// );

// // Report
// router.get("/report", reportController.view);

// router.get("/report/view/:id", reportController.getDetail);

// router.get("/report/process/:id", reportController.processReport);

// Request
router.get("/request", requestController.view);

router.get("/request/view/:id", requestController.getDetail);

module.exports = router;
