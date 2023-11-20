const express = require("express");
const requestController = require("../../controllers/ward/requestController");
const router = express.Router();

router.get("/", requestController.view);

router.get("/view/:id", requestController.getDetail);

router.get("/create", requestController.createNew);

module.exports = router;
