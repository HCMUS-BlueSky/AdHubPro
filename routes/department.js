const express = require("express");
const pathFor = require("../middleware/pathFor");
const accountController = require("../controllers/department/accountController");
const locationController = require("../controllers/department/locationController");
const requestDepartmentController = require("../controllers/department/requestController");
const statisticController = require("../controllers/department/statisticController");
const upload = require("../middleware/multer");
const router = express.Router();
const path = require("path");

router.use(pathFor("department_officer"));

// Account
router.get("/account", accountController.view);
router.get("/account/view/:id", accountController.getDetail);
router.get("/account/update-info/:id", accountController.updateInfo);
router.get("/account/assign/:id", accountController.assign);
router.get("/account/create", accountController.create);

// Location
router.get("/location", locationController.view);
router.get("/location/view/:id", locationController.getDetail);
router.get("/location/update-info/:id", locationController.renderUpdateInfo);

// Statistic
router.get("/statistic", statisticController.view);
router.get("/statistic/overview", statisticController.overview);
router.get("/report/view/:id", statisticController.getDetail);

// Request
router.get("/request", requestDepartmentController.view);
router.get("/request/view/:id", requestDepartmentController.getDetail);

module.exports = router;
