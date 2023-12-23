const express = require("express");
const pathFor = require("../middleware/pathFor");
const accountController = require("../controllers/department/accountController");
const locationController = require("../controllers/department/locationController");
const requestDepartmentController = require("../controllers/department/requestController");
const statisticController = require("../controllers/department/statisticController");
const adsController = require("../controllers/department/adsController");
const proposalController = require("../controllers/department/proposalController");
const upload = require("../middleware/multer");
const router = express.Router();
const path = require("path");

router.use(pathFor("department_officer"));

router.get("/", (req, res) => res.redirect("/department/location"));

// Location
router.get("/location", locationController.view);
router.get("/location/view/:id", locationController.getDetail);
router.get("/location/update-info/:id", locationController.renderUpdateInfo);
router.get("/location/search", locationController.search);
router.get("/location/create", locationController.renderCreate);
router.post("/location/create", locationController.create);
router.post("/location/:id/remove", locationController.remove);
router.post(
  "/location/update-info/:id",
  upload.array("images", 5),
  locationController.updateInfo
);
router.all("/location/*", (req, res) => {
  return res.redirect("/department/location");
});

// Ads
router.get("/ads", adsController.view);
router.get("/ads/view/:id", adsController.getDetail);
router.get("/ads/update-info/:id", adsController.renderUpdateInfo);
router.post("/ads/search", adsController.search);

// Proposal
router.get("/proposal", proposalController.view);
router.get("/proposal/view/:id", proposalController.getDetail);

// Request
router.get("/request", requestDepartmentController.view);
router.get("/request/view/:id", requestDepartmentController.getDetail);
router.get("/request/search", requestDepartmentController.search);
router.post("/request/:id/approve", requestDepartmentController.approveRequest);
router.post("/request/:id/reject", requestDepartmentController.rejectRequest);
router.all("/request/*", (req, res) => {
  return res.redirect("/department/request");
});

// Statistic
router.get("/statistic", statisticController.view);
router.get("/statistic/overview", statisticController.overview);
router.get("/report/view/:id", statisticController.getDetail);

// Account
router.get("/account", accountController.view);
router.get("/account/view/:id", accountController.getDetail);
router.get("/account/update-info/:id", accountController.updateInfo);
router.get("/account/assign/:id", accountController.assign);
router.get("/account/create", accountController.create);

router.all("*", (req, res) => {
  return res.redirect("/department");
});
module.exports = router;
