const Location = require("../../models/Location");
const mongoose = require("mongoose");

exports.view = (req, res) => {
  res.render("ward/location/index");
};

exports.getDetail = (req, res) => {
  res.render("ward/location/detail");
};

exports.updateInfo = (req, res) => {
  res.render("ward/location/update_info");
};
