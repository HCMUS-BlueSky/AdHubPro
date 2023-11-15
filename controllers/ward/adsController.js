const Ads = require("../../models/Ads");
const mongoose = require("mongoose");

exports.view = async (req, res) => {
  res.render("ward/ads/index");
};
