const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  // const locations = await Location.find({}).exec();
  // locations = json(locations);
  // console.log(locations);
  res.render("index");
});

module.exports = router;
