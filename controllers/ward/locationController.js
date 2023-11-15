const Location = require("../../models/Location");
const mongoose = require("mongoose");

exports.view = async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;
  try {
    const locations = await Location.aggregate([{ $sort: { updatedAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Location.count();
    res.render("ward/location/index", {
      locations,
      perPage,
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.getDetail = (req, res) => {
  res.render("ward/location/detail");
};

exports.updateInfo = (req, res) => {
  res.render("ward/location/update_info");
};
