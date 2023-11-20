const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  return res.render("auth/login", { layout: "./layouts/auth" });
});

router.get("/register", (req, res) => {
  return res.render("auth/register", { layout: "./layouts/auth" });
});

router.get("/reset/password", (req, res) => {
  return res.render("auth/reset", { layout: "./layouts/auth" });
});

module.exports = router;
