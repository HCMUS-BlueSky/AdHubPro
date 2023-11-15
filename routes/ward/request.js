const express = require("express");
const router = express.Router();
const requestController = require("../../controllers/ward/requestController");

router.get("/", (req, res) => {
  return res.render("ward/request/index");
});

router.get("/", requestController.view);

router.get("/view/:id", requestController.getDetail);

router.get("/create/:id", requestController.updateInfo);

module.exports = router;
