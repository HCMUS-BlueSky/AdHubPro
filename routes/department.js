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

router.get('/', (req, res) => res.redirect('/department/location'));

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
router.post('/location/search', locationController.search);
// router.post(
//   '/location/update-info/:id',
//   upload.array('images', 5),
//   locationController.updateInfo
// );
router.all('/location/*', (req, res) => {
  return res.redirect('/district/location');
});

// Statistic
router.get("/statistic", statisticController.view);
router.get("/statistic/overview", statisticController.overview);
router.get("/report/view/:id", statisticController.getDetail);

// Request
router.get("/request", requestDepartmentController.view);
router.get("/request/view/:id", requestDepartmentController.getDetail);

module.exports = router;
