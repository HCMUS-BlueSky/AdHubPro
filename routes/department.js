const express = require("express");
const pathFor = require("../middleware/pathFor");
const administrativeController = require("../controllers/department/administrativeController");
const methodController = require("../controllers/department/methodController");
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

// Administrative Units
router.get("/administrative", administrativeController.view);

// Method
router.get("/method", methodController.view);
router.get("/method/view/:id", methodController.getDetail);
router.post("/method/:id/add", methodController.add);
router.post("/method/:id/remove", methodController.remove);

// Location
router.get("/location", locationController.view);
router.get("/location/view/:id", locationController.getDetail);
router.get("/location/update-info/:id", locationController.renderUpdateInfo);
router.get("/location/search", locationController.search);
router.get("/location/create", locationController.renderCreate);
router.post(
  "/location/create",
  upload.array("images", 5),
  locationController.create
);
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
router.get("/ads/create", adsController.renderCreate);
router.post("/ads/create", upload.array("images", 5), adsController.create);
router.post("/ads/:id/remove", adsController.remove);
router.post(
  "/ads/update-info/:id",
  upload.array("images", 5),
  adsController.updateInfo
);
router.get("/ads/search", adsController.search);
router.all("/ads/*", (req, res) => {
  return res.redirect("/department/ads");
});

// Proposal
router.get("/proposal", proposalController.view);
router.get("/proposal/view/:id", proposalController.getDetail);
router.post("/proposal/:id/approve", proposalController.approve);
router.post("/proposal/:id/reject", proposalController.reject);
router.get("/proposal/search", proposalController.search);
router.all("/proposal/*", (req, res) => {
  return res.redirect("/department/proposal");
});
// Request
router.get("/request", requestDepartmentController.view);
router.get("/request/view/:id", requestDepartmentController.getDetail);
router.get("/request/search", requestDepartmentController.search);
router.get("/request/filter", requestDepartmentController.filter);
router.post("/request/:id/approve", requestDepartmentController.approveRequest);
router.post("/request/:id/reject", requestDepartmentController.rejectRequest);
router.all("/request/*", (req, res) => {
  return res.redirect("/department/request");
});

// Statistic
router.get("/statistic", statisticController.view);
router.get("/statistic/overview", statisticController.overview);
router.get("/statistic/filter", statisticController.filter);
router.get("/report/view/:id", statisticController.getDetail);
router.get("/report/search", statisticController.search);

// Account
router.get("/account", accountController.view);
router.get("/account/view/:id", accountController.getDetail);
router.get("/account/update-info/:id", accountController.renderUpdateInfo);
router.post("/account/update-info/:id", accountController.updateInfo);

router.get("/account/assign/:id", accountController.renderAssign);
router.post("/account/assign/:id", accountController.assign);
router.get("/account/create", accountController.renderCreate);
router.post("/account/create", accountController.create);
router.get("/account/search", accountController.search);

router.all("/account/*", (req, res) => {
  return res.redirect("/department/account");
});

router.get("/change-password", (req, res) => {
  const user = req.session.user;
  res.render("department/change-password", {
    user,
    pageName: "",
    header: {
      navRoot: "Thông tin cá nhân",
      navCurrent: "Đổi mật khẩu",
    },
  });
});

router.all("*", (req, res) => {
  return res.redirect("/department");
});
module.exports = router;
