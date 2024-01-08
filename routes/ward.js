const express = require("express");
const pathFor = require("../middleware/pathFor");
const adsController = require("../controllers/ward/adsController");
const locationController = require("../controllers/ward/locationController");
const reportController = require("../controllers/ward/reportController");
const requestController = require("../controllers/ward/requestController");
const upload = require("../middleware/multer");
const router = express.Router();
const path = require("path");

router.use(pathFor("ward_officer"));

// Home
router.get("/", (req, res) => {
  const user = req.session.user;
  return res.render("ward/index", {
    user,
    header: {
      navRoot: "Trang chủ",
      navCurrent: "Bản đồ",
    },
    layout: false,
  });
});

// Ads
router.get("/ads", adsController.view);

router.get("/ads/view/:id", adsController.getDetail);

router.get("/ads/update-info/:id", adsController.renderUpdateInfo);

router.get("/ads/search", adsController.search);

router.post(
  "/ads/update-info/:id",
  upload.array("images", 5),
  adsController.updateInfo
);

router.all("/ads/*", (req, res) => {
  return res.redirect("/ward/ads");
});

// Location
router.get("/location", locationController.view);

router.get("/location/view/:id", locationController.getDetail);

router.get("/location/update-info/:id", locationController.renderUpdateInfo);

router.get("/location/search", locationController.search);

router.post(
  "/location/update-info/:id",
  upload.array("images", 5),
  locationController.updateInfo
);

router.all("/location/*", (req, res) => {
  return res.redirect("/ward/location");
});

// Report
router.get("/report", reportController.view);

router.get("/report/view/:id", reportController.getDetail);

router.get("/report/search", reportController.search);

router.get("/report/process/:id", reportController.renderProcessReport);

router.post("/report/process/:id", reportController.processReport);

router.all("/report/*", (req, res) => {
  return res.redirect("/ward/report");
});

// Request
router.get("/request", requestController.view);

router.get("/request/view/:id", requestController.getDetail);

router.get("/request/search", requestController.search);

router.get("/request/create", requestController.renderCreateNew);

router.post(
  "/request/create",
  upload.array("images", 5),
  requestController.createNew
);

router.post("/request/:id/cancel", requestController.cancelRequest);

router.get("/change-password", (req, res) => {
  const user = req.session.user;
  res.render("ward/change-password", {
    user,
    pageName: "",
    header: {
      navRoot: "Thông tin cá nhân",
      navCurrent: "Đổi mật khẩu",
    },
  });
});

router.all("/request/*", (req, res) => {
  return res.redirect("/ward/request");
});

router.all("*", (req, res) => {
  return res.redirect("/ward");
});

module.exports = router;
